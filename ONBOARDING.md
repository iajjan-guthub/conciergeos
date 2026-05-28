# Bienvenue dans ConciergeOS 🎉

> **Premier fichier à lire.** Ce guide est conçu pour te donner une vision complète du projet en 30 minutes et te permettre de faire ta première contribution dans la journée.

---

## Bienvenue

### Le projet

ConciergeOS est une plateforme SaaS de gestion de conciergerie Airbnb, pensée pour les agences de conciergerie professionnelles qui gèrent des dizaines, voire des centaines, de logements pour le compte de propriétaires. En un seul outil, une agence peut piloter les réservations, coordonner les prestataires (ménagères, plombiers, techniciens), communiquer avec les voyageurs, et produire les relevés financiers mensuels pour chaque propriétaire.

Avant ConciergeOS, les agences jonglaient entre des tableurs Excel, WhatsApp pour les prestataires, des PDF envoyés par email aux propriétaires, et des plateformes de réservation disparates. Notre mission est de centraliser tout ça dans une interface moderne, fiable et extensible — sans sacrifier la simplicité.

Le projet est au stade **MVP v1.0** : toutes les fonctionnalités core sont en place et des données de démonstration françaises permettent de voir le produit en action immédiatement. La prochaine étape est la migration vers PostgreSQL/Supabase pour la production, l'intégration Stripe Connect et la synchronisation iCal avec les plateformes (Airbnb, Booking.com, VRBO).

### L'équipe

| Rôle | Responsabilité |
|------|---------------|
| **Lead développeur** | Architecture, revues de code, décisions techniques |
| **Développeur fullstack** | Fonctionnalités, API, base de données |
| **Développeur front** | Composants React, design system, expérience utilisateur |
| **Designer UX** | Maquettes, user flows, cohérence du design system |
| **Product manager** | Roadmap, priorités, coordination avec les clients |

*(Contacte le lead dev en premier pour toute question technique ou d'accès.)*

### Nos valeurs tech

- **Simplicité avant tout.** Si une feature peut être résolue sans ajouter une nouvelle dépendance, c'est le bon chemin. Chaque librairie ajoutée est une dette à long terme.
- **Code lisible.** Le code est lu bien plus souvent qu'il n'est écrit. Nomme tes variables, commente les décisions non évidentes, garde des fonctions courtes.
- **User-first.** Quand tu doutes d'un comportement, demande-toi ce qu'un gérant d'agence fatigué attendrait à 22h un vendredi. L'UX prime sur la pureté technique.

---

## Comprendre le produit (15 min)

### Les 7 types d'utilisateurs

| Profil | Qui est-ce ? | Ce qu'il fait dans ConciergeOS |
|--------|-------------|-------------------------------|
| **Admin agence** | Dirigeant ou responsable ops de l'agence | Configure le compte, gère les accès, consulte les analytics globaux |
| **Gestionnaire** | Chargé de compte, gère un portefeuille de biens | Supervise réservations, tâches, incidents pour ses propriétés |
| **Prestataire** | Ménagère, plombier, technicien | Reçoit des missions, valide les interventions via l'app PWA |
| **Propriétaire** | Bailleur qui confie son bien à l'agence | Consulte son dashboard revenus, télécharge ses documents, soumet des tickets |
| **Voyageur** | Locataire en séjour | Accède au guide d'arrivée, au code d'accès, au chat, peut signaler un problème |
| **Comptable** | Interne ou externe à l'agence | Exporte les factures, consulte les reversements propriétaires |
| **Super admin** | Équipe ConciergeOS | Accès plateforme multi-tenant pour support et maintenance |

### Les 6 modules métier

```
┌─────────────────────────────────────────────────────────┐
│                    ConciergeOS                          │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Proprié- │  │Réserva-  │  │ Planning │              │
│  │  tés     │  │  tions   │  │& Tâches  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Incidents │  │Messagerie│  │Finances  │              │
│  │& Tickets │  │ unifiée  │  │& Reports │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

1. **Propriétés** — Référentiel central : adresse, photos, capacité, équipements, règles de la maison, contacts d'urgence. Chaque bien est rattaché à un propriétaire.

2. **Réservations** — Cycle de vie complet d'un séjour : création manuelle ou import, check-in / check-out, statut, notes internes, historique. Chaque réservation déclenche des tâches automatiques.

3. **Planning & Tâches** — Vue calendrier multi-propriétés. Les tâches (ménage, état des lieux, maintenance) sont assignées aux prestataires avec deadline. Suivi en temps réel via l'app PWA.

4. **Incidents & Tickets** — Voyageurs et propriétaires peuvent signaler des problèmes. Chaque ticket est qualifié (priorité, catégorie), assigné, résolu et archivé. SLA configurable par agence.

5. **Messagerie unifiée** — Boîte de réception centralisée : messages voyageurs, notifications propriétaires, alertes internes. Réponses depuis l'interface sans quitter l'app.

6. **Finances & Reports** — Suivi des revenus par propriété, calcul des reversements propriétaires (après commission agence), génération de factures PDF, export comptable.

### Le parcours d'une réservation de bout en bout

**1. Création de la réservation**
Un voyageur réserve sur Airbnb (ou la réservation est saisie manuellement par le gestionnaire). La réservation apparaît dans le module avec le statut `CONFIRMED`. Elle est rattachée à la propriété, au voyageur (profil créé ou mis à jour) et à la période de séjour.

**2. Déclenchement automatique des tâches**
Dès confirmation, le système génère les tâches récurrentes : ménage d'arrivée (J-0 au check-in), état des lieux entrée, kit d'accueil. Ces tâches sont visibles dans le Planning et notifient les prestataires concernés.

**3. Communication pré-arrivée**
48h avant le check-in, un message automatique est envoyé au voyageur avec le guide d'arrivée : adresse précise, code de la boîte à clés ou de la serrure connectée, Wi-Fi, règles de la maison.

**4. Le séjour**
Le voyageur accède au portail voyageur (lien unique par réservation) : guide complet, chat avec l'agence, formulaire de signalement d'incident. Les gestionnaires voient les messages entrants en temps réel.

**5. Check-out et clôture**
Ménage de départ déclenché automatiquement. Le prestataire valide via l'app PWA (photos, checklist). La réservation passe en `COMPLETED`.

**6. Facturation propriétaire**
En fin de mois, le module Finance calcule automatiquement : revenus bruts de la période, commission agence (% configurable par contrat), charges refacturées (si applicable). Un relevé PDF est généré et disponible dans le portail propriétaire.

### Les 3 portails

| Portail | Accès | Fonctions clés |
|---------|-------|----------------|
| **Back-office agence** | `/` (auth requise) | Dashboard global, toutes les vues métier, paramètres, analytics |
| **Portail propriétaire** | `/owner` (token unique par email) | Dashboard revenus, calendrier occupé, documents, tickets, profil |
| **Portail voyageur** | `/guest/:token` (lien unique par réservation) | Guide d'arrivée, code accès, chat, signalement incident, mobile-first |

> **Note :** L'app prestataire est une PWA accessible via le même domaine, routée sur `/contractor`. Elle est optimisée pour mobile (offline-capable via service worker).

---

## L'infrastructure en une image

```
                        ConciergeOS — Architecture de déploiement
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   Utilisateur                                                      │
│   (Browser / PWA)                                                  │
│        │                                                           │
│        ▼                                                           │
│   ┌──────────┐      DDoS protection, WAF, CDN global              │
│   │Cloudflare│      Terminaison TLS, cache assets statiques        │
│   └────┬─────┘                                                     │
│        │                                                           │
│        ▼                                                           │
│   ┌──────────┐      Héberge le front React (Vite build)           │
│   │  Vercel  │      + l'API Express via Serverless Functions        │
│   │  (prod)  │      Déploiement automatique sur push `main`        │
│   └────┬─────┘                                                     │
│        │  API calls /api/*                                         │
│        ▼                                                           │
│   ┌──────────┐      Serveur Express.js                            │
│   │ Express  │      Authentification JWT, validation Zod           │
│   │   API    │      RBAC, business logic, ORM Drizzle              │
│   └────┬─────┘                                                     │
│        │                                                           │
│   ┌────┴────────────────────┐                                      │
│   │                         │                                      │
│   ▼                         ▼                                      │
│ ┌───────────┐         ┌──────────────┐                             │
│ │  SQLite   │         │  Supabase    │                             │
│ │  (dev /   │         │ PostgreSQL   │                             │
│ │   test)   │         │   (prod)     │                             │
│ └───────────┘         └──────┬───────┘                             │
│  Fichier local               │ RLS activé, backups auto            │
│  better-sqlite3              │ Storage pour fichiers/photos        │
│                              │                                     │
│        ┌─────────────────────┤                                     │
│        │  Services tiers     │                                     │
│        ▼                     ▼                                     │
│   ┌─────────┐         ┌──────────┐                                 │
│   │  Stripe │         │  Resend  │                                 │
│   │ Connect │         │  (email) │                                 │
│   └─────────┘         └──────────┘                                 │
│        ▼                                                           │
│   ┌─────────┐                                                      │
│   │  Sentry │   Monitoring erreurs (front + back)                  │
│   └─────────┘   Railway pour workers / jobs (à venir)             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Quel service fait quoi

| Service | Rôle | Environnement |
|---------|------|---------------|
| **Vercel** | Hosting front (React/Vite) + API serverless | Prod + preview (chaque PR) |
| **Railway** | Workers background, jobs CRON (migrations, rapports) | Prod |
| **Supabase** | PostgreSQL managé, Storage (photos), Auth helpers | Prod |
| **SQLite / better-sqlite3** | Base de données locale légère | Dev + test |
| **Stripe** | Paiements SaaS + Stripe Connect pour reversements | Prod (test mode en dev) |
| **Resend** | Envoi d'emails transactionnels | Prod (sandbox en dev) |
| **Sentry** | Capture d'erreurs, alertes, performance monitoring | Prod + staging |
| **Cloudflare** | CDN, protection DDoS, DNS, WAF | Prod |

### Où trouver les logs

- **Logs API (prod)** → Dashboard Vercel › Functions › Logs
- **Logs Railway** → Dashboard Railway › Service › Logs
- **Erreurs JS (front + back)** → Dashboard Sentry › Project `conciergeos`
- **Logs base de données** → Dashboard Supabase › Database › Logs
- **En local** → Console du terminal qui exécute `npm run dev`

---

## Accès et credentials (à demander au lead)

Demande les accès suivants au lead dev lors de ton onboarding :

| Service | Accès à demander | Usage |
|---------|-----------------|-------|
| **GitHub** | Invitation au repo `conciergeos/conciergeos` | Code source, PRs, issues |
| **Vercel** | Invitation à l'organisation Vercel | Déploiements, preview, logs prod |
| **Railway** | Invitation au projet Railway | Workers, jobs, logs |
| **Supabase** | Accès au projet (rôle `developer`) | Base de données prod (lecture/écriture staging) |
| **Stripe** | Accès au dashboard (test mode uniquement) | Tester les paiements, webhook |
| **Resend** | Accès à l'équipe Resend | Voir les emails envoyés, sandbox |
| **Sentry** | Invitation à l'organisation Sentry | Monitoring erreurs |
| **Linear / Notion** | Accès à l'espace de travail | Tickets, roadmap, documentation |

### Règle absolue — secrets et credentials

> ⚠️ **Ne jamais partager, commiter ou loguer des credentials de production.**
>
> - Toujours utiliser les **comptes de test** (Stripe test mode, Resend sandbox, Supabase staging).
> - Les variables d'environnement ne vont **jamais** dans le code ou dans un message Slack/Discord.
> - En cas de doute sur un secret exposé : rotation immédiate + prévenir le lead.

### Où trouver le fichier .env

Le fichier `.env.example` est à la racine du repo. Il contient toutes les variables nécessaires avec des valeurs d'exemple. Copie-le en `.env.local` pour le développement local (`.env.local` est dans le `.gitignore`).

---

## Setup en 10 minutes

```bash
# 1. Cloner le repo
git clone https://github.com/conciergeos/conciergeos.git
cd conciergeos

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env.local

# 4. Configurer .env.local
# Seule DATABASE_URL est OBLIGATOIRE en local.
# SQLite est créé automatiquement au premier démarrage.
# Pour SQLite local, la valeur par défaut dans .env.example suffit :
#   DATABASE_URL=file:./dev.db
# Pour les autres services (Stripe, Resend...), les valeurs de test
# du .env.example sont fonctionnelles pour le dev.

# 5. Initialiser la base de données avec les données de démo
npm run db:push      # Crée les tables via Drizzle
npm run db:seed      # Insère les données de démo françaises

# 6. Lancer le serveur de développement
npm run dev
# → Front React : http://localhost:5173
# → API Express : http://localhost:5000
# → (Vite proxy /api/* vers :5000 automatiquement)

# 7. Se connecter (comptes de démo disponibles)
# Email : admin@conciergeos.demo  /  Mot de passe : demo1234
# Email : owner@conciergeos.demo  /  Mot de passe : demo1234
# Email : guest@conciergeos.demo  /  Mot de passe : demo1234
```

### Vérifier que tout fonctionne

```bash
# Vérifier TypeScript (aucune erreur attendue)
npm run typecheck

# Vérifier le build de production
npm run build
# → dist/ doit être créé sans erreur

# Lancer les tests
npm run test
```

---

## Ton premier bug fix (walkthrough complet)

### 1. Trouver une issue

Rends-toi sur GitHub › Issues › filtre `good first issue`. Ces issues sont sélectionnées par le lead pour être accessibles sans connaissance approfondie du codebase. Lis la description complète et les éventuels commentaires.

### 2. S'assigner et créer une branche

```bash
# S'assigner l'issue sur GitHub (bouton "Assignees" en sidebar)

# Créer une branche depuis main à jour
git checkout main
git pull origin main
git checkout -b fix/nom-court-du-bug
# Convention : fix/ pour les bugs, feat/ pour les features, chore/ pour le maintenance
```

### 3. Reproduire le bug localement

Avant de toucher au code, reproduis le bug exactement comme décrit dans l'issue. Si tu n'y arrives pas, commente l'issue pour demander plus de précisions. Ne fixe jamais un bug que tu n'as pas pu reproduire.

### 4. Localiser le code

```
conciergeos/
├── client/                  # Front React
│   ├── src/
│   │   ├── components/      # Composants réutilisables (shadcn/ui + custom)
│   │   ├── pages/           # Une page = une route Wouter
│   │   ├── hooks/           # Custom hooks (data fetching, state)
│   │   └── lib/             # Utilitaires, helpers, config
├── server/                  # API Express
│   ├── routes.ts            # Tous les endpoints REST (/api/*)
│   ├── storage.ts           # Couche d'accès aux données (Drizzle ORM)
│   └── auth.ts              # Middleware JWT, RBAC
├── shared/
│   └── schema.ts            # Schéma Drizzle + types TypeScript partagés
├── drizzle/                 # Migrations générées
└── package.json
```

**Conseil :** utilise la recherche globale de ton éditeur. Si le bug concerne un composant visible, cherche le texte affiché. Si c'est une erreur API, cherche l'endpoint dans `server/routes.ts`.

### 5. Corriger et tester

- Effectue la correction la plus minimaliste possible
- Vérifie manuellement dans le navigateur
- Lance `npm run typecheck` pour valider TypeScript
- Lance `npm run build` pour s'assurer que le build de prod passe

### 6. Commiter

```bash
git add .
git commit -m "fix: description courte du bug en français ou anglais"
# Convention commits : Conventional Commits
# fix: correction de bug
# feat: nouvelle fonctionnalité
# chore: maintenance, dépendances
# docs: documentation
# refactor: refactoring sans changement de comportement
```

### 7. Push et ouvrir une PR

```bash
git push origin fix/nom-court-du-bug
```

Sur GitHub, ouvre une Pull Request vers `main`. Remplis le template de PR :
- **What** : ce que tu as changé
- **Why** : pourquoi ce changement résout le bug
- **How to test** : étapes pour vérifier la correction
- **Screenshots** (si changement UI)

Lie la PR à l'issue avec `Closes #123` dans la description.

### 8. Attendre la review

Le lead dev reviewe en général sous 24-48h. Sois réactif aux commentaires. Une fois approuvée, la PR est mergée par le lead (pas de merge auto sans approbation).

---

## Ton premier feature (walkthrough complet)

### Exemple : ajouter un champ "notes internes" sur une réservation

Ce walkthrough illustre le flux typique d'une feature fullstack dans ConciergeOS.

---

#### Étape 1 — Modifier `shared/schema.ts` (ajouter la colonne)

```typescript
// shared/schema.ts
export const reservations = sqliteTable('reservations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // ... colonnes existantes ...
  internalNotes: text('internal_notes'),  // ← Ajouter cette ligne
});

// Mettre à jour le type TypeScript exporté si nécessaire
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;
```

Puis régénère la migration :

```bash
npm run db:generate   # Génère le fichier de migration dans drizzle/
npm run db:push       # Applique la migration sur la base locale
```

---

#### Étape 2 — Modifier `server/storage.ts` (CRUD)

```typescript
// server/storage.ts
async updateReservation(id: number, data: Partial<InsertReservation>): Promise<Reservation> {
  const [updated] = await db
    .update(reservations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(reservations.id, id))
    .returning();
  return updated;
}
// La méthode existante supporte déjà les champs partiels via Partial<>
// Vérifier que internalNotes est bien inclus dans les méthodes getReservation et listReservations
```

---

#### Étape 3 — Modifier `server/routes.ts` (exposer via API)

```typescript
// server/routes.ts — route PATCH /api/reservations/:id
app.patch('/api/reservations/:id', requireAuth, async (req, res) => {
  const schema = z.object({
    internalNotes: z.string().max(2000).optional(),
    // ... autres champs modifiables ...
  });

  const body = schema.parse(req.body);
  const updated = await storage.updateReservation(Number(req.params.id), body);
  res.json(updated);
});
```

---

#### Étape 4 — Modifier le composant React

```tsx
// client/src/pages/ReservationDetail.tsx (ou composant approprié)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';

// Dans le composant :
const [notes, setNotes] = useState(reservation.internalNotes ?? '');
const queryClient = useQueryClient();

const updateMutation = useMutation({
  mutationFn: (data: { internalNotes: string }) =>
    fetch(`/api/reservations/${reservation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
  },
});

// Dans le JSX :
<div className="space-y-2">
  <label className="text-sm font-medium">Notes internes</label>
  <Textarea
    value={notes}
    onChange={e => setNotes(e.target.value)}
    onBlur={() => updateMutation.mutate({ internalNotes: notes })}
    placeholder="Visible uniquement par l'équipe agence..."
    rows={3}
  />
</div>
```

---

#### Étape 5 — Vérifier TypeScript et le build

```bash
npm run typecheck   # Aucune erreur TypeScript
npm run build       # Build prod sans erreur
```

---

#### Étape 6 — Ouvrir une PR

Description de PR suggérée :

```
feat: ajouter notes internes sur réservation

## What
Ajout d'un champ `internalNotes` (text, optionnel) sur le modèle Reservation.
Le champ est visible et modifiable dans la vue détail d'une réservation,
uniquement pour les rôles gestionnaire et admin agence.

## How to test
1. Aller sur une réservation
2. Saisir du texte dans le champ "Notes internes"
3. Naviguer hors de la page et revenir
4. Vérifier que les notes sont persistées

Closes #42
```

---

## Ressources pour aller plus loin

### Documentation du projet

| Ressource | Description |
|-----------|-------------|
| `README.md` | Vue d'ensemble technique rapide |
| `docs/ADR/` | Architecture Decision Records — comprendre les choix techniques |
| `docs/API.md` | Documentation complète des endpoints REST |
| `SECURITY.md` | Politique de sécurité et bonnes pratiques contributeurs |
| `CHANGELOG.md` | Historique des versions |

### Librairies principales

| Librairie | Docs |
|-----------|------|
| React 18 | https://react.dev |
| Vite | https://vitejs.dev |
| Express.js | https://expressjs.com |
| TypeScript | https://www.typescriptlang.org/docs |
| Drizzle ORM | https://orm.drizzle.team |
| shadcn/ui | https://ui.shadcn.com |
| TanStack Query v5 | https://tanstack.com/query/v5/docs |
| Tailwind CSS v3 | https://tailwindcss.com/docs |
| Wouter | https://github.com/molefrog/wouter |
| Zod | https://zod.dev |
| JWT (jose) | https://github.com/panva/jose |
| Sentry | https://docs.sentry.io/platforms/javascript |

### Glossaire métier

| Terme | Définition |
|-------|-----------|
| **Agence** | Entreprise de conciergerie qui utilise ConciergeOS |
| **Propriétaire** | Personne physique ou morale qui confie son bien à l'agence |
| **Voyageur / Guest** | Locataire pour la durée d'un séjour |
| **Prestataire** | Intervenant extérieur (ménage, maintenance, plomberie…) |
| **Réservation** | Séjour confirmé d'un voyageur dans un logement |
| **Check-in / Check-out** | Date d'arrivée / date de départ d'un séjour |
| **Reversement** | Virement mensuel au propriétaire après déduction de la commission |
| **Commission** | Pourcentage prélevé par l'agence sur les revenus bruts |
| **État des lieux** | Inspection du logement à l'entrée et à la sortie du voyageur |
| **Incident** | Problème signalé pendant ou après un séjour |
| **Mission** | Tâche assignée à un prestataire (ménage, maintenance…) |
| **Planning** | Vue calendrier de l'occupation et des tâches sur un logement |
| **OTA** | Online Travel Agency (Airbnb, Booking.com, VRBO…) |
| **iCal** | Format de synchronisation de calendriers entre plateformes |
| **PMS** | Property Management System — ce qu'est ConciergeOS |

---

## FAQ premier jour

**1. Quelle version de Node.js utiliser ?**
Node.js 20 LTS. Utilise `nvm` si tu as plusieurs versions installées : `nvm use 20`.

**2. La base de données ne se crée pas au démarrage, que faire ?**
Vérifie que `DATABASE_URL` dans `.env.local` pointe bien vers un chemin valide (`file:./dev.db`). Lance `npm run db:push` manuellement pour initialiser les tables.

**3. L'API renvoie 401 sur tous les endpoints, pourquoi ?**
Tu n'es pas authentifié. Appelle d'abord `POST /api/auth/login` avec les credentials de démo, puis inclus le token JWT dans le header `Authorization: Bearer <token>` de tes requêtes. En dev, le front le gère automatiquement si tu es connecté via l'interface.

**4. J'ai une erreur TypeScript que je ne comprends pas, que faire ?**
D'abord : lis le message d'erreur complet (avec le fichier et la ligne). TypeScript donne souvent la solution. Ensuite : cherche dans le codebase si un pattern similaire existe. Enfin : pose la question au lead en partageant le message d'erreur complet.

**5. Où sont les tests et comment les lancer ?**
`npm run test` pour tous les tests. Les tests unitaires sont dans `*.test.ts` colocalisés avec le code. Les tests d'intégration API sont dans `server/__tests__/`. On vise un coverage raisonnable, pas exhaustif — les paths critiques (auth, finances) doivent être couverts.

**6. Comment fonctionne l'authentification en local ?**
JWT signé côté serveur (`server/auth.ts`). Le token est stocké en mémoire côté client (pas de localStorage pour la sécurité). Durée de vie : 1h avec refresh automatique. En local, le secret JWT est dans `.env.local` (valeur par défaut du `.env.example` suffisante pour le dev).

**7. Je veux ajouter une librairie npm, c'est OK ?**
Demande d'abord au lead. On évalue : est-ce vraiment nécessaire, quelle est la taille du bundle, est-elle maintenue, y a-t-il un équivalent déjà dans le projet. Les librairies UI sont particulièrement scrutinées (on est sur shadcn/ui, on n'ajoute pas une autre librairie de composants).

**8. Comment voir les données de démo ?**
Lance `npm run db:seed` depuis une base vide. Les données incluent : 3 agences fictives, 12 propriétés avec adresses françaises réelles, 30+ réservations sur 3 mois, des voyageurs et prestataires fictifs, et des données financières pour les reversements.

**9. Quelle est la convention de nommage pour les branches ?**
`fix/<description-courte>` pour les bugs, `feat/<description-courte>` pour les features, `chore/<description-courte>` pour la maintenance, `docs/<description-courte>` pour la documentation. Utilise des tirets, pas de underscores, pas de majuscules.

**10. Qui contacter si je suis bloqué depuis plus d'une heure ?**
Ne reste jamais bloqué en silence. Écris un message dans le canal `#dev` (Slack/Discord) en décrivant ce que tu essaies de faire, ce que tu as essayé, et l'erreur exacte. Le lead ou un autre dev répondra rapidement. Pas de question bête — une heure bloqué vaut bien un message de 3 lignes.

---

*Document maintenu par l'équipe ConciergeOS. Dernière mise à jour : mai 2026.*
*Si quelque chose est inexact ou manquant, ouvre une PR pour corriger ce fichier — il appartient à toute l'équipe.*
