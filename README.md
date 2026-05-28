# ConciergeOS

> Plateforme SaaS de gestion de conciergerie pour locations courtes durées (Airbnb, Booking.com, Vrbo)

[![Version](https://img.shields.io/badge/version-1.0.0--MVP-blue)](https://github.com)
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Express%20%2B%20SQLite-teal)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Vue d'ensemble

ConciergeOS centralise la gestion des biens, des réservations, des opérations terrain (ménage, check-in, maintenance), de la relation propriétaires et voyageurs, et du pilotage financier.

**Problème résolu :** Les agences jonglent entre 4 à 7 outils distincts (tableur, messagerie, application ménage, canal OTA, comptabilité), générant pertes de temps, erreurs opérationnelles et mauvaise expérience client.

**Proposition de valeur :** Une plateforme unique, simple, mobile-first, avec automatisation des tâches répétitives et portails dédiés par profil.

---

## 🏗️ Architecture

```
conciergeos/
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── components/        # Composants UI (shadcn/ui)
│   │   ├── pages/             # Pages de l'application
│   │   │   ├── Landing.tsx    # Page marketing publique
│   │   │   ├── Dashboard.tsx  # Tableau de bord agence
│   │   │   ├── Properties.tsx # Gestion des biens
│   │   │   ├── Bookings.tsx   # Gestion des réservations
│   │   │   ├── Planning.tsx   # Planning opérationnel
│   │   │   ├── Tasks.tsx      # Missions terrain
│   │   │   ├── Incidents.tsx  # Incidents & maintenance
│   │   │   ├── Messages.tsx   # Messagerie unifiée
│   │   │   ├── Finances.tsx   # Finance & facturation
│   │   │   ├── Analytics.tsx  # Analytics & reporting
│   │   │   ├── Settings.tsx   # Paramètres agence
│   │   │   ├── OwnerPortal.tsx # Portail propriétaire
│   │   │   ├── GuestPortal.tsx # Portail voyageur
│   │   │   └── ProviderApp.tsx # App prestataire (PWA)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilitaires (queryClient, utils)
│   │   └── index.css          # Design system + tokens couleur
├── server/                    # Backend Express
│   ├── index.ts               # Point d'entrée serveur
│   ├── routes.ts              # Routes API REST
│   ├── storage.ts             # Couche données (Drizzle ORM)
│   └── vite.ts                # Intégration Vite en dev
├── shared/
│   └── schema.ts              # Schéma BDD partagé (Drizzle)
├── docs/                      # Documentation
│   ├── 01-guide-integration-hebergeur.md
│   ├── 02-manuel-administrateur.md
│   └── 03-manuel-utilisateur.md
├── specifications-conciergerie-airbnb.md  # Specs complètes
└── package.json
```

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js 20+
- npm 9+
- Git

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/conciergeos.git
cd conciergeos
npm install
```

### Développement

```bash
npm run dev
```

L'application démarre sur `http://localhost:5000`

### Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin agence | admin@demo.fr | demo123 |
| Propriétaire | proprio@demo.fr | demo123 |
| Prestataire | cleaner@demo.fr | demo123 |

> Note : En mode démo, n'importe quel email/mot de passe fonctionne.

### Build production

```bash
npm run build
NODE_ENV=production node dist/index.cjs
```

---

## 🗄️ Base de données

Le MVP utilise **SQLite** via Drizzle ORM. Pour la production, migrer vers **PostgreSQL via Supabase** (voir `docs/01-guide-integration-hebergeur.md`).

### Tables principales

| Table | Description |
|-------|-------------|
| `agencies` | Agences clientes de la plateforme |
| `users` | Tous les utilisateurs (admin, agents, prestataires) |
| `owners` | Propriétaires immobiliers |
| `properties` | Biens immobiliers gérés |
| `bookings` | Réservations |
| `tasks` | Missions opérationnelles (ménage, check-in, maintenance) |
| `incidents` | Incidents et tickets |
| `messages` | Messagerie unifiée |
| `invoices` | Factures propriétaires |

---

## 👥 Rôles utilisateurs

| Rôle | Portée | Droits principaux |
|------|--------|-------------------|
| Super Admin | Toute la plateforme | Toutes les actions |
| Admin agence | Son agence uniquement | Tous les paramètres |
| Manager opérations | Son agence | Planning, missions, incidents |
| Commercial/CRM | Son agence | Leads, contrats, propriétaires |
| Prestataire | Ses missions uniquement | Voir et valider ses tâches |
| Propriétaire | Ses biens uniquement | Lecture, blocage dates |
| Voyageur | Sa réservation uniquement | Guide, chat, services |

---

## 💰 Plans tarifaires

| Plan | Prix | Cible |
|------|------|-------|
| Freemium | Gratuit | 1 bien, fonctionnalités limitées |
| Starter | 9 €/logement/mois | Indépendants 1–5 biens |
| Pro | 14 €/logement/mois | Agences 6–20 biens |
| Agency | 19 €/logement/mois | Agences >20 biens |

---

## 🔌 Intégrations (roadmap production)

| Service | Usage | Tier gratuit |
|---------|-------|-------------|
| **Supabase** | PostgreSQL + Auth + Storage | 500 MB BDD |
| **Vercel** | Hosting frontend | Illimité (hobby) |
| **Railway** | Hosting backend | 5 $ crédit/mois |
| **Stripe Connect** | Paiements + reversements | Pas de fixe |
| **Resend** | Emails transactionnels | 3 000 emails/mois |
| **Twilio** | SMS | Pay-as-you-go |
| **Inngest** | Jobs asynchrones | 100K runs/mois |
| **Sentry** | Monitoring erreurs | 5K erreurs/mois |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Guide d'intégration hébergeur](docs/01-guide-integration-hebergeur.md) | Déploiement step-by-step sur Vercel + Supabase + Railway |
| [Manuel Administrateur](docs/02-manuel-administrateur.md) | Guide complet pour les admins d'agence |
| [Manuel Utilisateur](docs/03-manuel-utilisateur.md) | Guides pour propriétaires, voyageurs et prestataires |
| [Spécifications techniques](specifications-conciergerie-airbnb.md) | Specs fonctionnelles et techniques complètes |

---

## 🗺️ Roadmap

### Phase MVP (actuelle)
- ✅ Interface back-office agence complète
- ✅ Portail propriétaire
- ✅ Portail voyageur (mobile-first)
- ✅ App prestataire (PWA)
- ✅ Planning opérationnel
- ✅ Messagerie unifiée (inbox)
- ✅ Module finance (factures, reversements)
- ✅ Analytics & reporting
- ✅ Base SQLite (dev)

### Phase 1 — Intégrations (mois 3–6)
- [ ] Migration PostgreSQL/Supabase
- [ ] Authentification Supabase Auth (JWT, RBAC, RLS)
- [ ] Stripe Connect (paiements + abonnements)
- [ ] Resend (emails automatiques)
- [ ] Twilio (SMS + WhatsApp)
- [ ] Inngest (jobs asynchrones, workflows)

### Phase 2 — Channel Manager (mois 6–9)
- [ ] Sync iCal (Airbnb, Booking.com)
- [ ] API Booking.com
- [ ] Intégration serrures IoT (Nuki, Igloohome)
- [ ] Signature électronique (YouSign)

### Phase 3 — Intelligence (mois 9–12)
- [ ] Revenue management automatique
- [ ] Assistance IA messagerie (Claude API)
- [ ] Traduction automatique (FR/EN/ES/AR)
- [ ] Rapports prédictifs

---

## 🛠️ Stack technique

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool ultra-rapide)
- **Tailwind CSS v3** + design system custom
- **shadcn/ui** (composants accessibles)
- **Wouter** (routing hash-based, compatible déploiement)
- **TanStack Query v5** (state serveur, cache)
- **Recharts** (graphiques)
- **Lucide React** (icônes)

### Backend
- **Express.js** + **TypeScript**
- **Drizzle ORM** (type-safe, migrations)
- **SQLite** via `better-sqlite3` (MVP)
- **Zod** (validation des données)

### DevOps
- **GitHub** (versioning)
- **Vercel** (CI/CD frontend)
- **Railway** (backend Node.js)
- **Cloudflare** (DNS + CDN)

---

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm run test

# Build de vérification
npm run build
```

---

## 🤝 Contribution

1. Fork le dépôt
2. Crée une branche feature : `git checkout -b feature/mon-feature`
3. Commit tes changements : `git commit -m 'feat: ajout du simulateur de revenus'`
4. Push : `git push origin feature/mon-feature`
5. Ouvre une Pull Request

### Convention de commits (Conventional Commits)
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` modification documentation
- `refactor:` refactoring sans changement fonctionnel
- `style:` changement de style/CSS
- `test:` ajout ou modification de tests
- `chore:` tâches de maintenance

---

## 📄 Licence

MIT — voir [LICENSE](LICENSE)

---

## 👨‍💻 Auteur

Projet initié en **mai 2026** par un entrepreneur franco-marocain spécialisé dans la tech et l'immobilier.

---

*ConciergeOS — Plateforme SaaS de conciergerie Airbnb — v1.0 MVP — Mai 2026*
