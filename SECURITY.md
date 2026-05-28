# Politique de Sécurité — ConciergeOS

> Document officiel. Version en vigueur : 1.0 — Dernière révision : mai 2026.

---

## 1. Politique de sécurité

### Engagement de l'équipe

ConciergeOS traite des données personnelles sensibles : coordonnées de voyageurs, informations bancaires de propriétaires (IBAN), accès aux logements (codes de serrures), et flux financiers entre agences et propriétaires. La sécurité de ces données n'est pas une option — c'est une responsabilité fondamentale envers nos clients et leurs clients.

L'équipe ConciergeOS s'engage à :

- Appliquer les **bonnes pratiques de sécurité** tout au long du cycle de développement (secure by design)
- Répondre avec **diligence et transparence** à tout signalement de vulnérabilité
- Maintenir les **dépendances à jour** et auditer régulièrement les risques tiers
- Se conformer aux **exigences réglementaires** applicables (RGPD, PCI DSS via Stripe)
- Ne jamais compromettre la **confidentialité des données** au profit de la rapidité de livraison

### Périmètre couvert

Cette politique s'applique à :

| Périmètre | Inclus |
|-----------|--------|
| Application web back-office agence | ✅ |
| Portail propriétaire | ✅ |
| Portail voyageur | ✅ |
| Application prestataire (PWA) | ✅ |
| API REST (tous les endpoints `/api/*`) | ✅ |
| Infrastructure (Vercel, Railway, Supabase) | ✅ (signalement → nous transmettons au fournisseur si pertinent) |
| Page marketing (`conciergeos.fr`) | ✅ |
| Dépôts GitHub (secrets exposés, configs) | ✅ |
| Services tiers (Stripe, Resend, Sentry) | ❌ (signaler directement à ces fournisseurs) |

---

## 2. Versions supportées

Seule la version stable actuelle bénéficie de correctifs de sécurité actifs.

| Version | Supportée | Notes |
|---------|:---------:|-------|
| **1.0.x** (actuelle) | ✅ | Correctifs de sécurité appliqués en priorité |
| 0.2.x | ❌ | Fin de support — mettre à jour vers 1.0.x |
| 0.1.x | ❌ | Fin de support — mettre à jour vers 1.0.x |
| < 0.1 | ❌ | Versions de prototypage, jamais supportées en production |

> Si vous utilisez une version non supportée, nous vous recommandons vivement de migrer vers la **1.0.x** avant de déployer en production.

---

## 3. Signaler une vulnérabilité

### Canal de signalement

**Email confidentiel : security@conciergeos.fr**

Tous les messages reçus sur cette adresse sont traités comme **strictement confidentiels**. L'accès est restreint au responsable sécurité et au lead technique.

> ⚠️ **Ne jamais créer d'issue GitHub publique pour signaler une vulnérabilité.** Une issue publique expose la faille avant qu'un correctif soit disponible, mettant en danger tous les utilisateurs de la plateforme.

### Chiffrement PGP (optionnel)

Pour les signalements particulièrement sensibles, vous pouvez chiffrer votre message avec la clé PGP de l'équipe sécurité. Clé publique disponible sur demande à security@conciergeos.fr.

### Informations à inclure dans votre signalement

Pour permettre à l'équipe de qualifier et reproduire la vulnérabilité rapidement, merci d'inclure :

1. **Description de la vulnérabilité** — type (ex. XSS, IDOR, injection SQL, fuite de données), composant concerné, comportement observé
2. **Étapes de reproduction** — procédure pas à pas permettant de déclencher la vulnérabilité de manière fiable
3. **Impact potentiel** — données exposées, utilisateurs concernés, conditions d'exploitation
4. **Environnement** — URL, version, navigateur/OS si pertinent
5. **Preuve de concept** (si disponible) — capture d'écran, payload de test, log de requête/réponse HTTP
6. **Vos coordonnées** (optionnel) — pour vous notifier de la résolution et vous créditer si vous le souhaitez

### Engagements de délai de réponse

| Étape | Délai maximum |
|-------|--------------|
| **Accusé de réception** | 48 heures ouvrées |
| **Qualification de la vulnérabilité** (confirmée / non confirmée / hors périmètre) | 7 jours calendaires |
| **Plan de remédiation communiqué** | 14 jours calendaires |
| **Correctif déployé** (pour les vulnérabilités critiques et hautes) | 30 jours calendaires |
| **Correctif déployé** (pour les vulnérabilités moyennes et basses) | 90 jours calendaires |

En cas de vulnérabilité critique activement exploitée, nous nous engageons à déployer un patch d'urgence sous **72 heures**.

---

## 4. Divulgation responsable (Responsible Disclosure)

### Notre engagement envers les chercheurs en sécurité

ConciergeOS reconnaît et valorise la contribution des chercheurs en sécurité à l'amélioration de la sécurité des logiciels. En échange d'un signalement responsable respectant les règles ci-dessous, nous nous engageons à :

- **Répondre rapidement** et traiter votre signalement avec sérieux
- **Ne pas engager de poursuites judiciaires** à votre encontre pour une recherche menée de bonne foi, dans les limites du périmètre défini
- **Vous tenir informé** de l'avancement du correctif
- **Vous créditer publiquement** dans notre hall of fame (avec votre accord explicite)
- **Ne pas partager vos informations personnelles** avec des tiers sans votre consentement

### Règles de la recherche de bonne foi

Pour bénéficier des protections ci-dessus, la recherche doit respecter les règles suivantes :

- **Ne pas exfiltrer de données réelles** — dès la preuve de concept établie, arrêtez l'exploitation et signalez
- **Ne pas modifier ni supprimer** de données appartenant à des tiers
- **Ne pas mener d'attaques** par déni de service (DoS/DDoS) ou par force brute sur les systèmes de production
- **Ne pas cibler d'autres utilisateurs** — utiliser uniquement vos propres comptes de test
- **Ne pas divulguer publiquement** la vulnérabilité avant qu'un correctif soit disponible, sauf accord mutuel sur une date de divulgation coordonnée
- **Agir dans le respect de la législation** française et européenne applicable

### Processus de divulgation coordonnée

1. Vous nous signalez la vulnérabilité par email
2. Nous accusons réception et ouvrons un dossier confidentiel
3. Nous qualifions la vulnérabilité et vous notifions du résultat
4. Nous développons et testons le correctif
5. Nous déployons le correctif
6. Si souhaité, nous coordonnons avec vous une divulgation publique coordonnée (CVE, article de blog)
7. Nous vous ajoutons au hall of fame (avec votre accord)

### Hall of Fame

Nous remercions publiquement les chercheurs qui nous ont aidés à améliorer la sécurité de ConciergeOS. *(Aucune entrée pour le moment — soyez le premier !)*

---

## 5. Architecture de sécurité actuelle

### Authentification

| Composant | Implémentation |
|-----------|---------------|
| **Mécanisme** | JWT signé avec HS256 (secret rotatif via variable d'environnement) |
| **Durée de vie du token d'accès** | 1 heure |
| **Refresh token** | 7 jours, stocké en cookie httpOnly, Secure, SameSite=Strict |
| **Rotation des refresh tokens** | Oui — chaque refresh génère un nouveau pair de tokens |
| **Révocation** | Liste noire en mémoire (Redis prévu en production multi-instance) |
| **Tentatives de login** | Blocage temporaire (15 minutes) après 5 échecs consécutifs |
| **Portail propriétaire** | Lien email tokenisé (OTP à usage unique, expire en 15 min) |
| **Portail voyageur** | Lien unique par réservation, token opaque lié à la réservation |

### Autorisation (RBAC)

```
super_admin    → Accès plateforme complète (multi-tenant)
    │
agency_admin   → Accès complet à son agence (toutes propriétés et fonctions)
    │
manager        → Accès à son portefeuille de propriétés uniquement
    │
owner          → Accès lecture à ses propres propriétés (portail dédié)
    │
contractor     → Accès à ses missions assignées uniquement (app PWA)
```

- Contrôle d'accès vérifié **côté serveur** sur chaque requête (ne jamais faire confiance au client)
- Row-Level Security (RLS) PostgreSQL activé en production (Supabase) comme couche de défense en profondeur
- Les tokens JWT contiennent le rôle et l'ID agence — toute requête vérifie l'appartenance des ressources à l'agence du demandeur

### Protection des données

| Aspect | Mesure |
|--------|--------|
| **Chiffrement en transit** | TLS 1.2+ obligatoire (Cloudflare force HTTPS, HSTS avec preload) |
| **Chiffrement au repos** | Assuré par Supabase (AES-256 au niveau disque) en production |
| **Données de paiement** | Aucune donnée carte bancaire stockée — 100% délégué à Stripe (PCI DSS niveau 1) |
| **Codes d'accès logements** | Chiffrés en base (AES-256-GCM, clé en variable d'environnement) |
| **IBAN propriétaires** | Masqués dans l'UI (seuls les 4 derniers chiffres affichés), chiffrés en base |
| **Mots de passe** | Hashés avec bcrypt (cost factor 12), jamais loggés |
| **Logs** | PII (données personnelles identifiantes) exclus des logs applicatifs |

### RGPD

| Obligation | Implémentation |
|-----------|---------------|
| **Droit d'accès** | Export des données sur demande (endpoint `/api/me/export`, génère un JSON complet) |
| **Droit à l'effacement** | Suppression sur demande via `DELETE /api/me/account` + tâche d'anonymisation des données liées |
| **Consentement** | Recueil explicite lors de la création de compte, log horodaté du consentement |
| **Minimisation** | Seules les données nécessaires à la fonctionnalité sont collectées |
| **Notification de violation** | Procédure interne : notification CNIL dans les 72h si violation avérée, notification des personnes concernées si risque élevé |
| **DPO** | Contact : dpo@conciergeos.fr |

### Audit log

Toutes les actions sensibles sont tracées dans la table `audit_logs` :

- Connexion / déconnexion / échec de connexion
- Création, modification, suppression d'une propriété
- Création et changement de statut d'une réservation
- Accès au code de serrure d'un logement
- Génération d'un document financier
- Modification des droits d'un utilisateur
- Export de données personnelles
- Suppression de compte

Chaque entrée contient : timestamp, user_id, action, ressource concernée (type + id), adresse IP, user-agent, résultat (succès / échec).

---

## 6. Bonnes pratiques pour les contributeurs

Ces règles s'appliquent à **toute contribution** au projet ConciergeOS, que vous soyez membre de l'équipe interne ou contributeur externe.

### Gestion des secrets

- **Jamais de secrets dans le code source** — ni hardcodés, ni dans les commentaires, ni dans les messages de commit
- Toujours utiliser les **variables d'environnement** (`.env.local` en dev, secrets Vercel/Railway en prod)
- Utiliser `.env.example` avec des valeurs fictives pour documenter les variables nécessaires
- En cas de secret commité par erreur : rotation immédiate + alerter le lead

```bash
# Audit rapide avant commit :
git diff --staged | grep -i "password\|secret\|token\|key\|apikey"
# Si résultat non vide, vérifier chaque occurrence
```

### Validation des entrées

- **Toujours valider avec Zod** côté serveur, même si le client envoie des données "de confiance"
- Valider le type, le format, la longueur maximale et les valeurs autorisées
- Ne jamais utiliser les données de la requête directement dans une requête SQL (Drizzle ORM protège contre l'injection SQL par défaut)

```typescript
// ✅ Correct
const schema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
});
const body = schema.parse(req.body); // Lance une erreur si invalide

// ❌ Incorrect
const { email, name } = req.body; // Aucune validation
```

### Sécurité front-end

- **Pas de `eval()`** — ni directement, ni via des librairies qui l'utilisent
- **Pas de `innerHTML` non sanitisé** — utiliser `textContent` ou la librairie DOMPurify si HTML dynamique est nécessaire
- **Pas de `dangerouslySetInnerHTML`** en React sauf cas documenté et audité
- Les données affichées venant de l'utilisateur (commentaires, notes, noms) doivent passer par React (qui échappe automatiquement) ou être sanitisées

### Gestion des dépendances

```bash
# À exécuter avant chaque PR
npm audit

# Pour voir le détail et filtrer par sévérité
npm audit --audit-level=moderate

# Pour corriger automatiquement les vulnérabilités mineures
npm audit fix
```

- Les vulnérabilités de niveau **critical** ou **high** doivent être résolues avant le merge
- Les vulnérabilités **moderate** doivent être documentées et traitées dans les 7 jours
- Ne pas utiliser `npm audit fix --force` sans comprendre les breaking changes introduits

### Headers de sécurité HTTP

Les headers suivants sont configurés via le middleware Express en production :

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://*.supabase.co; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Ne pas affaiblir ces headers sans validation du lead et justification documentée.

### Code review orienté sécurité

Lors de chaque code review, vérifier systématiquement :

- [ ] Toutes les entrées utilisateur sont validées avec Zod côté serveur
- [ ] Les endpoints sensibles ont le middleware `requireAuth` et `requireRole()`
- [ ] Aucun secret n'est logué (`console.log(req.body)` peut exposer des mots de passe)
- [ ] Les erreurs renvoyées au client ne contiennent pas d'informations internes (stack trace, requêtes SQL)
- [ ] Les ressources renvoyées par l'API appartiennent bien à l'agence/utilisateur demandeur (vérification d'appartenance)

---

## 7. Historique des incidents de sécurité

Aucun incident de sécurité connu à ce jour.

> Cette section sera mise à jour après résolution de tout incident avéré, avec un résumé transparent de la nature de l'incident, de son impact, des mesures correctives prises et des améliorations apportées pour éviter toute récurrence.

---

## 8. Références

| Référence | Description | Lien |
|-----------|-------------|------|
| **OWASP Top 10** | Les 10 risques de sécurité les plus critiques pour les applications web | https://owasp.org/www-project-top-ten/ |
| **OWASP API Security Top 10** | Risques spécifiques aux APIs REST | https://owasp.org/www-project-api-security/ |
| **RGPD** | Règlement Général sur la Protection des Données (UE 2016/679) | https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on |
| **PCI DSS** | Standard de sécurité pour les paiements par carte (délégué à Stripe) | https://www.pcisecuritystandards.org/ |
| **Stripe Security** | Documentation sécurité Stripe (PCI DSS niveau 1) | https://stripe.com/fr/guides/pci-compliance |
| **Supabase Security** | Documentation sécurité Supabase | https://supabase.com/docs/guides/platform/security |
| **CNIL — Violations de données** | Procédure de notification en cas de violation | https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles |
| **Politique de confidentialité** | Politique de confidentialité ConciergeOS | https://conciergeos.fr/privacy |
| **Conditions Générales d'Utilisation** | CGU ConciergeOS | https://conciergeos.fr/terms |

---

*Document maintenu par l'équipe ConciergeOS. Pour toute question relative à cette politique : security@conciergeos.fr*

*Révisions de ce document soumises au même processus de review que le code (PR GitHub, approbation du lead).*
