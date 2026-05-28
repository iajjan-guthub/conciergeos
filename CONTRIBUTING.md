# Contribuer à ConciergeOS

Bienvenue, et merci de rejoindre le projet ! Ce guide te permettra d'être opérationnel en moins de 30 minutes. Lis-le une fois de bout en bout avant de coder.

---

## 1. Bienvenue dans le projet

**ConciergeOS** est un SaaS de gestion de conciergerie Airbnb : synchronisation multi-OTA (Airbnb, Booking.com, VRBO), automatisation des communications voyageurs, gestion des équipes de ménage et suivi financier en temps réel.

Stack : **React + TypeScript** (frontend), **Express + TypeScript** (backend), **SQLite via Drizzle ORM** (dev), **Supabase/PostgreSQL** (prod), déploiement **Vercel** (frontend) + **Railway** (backend).

### Liens utiles

| Ressource | URL |
|---|---|
| Dépôt GitHub | `https://github.com/conciergeos/conciergeos` |
| Documentation | `https://docs.conciergeos.app` |
| Démo en ligne | `https://demo.conciergeos.app` |
| Slack équipe | `https://conciergeos.slack.com` |
| Figma designs | `https://figma.com/conciergeos` |
| ADRs (Architecture Decision Records) | `docs/adr/` |

---

## 2. Setup local complet

### 2.1 Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Node.js | 20.x LTS | `node --version` |
| npm | 10.x | `npm --version` |
| Git | 2.40+ | `git --version` |
| VS Code | dernière stable | — |

> **Windows** : utiliser WSL2. Les scripts npm supposent un shell POSIX.

### 2.2 Extensions VS Code recommandées

Installe-les une seule fois :

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension drizzle-team.drizzle-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension eamodio.gitlens
```

Le fichier `.vscode/settings.json` du repo configure automatiquement le format-on-save et l'intégration ESLint.

### 2.3 Clone et installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/conciergeos/conciergeos.git
cd conciergeos

# 2. Installer les dépendances (racine + packages)
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env.local
```

### 2.4 Variables d'environnement

Ouvre `.env.local` et configure au minimum les variables **obligatoires** :

```dotenv
# ─── OBLIGATOIRES (le serveur ne démarrera pas sans elles) ───────────────────

DATABASE_URL="file:./dev.db"              # SQLite local (ne pas modifier)
SESSION_SECRET="dev-secret-change-in-prod-min-32chars"  # Clé de session Express
NODE_ENV="development"

# ─── OPTIONNELLES (fonctionnalités dégradées si absentes) ────────────────────

# Paiements Stripe (page billing non fonctionnelle sans ça)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID_STARTER=""
STRIPE_PRICE_ID_PRO=""

# Emails transactionnels (Resend)
RESEND_API_KEY=""
EMAIL_FROM="noreply@conciergeos.app"

# Synchronisation Airbnb
AIRBNB_CLIENT_ID=""
AIRBNB_CLIENT_SECRET=""

# Synchronisation Booking.com
BOOKING_CLIENT_ID=""
BOOKING_CLIENT_SECRET=""

# Sentry (monitoring erreurs)
SENTRY_DSN=""

# URL publique du frontend (utile pour les redirections OAuth)
APP_URL="http://localhost:5000"
```

> Les credentials de **démo** sont pré-renseignés dans `.env.example`. Ne les commite jamais dans `.env.local`.

### 2.5 Initialiser la base de données

```bash
# Créer le schéma SQLite + données de seed
npm run db:push
npm run db:seed
```

### 2.6 Lancer le serveur de développement

```bash
npm run dev
```

Le serveur Express sert à la fois l'API (`/api/*`) et les assets Vite en mode dev.

- **Frontend** : http://localhost:5000
- **API** : http://localhost:5000/api
- **Drizzle Studio** : `npm run db:studio` → http://localhost:4983

### 2.7 Comptes de démo intégrés

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@demo.com` | `Demo1234!` |
| Manager | `manager@demo.com` | `Demo1234!` |
| Staff (ménage) | `staff@demo.com` | `Demo1234!` |

---

## 3. Structure du projet

```
conciergeos/
│
├── client/                          # Frontend React + Vite
│   ├── src/
│   │   ├── components/              # Composants réutilisables
│   │   │   ├── ui/                  # Composants de base (shadcn/ui)
│   │   │   └── [feature]/           # Composants métier groupés par domaine
│   │   ├── hooks/                   # Custom hooks React
│   │   ├── lib/                     # Utilitaires frontend (queryClient, utils.ts)
│   │   ├── pages/                   # Pages = routes (1 fichier = 1 route)
│   │   ├── App.tsx                  # Router wouter + layout global
│   │   └── main.tsx                 # Point d'entrée React
│   └── index.html
│
├── server/                          # Backend Express
│   ├── routes.ts                    # Toutes les routes API (point d'entrée)
│   ├── storage.ts                   # Couche d'accès données (abstraction BDD)
│   ├── auth.ts                      # Passport.js + sessions
│   ├── middleware/                  # Middlewares Express custom
│   └── index.ts                     # Bootstrap Express + Vite (dev)
│
├── shared/                          # Code partagé client/serveur
│   └── schema.ts                    # Schéma Drizzle + types Zod exportés
│
├── docs/                            # Documentation projet
│   ├── adr/                         # Architecture Decision Records
│   └── *.md                         # Guides opérationnels
│
├── migrations/                      # Fichiers de migration Drizzle
├── .env.example                     # Template variables d'environnement
├── .env.local                       # Variables locales (gitignored)
├── drizzle.config.ts                # Config Drizzle ORM
├── tsconfig.json                    # TypeScript strict
├── vite.config.ts                   # Config Vite
└── package.json
```

### Convention de nommage des fichiers

| Type | Convention | Exemple |
|---|---|---|
| Composant React | PascalCase | `BookingCard.tsx` |
| Page React | PascalCase | `Dashboard.tsx` |
| Hook custom | camelCase préfixé `use` | `useProperties.ts` |
| Utilitaire | camelCase | `formatCurrency.ts` |
| Route API | camelCase | `routes.ts` |
| Schema/type | camelCase | `schema.ts` |
| Test | même nom + `.test` | `BookingCard.test.tsx` |

---

## 4. Workflow Git

### 4.1 Branches

| Branche | Rôle | Merge target |
|---|---|---|
| `main` | Production — toujours stable | — |
| `develop` | Staging — intégration continue | `main` via PR |
| `feature/xxx` | Nouvelle fonctionnalité | `develop` |
| `fix/xxx` | Correction de bug | `develop` |
| `hotfix/xxx` | Correction urgente en prod | `main` + `develop` |
| `docs/xxx` | Documentation uniquement | `develop` |
| `refactor/xxx` | Refactorisation sans feature | `develop` |

**Nommage** : kebab-case, court et descriptif.

```bash
# Exemples valides
feature/calendar-sync
fix/stripe-webhook-timeout
docs/contributing-guide
hotfix/auth-session-expiry

# Exemples invalides
feature/new          # trop vague
Feature/CalendarSync # mauvaise casse
fix_bug_123          # underscores + vague
```

### 4.2 Conventional Commits

Format obligatoire : `<type>(<scope optionnel>): <description>`

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité visible utilisateur |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `refactor` | Refactorisation sans changement de comportement |
| `style` | Formatage, indentation (aucun changement logique) |
| `test` | Ajout ou modification de tests |
| `chore` | Maintenance, dépendances, scripts CI |
| `perf` | Amélioration de performance |

```bash
# Exemples valides
git commit -m "feat(calendar): add iCal export endpoint"
git commit -m "fix(auth): handle expired JWT gracefully"
git commit -m "chore: upgrade drizzle-orm to 0.30.0"
git commit -m "docs: add runbook section for Stripe incidents"

# Exemples invalides
git commit -m "WIP"
git commit -m "fix stuff"
git commit -m "Updated files"
```

### 4.3 Process Pull Request

```
1. Créer une branche depuis develop
   git checkout develop && git pull origin develop
   git checkout -b feature/ma-fonctionnalite

2. Développer et commiter au fur et à mesure
   git add -p   # staging interactif recommandé
   git commit -m "feat(scope): description"

3. Vérifier la compilation TypeScript
   npm run build

4. Vérifier le linting
   npm run lint

5. Pousser et ouvrir la PR
   git push origin feature/ma-fonctionnalite
   # Ouvrir PR vers `develop` sur GitHub

6. Description de PR obligatoire :
   - Ce que ça fait (1-3 lignes)
   - Comment tester
   - Screenshots si changement UI
   - Lien vers l'issue/ticket

7. Review : 1 approbation minimum requise

8. Merge : squash merge uniquement (GitHub UI)
   Le titre du squash commit = titre de la PR
```

### 4.4 Gitflow — Schéma ASCII

```
main        ──●────────────────────────────────────●──▶  production
               \                                  /
                \    hotfix/auth-fix             /
                 ●──────────────────────────────●
                                               /
develop     ──●───────●───────●───────●───────●──────▶  staging
               \     / \     / \     /
                \   /   \   /   \   /
feature/A  ──────●───●   |   |   |
                     |   |   |   |
feature/B  ──────────●───●   |   |
                         |   |   |
fix/C      ──────────────────●───●
```

---

## 5. Standards de code

### 5.1 TypeScript

- **Strict mode activé** dans `tsconfig.json` — `"strict": true`
- **Interdit** : `any`, `@ts-ignore`, `as unknown as X` sans commentaire explicatif
- **Obligatoire** : typer explicitement les paramètres de fonctions et les retours des fonctions publiques

```typescript
// ✅ Correct
async function getProperty(id: number): Promise<Property | undefined> {
  return db.select().from(properties).where(eq(properties.id, id)).get();
}

// ❌ Interdit
async function getProperty(id: any) {
  return db.select().from(properties).where(eq(properties.id, id)).get();
}
```

### 5.2 Gestion d'erreurs async

Toutes les fonctions async **doivent** gérer les erreurs. Pattern à utiliser dans les routes Express :

```typescript
// ✅ Correct — wrapper try/catch
router.get("/properties/:id", async (req, res) => {
  try {
    const property = await storage.getProperty(Number(req.params.id));
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (error) {
    console.error("[GET /properties/:id]", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ❌ Interdit — pas de gestion d'erreur
router.get("/properties/:id", async (req, res) => {
  const property = await storage.getProperty(Number(req.params.id));
  res.json(property);
});
```

### 5.3 Validation avec Zod

**Obligatoire** pour toutes les entrées API (body, params, query) :

```typescript
import { z } from "zod";

const createBookingSchema = z.object({
  propertyId: z.number().int().positive(),
  guestName: z.string().min(2).max(100),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  totalAmount: z.number().positive().optional(),
});

router.post("/bookings", async (req, res) => {
  const result = createBookingSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  // result.data est typé et validé
  const booking = await storage.createBooking(result.data);
  res.status(201).json(booking);
});
```

### 5.4 Tailwind CSS

- **Utility-first** : composer les classes directement dans le JSX
- **Interdit** : CSS inline (`style={...}`), `!important`, fichiers `.css` custom sauf `globals.css`
- **Recommandé** : utiliser `cn()` (lib/utils.ts) pour les classes conditionnelles

```tsx
// ✅ Correct
<button className={cn(
  "px-4 py-2 rounded-md font-medium transition-colors",
  isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
)}>
  Valider
</button>

// ❌ Interdit
<button style={{ backgroundColor: "blue", padding: "8px 16px" }}>
  Valider
</button>
```

### 5.5 Composants React

- **Functional components uniquement** — pas de class components
- **Hooks custom** dans `client/src/hooks/` — un fichier par hook
- **Props** : toujours typer avec une interface ou un type nommé

```tsx
// ✅ Correct
interface BookingCardProps {
  booking: Booking;
  onEdit?: (id: number) => void;
  className?: string;
}

export function BookingCard({ booking, onEdit, className }: BookingCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      {/* ... */}
    </div>
  );
}
```

### 5.6 Convention de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composant React | PascalCase | `PropertyCard` |
| Fonction/variable | camelCase | `fetchBookings`, `isLoading` |
| Constante globale | SCREAMING_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Type/Interface | PascalCase | `BookingStatus`, `ApiResponse<T>` |
| Enum | PascalCase + valeurs SCREAMING_SNAKE_CASE | `BookingStatus.CHECK_IN` |
| Fichier composant | PascalCase | `BookingCard.tsx` |
| Fichier hook | camelCase | `useBookings.ts` |

### 5.7 Ordre des imports

```typescript
// 1. Libraries Node.js/npm (ordre alphabétique)
import { eq } from "drizzle-orm";
import { z } from "zod";

// 2. Modules internes — shared (ordre alphabétique)
import { bookings, properties } from "@shared/schema";

// 3. Modules internes — relatifs (ordre alphabétique)
import { storage } from "./storage";
import { requireAuth } from "./middleware/auth";
```

---

## 6. Base de données

### 6.1 Ajouter une nouvelle table

Suis ces étapes **dans l'ordre** :

```bash
# Étape 1 — Définir le schéma dans shared/schema.ts
# Ajouter la table avec Drizzle schema builder

# Étape 2 — Pousser le schéma vers SQLite
npm run db:push

# Étape 3 — Ajouter les méthodes CRUD dans server/storage.ts

# Étape 4 — Créer les routes API dans server/routes.ts

# Étape 5 — Consommer depuis le frontend (React Query)
```

**Exemple complet — ajout d'une table `reviews`** :

```typescript
// shared/schema.ts
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  rating: integer("rating").notNull(),          // 1-5
  comment: text("comment"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
```

```typescript
// server/storage.ts
async getReviewsByBooking(bookingId: number): Promise<Review[]> {
  return db.select().from(reviews).where(eq(reviews.bookingId, bookingId)).all();
}

async createReview(data: InsertReview): Promise<Review> {
  return db.insert(reviews).values(data).returning().get();
}
```

### 6.2 Règles Drizzle (SQLite)

```typescript
// ✅ .get() pour un seul résultat
const property = db.select().from(properties).where(eq(properties.id, id)).get();

// ✅ .all() pour une liste
const allProperties = db.select().from(properties).all();

// ✅ Transactions pour les opérations multi-tables
db.transaction((tx) => {
  tx.insert(bookings).values(bookingData).run();
  tx.insert(auditLogs).values(logData).run();
});

// ❌ SQL raw — seulement si Drizzle ne supporte pas la requête,
//    avec un commentaire expliquant pourquoi
// const result = db.run(sql`...`); // Drizzle ne supporte pas X ici
```

### 6.3 Seed data

```bash
# Ajouter des données de test
# 1. Éditer server/seed.ts
# 2. Lancer le seed
npm run db:seed

# Reset complet (supprime + recrée la BDD)
npm run db:reset
```

---

## 7. Ajouter une nouvelle page/route

### 7.1 Étapes frontend

```bash
# 1. Créer le composant de page
touch client/src/pages/MaNouvellePage.tsx
```

```tsx
// client/src/pages/MaNouvellePage.tsx
export default function MaNouvellePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ma Nouvelle Page</h1>
      {/* Contenu */}
    </div>
  );
}
```

```tsx
// 2. Enregistrer la route dans client/src/App.tsx
import MaNouvellePage from "@/pages/MaNouvellePage";

// Dans le composant Router :
<Route path="/ma-nouvelle-page" component={MaNouvellePage} />
```

```tsx
// 3. Ajouter l'entrée dans la sidebar (client/src/components/Sidebar.tsx)
{
  href: "/ma-nouvelle-page",
  label: "Ma Nouvelle Page",
  icon: IconName,
}
```

### 7.2 Étapes backend (si nouvelle route API nécessaire)

```typescript
// server/routes.ts — ajouter dans la fonction registerRoutes()

// GET — liste
app.get("/api/ma-ressource", requireAuth, async (req, res) => {
  try {
    const items = await storage.getMaRessource();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST — création
app.post("/api/ma-ressource", requireAuth, async (req, res) => {
  try {
    const result = insertMaRessourceSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error.flatten() });
    const item = await storage.createMaRessource(result.data);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
```

```typescript
// 4. Ajouter les méthodes dans server/storage.ts
async getMaRessource(): Promise<MaRessource[]> {
  return db.select().from(maRessource).all();
}
```

---

## 8. Tests

### 8.1 État actuel

Le projet dispose d'une **validation TypeScript stricte** comme filet de sécurité principal :

```bash
# Vérification TypeScript + build de production
npm run build

# Linting ESLint
npm run lint

# Vérification du type uniquement (plus rapide)
npm run typecheck
```

**Ces trois commandes doivent passer sans erreur avant chaque PR.**

### 8.2 Roadmap tests

| Phase | Outil | Scope | ETA |
|---|---|---|---|
| Phase 1 | **Vitest** | Tests unitaires (utils, hooks, schema) | Q3 2026 |
| Phase 2 | **Vitest + Testing Library** | Composants React | Q3 2026 |
| Phase 3 | **Playwright** | Tests E2E (flux critiques) | Q4 2026 |

### 8.3 Conventions à venir (Vitest)

```typescript
// Fichier : hooks/useBookings.test.ts
import { describe, it, expect, beforeEach } from "vitest";

describe("useBookings", () => {
  it("retourne une liste vide si aucune réservation", () => {
    // ...
  });

  it("filtre les réservations par propriété", () => {
    // ...
  });
});
```

Quand les tests seront en place, **aucune PR ne sera mergée si les tests échouent**.

---

## 9. Déploiement

### 9.1 Règle absolue

> **Ne jamais pousser directement sur `main`.** Toujours passer par une PR vers `develop`, puis une PR `develop → main`.

### 9.2 CI/CD automatique

| Événement | Action CI |
|---|---|
| Push sur n'importe quelle branche | Build TypeScript + Lint |
| Ouverture d'une PR | Build + preview deployment Vercel |
| Merge sur `develop` | Deploy sur staging (Railway staging + Vercel preview) |
| Merge sur `main` | Deploy sur production (Railway prod + Vercel prod) |

### 9.3 Variables d'environnement

```bash
# ❌ JAMAIS ça
DATABASE_URL="postgres://..." # dans le code ou un fichier commité

# ✅ En production
# Configurer via les dashboards :
# - Vercel : Project Settings → Environment Variables
# - Railway : Service → Variables
# - GitHub Actions : Settings → Secrets and Variables
```

### 9.4 Preview deployments

Chaque PR génère automatiquement une URL de preview Vercel :
```
https://conciergeos-git-feature-mon-nom-pr.vercel.app
```

Inclure le lien de preview dans la description de la PR pour faciliter la review.

---

## 10. Sécurité

### 10.1 Règles de base

- **Jamais de secret dans le code** — utiliser les variables d'environnement
- **Jamais de secret dans les logs** — masquer avant de logger
- **Jamais de `.env.local` ou `.env.production` commité** — ils sont dans `.gitignore`

### 10.2 Validation serveur

Zod est la seule source de vérité pour les données entrantes. Même si le frontend valide, **le backend doit toujours re-valider** :

```typescript
// ✅ Double validation — frontend ET backend
// Ne jamais faire confiance aux données du client
const result = createBookingSchema.safeParse(req.body);
if (!result.success) return res.status(400).json({ error: result.error });
```

### 10.3 RLS PostgreSQL (production)

En production (Supabase/PostgreSQL), les politiques Row Level Security sont obligatoires sur toutes les tables contenant des données utilisateur :

```sql
-- Exemple : un utilisateur ne voit que ses propres propriétés
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_properties" ON properties
  FOR ALL USING (user_id = auth.uid());
```

### 10.4 Signalement de vulnérabilités

Ne pas ouvrir une issue publique GitHub. Suivre la procédure dans `SECURITY.md` :
- Email : `security@conciergeos.app`
- Délai de réponse : 48h maximum
- Pas de divulgation publique avant patch

---

## 11. Questions fréquentes

**Q : Pourquoi `wouter` et pas React Router ?**
Voir `docs/adr/ADR-002-routing.md`. En résumé : wouter est 10× plus léger (2kb vs 50kb), son API est quasi identique à React Router pour notre usage. Si tu as besoin de fonctionnalités avancées manquantes, ouvre une discussion.

**Q : Pourquoi SQLite en dev et pas PostgreSQL directement ?**
Voir `docs/adr/ADR-003-database.md`. SQLite en dev = zéro configuration, démarrage instantané, pas de Docker requis. Drizzle ORM abstrait les différences ; le schéma est compatible avec Supabase/PostgreSQL en prod.

**Q : Comment ajouter un nouvel OTA (Booking.com, VRBO, etc.) ?**
Voir `docs/guide-integration-ota.md`. Il faut : créer un adapter dans `server/ota/`, implémenter l'interface `OtaAdapter`, enregistrer dans `server/ota/index.ts`.

**Q : Où sont les credentials de démo ?**
Dans `.env.example`. Copie ce fichier en `.env.local` lors du setup (étape 2.3).

**Q : Comment accéder à Drizzle Studio pour inspecter la BDD ?**
```bash
npm run db:studio
# Ouvre http://localhost:4983
```

**Q : La migration a planté, comment réinitialiser ?**
```bash
npm run db:reset   # Supprime dev.db et recrée depuis le schéma + seed
```

**Q : ESLint me bloque à cause d'une règle avec laquelle je ne suis pas d'accord ?**
Ouvre une discussion dans `#dev` sur Slack avant de désactiver la règle. Si consensus, modifier `.eslintrc.json` en PR dédiée.

---

*ConciergeOS — CONTRIBUTING.md — Mai 2026*
*Pour toute question non couverte : `#dev` sur Slack ou ouvrir une Discussion GitHub.*
