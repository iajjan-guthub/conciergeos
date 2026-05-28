# Runbook opérationnel — ConciergeOS

Ce document est destiné à la personne **responsable de l'infrastructure en production**. Il couvre le monitoring, les procédures d'urgence, les backups et la maintenance.

> **Principe de base** : en cas de doute, **stabiliser d'abord** (rollback si nécessaire), **diagnostiquer ensuite**, **documenter toujours** (post-mortem).

---

## 1. Contacts d'urgence et accès

### 1.1 Tableau des contacts

| Service | Contact principal | Contact backup | Lien | Niveau d'accès |
|---|---|---|---|---|
| Vercel (frontend) | ops@conciergeos.app | dev-lead@conciergeos.app | https://vercel.com/conciergeos | Admin |
| Railway (backend) | ops@conciergeos.app | dev-lead@conciergeos.app | https://railway.app/project/conciergeos | Admin |
| Supabase (BDD) | ops@conciergeos.app | dev-lead@conciergeos.app | https://app.supabase.com/project/conciergeos | Owner |
| Cloudflare (DNS/CDN) | ops@conciergeos.app | cto@conciergeos.app | https://dash.cloudflare.com | Super Admin |
| Stripe (paiements) | billing@conciergeos.app | cfo@conciergeos.app | https://dashboard.stripe.com | Admin |
| Resend (emails) | ops@conciergeos.app | dev-lead@conciergeos.app | https://resend.com/dashboard | Admin |
| Sentry (monitoring) | ops@conciergeos.app | dev-lead@conciergeos.app | https://sentry.io/conciergeos | Owner |
| GitHub (code) | dev-lead@conciergeos.app | cto@conciergeos.app | https://github.com/conciergeos | Owner |

### 1.2 Procédure de récupération d'accès

Si la personne principale est **indisponible** :

```
1. Contacter le backup indiqué dans le tableau ci-dessus via Slack (#ops-urgence)
2. Si le backup est aussi indisponible → contacter cto@conciergeos.app
3. Pour les accès Supabase/Railway/Vercel en urgence :
   - Les mots de passe maîtres sont dans 1Password (vault "Production - Ops")
   - Accès au vault : contacter cto@conciergeos.app pour l'emergency kit
4. Pour les clés API Stripe : Admin Dashboard → Developers → API Keys
   (nécessite 2FA sur le compte billing@conciergeos.app)
5. Toute récupération d'accès en urgence doit être documentée dans #ops-urgence
```

---

## 2. Architecture prod en un coup d'œil

### 2.1 Schéma des flux

```
Utilisateur
    │
    ▼
┌─────────────────┐
│   Cloudflare    │  DNS + WAF + DDoS protection
│  conciergeos.app│  SSL termination
└────────┬────────┘
         │ HTTPS (443)
    ┌────┴────────────────┐
    │                     │
    ▼                     ▼
┌──────────┐        ┌──────────────┐
│  Vercel  │        │   Railway    │
│ Frontend │        │   Backend    │
│  React   │        │   Express    │
│ (static) │        │  :3000 int.  │
└──────────┘        └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │   Supabase   │
                    │  PostgreSQL  │
                    │  + Auth RLS  │
                    │  Port 5432   │
                    └──────────────┘

Services tiers (appelés par le backend Railway) :
    ├── Stripe API (paiements)    → api.stripe.com:443
    ├── Resend API (emails)       → api.resend.com:443
    ├── Airbnb API (sync)        → api.airbnb.com:443
    └── Booking.com API (sync)   → distribution-xml.booking.com:443
```

### 2.2 URLs et domaines

| Environnement | URL | Service |
|---|---|---|
| Production frontend | `https://conciergeos.app` | Vercel |
| Production API | `https://api.conciergeos.app` | Railway |
| Staging frontend | `https://staging.conciergeos.app` | Vercel (branch develop) |
| Staging API | `https://api-staging.conciergeos.app` | Railway (staging service) |
| Supabase (prod) | `https://[ref].supabase.co` | Supabase |
| Supabase (staging) | `https://[ref-staging].supabase.co` | Supabase |

---

## 3. Monitoring & alertes

### 3.1 Sentry — Erreurs applicatives

**URL** : https://sentry.io/organizations/conciergeos/issues/

**Lecture des erreurs** :
- `Issues` → trier par `Events` (fréquence) ou `Users Affected`
- Cliquer sur une issue → voir la stacktrace, breadcrumbs, contexte utilisateur
- Tag `environment:production` pour filtrer

**Niveaux de criticité** :

| Niveau Sentry | Signification | Action |
|---|---|---|
| `fatal` | Application crash total | Intervention immédiate (<15 min) |
| `error` | Erreur non gérée | Triage dans l'heure |
| `warning` | Comportement anormal | Triage dans la journée |
| `info` | Événement informatif | Revue hebdomadaire |

**Alertes configurées** :
- `fatal` → notification Slack #ops-urgence + email ops@
- Error rate > 1% → notification Slack #ops-monitoring
- Nouveau type d'erreur × 10 occurrences → notification Slack #ops-monitoring

### 3.2 Vercel Analytics — Frontend

**URL** : https://vercel.com/conciergeos/conciergeos/analytics

**Métriques clés à surveiller** :

| Métrique | Seuil normal | Seuil d'alerte |
|---|---|---|
| Core Web Vitals — LCP | < 2.5s | > 4s |
| Core Web Vitals — CLS | < 0.1 | > 0.25 |
| Core Web Vitals — FID | < 100ms | > 300ms |
| Taux d'erreur 4xx/5xx | < 0.5% | > 2% |
| Visitors actifs | variable | chute soudaine -50% |

### 3.3 Supabase Dashboard — Base de données

**URL** : https://app.supabase.com/project/[ref]/reports

**Points de contrôle réguliers** :

| Métrique | Emplacement | Seuil d'alerte |
|---|---|---|
| Connexions actives | Reports → Database | > 80% du max (95/120) |
| Taille de la BDD | Settings → Database | > 80% du plan |
| Requêtes lentes (>1s) | Reports → Query Performance | > 5 requêtes/min |
| Cache hit ratio | Reports → Database | < 90% |
| Auth errors | Logs → Auth | > 10/min |

### 3.4 Railway — Backend Node.js

**URL** : https://railway.app/project/conciergeos

**Métriques à surveiller** :

| Métrique | Seuil d'alerte | Action |
|---|---|---|
| CPU | > 80% pendant 5 min | Investiguer, envisager scaling |
| RAM | > 85% | Redémarrer le service, investiguer les memory leaks |
| Déploiements échoués | 2 consécutifs | Bloquer les déploiements, investiguer les logs |

```bash
# Vérifier les métriques en temps réel via Railway CLI
railway logs --service backend --tail
```

### 3.5 Seuils d'alerte — Synthèse

```
CRITIQUE (intervention < 15 min) :
  - Backend ne répond plus (HTTP 5xx sur /api/health pendant > 2 min)
  - BDD inaccessible
  - CPU > 95% pendant > 5 min
  - Taux d'erreur Sentry > 5%

URGENT (intervention < 1h) :
  - Taux d'erreur 1–5%
  - RAM > 85%
  - Webhooks Stripe en échec > 30 min
  - Emails non envoyés > 1h

SURVEILLANCE (triage journalier) :
  - CPU > 80% pendant > 10 min
  - Taille BDD > 80%
  - Nouveaux types d'erreurs Sentry
  - Core Web Vitals dégradés
```

---

## 4. Procédures d'urgence

### 4.1 Le serveur backend ne répond plus

**Symptômes** :
- `/api/health` retourne 5xx ou timeout
- Sentry : spike de `fatal` errors
- Utilisateurs ne peuvent pas se connecter / les données ne chargent pas

**Diagnostic** :

```bash
# 1. Vérifier l'état du service Railway
railway status --service backend

# 2. Consulter les logs récents
railway logs --service backend --tail 200

# 3. Vérifier si le process Node.js tourne
railway shell --service backend
ps aux | grep node

# 4. Tester l'endpoint de santé
curl -f https://api.conciergeos.app/api/health
# Réponse attendue : {"status":"ok","timestamp":"..."}

# 5. Vérifier les variables d'environnement
railway variables list --service backend
```

**Résolution — Redémarrage** :

```bash
# Option 1 : Redémarrage via Railway CLI
railway service restart --service backend

# Option 2 : Via l'UI Railway
# Dashboard → Service backend → ⋮ → Restart
```

**Résolution — Rollback** :

```bash
# Via l'UI Railway :
# Dashboard → Service backend → Deployments
# → Cliquer sur le dernier déploiement stable
# → "Rollback to this deployment"

# Via CLI (si la commande est disponible dans ta version CLI)
railway rollback --service backend
```

**Escalade** : si non résolu en **15 minutes** → alerter `dev-lead@conciergeos.app` + poster dans `#ops-urgence`.

---

### 4.2 La base de données est inaccessible

**Symptômes** :
- Erreurs `ECONNREFUSED` ou `Connection timeout` dans les logs Railway
- Backend démarre mais toutes les requêtes API retournent 500

**Diagnostic** :

```bash
# 1. Vérifier la page de statut Supabase
# https://status.supabase.com/

# 2. Tester la connexion depuis Railway
railway shell --service backend
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
client.from('users').select('count').then(console.log).catch(console.error);
"

# 3. Vérifier les connexions actives dans Supabase
# Dashboard → Reports → Database → Active connections

# 4. Vérifier si le pool de connexions est saturé
# Si connexions actives = max_connections → problème de connection pooling
```

**Résolution — Connexions saturées** :

```bash
# Forcer la fermeture des connexions inactives via SQL
# Supabase Dashboard → SQL Editor
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND state_change < NOW() - INTERVAL '5 minutes'
  AND pid <> pg_backend_pid();
```

**Résolution — Mode read-only si Supabase est en maintenance** :

```bash
# Activer le flag READ_ONLY_MODE dans les variables Railway
railway variables set READ_ONLY_MODE=true --service backend
# Le backend répondra 503 sur les endpoints d'écriture
# et servira le cache des données en lecture si disponible
```

**Restaurer depuis backup** :

```bash
# 1. Identifier le backup à restaurer dans Supabase Dashboard
# Settings → Backups → choisir le point de restauration

# 2. Via Supabase Dashboard (plan Pro)
# Settings → Backups → "Restore" sur le backup voulu
# Durée estimée : 15-30 min selon la taille

# 3. Via CLI Supabase (restauration vers une instance fraîche)
supabase db dump --db-url "postgresql://..." -f backup_$(date +%Y%m%d).sql
# Restaurer sur une nouvelle instance
psql "postgresql://new-instance-url" < backup_$(date +%Y%m%d).sql
```

**Escalade** : si Supabase est indisponible et que le statut page confirme un incident → ouvrir un ticket support Supabase, poster dans `#ops-urgence`.

---

### 4.3 Stripe webhook en échec

**Symptômes** :
- Les paiements réussis ne déclenchent pas les mises à jour d'abonnement
- Comptes utilisateurs en état incohérent (payé mais non activé)
- Emails de confirmation non envoyés

**Diagnostic** :

```bash
# 1. Vérifier le Stripe Dashboard
# Dashboard → Developers → Webhooks → [endpoint prod]
# → Consulter "Recent webhook attempts" → chercher les 4xx/5xx

# 2. Vérifier que l'endpoint répond
curl -X POST https://api.conciergeos.app/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{}' 
# Réponse attendue : 400 (signature manquante) — pas 500 ni timeout

# 3. Vérifier les logs Railway pour les erreurs webhook
railway logs --service backend | grep -i "stripe\|webhook"
```

**Résolution — Rejouer les événements** :

```bash
# Via Stripe Dashboard (méthode recommandée) :
# Developers → Webhooks → [endpoint] → Recent attempts
# → Cliquer sur l'événement échoué → "Resend"

# Via Stripe CLI (pour rejouer en masse) :
stripe events list --limit 50 --type payment_intent.succeeded \
  --created[gte]=$(date -d '24 hours ago' +%s) \
  | jq -r '.data[].id' \
  | xargs -I {} stripe events resend {}
```

**Impact sur les paiements en attente** :

```bash
# Identifier les paiements récents sans abonnement activé
# Supabase SQL Editor :
SELECT u.email, s.stripe_payment_intent_id, s.status, s.created_at
FROM subscriptions s
JOIN users u ON u.id = s.user_id
WHERE s.status = 'pending'
  AND s.created_at > NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;
```

**Escalade** : si les webhooks échouent depuis > 30 minutes → vérifier que `STRIPE_WEBHOOK_SECRET` est correctement configuré dans Railway. En dernier recours, activer manuellement les abonnements concernés via le SQL Editor et notifier les utilisateurs.

---

### 4.4 Emails non envoyés (Resend)

**Symptômes** :
- Utilisateurs ne reçoivent pas les emails de confirmation, de réservation ou de bienvenue
- Logs Railway : `Resend API error` ou `Failed to send email`

**Diagnostic** :

```bash
# 1. Vérifier le dashboard Resend
# https://resend.com/emails → filtrer par statut "failed" ou "bounced"

# 2. Vérifier la réputation du domaine
# Resend → Domains → conciergeos.app → vérifier SPF, DKIM, DMARC

# 3. Tester l'API Resend manuellement
curl -X POST 'https://api.resend.com/emails' \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@conciergeos.app",
    "to": ["ops@conciergeos.app"],
    "subject": "Test Resend",
    "text": "Test manuel depuis le runbook"
  }'
# Réponse attendue : {"id":"..."}

# 4. Vérifier les bounces/blocks
# Resend → Suppressions → chercher les domaines ou adresses bloquées
```

**Fallback manuel — Emails critiques** :

Si Resend est indisponible > 1h, envoyer manuellement les emails critiques depuis `ops@conciergeos.app` :

| Priorité | Type d'email | Template |
|---|---|---|
| 1 | Confirmation de paiement | `email-templates/payment-confirmation.html` |
| 2 | Réinitialisation de mot de passe | `email-templates/password-reset.html` |
| 3 | Alerte de réservation (hôte) | `email-templates/new-booking-host.html` |

```bash
# Lister les emails en attente d'envoi (si persistés en BDD)
# Supabase SQL Editor :
SELECT recipient_email, template_name, payload, created_at
FROM email_queue
WHERE status = 'pending'
  AND created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at ASC;
```

---

### 4.5 Taux d'erreur élevé (> 1%)

**Symptômes** :
- Alerte Sentry : error rate > 1%
- Utilisateurs signalent des erreurs dans `#support`

**Diagnostic** :

```bash
# 1. Ouvrir Sentry → Issues → trier par "Events" (dernier 1h)
# Identifier l'erreur dominante

# 2. Distinguer erreur client vs erreur serveur
# - Erreur 4xx = problème côté client/API contract → pas de rollback immédiat
# - Erreur 5xx = problème serveur → envisager rollback si déploiement récent

# 3. Vérifier si un déploiement récent coïncide
# Railway → Deployments → horodatage du dernier déploiement
# Sentry → Issues → "First seen" vs heure du déploiement

# 4. Consulter les logs Railway
railway logs --service backend --tail 500 | grep -E "ERROR|FATAL|500"
```

**Résolution — Rollback si déploiement récent** :

```bash
# Rollback Vercel (frontend)
# Vercel Dashboard → Deployments → cliquer sur le déploiement précédent → "Promote to Production"
# Durée : ~30 secondes

# Rollback Railway (backend)
# Railway Dashboard → Service backend → Deployments
# → Sélectionner le dernier déploiement stable → "Rollback"
# Durée : ~2-3 minutes
```

**Hotfix process (si rollback non souhaité)** :

```bash
# 1. Créer une branche hotfix depuis main
git checkout main && git pull origin main
git checkout -b hotfix/nom-du-bug

# 2. Corriger le bug, commiter
git commit -m "fix(scope): description du fix"

# 3. PR directement vers main (contourner develop pour l'urgence)
# Obtenir approbation du dev-lead (review accélérée)

# 4. Merger et monitorer le déploiement dans Railway
railway logs --service backend --tail 200
```

---

### 4.6 Tentative d'intrusion / accès non autorisé

**Symptômes** :
- Logs Supabase : multiples échecs d'authentification sur un même compte
- Activité suspecte dans les audit logs (modifications inattendues)
- Alerte Sentry : erreurs 401 en masse depuis une même IP

**Procédure** :

```bash
# Étape 1 — Identifier l'activité suspecte
# Supabase → Logs → Auth logs → filtrer par user_id ou IP suspecte

# Étape 2 — Consulter les audit logs
# Supabase → Logs → PostgreSQL logs
# Ou via SQL :
SELECT *
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '2 hours'
ORDER BY created_at DESC
LIMIT 100;

# Étape 3 — Révoquer les sessions actives d'un utilisateur compromis
# Via Supabase Dashboard → Authentication → Users → [user] → "Sign out user"
# Ou via SQL :
DELETE FROM auth.sessions WHERE user_id = '[user-uuid]';

# Étape 4 — Bloquer l'IP suspecte (si identifiée)
# Cloudflare Dashboard → Security → WAF → Create rule
# Condition : IP = [IP suspecte] → Action : Block

# Étape 5 — Révoquer les JWT si la clé JWT est compromise
# Supabase → Settings → API → JWT Secret → "Generate new secret"
# ⚠️ Cela invalide TOUTES les sessions actives
```

**Notification RGPD (si données compromises)** :

```
Délai légal : 72h pour notifier la CNIL

Procédure :
1. Évaluer l'étendue des données potentiellement compromises
2. Notifier cto@conciergeos.app + dpo@conciergeos.app immédiatement
3. Préparer la notification CNIL via : https://notifications.cnil.fr/
4. Notifier les utilisateurs affectés par email (template : email-templates/security-breach.html)
5. Documenter l'incident dans le post-mortem (section 10)
```

---

### 4.7 La BDD est presque pleine (> 80%)

**Symptômes** :
- Alerte Supabase : usage stockage > 80%
- Dashboard Supabase → Settings → Billing : indicateur de stockage en rouge

**Diagnostic** :

```sql
-- Identifier les tables les plus volumineuses
-- Supabase SQL Editor :
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS table_size,
  pg_size_pretty(pg_indexes_size(schemaname || '.' || tablename)) AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 20;
```

**Résolution — Archiver les données historiques** :

```sql
-- Exemple : archiver les logs d'audit > 90 jours
CREATE TABLE audit_logs_archive AS
SELECT * FROM audit_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Vérifier l'archive
SELECT COUNT(*) FROM audit_logs_archive;

-- Supprimer les données archivées de la table principale
DELETE FROM audit_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Récupérer l'espace avec VACUUM
VACUUM ANALYZE audit_logs;
```

**Résolution — Upgrade plan Supabase** :

```bash
# Via Supabase Dashboard :
# Settings → Billing → Upgrade plan
# Free → Pro (8GB storage) → Team (>8GB)
# L'upgrade est immédiat, pas d'interruption de service
```

---

## 5. Backups & restauration

### 5.1 Sauvegardes automatiques Supabase

| Plan | Fréquence | Rétention | Point-in-time recovery |
|---|---|---|---|
| Free | — | — | Non |
| Pro | Quotidien | 7 jours | Non |
| Team | Quotidien | 14 jours | Oui (jusqu'à J-7) |

### 5.2 Vérifier qu'un backup est présent

```bash
# Via Supabase Dashboard :
# Settings → Backups → vérifier que la date du dernier backup < 24h

# Via CLI Supabase :
supabase db dump --db-url "$SUPABASE_DB_URL" -f /tmp/verify_backup_$(date +%Y%m%d).sql
ls -lh /tmp/verify_backup_*.sql
# Le fichier doit être non vide (> 0 bytes)
```

### 5.3 Restaurer depuis un backup Supabase

```bash
# Méthode 1 — Via le Dashboard (recommandé pour un PITR)
# Settings → Backups → choisir le point de restauration → "Restore"
# ⚠️ Cela écrase la BDD courante. Faire un dump manuel avant si possible.

# Méthode 2 — Via dump SQL manuel
# Étape 1 : Dumper la BDD source
supabase db dump \
  --db-url "postgresql://postgres:[password]@[host]:5432/postgres" \
  -f backup_$(date +%Y%m%d_%H%M%S).sql

# Étape 2 : Restaurer sur la BDD cible
psql \
  "postgresql://postgres:[password]@[new-host]:5432/postgres" \
  < backup_$(date +%Y%m%d_%H%M%S).sql

# Étape 3 : Vérifier l'intégrité
psql "postgresql://..." -c "
  SELECT
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM properties) AS properties,
    (SELECT COUNT(*) FROM bookings) AS bookings;
"

# Étape 4 : Mettre à jour DATABASE_URL dans Railway
railway variables set DATABASE_URL="postgresql://new-url..." --service backend
railway service restart --service backend
```

### 5.4 Test de restauration mensuel

Procédure à exécuter le **premier lundi de chaque mois** :

```bash
# 1. Créer une instance Supabase temporaire (pour le test)
# Supabase Dashboard → New Project → [nom]-restore-test

# 2. Restaurer le dernier backup disponible
supabase db dump --db-url "$PROD_DB_URL" -f /tmp/test_restore.sql
psql "$TEST_DB_URL" < /tmp/test_restore.sql

# 3. Vérifier les données critiques
psql "$TEST_DB_URL" -c "
  SELECT
    (SELECT COUNT(*) FROM users WHERE created_at < NOW() - INTERVAL '7 days') AS users_baseline,
    (SELECT COUNT(*) FROM bookings) AS total_bookings,
    (SELECT MAX(created_at) FROM bookings) AS latest_booking;
"

# 4. Supprimer l'instance de test
# Supabase Dashboard → [nom]-restore-test → Settings → Delete project

# 5. Documenter le résultat dans #ops-maintenance
```

---

## 6. Déploiements

### 6.1 Workflow normal

```
developer → git push feature/xxx → PR vers develop
  → GitHub Actions : build + lint + typecheck
  → Vercel : preview deployment automatique
  → Review + merge → deploy staging (develop branch)

develop → PR vers main
  → Review + merge → deploy production
    ├── Vercel (frontend) : déploiement automatique ~2 min
    └── Railway (backend) : déploiement automatique ~3-5 min
```

### 6.2 Vérification post-déploiement (10 premières minutes)

Checklist à exécuter immédiatement après chaque déploiement en production :

```bash
# Point 1 — Vérifier que le backend répond
curl -f https://api.conciergeos.app/api/health
# Réponse attendue : {"status":"ok"}

# Point 2 — Vérifier l'authentification
curl -X POST https://api.conciergeos.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"monitor@conciergeos.app","password":"MonitorPass123!"}'
# Réponse attendue : HTTP 200 avec token

# Point 3 — Vérifier Sentry (pas de spike d'erreurs)
# Sentry → Issues → Last 15 minutes → pas d'augmentation anormale

# Point 4 — Vérifier le frontend
curl -f https://conciergeos.app
# Réponse attendue : HTTP 200, contenu HTML non vide

# Point 5 — Vérifier Railway (CPU/RAM stables)
# Railway Dashboard → Service backend → Metrics → pas de spike CPU/RAM
```

### 6.3 Rollback Vercel (frontend)

```bash
# Via Dashboard (30 secondes) :
# Vercel → Project → Deployments
# → Trouver le dernier déploiement stable (marqué "Production" avant)
# → ⋮ → "Promote to Production"

# Via CLI Vercel :
vercel rollback [deployment-url] --token=$VERCEL_TOKEN
```

### 6.4 Rollback Railway (backend)

```bash
# Via Dashboard (~2-3 minutes) :
# Railway → Project → Service backend → Deployments
# → Sélectionner le déploiement précédent → "Rollback to this deployment"

# Vérifier le rollback :
curl -f https://api.conciergeos.app/api/health
railway logs --service backend --tail 50
```

---

## 7. Mise à l'échelle (scaling)

### 7.1 Indicateurs qui signalent qu'il faut scaler

```
Railway backend :
  - CPU > 70% de manière constante (>30 min) hors pic
  - RAM > 80% de manière constante
  - Temps de réponse API p95 > 2s en dehors des requêtes lourdes

Supabase :
  - > 80 connexions actives simultanées
  - Query time p99 > 5s
  - Taille BDD > 70% du plan

Vercel :
  - Pas d'action nécessaire (auto-scaling natif)
```

### 7.2 Railway — Augmenter les ressources

```bash
# Via CLI Railway :
railway service update --service backend --cpu 2 --memory 2048

# Via Dashboard Railway :
# Service backend → Settings → Resources
# Modifier CPU (vCPU) et RAM (MB) → Save

# Vérifier après modification :
railway logs --service backend --tail 50
```

### 7.3 Supabase — Connection pooling avec pgBouncer

```bash
# Activer pgBouncer (mode transaction pooling)
# Supabase Dashboard → Settings → Database → Connection Pooling
# Mode : Transaction (recommandé pour Express)
# Pool size : 20 (ajuster selon la charge)

# Mettre à jour DATABASE_URL dans Railway pour utiliser le port pgBouncer
# Port pgBouncer : 6543 (au lieu de 5432)
railway variables set DATABASE_URL="postgresql://postgres:[pw]@[host]:6543/postgres" \
  --service backend
railway service restart --service backend
```

### 7.4 Upgrade plan Supabase

```
Free → Pro : connexions 60 → 120, storage 500MB → 8GB
Pro → Team : PITR, support prioritaire, >8GB storage
```

### 7.5 Passage à une architecture multi-instances

Envisager quand :
- Traffic régulier > 1000 requêtes/min sur le backend
- Besoin de zero-downtime deployments
- SLA > 99.9%

Actions à ce stade :
1. Activer Railway multi-replica (2+ instances)
2. Migrer les sessions Express vers Redis (Railway Redis add-on)
3. Activer pgBouncer en mode session pour la compatibilité multi-instance
4. Configurer un load balancer Cloudflare devant Railway

---

## 8. Maintenance planifiée

### 8.1 Checklist mensuelle

À effectuer le **premier lundi de chaque mois** :

```bash
# 1. Vérifier les backups (voir section 5.4)
# ✅ Test de restauration réussi

# 2. Analyser les erreurs Sentry du mois
# Sentry → Issues → Last 30 days → résoudre ou tagger les issues connues

# 3. Vérifier la taille de la BDD
# Supabase → Settings → Billing → Storage usage

# 4. Vérifier les dépendances npm obsolètes
npm outdated

# 5. Vérifier les certificats SSL
# Cloudflare → SSL/TLS → Edge Certificates → vérifier la date d'expiration
# (renouvellement automatique, mais vérifier qu'il n'y a pas d'erreur)

# 6. Vérifier les logs d'erreur Railway du mois
railway logs --service backend | grep -E "ERROR|FATAL" | wc -l

# 7. Documenter le rapport mensuel dans #ops-maintenance
```

### 8.2 Mise à jour des dépendances

```bash
# Procédure sécurisée pour les mises à jour de dépendances

# Étape 1 — Créer une branche dédiée
git checkout develop && git pull origin develop
git checkout -b chore/update-dependencies-$(date +%Y%m)

# Étape 2 — Mettre à jour les dépendances (mineures/patches en priorité)
npm update

# Étape 3 — Vérifier les breaking changes (majeures)
npm outdated
# Pour chaque dépendance majeure : lire le CHANGELOG avant d'upgrader

# Étape 4 — Vérifier que tout fonctionne
npm run build
npm run lint
npm run typecheck

# Étape 5 — Tester l'application en local
npm run dev
# Tester les flux critiques : connexion, création propriété, réservation, paiement

# Étape 6 — PR vers develop avec description des changements
git commit -m "chore: update dependencies $(date +%Y-%m)"
```

### 8.3 Rotation des secrets (tous les 90 jours)

Secrets à faire tourner :

| Secret | Emplacement | Procédure |
|---|---|---|
| `SESSION_SECRET` | Railway vars | Générer via `openssl rand -hex 32` |
| `SUPABASE_SERVICE_KEY` | Railway vars | Supabase → Settings → API → Regenerate |
| `STRIPE_WEBHOOK_SECRET` | Railway vars | Stripe → Webhooks → Roll secret |
| `RESEND_API_KEY` | Railway vars | Resend → API Keys → Create new + delete old |

```bash
# Template de rotation :
# 1. Générer le nouveau secret
openssl rand -hex 32

# 2. Mettre à jour dans Railway SANS redémarrer
railway variables set SECRET_NAME="new-value" --service backend

# 3. Redémarrer le service (appliquer le changement)
railway service restart --service backend

# 4. Vérifier que le service fonctionne
curl -f https://api.conciergeos.app/api/health

# 5. Mettre à jour dans 1Password (vault Production - Ops)
# 6. Invalider l'ancien secret dans le service concerné
# 7. Documenter dans #ops-maintenance avec la date
```

---

## 9. Commandes utiles

```bash
# ─── RAILWAY ────────────────────────────────────────────────────────────────

# Voir les logs en temps réel
railway logs --service backend --tail

# Voir les 500 dernières lignes de log
railway logs --service backend --tail 500

# Ouvrir un shell interactif dans le container backend
railway shell --service backend

# Lister toutes les variables d'environnement
railway variables list --service backend

# Mettre à jour une variable
railway variables set NOM_VARIABLE="valeur" --service backend

# Redémarrer le service
railway service restart --service backend

# Voir l'état du service
railway status --service backend

# ─── SUPABASE CLI ───────────────────────────────────────────────────────────

# Dump complet de la BDD
supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql

# Dump uniquement le schéma (sans données)
supabase db dump --schema-only -f schema_$(date +%Y%m%d).sql

# Lister les migrations appliquées
supabase migration list

# Appliquer les migrations en attente
supabase db push

# Ouvrir un tunnel vers la BDD Supabase
supabase db start

# ─── NODE.JS PROD ───────────────────────────────────────────────────────────

# Lancer le serveur de production (si accès direct au container)
NODE_ENV=production node dist/index.cjs

# Lancer avec plus de logs
NODE_ENV=production DEBUG=* node dist/index.cjs

# Vérifier la mémoire utilisée
NODE_ENV=production node -e "console.log(process.memoryUsage())"

# ─── DIAGNOSTICS RÉSEAU ─────────────────────────────────────────────────────

# Tester l'endpoint de santé
curl -f -w "\nHTTP Status: %{http_code}\nTime: %{time_total}s\n" \
  https://api.conciergeos.app/api/health

# Tester la latence DNS
dig +stats conciergeos.app

# Vérifier le certificat SSL
openssl s_client -connect conciergeos.app:443 -servername conciergeos.app \
  </dev/null 2>/dev/null | openssl x509 -noout -dates
```

---

## 10. Post-mortem template

Copier ce template pour chaque incident en production et sauvegarder dans `docs/post-mortems/YYYYMMDD-titre.md`.

```markdown
# Post-mortem : [Titre de l'incident]

**Date** : YYYY-MM-DD
**Durée** : HH:MM – HH:MM (XX minutes d'impact)
**Sévérité** : P1 (critique) / P2 (majeur) / P3 (mineur)
**Rédigé par** : [Nom]
**Relu par** : [Nom]

---

## Résumé

[2-3 lignes décrivant ce qui s'est passé, l'impact et la résolution]

---

## Chronologie

| Heure (UTC) | Événement |
|---|---|
| HH:MM | Première alerte détectée |
| HH:MM | Début de l'investigation |
| HH:MM | Cause identifiée |
| HH:MM | Solution mise en place |
| HH:MM | Service rétabli |
| HH:MM | Monitoring confirmant le retour à la normale |

---

## Cause racine

[Description technique précise de la cause racine.
Ne pas chercher à blâmer une personne. Chercher les causes systémiques.]

**Cause directe** : 
**Cause sous-jacente** : 
**Facteurs contributifs** : 

---

## Impact

- **Utilisateurs affectés** : X utilisateurs / tous les utilisateurs
- **Fonctionnalités impactées** : 
- **Données perdues** : Oui / Non (si oui, détailler)
- **Perte financière estimée** : 

---

## Ce qui a bien fonctionné

- [Point positif 1]
- [Point positif 2]

---

## Ce qui n'a pas bien fonctionné

- [Point négatif 1]
- [Point négatif 2]

---

## Actions correctives

| Action | Responsable | Date limite | Statut |
|---|---|---|---|
| [Action 1] | [Personne] | YYYY-MM-DD | [ ] En cours / [x] Fait |
| [Action 2] | [Personne] | YYYY-MM-DD | [ ] En cours / [x] Fait |

---

*Post-mortem rédigé sans blame. L'objectif est d'apprendre et d'éviter la récurrence.*
```

---

*ConciergeOS — Runbook v1.0 — Mai 2026*
