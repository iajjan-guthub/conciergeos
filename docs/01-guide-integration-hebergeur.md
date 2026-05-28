# ConciergeOS — Guide d'intégration hébergeur

> Document technique destiné aux développeurs et DevOps responsables du déploiement de la plateforme ConciergeOS en environnement de production.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Architecture de déploiement](#2-architecture-de-déploiement)
3. [Étape 1 — Configuration Supabase](#étape-1--configuration-supabase)
4. [Étape 2 — Déploiement Backend (Railway)](#étape-2--déploiement-backend-railway)
5. [Étape 3 — Déploiement Frontend (Vercel)](#étape-3--déploiement-frontend-vercel)
6. [Étape 4 — Configuration Stripe](#étape-4--configuration-stripe)
7. [Étape 5 — Configuration Resend (Emails)](#étape-5--configuration-resend-emails)
8. [Étape 6 — Configuration Twilio (SMS)](#étape-6--configuration-twilio-sms)
9. [Étape 7 — Configuration Cloudflare (DNS + CDN)](#étape-7--configuration-cloudflare-dns--cdn)
10. [Étape 8 — Monitoring avec Sentry](#étape-8--monitoring-avec-sentry)
11. [Variables d'environnement complètes](#11-variables-denvironnement-complètes)
12. [Vérification post-déploiement](#12-vérification-post-déploiement)
13. [Mise à jour en production (CI/CD)](#13-mise-à-jour-en-production-cicd)
14. [Procédure de rollback](#14-procédure-de-rollback)
15. [Estimation des coûts mensuels](#15-estimation-des-coûts-mensuels)

---

## 1. Prérequis

### Environnement local

Avant de démarrer le déploiement, vérifiez que votre machine dispose des outils suivants :

| Outil | Version minimale | Vérification |
|---|---|---|
| Node.js | 20.x LTS | `node --version` |
| npm | 10.x | `npm --version` |
| Git | 2.40+ | `git --version` |
| Railway CLI | dernière | `railway --version` |
| Vercel CLI | dernière | `vercel --version` |

```bash
# Installation des CLI
npm install -g @railway/cli
npm install -g vercel
```

### Comptes à créer

Créez les comptes suivants **avant** de commencer. Conservez vos identifiants dans un gestionnaire de mots de passe sécurisé (Bitwarden, 1Password).

| Service | URL | Rôle | Plan recommandé |
|---|---|---|---|
| Supabase | https://supabase.com | Base de données PostgreSQL + Auth | Pro (25 $/mois) |
| Railway | https://railway.app | Hébergement backend Express.js | Hobby/Team (5 $/mois) |
| Vercel | https://vercel.com | Hébergement frontend React | Pro (20 $/mois) |
| Stripe | https://stripe.com | Paiements + Stripe Connect | Pay-as-you-go |
| Resend | https://resend.com | Envoi d'emails transactionnels | Pro (20 $/mois) |
| Twilio | https://twilio.com | Envoi de SMS | Pay-as-you-go |
| Cloudflare | https://cloudflare.com | DNS + CDN + SSL | Free ou Pro |
| Sentry | https://sentry.io | Monitoring des erreurs | Team (26 $/mois) |
| Inngest | https://inngest.com | Jobs asynchrones | Free → Pro |
| GitHub | https://github.com | Versioning + CI/CD | Free ou Team |

> ⚠️ **Note :** Stripe nécessite une vérification d'identité pour activer les paiements réels. Lancez ce processus dès l'ouverture du compte pour éviter tout délai.

---

## 2. Architecture de déploiement

### Schéma ASCII de l'infrastructure production

```
                         ┌──────────────────────────────────┐
                         │           UTILISATEURS            │
                         │  Browsers, PWA mobile, Voyageurs  │
                         └──────────────┬───────────────────┘
                                        │ HTTPS
                         ┌──────────────▼───────────────────┐
                         │          CLOUDFLARE               │
                         │  DNS + CDN + WAF + SSL/TLS       │
                         │  DDoS protection + Page Rules     │
                         └───┬──────────────────────────┬───┘
                             │                          │
              ┌──────────────▼──────────┐  ┌───────────▼────────────┐
              │       VERCEL             │  │       RAILWAY           │
              │   Frontend React/Vite    │  │  Backend Express.js     │
              │   Tailwind + shadcn/ui   │  │  API REST + Webhooks    │
              │   app.conciergeos.fr     │  │  api.conciergeos.fr     │
              └─────────────────────────┘  └───────────┬────────────┘
                                                        │
                          ┌─────────────────────────────┼──────────────────────────┐
                          │                             │                          │
              ┌───────────▼──────────┐   ┌─────────────▼──────────┐  ┌───────────▼──────────┐
              │      SUPABASE         │   │        INNGEST          │  │        SENTRY         │
              │  PostgreSQL + Auth    │   │  Jobs asynchrones       │  │  Monitoring erreurs   │
              │  Row Level Security   │   │  Tâches planifiées      │  │  Stack traces         │
              │  Realtime             │   │  Retry automatique      │  │  Alertes             │
              └───────────────────────┘   └─────────────────────────┘  └───────────────────────┘
                          │
          ┌───────────────┼──────────────────┐
          │               │                  │
┌─────────▼──────┐ ┌──────▼──────┐ ┌────────▼────────┐
│     STRIPE      │ │   RESEND    │ │     TWILIO       │
│  Paiements     │ │  Emails     │ │  SMS             │
│  Stripe Connect│ │  Templates  │ │  Notifications   │
│  Webhooks      │ │  Webhooks   │ │  Alertes         │
└────────────────┘ └─────────────┘ └─────────────────┘
```

### Explication de chaque composant

- **Cloudflare** : Couche d'entrée universelle. Gère le DNS, le SSL, le cache et la protection anti-DDoS. Tous les flux passent par Cloudflare avant d'atteindre Vercel ou Railway.
- **Vercel** : CDN mondial qui sert le bundle React statique. Déploiement automatique à chaque push sur `main`. Gère les edge functions si nécessaire.
- **Railway** : Plateforme PaaS hébergeant le serveur Express.js. Scaling automatique horizontal, logs centralisés, domaine custom HTTPS.
- **Supabase** : Backend-as-a-Service PostgreSQL avec Row Level Security, authentification JWT, realtime via WebSockets et stockage de fichiers.
- **Inngest** : Orchestrateur de jobs asynchrones (envoi d'emails différés, calcul de reversements, synchronisation Airbnb). Retry automatique avec backoff exponentiel.
- **Stripe** : Gestion des abonnements SaaS (Stripe Billing) et des reversements aux propriétaires (Stripe Connect).
- **Resend** : Service d'envoi d'emails transactionnels avec templates React Email.
- **Twilio** : Envoi de SMS pour les notifications critiques (arrivée imminente, incident urgent).
- **Sentry** : Capture des erreurs frontend et backend avec contexte complet (user, request, stack trace).

---

## Étape 1 — Configuration Supabase

### 1.1 Création du projet Supabase

1. Connectez-vous sur [app.supabase.com](https://app.supabase.com)
2. Cliquez sur **New project**
3. Renseignez :
   - **Organization** : votre organisation
   - **Project name** : `conciergeos-prod`
   - **Database password** : générez un mot de passe fort (minimum 32 caractères, conservez-le précieusement)
   - **Region** : `West EU (Ireland)` pour une latence optimale depuis la France
4. Cliquez sur **Create new project** et attendez ~2 minutes

### 1.2 Migration du schéma SQLite → PostgreSQL

Exécutez le SQL suivant dans l'éditeur SQL de Supabase (**SQL Editor > New query**) :

```sql
-- =============================================
-- SCHEMA CONCIERGEOS — PostgreSQL / Supabase
-- Version 1.0 — Mai 2026
-- =============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLE: agencies
-- =============================================
CREATE TABLE agencies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  address       TEXT,
  city          TEXT,
  postal_code   TEXT,
  country       TEXT DEFAULT 'FR',
  logo_url      TEXT,
  plan          TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('freemium','starter','pro','agency')),
  stripe_customer_id       TEXT UNIQUE,
  stripe_subscription_id   TEXT UNIQUE,
  subscription_status      TEXT DEFAULT 'trialing',
  max_properties           INTEGER DEFAULT 1,
  settings      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: users
-- =============================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id     UUID REFERENCES agencies(id) ON DELETE CASCADE,
  supabase_uid  UUID UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  phone         TEXT,
  role          TEXT NOT NULL CHECK (role IN ('super_admin','agency_admin','operations_manager','commercial','provider','owner','traveler')),
  avatar_url    TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  preferences   JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: owners
-- =============================================
CREATE TABLE owners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  iban            TEXT,
  bic             TEXT,
  tax_id          TEXT,
  address         TEXT,
  city            TEXT,
  postal_code     TEXT,
  country         TEXT DEFAULT 'FR',
  commission_rate NUMERIC(5,2) DEFAULT 20.00,
  stripe_account_id TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: properties
-- =============================================
CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES owners(id),
  name            TEXT NOT NULL,
  slug            TEXT,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  postal_code     TEXT NOT NULL,
  country         TEXT DEFAULT 'FR',
  latitude        NUMERIC(10,7),
  longitude       NUMERIC(10,7),
  type            TEXT DEFAULT 'apartment' CHECK (type IN ('apartment','house','studio','villa','loft')),
  bedrooms        INTEGER DEFAULT 1,
  bathrooms       INTEGER DEFAULT 1,
  max_guests      INTEGER DEFAULT 2,
  base_price      NUMERIC(10,2),
  cleaning_fee    NUMERIC(10,2) DEFAULT 0,
  platform_ids    JSONB DEFAULT '{}',
  wifi_ssid       TEXT,
  wifi_password   TEXT,
  access_code     TEXT,
  checkin_time    TIME DEFAULT '15:00',
  checkout_time   TIME DEFAULT '11:00',
  checklist_ids   UUID[],
  photos          JSONB DEFAULT '[]',
  amenities       TEXT[],
  is_active       BOOLEAN DEFAULT TRUE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: bookings
-- =============================================
CREATE TABLE bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id         UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id       UUID NOT NULL REFERENCES properties(id),
  platform          TEXT DEFAULT 'airbnb' CHECK (platform IN ('airbnb','booking','direct','other')),
  platform_booking_id TEXT,
  traveler_first_name  TEXT NOT NULL,
  traveler_last_name   TEXT NOT NULL,
  traveler_email       TEXT,
  traveler_phone       TEXT,
  checkin_date      DATE NOT NULL,
  checkout_date     DATE NOT NULL,
  nights            INTEGER GENERATED ALWAYS AS (checkout_date - checkin_date) STORED,
  guests_count      INTEGER DEFAULT 1,
  total_amount      NUMERIC(10,2),
  platform_fee      NUMERIC(10,2) DEFAULT 0,
  agency_commission NUMERIC(10,2) DEFAULT 0,
  owner_payout      NUMERIC(10,2) DEFAULT 0,
  tourist_tax       NUMERIC(10,2) DEFAULT 0,
  status            TEXT DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled','no_show','completed')),
  cancellation_reason TEXT,
  special_requests  TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: tasks
-- =============================================
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  booking_id      UUID REFERENCES bookings(id),
  property_id     UUID NOT NULL REFERENCES properties(id),
  assigned_to     UUID REFERENCES users(id),
  type            TEXT NOT NULL CHECK (type IN ('cleaning','checkin','checkout','maintenance','inspection','other')),
  title           TEXT NOT NULL,
  description     TEXT,
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_min    INTEGER DEFAULT 60,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','assigned','in_progress','completed','cancelled','issue')),
  checklist       JSONB DEFAULT '[]',
  photos_before   TEXT[],
  photos_after    TEXT[],
  completed_at    TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: incidents
-- =============================================
CREATE TABLE incidents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id     UUID REFERENCES properties(id),
  booking_id      UUID REFERENCES bookings(id),
  reported_by     UUID REFERENCES users(id),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT DEFAULT 'other' CHECK (category IN ('damage','equipment','security','cleanliness','noise','other')),
  severity        TEXT DEFAULT 'normal' CHECK (severity IN ('urgent','important','normal')),
  status          TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  photos          TEXT[],
  resolution      TEXT,
  resolved_at     TIMESTAMPTZ,
  estimated_cost  NUMERIC(10,2),
  actual_cost     NUMERIC(10,2),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: messages
-- =============================================
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  booking_id      UUID REFERENCES bookings(id),
  channel         TEXT DEFAULT 'email' CHECK (channel IN ('email','sms','airbnb','whatsapp','direct')),
  direction       TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  from_address    TEXT,
  to_address      TEXT,
  subject         TEXT,
  body            TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: invoices
-- =============================================
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  owner_id        UUID REFERENCES owners(id),
  booking_id      UUID REFERENCES bookings(id),
  invoice_number  TEXT UNIQUE NOT NULL,
  type            TEXT DEFAULT 'owner_payout' CHECK (type IN ('owner_payout','agency_fee','subscription','deposit')),
  period_start    DATE,
  period_end      DATE,
  subtotal        NUMERIC(10,2) NOT NULL,
  tax_rate        NUMERIC(5,2) DEFAULT 20.00,
  tax_amount      NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','cancelled')),
  pdf_url         TEXT,
  stripe_invoice_id TEXT,
  due_date        DATE,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: payments
-- =============================================
CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id             UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  invoice_id            UUID REFERENCES invoices(id),
  stripe_payment_intent TEXT,
  stripe_charge_id      TEXT,
  amount                NUMERIC(10,2) NOT NULL,
  currency              TEXT DEFAULT 'eur',
  status                TEXT DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','refunded')),
  method                TEXT DEFAULT 'card' CHECK (method IN ('card','bank_transfer','stripe_connect','manual')),
  paid_at               TIMESTAMPTZ,
  refunded_at           TIMESTAMPTZ,
  refund_reason         TEXT,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEX POUR LES PERFORMANCES
-- =============================================
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, checkin_date, checkout_date);
CREATE INDEX idx_bookings_agency_status ON bookings(agency_id, status);
CREATE INDEX idx_tasks_assigned_scheduled ON tasks(assigned_to, scheduled_at);
CREATE INDEX idx_tasks_property_status ON tasks(property_id, status);
CREATE INDEX idx_incidents_agency_severity ON incidents(agency_id, severity, status);
CREATE INDEX idx_messages_booking ON messages(booking_id, created_at DESC);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_properties_agency ON properties(agency_id, is_active);
CREATE INDEX idx_owners_agency ON owners(agency_id);

-- =============================================
-- TRIGGERS updated_at automatique
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 1.3 Activation du Row Level Security (RLS)

Activez le RLS sur toutes les tables sensibles pour qu'un utilisateur d'une agence ne puisse jamais accéder aux données d'une autre agence :

```sql
-- Activation RLS
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politique RLS : les utilisateurs ne voient que les données de leur agence
CREATE POLICY "agency_isolation_users" ON users
  USING (agency_id = (SELECT agency_id FROM users WHERE supabase_uid = auth.uid()));

CREATE POLICY "agency_isolation_properties" ON properties
  USING (agency_id = (SELECT agency_id FROM users WHERE supabase_uid = auth.uid()));

CREATE POLICY "agency_isolation_bookings" ON bookings
  USING (agency_id = (SELECT agency_id FROM users WHERE supabase_uid = auth.uid()));

-- Super admin : accès total
CREATE POLICY "super_admin_all" ON agencies
  USING ((SELECT role FROM users WHERE supabase_uid = auth.uid()) = 'super_admin');
```

### 1.4 Configuration Supabase Auth

Dans **Supabase Dashboard > Authentication > Settings** :

- **JWT expiry** : `3600` secondes (1h)
- **Refresh token rotation** : activé
- **Email confirmations** : activé
- **Magic Link** : activé (pour les propriétaires et voyageurs)
- **Site URL** : `https://app.conciergeos.fr`
- **Redirect URLs autorisées** :
  ```
  https://app.conciergeos.fr/**
  https://owner.conciergeos.fr/**
  http://localhost:5173/**
  ```

### 1.5 Variables d'environnement Supabase à récupérer

Dans **Project Settings > API** :

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
SUPABASE_JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres
```

> ⚠️ **Note :** La `SERVICE_ROLE_KEY` donne un accès total à la base de données en contournant le RLS. Ne l'exposez **jamais** côté frontend. Elle est réservée au backend.

---

## Étape 2 — Déploiement Backend (Railway)

### 2.1 Création et configuration du projet Railway

```bash
# Connexion Railway CLI
railway login

# Dans le dossier backend du projet
cd packages/backend
railway init
# Sélectionner "Create new project" > Nommer: conciergeos-api
```

### 2.2 Import depuis GitHub

1. Sur [railway.app/new](https://railway.app/new), choisissez **Deploy from GitHub repo**
2. Autorisez l'accès à votre organisation GitHub
3. Sélectionnez le repo `conciergeos` et le dossier `packages/backend`
4. Railway détecte automatiquement Node.js et configure le build

### 2.3 Configuration des variables d'environnement Railway

Dans **Railway > Service > Variables**, ajoutez :

```bash
# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.conciergeos.fr
FRONTEND_URL=https://app.conciergeos.fr

# Base de données
DATABASE_URL=postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
SUPABASE_JWT_SECRET=your-jwt-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
STRIPE_CONNECT_CLIENT_ID=ca_xxxxxxxxxxxxx

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@conciergeos.fr

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33XXXXXXXXX

# Inngest
INNGEST_EVENT_KEY=xxxxxxxxxxxxx
INNGEST_SIGNING_KEY=signkey-prod-xxxxxxxxxxxxx

# Sentry
SENTRY_DSN=https://xxxxxxxxxxxxx@o0.ingest.sentry.io/0

# Session / JWT
JWT_SECRET=un-secret-tres-long-et-aleatoire-minimum-64-chars
SESSION_SECRET=un-autre-secret-session-tres-long
```

### 2.4 Healthcheck endpoint

Ajoutez cet endpoint dans votre serveur Express :

```typescript
// src/routes/health.ts
import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

export default router;
```

Dans Railway, configurez le healthcheck :
- **Health check path** : `/health`
- **Timeout** : 30 secondes

### 2.5 Domaine custom Railway

```bash
railway domain
# Railway génère: conciergeos-api.up.railway.app

# Pour un domaine custom, dans Railway > Settings > Domains
# Ajouter: api.conciergeos.fr
# Configurer le CNAME dans Cloudflare: api → conciergeos-api.up.railway.app
```

### 2.6 Fichier `package.json` scripts de build

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "start:dev": "tsx watch src/index.ts",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

## Étape 3 — Déploiement Frontend (Vercel)

### 3.1 Import du repo sur Vercel

```bash
# Via CLI dans le dossier frontend
cd packages/frontend
vercel

# Répondre aux questions :
# - Setup and deploy: Y
# - Project name: conciergeos-app
# - Framework: Vite
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist
```

### 3.2 Configuration build settings sur Vercel

Dans **Vercel > Project Settings > Build & Development Settings** :

| Paramètre | Valeur |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 20.x |

### 3.3 Variables d'environnement frontend (préfixe VITE_)

```bash
VITE_API_URL=https://api.conciergeos.fr
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
VITE_SENTRY_DSN=https://xxxxxxxxxxxxx@o0.ingest.sentry.io/0
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

> ⚠️ **Note :** Seules les variables préfixées `VITE_` sont exposées au navigateur. Ne mettez **jamais** de clés secrètes avec ce préfixe.

### 3.4 Configuration domaine custom Vercel

```bash
vercel domains add app.conciergeos.fr
# Vercel fournit un CNAME: cname.vercel-dns.com
# À configurer dans Cloudflare
```

### 3.5 Fichier `vercel.json` pour les routes SPA et rewrites API

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.conciergeos.fr/api/:path*"
    },
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## Étape 4 — Configuration Stripe

### 4.1 Activation Stripe Connect

1. Connectez-vous sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Allez dans **Connect > Settings**
3. Activez **Standard accounts** (pour les propriétaires)
4. Renseignez : nom de la plateforme, URL, logo, description

### 4.2 Webhooks Stripe

Dans **Developers > Webhooks > Add endpoint** :
- **Endpoint URL** : `https://api.conciergeos.fr/webhooks/stripe`
- **Listen to events** :

| Événement | Action dans ConciergeOS |
|---|---|
| `checkout.session.completed` | Activer abonnement agence |
| `customer.subscription.updated` | Mettre à jour le plan |
| `customer.subscription.deleted` | Désactiver l'agence |
| `invoice.payment_succeeded` | Marquer facture payée |
| `invoice.payment_failed` | Alerter l'admin |
| `payment_intent.succeeded` | Confirmer paiement |
| `account.updated` | Mettre à jour compte Connect |
| `transfer.created` | Enregistrer reversement propriétaire |

```bash
# Récupérer le webhook secret
stripe listen --forward-to localhost:3000/webhooks/stripe
# ⚙️ Webhook signing secret: whsec_xxxxxxxxxxxxx
```

### 4.3 Clés API à configurer

```bash
# Stripe Billing (abonnements SaaS)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx       # Backend uniquement
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx  # Frontend (VITE_)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx     # Backend uniquement

# Stripe Connect (reversements propriétaires)
STRIPE_CONNECT_CLIENT_ID=ca_xxxxxxxxxxxxx     # Backend
```

---

## Étape 5 — Configuration Resend (Emails)

### 5.1 Vérification du domaine DNS

1. Dans [Resend Dashboard > Domains](https://resend.com/domains), cliquez **Add Domain**
2. Entrez `conciergeos.fr`
3. Resend fournit des entrées DNS à ajouter dans Cloudflare :

```
Type: TXT
Name: resend._domainkey
Value: p=MIIBIjANBgkqhkiG9w0BAQEFAAOC...

Type: MX
Name: @
Value: feedback-smtp.eu-west-1.amazonses.com

Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
```

4. Attendez la propagation DNS (généralement < 30 min avec Cloudflare)
5. Cliquez **Verify** dans le dashboard Resend

### 5.2 Templates d'emails transactionnels

```typescript
// src/emails/templates/booking-confirmation.tsx
import { Html, Heading, Text, Button } from '@react-email/components';

export default function BookingConfirmation({ 
  travelerName, 
  propertyName, 
  checkinDate, 
  portalUrl 
}) {
  return (
    <Html>
      <Heading>Votre réservation est confirmée ✓</Heading>
      <Text>Bonjour {travelerName},</Text>
      <Text>Votre séjour à {propertyName} commence le {checkinDate}.</Text>
      <Button href={portalUrl}>Accéder à votre portail voyageur</Button>
    </Html>
  );
}
```

Emails à implémenter :
- `booking-confirmation` : confirmation réservation voyageur
- `checkin-instructions` : instructions J-1 avant arrivée
- `owner-monthly-report` : rapport mensuel propriétaire
- `task-assigned` : mission assignée au prestataire
- `incident-alert` : alerte incident critique
- `invoice-sent` : envoi facture propriétaire
- `magic-link` : lien de connexion sécurisé
- `subscription-renewal` : rappel renouvellement agence

---

## Étape 6 — Configuration Twilio (SMS)

### 6.1 Achat d'un numéro français

1. Dans [Twilio Console > Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Cliquez **Buy a number**
3. Filtrez par **Country: France**, **Capabilities: SMS**
4. Achetez le numéro (environ 1 $/mois)

### 6.2 Configuration webhook SMS entrant

```bash
# URL de webhook pour les SMS entrants
https://api.conciergeos.fr/webhooks/twilio/sms
```

Dans Twilio Console > Phone Number > **Messaging** :
- **A message comes in** : Webhook → `https://api.conciergeos.fr/webhooks/twilio/sms`
- **HTTP Method** : POST

### 6.3 Variables d'environnement Twilio

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+33XXXXXXXXX
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxx  # Optionnel, pour le routing intelligent
```

### 6.4 Cas d'usage SMS dans ConciergeOS

| Déclencheur | Destinataire | Contenu |
|---|---|---|
| Réservation J-1 | Voyageur | Code d'accès + instructions |
| Incident URGENT | Manager | Alerte avec lien direct |
| Mission assignée | Prestataire | Heure + adresse |
| Paiement reçu | Propriétaire | Montant reversé |

---

## Étape 7 — Configuration Cloudflare (DNS + CDN)

### 7.1 Pointage des nameservers

1. Créez un compte Cloudflare et ajoutez votre domaine `conciergeos.fr`
2. Cloudflare vous fournit 2 nameservers (ex: `ada.ns.cloudflare.com`)
3. Remplacez les NS chez votre registrar (OVH, Gandi, etc.) par ceux de Cloudflare
4. Propagation : 1-24 heures

### 7.2 Entrées DNS à configurer

| Type | Nom | Valeur | Proxy |
|---|---|---|---|
| A | `@` | IP Cloudflare (Pages) | ✅ Proxied |
| CNAME | `app` | `cname.vercel-dns.com` | ✅ Proxied |
| CNAME | `api` | `conciergeos-api.up.railway.app` | ✅ Proxied |
| CNAME | `owner` | `cname.vercel-dns.com` | ✅ Proxied |
| TXT | `@` | SPF Resend | ❌ DNS only |
| TXT | `resend._domainkey` | DKIM Resend | ❌ DNS only |
| MX | `@` | Resend feedback SMTP | ❌ DNS only |

### 7.3 SSL/TLS

Dans **Cloudflare > SSL/TLS > Overview** :
- **Encryption mode** : **Full (strict)**
- Activez **Always Use HTTPS**
- Activez **HSTS** (Strict Transport Security, max-age 6 mois)
- **Minimum TLS Version** : TLS 1.2

### 7.4 Page Rules de cache

```
# Rule 1 : Cache agressif pour les assets statiques
URL: app.conciergeos.fr/assets/*
Setting: Cache Level → Cache Everything
Edge TTL: 1 month

# Rule 2 : Bypass cache pour les routes API
URL: api.conciergeos.fr/*
Setting: Cache Level → Bypass

# Rule 3 : Cache pour les assets du portail voyageur
URL: portail.conciergeos.fr/assets/*
Setting: Cache Level → Cache Everything
```

---

## Étape 8 — Monitoring avec Sentry

### 8.1 Création du projet Sentry

1. Sur [sentry.io](https://sentry.io), créez une organisation `conciergeos`
2. Créez 2 projets : `conciergeos-frontend` (React) et `conciergeos-backend` (Node.js)
3. Récupérez les DSN de chaque projet

### 8.2 Configuration backend Express

```bash
npm install @sentry/node @sentry/profiling-node
```

```typescript
// src/instrument.ts — DOIT ÊTRE IMPORTÉ EN PREMIER
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.1,
  beforeSend(event) {
    // Ne pas envoyer les erreurs de dev
    if (process.env.NODE_ENV === 'development') return null;
    return event;
  },
});
```

### 8.3 Configuration frontend React

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: false }),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
});
```

### 8.4 Alertes Sentry à configurer

Dans **Sentry > Alerts > Create Alert Rule** :

| Alerte | Condition | Action |
|---|---|---|
| Erreur critique | `level:fatal` dans les 5 min | Email + Slack |
| Taux d'erreur élevé | >5% en 10 min | Email |
| Performance lente | P95 > 2s | Email |
| Nouvelle issue | Première occurrence | Email |

---

## 11. Variables d'environnement complètes

### Backend (Railway)

| Variable | Exemple | Où trouver |
|---|---|---|
| `NODE_ENV` | `production` | Manuel |
| `PORT` | `3000` | Manuel |
| `API_URL` | `https://api.conciergeos.fr` | Manuel |
| `FRONTEND_URL` | `https://app.conciergeos.fr` | Manuel |
| `DATABASE_URL` | `postgresql://postgres:***@db.xxx.supabase.co:5432/postgres` | Supabase > Settings > Database |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase > Settings > API |
| `SUPABASE_JWT_SECRET` | `your-jwt-secret` | Supabase > Settings > API |
| `JWT_SECRET` | `64-char-random-string` | `openssl rand -base64 48` |
| `SESSION_SECRET` | `64-char-random-string` | `openssl rand -base64 48` |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | Stripe > Developers > API Keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | Stripe > Webhooks > Signing secret |
| `STRIPE_CONNECT_CLIENT_ID` | `ca_xxx` | Stripe > Connect > Settings |
| `RESEND_API_KEY` | `re_xxx` | Resend > API Keys |
| `RESEND_FROM_EMAIL` | `noreply@conciergeos.fr` | Manuel |
| `TWILIO_ACCOUNT_SID` | `ACxxx` | Twilio > Console > Dashboard |
| `TWILIO_AUTH_TOKEN` | `xxx` | Twilio > Console > Dashboard |
| `TWILIO_PHONE_NUMBER` | `+33XXXXXXXXX` | Twilio > Phone Numbers |
| `INNGEST_EVENT_KEY` | `xxx` | Inngest > App > Keys |
| `INNGEST_SIGNING_KEY` | `signkey-prod-xxx` | Inngest > App > Keys |
| `SENTRY_DSN` | `https://xxx@o0.ingest.sentry.io/0` | Sentry > Project > DSN |

### Frontend (Vercel, préfixe VITE_)

| Variable | Exemple | Où trouver |
|---|---|---|
| `VITE_API_URL` | `https://api.conciergeos.fr` | Manuel |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase > API |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase > API |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` | Stripe > API Keys |
| `VITE_SENTRY_DSN` | `https://xxx@...` | Sentry > Project |
| `VITE_APP_ENV` | `production` | Manuel |

---

## 12. Vérification post-déploiement

Exécutez cette checklist après chaque déploiement en production :

- [ ] **1. Healthcheck backend** : `curl https://api.conciergeos.fr/health` retourne `{"status":"ok"}`
- [ ] **2. Frontend accessible** : `https://app.conciergeos.fr` charge la page de connexion
- [ ] **3. SSL valide** : Cadenas vert visible, certificat valide et non expiré
- [ ] **4. Connexion Supabase** : Un utilisateur de test peut se connecter via magic link
- [ ] **5. RLS activé** : Un utilisateur agence A ne voit pas les données de l'agence B
- [ ] **6. Stripe Webhook** : Déclencher un événement test dans Stripe Dashboard → vérifier les logs Railway
- [ ] **7. Envoi email** : Créer une réservation test → vérifier réception de l'email de confirmation
- [ ] **8. Envoi SMS** : Déclencher une notification SMS test → vérifier réception
- [ ] **9. Sentry** : Déclencher une erreur test → vérifier qu'elle apparaît dans Sentry
- [ ] **10. Inngest** : Vérifier les fonctions sont enregistrées dans le dashboard Inngest
- [ ] **11. CORS** : Vérifier que les requêtes de `app.conciergeos.fr` vers `api.conciergeos.fr` aboutissent
- [ ] **12. Upload fichiers** : Uploader une photo de bien → vérifier dans Supabase Storage
- [ ] **13. Performance** : Lighthouse score > 80 sur `https://app.conciergeos.fr`
- [ ] **14. Mobile** : Tester la PWA sur iOS et Android (installation sur écran d'accueil)
- [ ] **15. Backup DB** : Vérifier que Supabase Point-in-Time Recovery est activé

---

## 13. Mise à jour en production (CI/CD)

### Fichier `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  NODE_VERSION: '20'

jobs:
  test:
    name: Tests & Linting
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  
  deploy-backend:
    name: Deploy Backend to Railway
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy to Railway
        run: railway up --service conciergeos-api --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      
      - name: Wait for deployment
        run: sleep 30
      
      - name: Health check
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.conciergeos.fr/health)
          if [ "$STATUS" != "200" ]; then
            echo "❌ Health check failed: HTTP $STATUS"
            exit 1
          fi
          echo "✅ Backend healthy"
  
  deploy-frontend:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: |
          cd packages/frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }} \
            --scope ${{ secrets.VERCEL_TEAM_ID }} \
            --yes
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  
  notify:
    name: Notify Deployment
    runs-on: ubuntu-latest
    needs: [deploy-backend, deploy-frontend]
    if: always()
    steps:
      - name: Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "${{ needs.deploy-backend.result == 'success' && needs.deploy-frontend.result == 'success' && '✅' || '❌' }} Déploiement ConciergeOS ${{ github.sha }} — ${{ needs.deploy-backend.result == 'success' && needs.deploy-frontend.result == 'success' && 'SUCCÈS' || 'ÉCHEC' }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Secrets GitHub à configurer

Dans **GitHub > Repository > Settings > Secrets and variables > Actions** :

```
RAILWAY_TOKEN        → Railway > Account > Tokens
VERCEL_TOKEN         → Vercel > Account Settings > Tokens
VERCEL_ORG_ID        → .vercel/project.json après premier déploiement
VERCEL_PROJECT_ID    → .vercel/project.json après premier déploiement
TEST_DATABASE_URL    → URL Supabase de la base de test
SLACK_WEBHOOK_URL    → Slack > App > Incoming Webhooks
```

---

## 14. Procédure de rollback

### Rollback Railway (Backend)

```bash
# Lister les déploiements récents
railway deployments list

# Rollback vers un déploiement précédent
railway rollback --deployment-id DEPLOYMENT_ID

# Vérification
curl https://api.conciergeos.fr/health
```

### Rollback Vercel (Frontend)

```bash
# Via CLI — lister les déploiements
vercel ls

# Promouvoir un ancien déploiement
vercel promote https://conciergeos-app-git-xxxxx.vercel.app --scope=conciergeos
```

Via le dashboard Vercel : **Deployments > [ancien déploiement] > Promote to Production**

### Rollback base de données (Supabase Point-in-Time Recovery)

> ⚠️ **Attention :** La restauration PITR est destructive. Sauvegardez les données récentes avant.

1. Dans **Supabase > Database > Backups**
2. Sélectionnez **Point in Time Recovery**
3. Choisissez le timestamp cible (précision à la seconde)
4. Confirmez la restauration (l'opération prend ~10 minutes)
5. Après restauration, re-déployez le backend pour re-appliquer les migrations manquantes

### Procédure de rollback complète (incident majeur)

```bash
# 1. Activer la page de maintenance Cloudflare
# Cloudflare > Workers > conciergeos-maintenance > Route: *conciergeos.fr/*

# 2. Rollback backend
railway rollback --deployment-id PREVIOUS_DEPLOYMENT_ID

# 3. Rollback frontend
vercel promote PREVIOUS_VERCEL_URL

# 4. Vérifier la santé du système
curl https://api.conciergeos.fr/health

# 5. Désactiver la page de maintenance
# Cloudflare > Workers > supprimer la route

# 6. Notifier l'équipe et les clients
```

---

## 15. Estimation des coûts mensuels

### Tier gratuit (développement / MVP < 10 biens)

| Service | Plan | Coût mensuel |
|---|---|---|
| Supabase | Free (500 MB DB, 1 GB storage) | 0 € |
| Railway | Hobby (5 $ de crédit offert) | 0 € |
| Vercel | Free (100 GB bandwidth) | 0 € |
| Stripe | Pay-as-you-go | 0 € (+ 1,5 % par transaction) |
| Resend | Free (3 000 emails/mois) | 0 € |
| Twilio | Pay-as-you-go | ~5 € (100 SMS) |
| Cloudflare | Free | 0 € |
| Sentry | Free (5 000 events/mois) | 0 € |
| Inngest | Free (50 000 runs/mois) | 0 € |
| **TOTAL** | | **~5 €/mois** |

### Production (50-200 biens gérés)

| Service | Plan | Coût mensuel |
|---|---|---|
| Supabase | Pro (8 GB DB, 100 GB storage) | 25 € |
| Railway | Team (10 $ crédit inclus, ~0.5 $ CPU/h) | 40 € |
| Vercel | Pro (1 TB bandwidth, analytics) | 20 € |
| Stripe | Pay-as-you-go | 0 € fixe + 1,5 % commissions |
| Resend | Pro (50 000 emails/mois) | 20 € |
| Twilio | Pay-as-you-go | ~50 € (1 000 SMS) |
| Cloudflare | Pro (WAF, analytics avancées) | 22 € |
| Sentry | Team (50 000 events, alertes) | 26 € |
| Inngest | Pro (1M runs/mois) | 20 € |
| **TOTAL infra** | | **~223 €/mois** |

> ⚠️ **Note :** Les coûts Stripe varient selon le volume de transactions. Pour 100 biens à 14 €/mois (plan Pro), la commission Stripe (1,5 % + 0,25 €) représente environ 35 €/mois additionnels. À partir de 200 biens, négociez un tarif personnalisé avec Stripe.

### Seuil de rentabilité infrastructure

Pour une agence gérant 20 biens au plan Pro (14 €/bien/mois) :
- **Revenus SaaS** : 280 €/mois
- **Coût infra** : ~223 €/mois
- **Marge nette infra** : ~57 €/mois

Au-delà de 20 biens, chaque bien supplémentaire génère ~14 € de marge brute avec seulement ~1 € de coût infra marginal.

---

*ConciergeOS — Documentation v1.0 — Mai 2026*
