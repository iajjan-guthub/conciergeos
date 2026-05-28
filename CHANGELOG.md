# Changelog

Toutes les modifications notables de **ConciergeOS** sont documentées dans ce fichier.

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
Versionnage : [Semantic Versioning](https://semver.org/lang/fr/)

> **Conventions SemVer utilisées :**
> - **MAJEUR** : changements incompatibles avec les versions précédentes (ex. refonte du schéma, rupture d'API publique)
> - **MINEUR** : nouvelles fonctionnalités rétrocompatibles
> - **CORRECTIF** : corrections de bugs rétrocompatibles

---

## [Non publié]

### En cours de développement

- **Migration PostgreSQL/Supabase** — Remplacement de SQLite par PostgreSQL pour la production, avec activation du Row-Level Security (RLS) par agence. Migration des données de démo incluse.
- **Stripe Connect** — Intégration des reversements automatiques aux propriétaires via Stripe Connect, avec gestion des comptes connectés, dashboards de paiement et webhook de réconciliation.
- **Channel manager iCal** — Synchronisation bidirectionnelle des disponibilités avec Airbnb, Booking.com et VRBO via le protocole iCal. Import automatique des réservations entrantes.
- **Notifications push PWA** — Alertes temps réel pour les prestataires (nouvelle mission assignée) et les gestionnaires (incident critique signalé).
- **Multi-tenant SaaS** — Isolation des données par agence au niveau base de données, gestion des abonnements, limites par plan (nombre de propriétés, utilisateurs, stockage).
- **Export comptable** — Export des données financières au format FEC (Fichier des Écritures Comptables), compatible avec les logiciels comptables français.

---

## [1.0.0] — 2026-05-28

### Ajouté — MVP initial (release publique)

#### Interface back-office agence

- **Dashboard global** : KPIs temps réel (taux d'occupation, revenus du mois, réservations actives, incidents ouverts), graphiques de tendance sur 30/90 jours, activité récente, alertes prioritaires
- **Gestion des propriétés** : CRUD complet avec formulaire multi-étapes (informations générales, adresse, capacité, équipements, règles, contacts d'urgence, photos), vue liste et vue carte, recherche et filtres avancés
- **Gestion des réservations** : création manuelle, vue liste paginée, vue détail complète, cycle de vie avec statuts (`PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `COMPLETED`, `CANCELLED`), notes internes, historique des modifications
- **Planning multi-propriétés** : vue calendrier mensuelle et hebdomadaire, code couleur par statut, drag-and-drop pour modifier les dates (réservations et tâches), filtres par propriété et par prestataire
- **Gestion des tâches** : création manuelle et déclenchement automatique à partir des réservations, assignation aux prestataires, statuts (`TODO`, `IN_PROGRESS`, `DONE`, `BLOCKED`), priorité, deadline, notes, pièces jointes
- **Gestion des incidents** : formulaire de signalement (titre, description, catégorie, priorité, photos), workflow de qualification et résolution, historique des actions, lien avec la réservation et la propriété concernées
- **Messagerie unifiée** : boîte de réception centralisée pour tous les canaux (voyageurs, propriétaires, interne), threading par conversation, statuts lus/non-lus, filtres par type et par propriété
- **Module finances** : tableau des revenus par propriété et par période, calcul automatique des commissions (% configurable par contrat propriétaire), génération des relevés PDF mensuels, suivi des reversements (planifié / effectué / en retard)
- **Analytics et reporting** : taux d'occupation par propriété et par période, revenus bruts vs nets, performance des prestataires (missions complétées, délais, incidents), graphiques exportables
- **Paramètres agence** : configuration du profil agence (nom, logo, coordonnées), gestion des membres et des rôles (admin, gestionnaire, comptable), templates d'emails, taux de commission par défaut, catégories d'équipements

#### Portail propriétaire

- **Dashboard revenus** : revenus du mois en cours et historique 12 mois, prochaines réservations, solde de reversement attendu, alertes (incidents en cours sur leur bien)
- **Calendrier** : vue mensuelle de l'occupation de leur(s) propriété(s), statut des réservations (sans accès aux informations voyageur détaillées)
- **Documents** : liste des relevés mensuels PDF, téléchargement, historique sur 24 mois
- **Tickets** : formulaire de signalement d'un problème ou d'une demande, suivi du statut, historique des échanges avec l'agence
- **Profil** : modification des coordonnées bancaires (IBAN pour reversements), préférences de notification, historique des connexions

#### Portail voyageur (mobile-first)

- **Guide d'arrivée** : adresse avec lien carte, photos du logement, instructions d'accès étape par étape (code boîte à clés, interphone, parking), Wi-Fi (SSID + mot de passe), contacts d'urgence
- **Code d'accès** : affichage sécurisé du code de la serrure, visible uniquement 24h avant le check-in et pendant le séjour
- **Chat en temps réel** : messagerie avec l'agence, accusés de réception, disponible 24h/24 pendant le séjour
- **Signalement d'incident** : formulaire simplifié (description + photo optionnelle), accusé de réception automatique, suivi du statut
- **Informations séjour** : dates de check-in/check-out, règles de la maison, informations pratiques (restaurants, transports, services locaux)
- **Design mobile-first** : interface optimisée pour smartphone, sans application à télécharger (lien unique par réservation)

#### Application prestataire (PWA)

- **Liste des missions** : missions du jour et à venir, triées par priorité et heure, avec adresse et type d'intervention
- **Vue mission** : détail complet (propriété, type de tâche, notes spécifiques, contacts), checklist d'intervention personnalisable par type de mission
- **Validation avec photos** : prise de photos directement dans l'app, upload automatique, commentaires sur les éléments signalés
- **Statut temps réel** : mise à jour du statut de la mission visible instantanément par l'agence (`EN ROUTE`, `SUR PLACE`, `TERMINÉ`, `PROBLÈME`)
- **Mode hors ligne** : consultation des missions et checklist disponibles sans connexion, synchronisation au retour en ligne (service worker)

#### Page marketing et landing page

- **Page d'accueil** : présentation du produit, hero section avec démonstration animée, fonctionnalités clés, témoignages fictifs pour la démo, section pricing
- **Page pricing** : 3 plans (Starter, Pro, Agence), tableau comparatif des fonctionnalités, FAQ pricing
- **Authentification démo** : accès immédiat sans carte bancaire, 3 comptes préconfigurés (admin agence, propriétaire, voyageur), données de démo françaises réalistes

#### Base de données et données de démo

- **Schéma SQLite complet** : 18 tables (agencies, users, properties, reservations, tasks, incidents, messages, financials, documents, audit_logs, etc.)
- **Données de démo françaises** : 3 agences parisiennes fictives, 12 propriétés avec vraies adresses (Paris, Lyon, Nice, Bordeaux), 30+ réservations sur 3 mois glissants, 8 prestataires fictifs, données financières cohérentes sur 6 mois
- **Migrations Drizzle** : système de migrations versionné, rollback possible, script de seeding reproductible

#### API REST

- **40+ endpoints** couvrant l'ensemble des modules métier :
  - `POST /api/auth/login` — `POST /api/auth/refresh` — `POST /api/auth/logout`
  - `GET|POST /api/properties` — `GET|PATCH|DELETE /api/properties/:id`
  - `GET|POST /api/reservations` — `GET|PATCH|DELETE /api/reservations/:id`
  - `GET|POST /api/tasks` — `GET|PATCH /api/tasks/:id`
  - `GET|POST /api/incidents` — `GET|PATCH /api/incidents/:id`
  - `GET|POST /api/messages` — `GET /api/messages/:conversationId`
  - `GET /api/financials` — `GET /api/financials/summary` — `POST /api/financials/generate-report`
  - `GET /api/analytics/overview` — `GET /api/analytics/occupancy` — `GET /api/analytics/revenue`
  - `GET|PATCH /api/users/me` — `GET|POST /api/users` (admin)
  - `GET /api/owner/dashboard` — `GET /api/owner/documents`
  - `GET /api/guest/:token` — `POST /api/guest/:token/incident`
  - `GET|PATCH /api/contractor/missions`
- **Validation des entrées** : tous les endpoints validés avec Zod, messages d'erreur structurés
- **Pagination** : paramètres `page` / `limit` sur toutes les listes, métadonnées de pagination dans la réponse
- **Filtres** : query params sur les listes (par période, statut, propriété, prestataire...)

#### Authentification et sécurité

- **JWT** avec expiration 1h et refresh token (7 jours) en cookie httpOnly
- **RBAC applicatif** : 5 rôles distincts (super_admin, agency_admin, manager, owner, contractor) avec permissions granulaires
- **Rate limiting** : 100 requêtes / minute par IP sur l'API, 5 tentatives de login avant blocage temporaire
- **Headers de sécurité** : CSP, X-Frame-Options, X-Content-Type-Options, HSTS configurés

#### Design et expérience utilisateur

- **Design system teal/navy** : palette de couleurs cohérente, typographie Inter, composants shadcn/ui customisés
- **Dark mode natif** : toggle persisté en localStorage, respect de `prefers-color-scheme` au premier chargement
- **Responsive** : interface back-office adaptée desktop (≥ 1024px) et tablette (≥ 768px) ; portails voyageur et prestataire optimisés mobile-first
- **Animations** : transitions CSS légères, skeleton loaders pendant les fetches, toasts de feedback (succès/erreur)
- **Accessibilité** : labels ARIA sur les formulaires, navigation clavier, contrastes WCAG AA

### Architecture technique

- **Stack** : React 18 + Vite 5 + Express.js 4 + TypeScript 5.4 + Drizzle ORM 0.30
- **Base de données** : SQLite via `better-sqlite3` (développement et MVP)
- **UI** : Tailwind CSS v3 + shadcn/ui (composants Radix UI)
- **Routing client** : Wouter (hash-based, compatible Vercel)
- **State serveur** : TanStack Query v5 (cache, invalidation, mutations)
- **Validation** : Zod (partagé entre client et serveur via `shared/`)
- **Bundler** : Vite avec monorepo client/server dans un seul repo
- **Déploiement** : Vercel (front + API serverless), Railway (workers)

---

## [0.2.0] — 2026-05-15

> Version pré-MVP. Fonctionnalités de complétion du back-office.

### Ajouté

- **Module Finances** : premiers écrans de suivi des revenus, formulaire de saisie manuelle des encaissements, calcul de commission basique
- **Module Analytics** : dashboard d'analyse avec graphiques (taux d'occupation, revenus par mois), exportables en CSV
- **Messagerie unifiée v1** : boîte de réception centralisée, threading de messages, notifications de nouveaux messages dans la navigation
- **Portail propriétaire v1** : écrans de base (dashboard revenus, calendrier), authentification par lien email sécurisé (tokenisé)
- **Portail voyageur v1** : guide d'arrivée, informations du séjour, formulaire de signalement d'incident simplifié
- **Module Incidents v1** : formulaire de création, liste avec filtres, assignation à un gestionnaire
- **Données de démo enrichies** : ajout de données financières, de messages et d'incidents pour couvrir tous les modules

### Modifié

- **Schéma base de données** : ajout des tables `financials`, `documents`, `audit_logs`, `messages` et `conversations`
- **Navigation** : refonte de la sidebar avec groupes (Core, Finances, Configuration), badges de notifications
- **API** : ajout de 15 nouveaux endpoints pour les modules finances, messagerie et analytics
- **Performance** : mise en place du cache TanStack Query avec `staleTime` configuré par ressource, réduction des re-fetches inutiles

### Corrigé

- Calcul incorrect du taux d'occupation lors des réservations à cheval sur 2 mois
- Fuite mémoire dans le gestionnaire d'événements du composant calendrier
- Tokens JWT non invalidés correctement côté client lors de la déconnexion

---

## [0.1.0] — 2026-05-01

> Version initiale. Scaffold du projet et modules fondamentaux.

### Ajouté

- **Scaffold React + Express** : monorepo avec structure `client/` / `server/` / `shared/`, TypeScript strict, Vite, ESLint + Prettier configurés
- **Schéma base de données initial** : tables `agencies`, `users`, `properties`, `reservations`, `tasks`, configuration Drizzle ORM, première migration
- **Authentification** : `POST /api/auth/login`, génération JWT, middleware `requireAuth`, structure RBAC initiale (admin, manager, owner)
- **Module Propriétés (CRUD complet)** : liste des propriétés avec recherche et filtres basiques, formulaire de création/édition, vue détail, suppression avec confirmation
- **Module Réservations (CRUD complet)** : liste des réservations, création manuelle, vue détail, changement de statut manuel, liaison propriété ↔ réservation
- **Module Tâches (v1)** : liste des tâches, création, assignation à un utilisateur, statuts basiques
- **Dashboard de base** : compteurs (nombre de propriétés, réservations en cours, tâches du jour), liste des prochains check-ins
- **Design system initial** : configuration Tailwind avec palette teal/navy, intégration shadcn/ui (Button, Input, Card, Table, Dialog, Toast), layout avec sidebar et header
- **Routing client** : mise en place de Wouter, routes principales protégées par auth, redirect login
- **Données de démo v1** : script de seed avec 2 propriétés et 5 réservations fictives pour tester le MVP en développement
- **CI/CD** : GitHub Actions pour typecheck + build sur chaque PR, déploiement automatique Vercel sur `main`

### Architecture initiale

- Décision d'utiliser SQLite pour le MVP (simplicité, zéro infrastructure, migration vers PostgreSQL planifiée pour la v1.1)
- Décision d'utiliser Wouter plutôt que React Router (bundle size, simplicité pour un SPA sans SSR)
- Décision de partager les types Drizzle entre client et serveur via `shared/schema.ts`
- Décision d'utiliser shadcn/ui plutôt qu'une librairie de composants classique (copie des composants, personnalisation totale)

---

*Les versions antérieures à 0.1.0 correspondent aux phases de prototypage et ne sont pas documentées ici.*

[Non publié]: https://github.com/conciergeos/conciergeos/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/conciergeos/conciergeos/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/conciergeos/conciergeos/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/conciergeos/conciergeos/releases/tag/v0.1.0
