# Checklist d'audit post-déploiement — ConciergeOS

> À exécuter après chaque mise en production majeure. Cocher chaque item après vérification.
> **Durée estimée :** 90 minutes pour un premier déploiement, 30 minutes pour les suivants.

**Date d'audit :** _______________
**Version déployée :** _______________
**Environnement :** ☐ Staging  ☐ Production
**Auditeur :** _______________

---

## 1. Sécurité

### 1.1 HTTPS & Transport
- [ ] Le site répond uniquement en HTTPS (HTTP redirige automatiquement vers HTTPS)
- [ ] Certificat SSL valide, non expiré (vérifier sur [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/))
- [ ] Score SSL Labs ≥ A
- [ ] HSTS activé (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)
- [ ] Pas de contenu mixte HTTP/HTTPS sur les pages (vérifier console navigateur)

### 1.2 Headers de sécurité
- [ ] `Content-Security-Policy` configuré (vérifier sur [securityheaders.com](https://securityheaders.com))
- [ ] `X-Frame-Options: DENY` ou `SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` configuré (désactiver camera, microphone si non utilisés)
- [ ] Score global SecurityHeaders.com ≥ B

### 1.3 Authentification & Sessions
- [ ] Les tokens JWT expirent bien (tester avec un token expiré → redirection /login)
- [ ] Les mots de passe sont hashés (bcrypt, jamais en clair en BDD)
- [ ] Les routes protégées retournent 401 sans token valide (tester avec curl sans header)
- [ ] Pas de credentials dans les logs (vérifier Railway logs)
- [ ] Le refresh token est httpOnly (non accessible via `document.cookie` en JS)
- [ ] Tentatives de connexion échouées limitées (rate limiting sur `/api/auth/login`)

### 1.4 API & Backend
- [ ] Toutes les routes API sensibles nécessitent un token valide
- [ ] Les entrées utilisateur sont validées avec Zod côté serveur (pas seulement frontend)
- [ ] Pas de stack trace exposée dans les réponses d'erreur en production
- [ ] `NODE_ENV=production` confirmé dans les logs Railway
- [ ] Pas de route de debug ou d'admin exposée publiquement (`/api/seed`, `/api/debug`)
- [ ] Rate limiting global activé sur l'API (ex: 100 req/min par IP)

### 1.5 Base de données (Supabase)
- [ ] Row Level Security (RLS) activé sur toutes les tables
- [ ] Tester l'isolation : un user de l'agence A ne voit pas les données de l'agence B
- [ ] La `service_role_key` Supabase n'est jamais exposée côté frontend
- [ ] Les backups automatiques sont activés (Supabase Dashboard → Backups)
- [ ] Connexion à la BDD uniquement depuis les IPs Railway (si option disponible)

### 1.6 Variables d'environnement
- [ ] Aucune clé API ou secret n'est dans le code source (vérifier avec `git grep "sk_live"`)
- [ ] Le `.env` n'est pas commité (vérifier `.gitignore`)
- [ ] Toutes les variables listées dans `.env.example` sont renseignées en prod
- [ ] Les clés Stripe utilisées sont bien les clés **live** (pas test) en production

---

## 2. Performance

### 2.1 Temps de chargement
- [ ] Score Lighthouse Performance ≥ 80 sur mobile (tester sur [PageSpeed Insights](https://pagespeed.web.dev/))
- [ ] First Contentful Paint (FCP) < 2.5s
- [ ] Largest Contentful Paint (LCP) < 4s
- [ ] Time to Interactive (TTI) < 5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

### 2.2 Assets & Bundle
- [ ] Le build est minifié (vérifier que `dist/` contient des fichiers `.js` minifiés)
- [ ] Les images sont compressées (aucune image > 500 Ko sans lazy loading)
- [ ] Le bundle JS principal < 500 Ko gzippé (vérifier dans Vite build output)
- [ ] Les fonts sont préchargées (`<link rel="preload">`)
- [ ] Pas d'erreur 404 sur les assets (vérifier onglet Network dans DevTools)

### 2.3 API & Backend
- [ ] Temps de réponse API < 500ms pour les endpoints courants (tester avec curl)
- [ ] L'endpoint `/api/dashboard/stats` répond en < 300ms
- [ ] Les requêtes BDD les plus fréquentes ont bien leurs index (vérifier `07-schema-bdd-erd.md`)
- [ ] Pas de requête N+1 visible dans les logs Supabase

### 2.4 Disponibilité
- [ ] L'URL de production répond (curl retourne 200)
- [ ] L'API backend répond (`/api/dashboard/stats` retourne du JSON)
- [ ] Configurer un monitoring uptime (ex: UptimeRobot gratuit — alerte si site down)
- [ ] Le healthcheck Railway est vert

---

## 3. RGPD & Données personnelles

### 3.1 Mentions légales & Politique de confidentialité
- [ ] Page "Politique de confidentialité" accessible depuis le footer
- [ ] Page "Mentions légales" accessible depuis le footer
- [ ] Page "CGU" accessible depuis le footer
- [ ] Les documents mentionnent : responsable de traitement, finalités, durée de conservation, droits des personnes
- [ ] Coordonnées du DPO (ou responsable) indiquées

### 3.2 Consentement & Cookies
- [ ] Bandeau de consentement cookies présent si cookies non essentiels utilisés
- [ ] Les analytics (si activées) ne se déclenchent qu'après consentement
- [ ] Pas de cookies tiers sans consentement explicite
- [ ] Les cookies de session sont `httpOnly` et `Secure`

### 3.3 Données des utilisateurs
- [ ] Les données personnelles (email, téléphone, IBAN) sont chiffrées at-rest (Supabase le fait par défaut)
- [ ] Les données de carte bancaire ne transitent JAMAIS par vos serveurs (Stripe gère tout)
- [ ] Les voyageurs peuvent demander la suppression de leurs données (procédure documentée)
- [ ] Les propriétaires peuvent exporter leurs données (prévu en Phase 2)
- [ ] Les logs serveur ne contiennent pas de données personnelles (emails, téléphones)
- [ ] Durée de conservation définie : réservations (5 ans comptables), messages (2 ans), logs (90 jours)

### 3.4 Sous-traitants
- [ ] Liste des sous-traitants documentée (Supabase, Stripe, Resend, Twilio, Railway, Vercel)
- [ ] Vérifier que chaque sous-traitant est conforme RGPD (DPA signés ou disponibles)
- [ ] Les données ne transitent pas hors UE sans garanties (Supabase EU region, Resend EU)

### 3.5 Breach & Incidents
- [ ] Procédure de notification de violation (72h à la CNIL) documentée dans le runbook
- [ ] Contacts CNIL sauvegardés : [cnil.fr](https://www.cnil.fr) / notifications@cnil.fr

---

## 4. Stripe & Paiements

### 4.1 Configuration Stripe
- [ ] Les clés **live** sont bien utilisées en production (commencent par `sk_live_` et `pk_live_`)
- [ ] Le webhook endpoint est enregistré dans Stripe Dashboard (`/api/webhooks/stripe`)
- [ ] Le `STRIPE_WEBHOOK_SECRET` en prod correspond bien au secret du webhook live
- [ ] Les événements webhook abonnés sont corrects : `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`

### 4.2 Tests de paiement (en staging avec clés test)
- [ ] Un paiement test réussit de bout en bout (carte `4242 4242 4242 4242`)
- [ ] Un paiement refusé génère le bon message d'erreur (carte `4000 0000 0000 0002`)
- [ ] Le webhook de succès est bien reçu et traité (vérifier dans Stripe Dashboard → Webhooks)
- [ ] L'abonnement SaaS se crée correctement après paiement
- [ ] La période d'essai (15 jours) se configure bien sans CB

### 4.3 Stripe Connect (reversements propriétaires)
- [ ] Les comptes Connect des propriétaires se créent correctement
- [ ] Un reversement test arrive bien sur le compte du propriétaire
- [ ] Les frais de plateforme sont bien déduits avant reversement
- [ ] Le tableau de bord Stripe affiche les reversements correctement

### 4.4 Sécurité paiements
- [ ] La page de paiement utilise Stripe Elements (iframe Stripe, pas un formulaire custom)
- [ ] Pas de données de carte dans vos logs (vérifier Railway logs pendant un paiement test)
- [ ] Le montant est toujours calculé côté serveur (jamais depuis le frontend)
- [ ] Vérification de la signature webhook avant traitement (`stripe.webhooks.constructEvent`)

---

## 5. E-mails & Communications

### 5.1 Configuration Resend
- [ ] Le domaine d'envoi est vérifié dans Resend Dashboard (DNS TXT/MX configurés)
- [ ] L'email `noreply@votre-domaine.fr` envoie bien (test depuis Resend Dashboard)
- [ ] SPF configuré : enregistrement DNS TXT `v=spf1 include:resend.com ~all`
- [ ] DKIM configuré : clé publique dans le DNS (fournie par Resend)
- [ ] DMARC configuré : `v=DMARC1; p=quarantine; rua=mailto:dmarc@votre-domaine.fr`
- [ ] Tester la délivrabilité sur [mail-tester.com](https://www.mail-tester.com) — score ≥ 9/10

### 5.2 E-mails transactionnels
- [ ] Email de bienvenue à l'inscription → reçu dans la boîte (vérifier spam aussi)
- [ ] Email de confirmation de réservation → reçu par le voyageur
- [ ] Email de code d'accès (J-1) → reçu par le voyageur
- [ ] Email de reversement au propriétaire → reçu avec le bon montant
- [ ] Email d'invitation utilisateur → lien de connexion fonctionnel
- [ ] Email de réinitialisation de mot de passe → lien expiré après utilisation

### 5.3 SMS (Twilio)
- [ ] Le numéro Twilio est actif et validé
- [ ] SMS de code d'accès envoyé correctement (tester avec un vrai numéro)
- [ ] Les SMS ne sont pas bloqués en France (vérifier réglementation A2P)
- [ ] Opt-out SMS géré (`STOP` désabonne automatiquement)

### 5.4 Anti-spam & Délivrabilité
- [ ] Les emails ne tombent pas en spam (tester Gmail, Outlook, Orange)
- [ ] L'adresse de réponse (`Reply-To`) est une vraie adresse surveillée
- [ ] Les emails contiennent un lien de désabonnement (obligatoire légalement)
- [ ] Le volume d'envoi est dans les limites du plan Resend

---

## 6. Onboarding & Expérience utilisateur

### 6.1 Inscription & Premier accès
- [ ] Le formulaire d'inscription fonctionne (tester avec un vrai email)
- [ ] L'email de bienvenue arrive en < 2 minutes
- [ ] Après inscription, l'utilisateur est bien redirigé vers le dashboard
- [ ] Le dashboard vide (sans données) affiche un onboarding clair avec des CTAs
- [ ] La checklist d'onboarding (créer son premier bien) est visible et fonctionnelle

### 6.2 Parcours "Premier bien"
- [ ] Créer un bien de A à Z en moins de 5 minutes (chronométrer)
- [ ] Tous les champs obligatoires sont clairement indiqués
- [ ] Les messages d'erreur de formulaire sont clairs et en français
- [ ] Après création du bien, une confirmation visuelle apparaît (toast)
- [ ] Le bien créé apparaît immédiatement dans la liste

### 6.3 Portail Voyageur
- [ ] Le lien du portail voyageur fonctionne depuis un mobile (tester sur iPhone et Android)
- [ ] Le code d'accès est lisible sans zoom (grande taille de police)
- [ ] Le bouton "Contacter l'agence" ouvre bien le chat
- [ ] Le formulaire de signalement d'incident fonctionne
- [ ] La page se charge en < 3s sur connexion 4G

### 6.4 App Prestataire (PWA)
- [ ] L'app s'installe sur l'écran d'accueil iOS (Safari → Partager → Sur l'écran d'accueil)
- [ ] L'app s'installe sur l'écran d'accueil Android (Chrome → Installer l'application)
- [ ] Les missions du jour s'affichent correctement
- [ ] La checklist peut être cochée sans connexion (mode offline si implémenté)
- [ ] La validation de mission fonctionne et met à jour le statut en temps réel

### 6.5 Portail Propriétaire
- [ ] L'accès par lien magique fonctionne (tester avec un vrai email propriétaire)
- [ ] Les revenus affichés correspondent aux réservations réelles
- [ ] Le blocage de dates fonctionne et se reflète sur le calendrier
- [ ] Les documents (factures) sont téléchargeables en PDF

### 6.6 Accessibilité & Responsive
- [ ] Toutes les pages sont utilisables sur mobile 375px (iPhone SE)
- [ ] Le contraste texte/fond respecte WCAG AA (ratio ≥ 4.5:1) — tester sur [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
- [ ] La navigation au clavier fonctionne (Tab, Entrée, Échap)
- [ ] Les images ont des attributs `alt` renseignés
- [ ] Le dark mode s'affiche correctement sur toutes les pages

---

## 7. Monitoring & Alertes

- [ ] Sentry est configuré et reçoit les erreurs (provoquer une erreur test et vérifier)
- [ ] Une alerte Sentry est configurée pour les erreurs critiques (email immédiat)
- [ ] UptimeRobot (ou équivalent) surveille l'URL de production toutes les 5 minutes
- [ ] Une alerte est configurée si le site est down > 2 minutes
- [ ] Les logs Railway sont consultables et lisibles
- [ ] Le dashboard Supabase affiche les connexions actives et la taille de la BDD
- [ ] Une alerte est configurée si la BDD dépasse 80% de sa capacité

---

## 8. Vérification finale — Smoke Test (15 min)

Parcours rapide à faire après chaque déploiement pour vérifier que rien n'est cassé :

- [ ] **Landing page** : s'affiche correctement, CTA "Essai gratuit" fonctionne
- [ ] **Inscription** : créer un nouveau compte de test
- [ ] **Connexion** : se déconnecter et se reconnecter
- [ ] **Dashboard** : KPIs s'affichent, pas d'erreur console
- [ ] **Créer un bien** : formulaire soumis avec succès
- [ ] **Créer une réservation** : formulaire soumis avec succès
- [ ] **Créer une tâche** : formulaire soumis avec succès
- [ ] **Envoyer un message** : message apparaît dans le thread
- [ ] **Portail voyageur** : accès via token, code d'accès visible
- [ ] **App prestataire** : missions du jour listées
- [ ] **Dark mode** : toggle fonctionne sur le dashboard
- [ ] **Mobile** : ouvrir le dashboard sur smartphone, vérifier l'affichage

---

## Résumé de l'audit

| Catégorie | Total items | ✅ OK | ❌ KO | ⚠️ À surveiller |
|-----------|-------------|-------|-------|-----------------|
| Sécurité | 28 | | | |
| Performance | 16 | | | |
| RGPD | 18 | | | |
| Stripe | 16 | | | |
| E-mails | 16 | | | |
| Onboarding | 20 | | | |
| Monitoring | 7 | | | |
| Smoke Test | 12 | | | |
| **TOTAL** | **133** | | | |

**Résultat global :** _____ / 133

### Points bloquants identifiés
> (Lister ici les items ❌ qui empêchent la mise en service)

1.
2.
3.

### Actions correctives
> (Lister les tickets à créer)

| # | Description | Responsable | Deadline | Priorité |
|---|-------------|-------------|----------|----------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Décision de mise en service
- [ ] ✅ **GO** — Tous les items bloquants sont résolus, le déploiement est validé
- [ ] ❌ **NO-GO** — Des points bloquants subsistent, retour en staging

**Signé par :** _______________ **Date :** _______________

---

*ConciergeOS — Checklist d'audit post-déploiement v1.0 — Juin 2026*
