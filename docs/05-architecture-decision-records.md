# ConciergeOS — Architecture Decision Records (ADR)

---

## Introduction

### Qu'est-ce qu'un ADR ?

Un **Architecture Decision Record** (ADR) est un document court qui capture une décision architecturale importante prise dans le cadre du projet, avec son contexte, les alternatives envisagées, la décision finale et ses conséquences.

Les ADR ne sont pas des documents de communication marketing : leur valeur réside dans leur **honnêteté**. Ils expliquent pourquoi une option a été préférée, y compris les compromis acceptés et les risques connus.

### Comment lire ces ADR

Chaque ADR est **autonome** : il peut être lu indépendamment des autres. Les statuts possibles sont :

| Statut | Signification |
|---|---|
| **Accepté** | Décision en vigueur, appliquée dans le code |
| **Déprécié** | Décision remplacée mais documentée pour l'historique |
| **Remplacé par ADR-XXX** | Une nouvelle décision annule et remplace celle-ci |
| **En discussion** | Décision non encore finalisée |

Les ADR sont numérotés séquentiellement et **ne sont jamais supprimés** — même si la décision est ultérieurement révisée.

### Comment ajouter un nouvel ADR

1. Copier le template ci-dessous dans ce fichier.
2. Attribuer le numéro suivant dans la séquence.
3. Remplir toutes les sections (ne pas laisser de section vide).
4. Faire relire par au moins un autre membre de l'équipe technique.
5. Commiter le fichier avec le message : `docs: add ADR-XXX — <titre>`.

**Template :**

```markdown
## ADR-XXX — Titre

**Date :** Mois AAAA
**Statut :** Accepté
**Décideurs :** Équipe technique

### Contexte
...

### Options envisagées
1. **Option A** — avantages / inconvénients
2. **Option B** — avantages / inconvénients

### Décision
...

### Conséquences
- **Positives :** ...
- **Négatives / risques :** ...
- **À surveiller :** ...
```

---

## ADR-001 — Choix du framework frontend : React vs Vue vs Svelte

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

ConciergeOS est une application SaaS avec une interface complexe : tableaux de bord avec KPIs en temps réel, calendriers interactifs, gestion d'état multi-entités (propriétés, réservations, tâches, incidents). Le choix du framework frontend conditionne l'écosystème de composants, la vélocité de développement et les options de recrutement.

### Options envisagées

1. **React** — Framework dominant du marché, écosystème mature, large communauté.  
   Avantages : base de composants (shadcn/ui, Radix), familiarité de la majorité des développeurs, documentation abondante, React Query pour le data fetching.  
   Inconvénients : verbosité plus importante que Vue/Svelte, API hooks parfois déroutante (stale closures, règles des hooks), bundle plus lourd à taille de code équivalente.

2. **Vue 3** — Alternative solide avec Composition API, très populaire en Europe.  
   Avantages : courbe d'apprentissage douce, template HTML-like plus lisible, Pinia pour le state management.  
   Inconvénients : écosystème de composants UI moins riche que React, moins de développeurs disponibles en France, intégration TypeScript légèrement moins mature qu'en React.

3. **Svelte / SvelteKit** — Compilateur, pas de runtime DOM virtuel, performances maximales.  
   Avantages : performances brutes supérieures, syntaxe concise, bundle minimal.  
   Inconvénients : écosystème de composants quasi-inexistant comparé à React, peu de développeurs formés, risque fort sur une application SaaS complexe avec beaucoup d'interactions.

### Décision

**React** est choisi. La décision est pragmatique, pas idéologique : l'équipe actuelle est familière avec React, et l'écosystème shadcn/ui + TanStack Query couvre la majorité des besoins sans développement custom. La vraie raison du choix est le **coût humain** : changer de framework en cours de MVP aurait un coût prohibitif, et React reste le choix le plus sûr pour le recrutement futur.

### Conséquences

- **Positives :** Accès à shadcn/ui, Radix UI, Recharts, TanStack Query. Onboarding des nouveaux développeurs facilité.
- **Négatives / risques :** Bundle initial plus lourd. Gestion des hooks complexes si l'état global grossit. React Server Components non utilisés (stack Express, pas Next.js).
- **À surveiller :** Si la complexité de l'état global augmente significativement, évaluer Zustand ou Jotai plutôt que le Context API natif.

---

## ADR-002 — Choix du routeur : Wouter vs React Router vs TanStack Router

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

L'application nécessite un routeur côté client pour naviguer entre les vues (dashboard, propriétés, réservations, etc.). Comme le backend est un serveur Express séparé, le routeur client doit gérer le hash-routing ou configurer correctement le server-side fallback. Le routeur doit supporter les paramètres dynamiques (`:id`), les routes protégées et une API TypeScript correcte.

### Options envisagées

1. **Wouter (hash-based)** — Routeur minimaliste (~2 KB), orienté hash routing.  
   Avantages : extrêmement léger, zéro configuration côté serveur pour le hash routing, API simple.  
   Inconvénients : fonctionnalités avancées absentes (data loaders, Suspense intégré), moins populaire, documentation limitée.

2. **React Router v6** — Standard de facto historique.  
   Avantages : très documenté, data loaders avec Remix-style routing en v6.4+, grande communauté.  
   Inconvénients : API a significativement changé entre v5 et v6 (confusions dans la communauté), surpuissant pour un MVP, taille ~50 KB.

3. **TanStack Router** — Routeur nouvelle génération, full TypeScript, type-safe routes.  
   Avantages : sécurité de type maximale sur les routes et paramètres, intégration native avec TanStack Query.  
   Inconvénients : API encore instable en 2024-2025, courbe d'apprentissage, boilerplate de configuration important.

### Décision

**Wouter en mode hash-based** est choisi pour le MVP. La raison principale est opérationnelle : avec un backend Express sur un domaine séparé, configurer un fallback HTML5 History propre demande de la configuration serveur supplémentaire. Wouter avec hash routing (`/#/dashboard`) fonctionne sans configuration serveur et s'intègre en quelques lignes. La légèreté (< 2 KB) est aussi un avantage réel. Si l'application migre vers un hébergement avec support de l'History API (Vercel, Netlify), React Router ou TanStack Router seront réévalués.

### Conséquences

- **Positives :** Zéro configuration serveur, bundle minimal, API simple à apprendre.
- **Négatives / risques :** URLs avec `#` (ex. `/#/properties`) moins lisibles et moins SEO-friendly (peu impactant pour un SaaS). Pas de data loaders natifs.
- **À surveiller :** Si le besoin de routes SEO-friendly émerge (ex. portail public), migration vers React Router v6 avec History API.

---

## ADR-003 — Base de données MVP : SQLite (better-sqlite3 + Drizzle) vs PostgreSQL direct

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

ConciergeOS gère des données relationnelles complexes : propriétés, propriétaires, réservations, tâches, factures. Il faut une base de données fiable dès le MVP. La question est de savoir si commencer avec SQLite (déploiement simplifié) est raisonnable ou si PostgreSQL doit être utilisé d'emblée.

### Options envisagées

1. **SQLite via better-sqlite3** — Base embarquée, fichier local.  
   Avantages : déploiement trivial (pas de service à gérer), transactions ACID robustes, performances excellentes pour < 100 utilisateurs concurrents en écriture, coût infrastructure = 0.  
   Inconvénients : un seul écrivain simultané (WAL mode améliore ce point), ne supporte pas `RETURNING` de façon complète sur certaines versions, migration vers PostgreSQL nécessaire à terme.

2. **PostgreSQL directement** — SGBD production-grade.  
   Avantages : prêt pour la production à grande échelle, fonctionnalités avancées (JSONB, full-text search, pg_vector), pas de migration future.  
   Inconvénients : nécessite un service PostgreSQL (coût ~7 €/mois sur Railway/Render minimum), configuration supplémentaire, overkill pour un MVP < 50 agences.

3. **PlanetScale (MySQL compatible)** — Base de données serverless.  
   Avantages : scalabilité automatique, branchement de schéma.  
   Inconvénients : coût, dépendance à un service tiers, pas de transactions DDL, contraintes étrangères désactivées par défaut.

### Décision

**SQLite avec better-sqlite3** pour le MVP. La vraie raison : à ce stade du projet, le risque principal n'est pas la scalabilité de la base de données (qui n'arrivera pas avant 200+ agences actives), mais la vélocité de développement et le coût d'infrastructure à zéro. SQLite en mode WAL est parfaitement adapté pour un SaaS B2B en phase early-stage. La migration vers PostgreSQL est planifiée (voir ADR-014) et Drizzle ORM facilite cette transition.

### Conséquences

- **Positives :** Déploiement sur un simple VPS sans service de base de données, coût = 0, vitesse de développement maximale.
- **Négatives / risques :** Écriture concurrente limitée (atteint ses limites autour de 50 requêtes d'écriture/seconde). Sauvegardes à implémenter manuellement (Litestream ou cron de copie S3).
- **À surveiller :** Dès que l'agence dépasse 100 propriétés actives ou que les temps de réponse dégradent, déclencher ADR-014 (migration PostgreSQL).

---

## ADR-004 — ORM : Drizzle vs Prisma vs TypeORM

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

Un ORM ou query builder est nécessaire pour interagir avec la base de données depuis Express. Il doit supporter SQLite (MVP) et PostgreSQL (production), offrir une bonne expérience TypeScript et permettre les migrations de schéma.

### Options envisagées

1. **Drizzle ORM** — Query builder SQL-first avec types TypeScript inférés.  
   Avantages : SQL explicite (pas de magie cachée), types inférés du schéma, supporte SQLite et PostgreSQL sans changer le code applicatif, très léger (pas de client runtime lourd), migrations gérées via `drizzle-kit`.  
   Inconvénients : écosystème plus jeune que Prisma, moins de ressources d'apprentissage, `drizzle-kit` encore en maturation (API qui change parfois entre versions mineures).

2. **Prisma** — ORM de référence dans l'écosystème Node.js.  
   Avantages : documentation excellente, large communauté, Prisma Studio pour visualiser les données, générateur de types automatique.  
   Inconvénients : client Prisma lourd (~10 MB), moteur de requête Rust embarqué, mauvaises performances avec better-sqlite3 (passe par un moteur propriétaire), abstraction trop haute qui masque le SQL et complique les requêtes complexes.

3. **TypeORM** — ORM decorator-based à la Java/Hibernate.  
   Avantages : familier pour les développeurs Java/Spring, Active Record pattern disponible.  
   Inconvénients : bugs connus non résolus depuis des années, support TypeScript fragile, maintenance ralentie, à éviter sur les nouveaux projets.

4. **SQL brut (better-sqlite3 direct)** — Requêtes SQL manuelles.  
   Avantages : contrôle total, performance maximale.  
   Inconvénients : pas de types inférés, migrations manuelles, boilerplate important.

### Décision

**Drizzle ORM**. La décision clé est le support natif de SQLite et PostgreSQL avec le même code applicatif — ce qui rend ADR-014 (migration BDD) réalisable sans refactoring massif. Drizzle adopte une approche SQL-first qui maintient la transparence des requêtes, contrairement à Prisma dont l'abstraction peut produire des N+1 silencieux ou des requêtes inattendues. Le léger manque de maturité est un compromis acceptable pour les gains obtenus.

### Conséquences

- **Positives :** Migration SQLite → PostgreSQL sans changement de code SQL. Types TypeScript inférés du schéma. Pas de runtime lourd.
- **Négatives / risques :** API `drizzle-kit` peut évoluer entre versions (nécessite de veiller aux changelogs). Moins de documentation communautaire que Prisma.
- **À surveiller :** Mises à jour majeures de Drizzle ; maintenir les migrations dans un dossier versionné (`/db/migrations`).

---

## ADR-005 — Backend : Express.js vs Hono vs Next.js API Routes vs FastAPI

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

Le backend de ConciergeOS expose une API REST consommée par le frontend React et par des webhooks externes (Stripe, channel managers). Il doit être capable de gérer l'authentification JWT, les jobs asynchrones légers et les uploads de fichiers.

### Options envisagées

1. **Express.js** — Framework Node.js historique et minimaliste.  
   Avantages : documentation abondante, middleware écosystème mature (passport, multer, etc.), équipe familière, zéro surprise.  
   Inconvénients : pas de types natifs, verbosité, pas de validation de schéma intégrée, maintenance ralentie (mais stable).

2. **Hono** — Framework ultra-léger, multi-runtime (Node, Deno, Bun, edge).  
   Avantages : performance excellente, API moderne, validation Zod intégrée via middleware, compatible edge workers.  
   Inconvénients : écosystème de middleware moins fourni, moins de ressources communautaires.

3. **Next.js API Routes** — API co-localisée avec le frontend.  
   Avantages : monorepo naturel, déploiement simplifié sur Vercel.  
   Inconvénients : couplage fort frontend/backend difficile à séparer ensuite, WebSocket difficile, pas adapté à une API standalone réutilisable, contraintes d'architecture forte.

4. **FastAPI (Python)** — Framework Python asynchrone.  
   Avantages : documentation OpenAPI automatique, performances asynchrones excellentes, typage Pydantic.  
   Inconvénients : changement de stack complet (Python vs JavaScript), partage de types avec le frontend impossible, onboarding plus long pour une équipe JavaScript.

### Décision

**Express.js**. La décision est délibérément conservatrice : l'équipe maîtrise Express, l'écosystème middleware couvre tous les besoins (JWT avec `jsonwebtoken`, validation avec `zod`, upload avec `multer`), et le principal avantage de Hono (edge compatibility) n'est pas nécessaire pour ce projet. Sur un MVP, la familiarité de l'équipe prime sur la modernité du framework. Next.js API Routes a été écarté car l'API doit rester indépendante du frontend (consommation future par des clients mobiles ou partenaires).

### Conséquences

- **Positives :** Productivité maximale dès le premier sprint. Middleware mature disponible pour chaque besoin.
- **Négatives / risques :** Pas de validation intégrée (compensé par Zod). Express ne supporte pas les Edge Functions nativement. Maintenance du projet Express plus lente (peu de nouvelles fonctionnalités).
- **À surveiller :** Si les performances deviennent un enjeu (> 1 000 req/s), évaluer Fastify comme remplacement drop-in d'Express.

---

## ADR-006 — Architecture monorepo : tout dans un seul repo vs séparation frontend/backend

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

Le projet comprend un frontend React et un backend Express. La question est de les maintenir dans un seul dépôt Git (monorepo) ou dans deux dépôts séparés (polyrepo).

### Options envisagées

1. **Monorepo (dossiers `/client` et `/server`)** — Tout dans un seul repo Git.  
   Avantages : partage de types TypeScript entre frontend et backend (interfaces des réponses API, schémas Drizzle), PRs atomiques couvrant des modifications full-stack, CI/CD simplifié, onboarding en un seul `git clone`.  
   Inconvénients : builds plus complexes à configurer si l'équipe grandit, risque de couplage accidentel.

2. **Polyrepo (deux repos séparés)** — Frontend et backend dans des dépôts distincts.  
   Avantages : déploiements indépendants, équipes pouvant travailler en parallèle sans conflit de branches.  
   Inconvénients : synchronisation des types entre repos (package npm partagé ou copie manuelle), PRs fractionnées sur plusieurs repos, doublon de configuration (ESLint, TypeScript, CI/CD).

3. **Monorepo avec Turborepo/Nx** — Monorepo outillé pour workspaces multiples.  
   Avantages : builds incrémentaux, cache partagé, séparation formelle des packages.  
   Inconvénients : complexité de configuration excessive pour un MVP à deux personnes.

### Décision

**Monorepo simple** avec `/client` et `/server` dans un seul repo, sans outil de workspaces. La principale motivation est le **partage de types TypeScript** : les interfaces des réponses API et les types Drizzle peuvent être importés directement dans le frontend, éliminant une source de désynchronisation. Pour un MVP avec une petite équipe, la simplicité d'un seul `git clone` et d'un seul pipeline CI l'emporte sur la flexibilité d'un polyrepo.

### Conséquences

- **Positives :** Types partagés sans friction. PRs atomiques. Un seul `.github/workflows`. Onboarding simplifié.
- **Négatives / risques :** Si l'équipe grossit (> 10 développeurs), les conflits de branches et le temps de build augmentent. Déploiements couplés si le CI n'est pas configuré pour déployer sélectivement.
- **À surveiller :** Configurer le CI pour détecter les changements par dossier (`paths` dans GitHub Actions) afin de ne déployer que la partie modifiée.

---

## ADR-007 — Authentification MVP : JWT en React context vs sessions serveur vs Supabase Auth

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

ConciergeOS nécessite une authentification sécurisée avec gestion des rôles (`admin`, `manager`, `operator`, `provider`). Le MVP doit également supporter les magic links pour faciliter la connexion des prestataires sans mot de passe.

### Options envisagées

1. **JWT stocké en mémoire/localStorage + Context React** — Authentification stateless côté client.  
   Avantages : pas de session côté serveur à gérer, scalable horizontalement, contrôle total sur le payload (rôles inclus dans le token).  
   Inconvénients : révocation de token complexe (nécessite une liste noire), refresh token à implémenter, risque XSS si stocké dans localStorage.

2. **Sessions serveur (express-session + store SQLite)** — Authentification stateful.  
   Avantages : révocation immédiate, plus simple à implémenter et à comprendre.  
   Inconvénients : scalabilité horizontale complexe (sessions à partager entre instances), incompatible avec une future API mobile/partenaire sans adaptation.

3. **Supabase Auth** — Service d'authentification managé.  
   Avantages : magic links, OAuth social, sécurité gérée par Supabase.  
   Inconvénients : dépendance externe forte, coût à l'usage, couplage avec l'écosystème Supabase difficile à défaire, complexité ajoutée si Supabase n'est utilisé que pour l'auth.

### Décision

**JWT stocké en mémoire React (Context API)** avec liste noire en mémoire pour la révocation. Compromis pragmatique : stateless pour la scalabilité future, contrôle complet sur le payload (rôles, agencyId), et implémentation simple. Le token n'est pas persisté dans localStorage mais dans le Context React (perd la session au refresh — compensé par un cookie `httpOnly` de refresh token côté serveur dans la v2). La liste noire est maintenue en mémoire pour le MVP (acceptable tant qu'il y a une seule instance serveur).

### Conséquences

- **Positives :** Implémentation rapide, pas de service tiers, contrôle des rôles dans le payload JWT.
- **Négatives / risques :** Perte de session au rechargement de page si le refresh token n'est pas implémenté. Liste noire en mémoire = invalidée au redémarrage du serveur (acceptable en MVP, inacceptable en production multi-instances).
- **À surveiller :** Implémenter un cookie `httpOnly` refresh token avant passage en production multi-instances. Migrer la liste noire vers Redis si nécessaire.

---

## ADR-008 — UI Components : shadcn/ui vs MUI vs Ant Design vs Radix UI seul

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

L'application nécessite une bibliothèque de composants UI complète : boutons, formulaires, modales, tables, calendriers, toasts, etc. Le composant doit être personnalisable (Tailwind CSS), accessible (ARIA), et rapide à intégrer.

### Options envisagées

1. **shadcn/ui** — Collection de composants basée sur Radix UI + Tailwind CSS, copiés dans le projet.  
   Avantages : contrôle total du code (pas de dépendance npm), Radix UI pour l'accessibilité, Tailwind pour la personnalisation, composants copiables à la carte.  
   Inconvénients : « no-package » (les composants vivent dans le projet, pas dans `node_modules`), maintenance des composants copiés, pas de versioning automatique.

2. **Material UI (MUI)** — Bibliothèque complète, design Material Design.  
   Avantages : très complet, stable, large adoption.  
   Inconvénients : opinionated Material Design difficile à sur-styler, bundle lourd, sx prop peu ergonomique avec Tailwind.

3. **Ant Design** — Bibliothèque enterprise, très complète.  
   Avantages : composants complexes inclus (tables virtualisées, date pickers avancés), documentation en anglais et chinois.  
   Inconvénients : esthétique très marquée (difficile de dévier du style Ant), bundle > 1 MB, surchargé pour un MVP.

4. **Radix UI seul** — Primitives accessibles sans style.  
   Avantages : minimaliste, accessibilité parfaite, contrôle total du style.  
   Inconvénients : nécessite de styliser chaque composant depuis zéro — coût développement significatif.

### Décision

**shadcn/ui**. L'approche « copy-paste » n'est pas un défaut mais un avantage délibéré : les composants sont dans le projet, modifiables librement, sans contrainte de mise à jour de dépendance. La combinaison Radix UI (accessibilité) + Tailwind CSS (personnalisation) correspond exactement à nos contraintes. Ant Design et MUI ont été écartés car leur système de style entre en conflit avec Tailwind CSS et nécessitent une configuration complexe pour s'en affranchir.

### Conséquences

- **Positives :** Accessibilité ARIA incluse. Personnalisation totale via Tailwind. Pas de bundle npm à gérer.
- **Négatives / risques :** Les mises à jour de shadcn/ui sont manuelles (surveiller les nouvelles versions pour les correctifs de sécurité). Quelques composants complexes absents (tableau virtuel, calendrier avancé) → compléter avec `react-big-calendar` ou `TanStack Table`.
- **À surveiller :** Pour le calendrier des réservations, `react-big-calendar` ou `@fullcalendar/react` sont à évaluer car shadcn/ui ne propose pas de calendrier multi-ressources.

---

## ADR-009 — Jobs asynchrones : Inngest vs BullMQ vs simple cron Node.js

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

Certaines opérations ne doivent pas bloquer la réponse HTTP : génération de PDFs de factures, envoi d'emails, traitement des webhooks Stripe, création automatique des tâches de ménage lors d'une réservation. Un mécanisme de jobs asynchrones est nécessaire.

### Options envisagées

1. **Simple cron Node.js (node-cron)** — Tâches planifiées dans le même processus.  
   Avantages : zéro dépendance externe, simple à comprendre.  
   Inconvénients : pas de file d'attente, pas de retry automatique, jobs perdus si le serveur redémarre, pas de monitoring des jobs.

2. **BullMQ** — File de messages Redis-backed, battle-tested.  
   Avantages : retry automatique, monitoring via Bull Board, jobs distribués, priorités.  
   Inconvénients : nécessite un service Redis (~7 €/mois minimum), complexité ajoutée.

3. **Inngest** — Service de jobs asynchrones managé, déclenchement par événements.  
   Avantages : pas d'infrastructure à gérer, retry configurable, dashboard de monitoring, déclenchement par événement (serverless-friendly), gratuit jusqu'à 50 000 événements/mois.  
   Inconvénients : dépendance externe, latence légèrement plus élevée qu'un worker local, données transitant par les serveurs Inngest.

### Décision

**node-cron pour le MVP**, avec une architecture préparée pour migrer vers BullMQ ou Inngest. La raison honnête est le coût : pour un MVP avec < 100 réservations/jour, l'overhead d'un service Redis ou d'Inngest n'est pas justifié. Les jobs critiques (génération de factures, emails) sont exécutés de manière synchrone avec retry manuel en cas d'échec, loggués dans la base. Si un job échoue, un admin peut le re-déclencher manuellement via l'API. Cette approche est acceptable pour les premiers mois, pas pour une croissance au-delà de 50 agences.

### Conséquences

- **Positives :** Zéro infrastructure supplémentaire, coût = 0, simplicité maximale.
- **Négatives / risques :** Jobs perdus si le processus crash. Pas de retry automatique. Risque de timeout HTTP si un job lourd (PDF) est exécuté de manière synchrone.
- **À surveiller :** Dès que le volume dépasse 20 réservations/jour ou que des jobs longs apparaissent, migrer vers Inngest (choix prioritaire pour sa simplicité d'intégration) ou BullMQ si l'infra Redis est déjà présente.

---

## ADR-010 — Emails : Resend vs SendGrid vs Nodemailer

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

ConciergeOS doit envoyer plusieurs types d'emails : magic links d'authentification, invitations d'utilisateurs, notifications d'incidents, envoi de factures PDF aux propriétaires. La délivrabilité est critique pour les emails transactionnels.

### Options envisagées

1. **Resend** — Service d'emails transactionnels moderne, API REST simple.  
   Avantages : DX excellente (SDK officiel Node.js, React Email pour les templates), délivrabilité DKIM/SPF gérée, 3 000 emails/mois gratuits, dashboard de tracking, webhooks.  
   Inconvénients : service relativement récent (fondé en 2022), moins de recul sur la délivrabilité long terme.

2. **SendGrid** — Standard de l'industrie pour les emails.  
   Avantages : délivrabilité éprouvée, 100 emails/jour gratuits, documentation exhaustive.  
   Inconvénients : interface admin datée, API verbieuse, intégration templates moins moderne, tarification qui monte vite.

3. **Nodemailer (SMTP direct)** — Envoi SMTP via un serveur tiers (OVH, Gmail, etc.)  
   Avantages : gratuit, pas de dépendance tiers.  
   Inconvénients : délivrabilité médiocre sans configuration SPF/DKIM propre, risque d'atterrir en spam, complexité de configuration, pas de tracking ni de rebond automatique.

### Décision

**Resend**. La DX est nettement supérieure aux alternatives : l'intégration avec **React Email** permet de créer des templates d'emails en composants React, ce qui est cohérent avec notre stack. L'API est simple et bien typée. Les 3 000 emails/mois gratuits couvrent largement les besoins du MVP. Nodemailer a été écarté pour ses risques de délivrabilité (les emails de factures en spam seraient inacceptables pour nos clients propriétaires).

### Conséquences

- **Positives :** Templates d'emails en React (cohérence avec la stack). Délivrabilité gérée. Dashboard de tracking.
- **Négatives / risques :** Dépendance à Resend. Si Resend tombe en panne, les emails ne partent pas. Prévoir un fallback (file d'attente avec retry).
- **À surveiller :** Configurer les webhooks Resend pour détecter les bounces et désactiver les destinataires invalides.

---

## ADR-011 — Hébergement frontend : Vercel vs Netlify vs Cloudflare Pages vs VPS

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

Le frontend React est une Single Page Application (SPA) avec assets statiques. Il doit être servi rapidement, avec HTTPS automatique, et se déployer automatiquement à chaque push sur `main`.

### Options envisagées

1. **Vercel** — Plateforme de déploiement frontend de référence.  
   Avantages : déploiement CI/CD intégré, Edge Network mondial, previews de déploiement par PR, gratuit pour les projets personnels, HTTPS automatique.  
   Inconvénients : plan gratuit limité (100 Go de bande passante, 12 000 edge requêtes), pricing qui peut devenir élevé à forte volumétrie.

2. **Netlify** — Alternative directe à Vercel.  
   Avantages : fonctionnalités similaires à Vercel, formulaires et functions intégrés.  
   Inconvénients : Edge Network légèrement moins performant, interface moins soignée, moins d'intégration avec l'écosystème React/Next.js.

3. **Cloudflare Pages** — CDN de Cloudflare pour les sites statiques.  
   Avantages : réseau CDN le plus rapide (300+ PoP mondiaux), bande passante illimitée en gratuit, Workers pour la logique edge.  
   Inconvénients : intégration CI/CD moins intuitive, dashboard moins lisible, Workers API différente de Node.js.

4. **VPS OVH (serveur nginx)** — Servir les assets statiques depuis un VPS.  
   Avantages : coût prévisible et faible (3-5 €/mois), contrôle total.  
   Inconvénients : pas de CDN par défaut, configuration nginx manuelle, pas de previews de déploiement, pas de CI/CD natif.

### Décision

**Vercel**. L'intégration GitHub + déploiement automatique + previews de PR est ici le critère décisif. Sur un MVP, la productivité de l'équipe (voir les changements visuels en PR avant merge) justifie amplement le choix de Vercel malgré un coût potentiellement plus élevé à grande échelle. Le plan gratuit couvre les besoins jusqu'à plusieurs dizaines d'agences actives.

### Conséquences

- **Positives :** Déploiements automatiques, previews par PR, HTTPS, CDN mondial, zéro ops.
- **Négatives / risques :** Dépendance à Vercel. Si les besoins dépassent le plan gratuit, le coût augmente rapidement.
- **À surveiller :** Surveiller la consommation de bande passante. Si le coût Vercel dépasse 50 €/mois, migrer vers Cloudflare Pages (bande passante illimitée).

---

## ADR-012 — Hébergement backend : Railway vs Render vs Fly.io vs VPS OVH

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

Le backend Express + SQLite doit être déployé sur un service gérant le déploiement depuis Git, avec stockage persistant pour le fichier SQLite, HTTPS automatique et capacité de redémarrage automatique.

### Options envisagées

1. **Railway** — PaaS simple, déploiement depuis GitHub, volumes persistants.  
   Avantages : volumes persistants pour SQLite, déploiement en 2 minutes, starter plan à ~5 $/mois, logs et métriques intégrés.  
   Inconvénients : starter plan limité (500h/mois de compute), pricing moins prévisible que Render.

2. **Render** — PaaS similaire à Railway.  
   Avantages : plan gratuit (avec cold start de 50s), disques persistants, déploiement depuis Git, pricing prévisible.  
   Inconvénients : cold starts sur le plan gratuit inacceptables en production, disques persistants disponibles uniquement sur les plans payants.

3. **Fly.io** — Déploiement de containers Docker, edge computing.  
   Avantages : déploiement proche des utilisateurs, Fly Volumes pour SQLite persistant, pricing attractif.  
   Inconvénients : courbe d'apprentissage plus élevée (CLI Fly, flyctl, toml de config), container Docker requis.

4. **VPS OVH (3,5 €/mois)** — Serveur virtuel avec PM2 + nginx.  
   Avantages : coût fixe et minimal, données sur le même serveur, contrôle total.  
   Inconvénients : configuration manuelle (nginx, SSL, PM2, monitoring), pas de déploiement automatique natif, responsabilité des mises à jour de sécurité.

### Décision

**Railway**. Le critère principal est la **persistance du volume SQLite** combinée à la simplicité de déploiement. Railway propose des volumes persistants sur son plan starter, ce qui est essentiel pour SQLite (le fichier doit survivre aux déploiements). Render a été écarté pour ses cold starts sur le plan gratuit. Fly.io est très bien mais nécessite un Dockerfile et une courbe d'apprentissage non négligeable. Le VPS OVH reste en option de repli si le coût Railway devient disproportionné.

### Conséquences

- **Positives :** Volume persistant pour SQLite. Déploiement depuis GitHub. Logs intégrés. HTTPS automatique.
- **Négatives / risques :** Pricing Railway peut augmenter avec l'usage. Vendor lock-in modéré.
- **À surveiller :** Configurer des sauvegardes automatiques du fichier SQLite vers S3 (ex. via Litestream) indépendamment de Railway, pour ne pas dépendre uniquement des snapshots Railway.

---

## ADR-013 — Paiements : Stripe Connect vs PayPal vs Adyen vs Lemon Squeezy

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

ConciergeOS facture les agences via un abonnement SaaS mensuel. À terme, la plateforme pourrait gérer les reversements aux propriétaires via des virements automatisés. Deux cas d'usage distincts : (1) facturation de l'abonnement SaaS, (2) (futur) reversements aux propriétaires.

### Options envisagées

1. **Stripe** — Standard de l'industrie pour les paiements SaaS.  
   Avantages : Stripe Billing pour les abonnements récurrents, Stripe Connect pour les reversements propriétaires, webhooks robustes, SDK officiel Node.js, documentation exemplaire, disponible partout en Europe.  
   Inconvénients : frais de transaction (1,5% + 0,25€ sur la zone SEPA), Stripe Connect complexe à configurer pour les reversements.

2. **Lemon Squeezy** — Merchant of Record pour les SaaS.  
   Avantages : gère la TVA automatiquement (Merchant of Record), intégration simple, pas besoin de Stripe Tax.  
   Inconvénients : frais plus élevés (5% + $0.50), moins de contrôle, pas adapté aux reversements propriétaires.

3. **PayPal** — Solution de paiement grand public.  
   Avantages : notoriété, disponibilité mondiale.  
   Inconvénients : DX médiocre, API vieillissante, rétentions de fonds fréquentes pour les nouvelles entreprises, peu adapté au B2B SaaS européen.

4. **Adyen** — Solution enterprise.  
   Avantages : robustesse, couverture mondiale, réversements bancaires.  
   Inconvénients : volume minimum élevé, onboarding long (>2 semaines), seuil d'accès en volume, inadapté au MVP.

### Décision

**Stripe** (Stripe Billing pour les abonnements, Stripe Connect préparé pour les reversements). Stripe est le choix incontestable pour un SaaS B2B en Europe : documentation, DX, webhooks et fiabilité sont imbattables. Lemon Squeezy a été sérieusement envisagé pour sa gestion automatique de la TVA, mais ses frais de 5% sont trop élevés à l'échelle et les reversements propriétaires seraient impossibles. La gestion TVA sera déléguée à Stripe Tax dès que le volume le justifie.

### Conséquences

- **Positives :** Abonnements récurrents via Stripe Billing. Webhooks fiables. Prêt pour les reversements propriétaires via Stripe Connect en phase 2.
- **Négatives / risques :** Gestion manuelle de la conformité TVA en attendant Stripe Tax. Stripe Connect pour les reversements est complexe et nécessite une vérification KYB des agences.
- **À surveiller :** Activer Stripe Tax dès 10 000 € de MRR. Documenter le processus de KYB Stripe Connect avant de développer les reversements automatisés.

---

## ADR-014 — Stratégie de migration BDD : SQLite MVP → PostgreSQL production

**Date :** Mai 2026  
**Statut :** Accepté  
**Décideurs :** Équipe technique

### Contexte

La décision ADR-003 de démarrer avec SQLite implique une migration vers PostgreSQL à terme. Cette ADR documente la stratégie de migration pour qu'elle soit anticipée dès le début et non découverte en urgence.

### Options envisagées

1. **Migration directe (big bang)** — Exporter SQLite, importer dans PostgreSQL, basculer en production.  
   Avantages : simple à concevoir, migration en une seule fenêtre de maintenance.  
   Inconvénients : risque élevé, downtime potentiellement long, pas de rollback facile.

2. **Migration progressive avec double-écriture** — Écrire simultanément dans SQLite et PostgreSQL pendant une période de transition, puis basculer les lectures.  
   Avantages : zéro downtime, validation des données en parallèle, rollback simple.  
   Inconvénients : complexité du code de double-écriture, durée de la période de transition.

3. **Migration via Drizzle (changement de dialecte)** — Changer le dialecte Drizzle de `sqlite` à `postgres`, générer de nouvelles migrations, exporter/importer les données.  
   Avantages : le schéma Drizzle reste identique (ADR-004 anticipait ce cas), la plupart des types SQLite mappent directement en PostgreSQL.  
   Inconvénients : quelques ajustements de types nécessaires (BLOB → BYTEA, INTEGER timestamps → TIMESTAMPTZ).

### Décision

**Migration via Drizzle (option 3)**, avec une fenêtre de maintenance planifiée. La stratégie en 5 étapes :

1. **Préparer l'environnement PostgreSQL** sur Railway ou Supabase.
2. **Exporter les données SQLite** via script d'export en JSON ou CSV.
3. **Adapter le schéma Drizzle** : changer le dialecte, ajuster les types (notamment les timestamps stockés en INTEGER → remplacer par des TIMESTAMPTZ natifs).
4. **Importer les données** via un script de migration one-shot.
5. **Tester en staging** pendant 48h avant bascule production.

La double-écriture (option 2) est prévue uniquement si les données en production dépassent 100 000 lignes au moment de la migration — dans ce cas, le risque justifie la complexité.

### Conséquences

- **Positives :** Migration anticipée et documentée. Code Drizzle quasi-identique après migration (seul le dialecte change). Schéma évolutif dès le MVP (pas de types SQLite-only utilisés volontairement).
- **Négatives / risques :** Fenêtre de maintenance nécessaire (estimée à 1-4h selon le volume de données). Risque de données corrompues si le script d'export/import n'est pas testé en amont.
- **À surveiller :** Éviter d'utiliser des fonctionnalités SQLite-spécifiques dans le code (ex. `sqlite_sequence`, fonctions SQLite propriétaires). Maintenir un script de test de migration à jour et l'exécuter à chaque évolution de schéma.

---

*ConciergeOS — Documentation v1.0 — Mai 2026*
