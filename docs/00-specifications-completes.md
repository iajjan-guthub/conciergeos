# Dossier de spécifications — Plateforme SaaS de conciergerie Airbnb

**Version :** 1.0  
**Date :** Mai 2026  
**Statut :** Référence initiale — MVP  
**Public :** Fondateur, développeur, investisseurs, partenaires pilotes

---

## Table des matières

1. [Résumé exécutif](#1-résumé-exécutif)
2. [Spécifications fonctionnelles](#2-spécifications-fonctionnelles)
3. [Spécifications techniques](#3-spécifications-techniques)
4. [Plan projet détaillé](#4-plan-projet-détaillé)
5. [Maquettes graphiques](#5-maquettes-graphiques)
6. [Modèle économique & pricing](#6-modèle-économique--pricing)

---

## 1. Résumé exécutif

La plateforme est un logiciel SaaS multi-tenant destiné aux agences de conciergerie en location courte durée (Airbnb, Booking.com, Vrbo, site direct). Elle centralise la gestion des biens, des réservations, des opérations terrain (ménage, check-in, maintenance), de la relation propriétaires et voyageurs, et du pilotage financier.

**Problème résolu :** Les agences jonglent aujourd'hui entre 4 à 7 outils distincts (tableur, messagerie, application ménage, canal OTA, comptabilité), générant pertes de temps, erreurs opérationnelles et mauvaise expérience client.

**Proposition de valeur :** Une plateforme unique, simple, mobile-first, avec automatisation des tâches répétitives, portails dédiés par profil (agence, propriétaire, voyageur, prestataire) et tarification à la logement active.

**Modèle de revenus :** Abonnement mensuel par logement, avec période d'essai gratuite 15 jours sans CB, puis trois plans tarifaires (Starter / Pro / Agency).

---

## 2. Spécifications fonctionnelles

### 2.1 Domaines fonctionnels

La plateforme est organisée en six domaines métier indépendants mais interconnectés.

---

### 2.2 Domaine 1 — Acquisition & onboarding propriétaires

**Objectif :** Convertir un prospect propriétaire en bien exploitable le plus rapidement possible.

#### Fonctionnalités

- **Simulateur de revenus public** : formulaire adresse + type + capacité → estimation CA net mensuel (saisonnalité, frais agence, charges). Accessible sans compte, intégrable en landing page.
- **CRM propriétaires** : pipeline de leads (Prospect → Audit → Contrat → Actif), historique des échanges, score de priorité, relances automatiques.
- **Prise de rendez-vous** : intégration calendrier agent, lien de réservation créneau, confirmation email/SMS.
- **Onboarding guidé du bien** :
  - Formulaire multi-étapes (adresse, capacité, équipements, photos, règlement intérieur, accès, instructions particulières).
  - Checklist de conformité (assurance, autorisation de location, déclaration mairie si applicable).
  - Génération automatique du livret maison et du guide d'accès voyageur.
- **Signature électronique du mandat** : contrat de gestion, annexes financières, conditions SLA. Signature en ligne sans installation.
- **Galerie photos & médias** : upload multi-fichiers, recadrage, tri, légendes, export vers les OTAs.

#### Règles métier

- Un bien ne peut être activé que si toutes les étapes de la checklist de conformité sont validées.
- Le simulateur de revenus s'appuie sur des données historiques de taux d'occupation par zone géographique (mises à jour manuellement ou via data externe).
- Un propriétaire peut gérer plusieurs biens depuis un même compte.

---

### 2.3 Domaine 2 — Distribution & revenue management

**Objectif :** Diffuser les annonces sur les OTAs, gérer la disponibilité et optimiser le prix.

#### Fonctionnalités

- **Channel manager** :
  - Synchronisation bidirectionnelle des calendriers et des prix avec Airbnb (via partenaire certifié ou channel manager intermédiaire), Booking.com, Vrbo.
  - Prévention du surbooking : verrouillage immédiat après confirmation sur un canal.
  - Site direct : mini-site généré automatiquement par bien, avec widget de réservation et paiement intégré.
- **Revenue management** :
  - Tarification de base par saison et jour de semaine.
  - Règles automatiques : last-minute (réduction X %), long séjour (réduction Y %), trou de planning (ajustement auto), événement local (majoration).
  - Alertes sous-performance : taux d'occupation en dessous du seuil cible → suggestion de baisser le prix.
- **Qualité annonce** :
  - Score de complétude par bien (photos, description, équipements, règles).
  - Suggestions d'amélioration contextuelles.
  - Multilingue : traduction automatique des descriptions (FR/EN/ES/AR minimum).
- **Gestion des réservations** :
  - Acceptation automatique ou manuelle selon règles définies par l'agence.
  - Dépôt de garantie : collecte automatique, libération ou déduction avec justificatif.
  - Annulations : calcul automatique des pénalités selon la politique choisie.
  - Modifications : recalcul du prix, des missions et des notifications associées.
  - No-show : déclenchement du workflow correspondant (notification, facturation, libération du bien).

#### Règles métier

- Tout changement de prix ou de disponibilité déclenche une synchronisation immédiate sur tous les canaux actifs (dans un délai cible < 2 minutes).
- Un calendrier bloqué manuellement par le propriétaire est prioritaire sur toutes les règles automatiques.

---

### 2.4 Domaine 3 — Opérations terrain

**Objectif :** Garantir la qualité de chaque séjour et la fiabilité du turnover entre deux locations.

#### Fonctionnalités

- **Planning opérationnel** :
  - Vue agenda par bien, zone géographique, prestataire et priorité.
  - Détection automatique des conflits (chevauchement arrivée/départ, temps de ménage insuffisant).
  - Affectation automatique du prestataire selon disponibilité, zone, note qualité et coût.
- **Missions de ménage** :
  - Création automatique à chaque départ (ou manuellement).
  - Application mobile prestataire : liste des tâches, photos avant/après, validation item par item, signature de fin de mission.
  - Gestion du linge : stock par bien, demande de réassort, traçabilité.
  - Rattrapage express : mission prioritaire si signalement de non-conformité.
- **Check-in / check-out** :
  - Modes : autonome (code de boîte à clés ou serrure connectée), physique (agent sur place), hybride (code + vidéo-assistance), sans contact (serrure IoT).
  - Vérification d'identité en ligne avant arrivée.
  - État des lieux photo : comparatif départ/arrivée.
  - Check-out guidé voyageur : rappel règles, instructions départ, signalement casse.
- **Maintenance & incidents** :
  - Niveaux de criticité : Urgent (< 2h), Important (< 24h), Normal (< 72h).
  - Dispatch prestataire avec devis, validation propriétaire au-delà d'un seuil, suivi résolution.
  - Base fournisseurs par zone, spécialité, tarif.
  - Historique des incidents par bien.

#### Règles métier

- Une mission ménage est automatiquement créée dès qu'une réservation est confirmée avec départ et arrivée connus.
- Si la mission ménage n'est pas validée 30 minutes avant l'heure d'arrivée, une alerte est envoyée au responsable agence.
- Un incident de criticité "Urgent" déclenche une notification push immédiate sur tous les appareils du responsable de zone.

---

### 2.5 Domaine 4 — Expérience client

**Objectif :** Offrir une expérience fluide au voyageur et une relation transparente avec le propriétaire.

#### Fonctionnalités propriétaire

- **Portail propriétaire** (accès restreint, vue sur ses biens uniquement) :
  - Dashboard : CA mensuel, taux d'occupation, réservations à venir, incidents en cours.
  - Calendrier personnel : vue des disponibilités, blocage de dates en libre-service.
  - Documents : rapports mensuels, contrats, factures, états des lieux.
  - Tickets : suivi en temps réel de chaque incident ou demande.
  - Notifications configurables : par email, SMS ou push.

#### Fonctionnalités voyageur

- **Portail voyageur** (web app légère, sans inscription obligatoire) :
  - Accessible via lien personnalisé envoyé automatiquement à la confirmation.
  - Guide d'arrivée : adresse, photos extérieures, code d'accès (débloqué J-1), instructions.
  - Chat avec l'agence (canal principal, accessible 7j/7).
  - Services additionnels : parking, ménage de mi-séjour, location de vélo, recommandations locales.
  - Signalement incident : formulaire photo + description + criticité.
  - Check-out guidé : instructions départ, déclaration de casse, lien avis Airbnb/Google.

#### Messagerie unifiée

- Inbox centrale pour tous les canaux : Airbnb, Booking, email direct, SMS, WhatsApp.
- Templates personnalisables par événement et par bien (langues multiples).
- IA d'assistance : suggestions de réponse contextuelles, détection d'urgence, traduction automatique.
- Escalade humaine depuis l'IA : bouton "reprendre en main" visible à tout moment.
- Statistiques de réponse : délai moyen, taux de résolution automatique, satisfaction.

---

### 2.6 Domaine 5 — Finance & administration

**Objectif :** Automatiser la clôture mensuelle, les reversements et la conformité fiscale.

#### Fonctionnalités

- **Facturation & reversements** :
  - Calcul automatique des reversements propriétaires (revenus bruts − commission − extras − réparations).
  - Gestion des commissions différentes par contrat et par type de service.
  - Factures générées automatiquement au format PDF.
  - Virement programmé ou sur validation manuelle.
- **Suivi des paiements** :
  - Statut de chaque transaction : en attente, capturé, remboursé, litigieux.
  - Gestion des cautions : capture auto, libération à J+3 après départ sans incident.
  - Intégration PSP : Stripe Connect pour les reversements multi-comptes.
- **Fiscalité & exports** :
  - Taxe de séjour : calcul et collecte automatique selon la réglementation locale.
  - TVA : gestion taux par pays et type de service.
  - Export comptable : format CSV ou intégration directe comptabilité.
- **Back-office administratif** :
  - Gestion des utilisateurs, rôles, droits et permissions.
  - Journal d'audit : chaque action critique est tracée (qui, quoi, quand).
  - Multi-agences : une instance peut gérer plusieurs entités juridiques.

---

### 2.7 Domaine 6 — Pilotage & analytics

**Objectif :** Fournir aux responsables d'agence les indicateurs pour prendre de bonnes décisions.

#### Fonctionnalités

- **Dashboard agence** : KPIs en temps réel — CA global, taux d'occupation, RevPAR, ADR, NPS, délai de réponse moyen.
- **Analyse portefeuille** : performance comparée par bien, par ville, par prestataire.
- **Reporting propriétaire mensuel** : généré automatiquement, personnalisable, envoyé par email.
- **Alertes intelligentes** : bien sous-performant, prestataire en retard, avis négatif, stock linge faible, paiement en échec.
- **Exports** : CSV / Excel / PDF pour chaque vue de données.

---

### 2.8 Gestion des rôles

| Rôle | Portée | Droits principaux |
|---|---|---|
| Super Admin | Toute la plateforme | Toutes les actions, multi-agences, facturation SaaS |
| Admin agence | Son agence uniquement | Tous les paramètres de son agence |
| Manager opérations | Son agence | Planning, missions, incidents, prestataires |
| Commercial / CRM | Son agence | Leads, contrats, propriétaires |
| Prestataire (cleaner) | Ses missions uniquement | Voir et valider ses tâches du jour |
| Propriétaire | Ses biens uniquement | Lecture, blocage dates, documents |
| Voyageur | Sa réservation uniquement | Guide, chat, services, check-out |

---

### 2.9 Modèle de période d'essai et gating

- **Essai gratuit 15 jours** sans CB, accès complet à toutes les fonctionnalités du plan Pro.
- À J+15 : conversion automatique vers le plan choisi ou passage en mode lecture seule (données conservées 30 jours supplémentaires).
- **Freemium limité** : jusqu'à 1 bien actif en accès permanent gratuit (fonctionnalités restreintes : pas de channel manager, pas de portail propriétaire avancé, pas d'analytics).
- **Upgrade in-app** : bouton d'upgrade contextuel affiché dès qu'une fonctionnalité hors plan est tentée.

---

## 3. Spécifications techniques

### 3.1 Architecture globale

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COUCHE PRÉSENTATION                             │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Site marketing│  │ Back-office  │  │ Portail      │  │ App mobile│  │
│  │ + landing    │  │ agence       │  │ propriétaire │  │ prestataire│  │
│  │ (Next.js SSR)│  │ (Next.js SPA)│  │ (Next.js)    │  │ (PWA)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │
│                             │                                          │
│                    ┌────────────────┐                                  │
│                    │ Portail voyageur│                                  │
│                    │ (Next.js légèr)│                                  │
│                    └────────────────┘                                  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTPS / REST + WebSocket
┌──────────────────────────────▼──────────────────────────────────────────┐
│                       API GATEWAY / IAM                                 │
│  Authentification JWT, rôles RBAC, rate limiting, audit log            │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                       SERVICES MÉTIER                                   │
│                                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ CRM &      │  │ PMS        │  │ Operations │  │ Messaging &      │  │
│  │ Onboarding │  │ Réservations│  │ Engine     │  │ Notifications    │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────────┘  │
│                                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                        │
│  │ Revenue    │  │ Billing &  │  │ Analytics  │                        │
│  │ Management │  │ Finance    │  │ & Reporting│                        │
│  └────────────┘  └────────────┘  └────────────┘                        │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                    MOTEUR D'AUTOMATISATION                              │
│  Event bus (booking.created / task.failed / incident.opened …)         │
│  Workflow engine : déclencheurs, délais, branches, escalades           │
│  File de jobs : emails, SMS, sync OTA, génération PDF                  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                          DONNÉES                                        │
│                                                                        │
│  ┌────────────────────────┐    ┌────────────────────┐                  │
│  │ PostgreSQL (Supabase)  │    │ Stockage fichiers  │                  │
│  │ Base transactionnelle  │    │ (Supabase Storage) │                  │
│  │ Tous les domaines      │    │ Photos, docs, PDF  │                  │
│  └────────────────────────┘    └────────────────────┘                  │
│                                                                        │
│  ┌────────────────────────┐    ┌────────────────────┐                  │
│  │ Cache Redis (Upstash)  │    │ Data mart / BI     │                  │
│  │ Sessions, temps réel   │    │ (vues analytiques) │                  │
│  └────────────────────────┘    └────────────────────┘                  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                      INTÉGRATIONS EXTERNES                              │
│                                                                        │
│  OTAs         │ Airbnb (via partenaire) · Booking.com API · Vrbo       │
│  Paiement     │ Stripe Connect · Stripe Billing                        │
│  Messagerie   │ Resend (email) · Twilio (SMS) · WhatsApp Business API  │
│  IoT / Accès  │ Nuki · Yale Connect · August · Igloohome               │
│  Signature    │ Docusign / YouSign                                     │
│  Comptabilité │ Export CSV / Pennylane / QuickBooks                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Stack technologique recommandée

| Couche | Choix | Justification |
|---|---|---|
| Framework front | **Next.js 15 (App Router)** | SSR + SPA, excellent DX, déploiement Vercel direct |
| Styling | **Tailwind CSS v4** | Productivité maximale, design tokens, dark mode natif |
| État client | **Zustand + React Query** | Léger, sans boilerplate |
| Backend API | **Next.js Route Handlers** ou **Hono.js** | Même dépôt ou service dédié léger |
| Base de données | **PostgreSQL via Supabase** | Gratuit jusqu'à 500 MB, auth incluse, RLS, API REST auto-générée |
| Auth | **Supabase Auth** | JWT, social login, RBAC, MFA |
| Stockage fichiers | **Supabase Storage** | CDN intégré, accès sécurisé par token |
| Cache / Temps réel | **Upstash Redis + Supabase Realtime** | Gratuit en tier free |
| Jobs asynchrones | **Inngest** (gratuit en dev) | Workflows event-driven, retry, scheduling |
| Emails | **Resend** | API simple, 3 000 emails/mois gratuits |
| SMS | **Twilio** | Standard industrie |
| PSP | **Stripe Connect** | Reversements multi-comptes, Billing pour abonnements |
| Déploiement front | **Vercel** | Déploiement automatique sur push Git |
| Déploiement back | **Railway** | Simple, cheap, bon DX |
| DNS / Domaine | **Namecheap + Cloudflare** | ~10 €/an + CDN gratuit |
| Monitoring | **Sentry** (free tier) + Vercel Analytics | Erreurs + performances |

---

### 3.3 Architecture de la base de données — Schéma principal

```sql
-- Entités principales (schéma simplifié)

agencies          -- Agences clientes de la plateforme
  id, name, slug, plan, trial_ends_at, stripe_customer_id

users             -- Tous les utilisateurs (admin, agents, prestataires)
  id, agency_id, email, role, full_name, phone, avatar_url

owners            -- Propriétaires
  id, agency_id, user_id (optionnel), full_name, email, phone

properties        -- Biens immobiliers
  id, agency_id, owner_id, address, city, type, bedrooms, capacity, status

listings          -- Annonces par bien (une par canal ou une partagée)
  id, property_id, channel, external_id, title, description, price_base

bookings          -- Réservations
  id, listing_id, property_id, guest_name, guest_email, check_in, check_out,
  adults, total_price, commission, status, channel, external_booking_id

tasks             -- Missions opérationnelles (ménage, check-in, maintenance)
  id, booking_id, property_id, assignee_id, type, scheduled_at,
  started_at, completed_at, status, notes, checklist_json

incidents         -- Incidents et tickets
  id, booking_id, property_id, reported_by, severity, title,
  description, status, resolved_at, cost

messages          -- Messagerie unifiée
  id, booking_id, channel, direction, body, translated_body,
  sent_at, is_automated, read_at

invoices          -- Factures
  id, agency_id, owner_id, period, gross_revenue, commission,
  deductions, net_amount, status, pdf_url

payments          -- Transactions Stripe
  id, booking_id, stripe_payment_intent_id, amount, currency,
  status, type (deposit/rent/extra)
```

---

### 3.4 Architecture par bloc applicatif

#### Bloc A — Back-office agence

- **Framework :** Next.js App Router, rendu client-side majoritaire (SPA).
- **Navigation :** Sidebar persistante avec sections : Tableau de bord, Biens, Réservations, Planning, Messagerie, Finances, Paramètres.
- **Temps réel :** Supabase Realtime pour les notifications d'incidents et les mises à jour de statut de tâches.
- **Sécurité :** Row Level Security (RLS) PostgreSQL : chaque requête est filtrée par `agency_id` de l'utilisateur connecté.

#### Bloc B — Portail propriétaire

- **Accès :** Lien d'invitation email + mot de passe ou lien magique.
- **Vues disponibles :** Dashboard revenus, Calendrier du bien, Documents, Tickets.
- **RLS :** Accès restreint aux biens `owner_id = user_id`.
- **Mobile :** Responsive first, design simplifié.

#### Bloc C — Portail voyageur

- **Accès :** Token unique dans l'URL (pas de compte requis).
- **Architecture :** Page Next.js légère, rendu SSR pour le premier chargement (critique pour le SEO et la vitesse).
- **Contenu dynamique :** Code d'accès débloqué uniquement à J-1 de l'arrivée via règle serveur.
- **Chat :** WebSocket temps réel vers la messagerie unifiée.

#### Bloc D — Application mobile prestataires

- **Architecture :** PWA (Progressive Web App) — accessible depuis le navigateur mobile, installable sur l'écran d'accueil.
- **Fonctionnalités :** Liste des missions du jour, navigation GPS, checklist, upload photos, validation.
- **Offline :** Service Worker pour consultation des missions sans réseau.

#### Bloc E — Site marketing & landing

- **Framework :** Next.js SSR/SSG — pages statiques pour la performance SEO.
- **Contenu :** Simulateur de revenus, landing par ville, témoignages, pricing, blog.
- **Conversion :** CTA → Essai gratuit → Onboarding guidé.

#### Bloc F — Moteur d'automatisation (Inngest)

- **Événements déclencheurs principaux :**
  - `booking/created` → crée tâches, envoie confirmation, bloque calendrier
  - `booking/check_in.approach` (J-3) → envoie instructions voyageur
  - `booking/checked_out` → crée mission ménage, libère caution J+3
  - `task/overdue` → alerte manager, réassigne si besoin
  - `incident/opened.urgent` → push notification, escalade immédiate
  - `invoice/month_end` → génère factures, envoie rapports propriétaires
- **Retry automatique** : chaque job a 3 tentatives avec backoff exponentiel.

---

### 3.5 Sécurité & conformité

- **Authentification :** JWT + refresh tokens, expiration 1h, révocable.
- **Autorisations :** RBAC + RLS PostgreSQL (double couche).
- **RGPD :** Chiffrement des données personnelles at-rest, export données sur demande, suppression sur demande, registre des traitements.
- **Paiements :** Aucune donnée CB stockée en propre (délégué à Stripe, PCI DSS niveau 1).
- **Audit log :** Chaque action sensible (login, modification contrat, virement) est journalisée avec horodatage et IP.
- **Backups :** Supabase effectue des backups quotidiens automatiques (à activer sur le plan Pro Supabase).

---

## 4. Plan projet détaillé

### 4.1 Vue d'ensemble des phases

| Phase | Nom | Durée estimée (2h/jour) | Livrable |
|---|---|---|---|
| 0 | Fondations | 2 semaines | Dépôt Git, CI/CD, design system |
| 1 | Socle technique | 4 semaines | Auth, BDD, API de base, RBAC |
| 2 | PMS & réservations | 5 semaines | Gestion biens, calendrier, réservations |
| 3 | Opérations terrain | 4 semaines | Planning, missions, incidents |
| 4 | Messagerie & portails | 4 semaines | Inbox, portail propriétaire, portail voyageur |
| 5 | Finance & billing | 3 semaines | Stripe, reversements, factures |
| 6 | Analytics & reporting | 2 semaines | Dashboards, rapports, exports |
| 7 | Intégrations externes | 4 semaines | OTAs, IoT, comptabilité |
| 8 | Site marketing & onboarding | 2 semaines | Landing, simulateur, essai gratuit |
| **Total** | | **~30 semaines (~7 mois)** | **Plateforme MVP complète** |

---

### 4.2 Phase 0 — Fondations (2 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 0.1 | Créer dépôt Git (GitHub / GitLab) avec structure monorepo | 🔴 Critique | ☐ |
| 0.2 | Configurer Vercel (déploiement auto sur push `main`) | 🔴 Critique | ☐ |
| 0.3 | Créer projet Supabase (BDD, auth, storage) | 🔴 Critique | ☐ |
| 0.4 | Initialiser projet Next.js 15 + Tailwind CSS | 🔴 Critique | ☐ |
| 0.5 | Mettre en place le design system (tokens couleur, typographie, composants de base) | 🟠 Haute | ☐ |
| 0.6 | Configurer ESLint, Prettier, Husky (qualité code) | 🟡 Moyenne | ☐ |
| 0.7 | Mettre en place Sentry (monitoring erreurs) | 🟡 Moyenne | ☐ |
| 0.8 | Définir les variables d'environnement (`.env.local`, secrets Vercel) | 🔴 Critique | ☐ |

---

### 4.3 Phase 1 — Socle technique (4 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 1.1 | Schéma BDD : tables `agencies`, `users`, `roles` | 🔴 Critique | ☐ |
| 1.2 | Migrations SQL avec Supabase CLI | 🔴 Critique | ☐ |
| 1.3 | Authentification : inscription, connexion, lien magique, récupération MDP | 🔴 Critique | ☐ |
| 1.4 | Système RBAC : middleware Next.js par rôle | 🔴 Critique | ☐ |
| 1.5 | RLS PostgreSQL : isolation des données par agence | 🔴 Critique | ☐ |
| 1.6 | Layout back-office : sidebar, topbar, navigation principale | 🔴 Critique | ☐ |
| 1.7 | Gestion des utilisateurs : invitation email, liste, désactivation | 🟠 Haute | ☐ |
| 1.8 | Journal d'audit : hook global sur les mutations sensibles | 🟡 Moyenne | ☐ |
| 1.9 | Tests end-to-end de l'authentification (Playwright) | 🟡 Moyenne | ☐ |

---

### 4.4 Phase 2 — PMS & réservations (5 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 2.1 | Schéma BDD : `owners`, `properties`, `listings`, `bookings` | 🔴 Critique | ☐ |
| 2.2 | CRUD biens : création multi-étapes, photos, équipements | 🔴 Critique | ☐ |
| 2.3 | Upload photos : Supabase Storage, optimisation, tri | 🔴 Critique | ☐ |
| 2.4 | Calendrier de disponibilités : vue mensuelle, blocage manuel | 🔴 Critique | ☐ |
| 2.5 | Gestion réservations : liste, détail, statuts, timeline | 🔴 Critique | ☐ |
| 2.6 | Fiche réservation 360° : voyageur, accès, tâches, messages, finances | 🔴 Critique | ☐ |
| 2.7 | Moteur de prix : tarifs de base, saisons, jours de semaine | 🟠 Haute | ☐ |
| 2.8 | Workflow `booking/created` via Inngest (création automatique des tâches) | 🟠 Haute | ☐ |
| 2.9 | Recherche et filtres avancés sur les réservations | 🟡 Moyenne | ☐ |
| 2.10 | Import CSV de réservations historiques (migration) | 🟡 Moyenne | ☐ |

---

### 4.5 Phase 3 — Opérations terrain (4 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 3.1 | Schéma BDD : `tasks`, `checklists`, `service_providers`, `incidents` | 🔴 Critique | ☐ |
| 3.2 | Planning opérationnel : vue agenda par bien / prestataire | 🔴 Critique | ☐ |
| 3.3 | CRUD missions : création, affectation, statut, checklist | 🔴 Critique | ☐ |
| 3.4 | App mobile prestataire (PWA) : liste missions, checklist, photos, validation | 🔴 Critique | ☐ |
| 3.5 | Alertes ops : tâche en retard → push notification → escalade | 🔴 Critique | ☐ |
| 3.6 | Gestion incidents : formulaire, niveaux de criticité, dispatch | 🟠 Haute | ☐ |
| 3.7 | Base fournisseurs : liste, spécialités, zones, tarifs | 🟡 Moyenne | ☐ |
| 3.8 | Gestion du stock linge par bien | 🟡 Moyenne | ☐ |

---

### 4.6 Phase 4 — Messagerie & portails (4 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 4.1 | Schéma BDD : `messages`, `templates`, `notifications` | 🔴 Critique | ☐ |
| 4.2 | Inbox unifiée : liste conversations, détail, réponse | 🔴 Critique | ☐ |
| 4.3 | Templates de messages par événement et par bien | 🔴 Critique | ☐ |
| 4.4 | Envoi automatique via Resend (email) et Twilio (SMS) | 🔴 Critique | ☐ |
| 4.5 | Portail propriétaire : dashboard, calendrier, documents, tickets | 🔴 Critique | ☐ |
| 4.6 | Portail voyageur : guide arrivée, code accès temporisé, chat | 🔴 Critique | ☐ |
| 4.7 | Génération automatique du guide d'arrivée par bien | 🟠 Haute | ☐ |
| 4.8 | Notifications temps réel (Supabase Realtime) dans le back-office | 🟠 Haute | ☐ |
| 4.9 | Assistance IA à la rédaction de messages (appel API Claude/GPT) | 🟡 Moyenne | ☐ |

---

### 4.7 Phase 5 — Finance & billing (3 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 5.1 | Intégration Stripe Connect (comptes propriétaires liés) | 🔴 Critique | ☐ |
| 5.2 | Stripe Billing : abonnements, plans, essai gratuit 15j | 🔴 Critique | ☐ |
| 5.3 | Schéma BDD : `invoices`, `payments`, `commissions` | 🔴 Critique | ☐ |
| 5.4 | Calcul automatique des reversements mensuels | 🔴 Critique | ☐ |
| 5.5 | Génération PDF des factures propriétaires | 🔴 Critique | ☐ |
| 5.6 | Tableau de suivi des paiements : statuts, litiges, remboursements | 🟠 Haute | ☐ |
| 5.7 | Gestion de la taxe de séjour par ville | 🟡 Moyenne | ☐ |
| 5.8 | Export comptable CSV / Pennylane | 🟡 Moyenne | ☐ |

---

### 4.8 Phase 6 — Analytics & reporting (2 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 6.1 | Dashboard agence : KPIs taux d'occupation, CA, RevPAR, ADR | 🔴 Critique | ☐ |
| 6.2 | Vue performance portefeuille : comparaison par bien et par ville | 🟠 Haute | ☐ |
| 6.3 | Rapport mensuel propriétaire : génération auto + envoi email | 🔴 Critique | ☐ |
| 6.4 | Alertes intelligentes : seuils configurables, notifications | 🟠 Haute | ☐ |
| 6.5 | Exports CSV/Excel de toutes les vues de données | 🟡 Moyenne | ☐ |

---

### 4.9 Phase 7 — Intégrations externes (4 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 7.1 | Intégration channel manager (Smoobu ou Lodgify API) pour Airbnb | 🔴 Critique | ☐ |
| 7.2 | Intégration Booking.com API (sandbox → production) | 🔴 Critique | ☐ |
| 7.3 | Synchronisation calendriers iCal (fallback universel) | 🔴 Critique | ☐ |
| 7.4 | Intégration serrure connectée (Nuki API ou Igloohome) | 🟠 Haute | ☐ |
| 7.5 | Intégration YouSign ou Docusign (signature contrats) | 🟠 Haute | ☐ |
| 7.6 | Intégration WhatsApp Business API (via Twilio) | 🟡 Moyenne | ☐ |
| 7.7 | Webhook Stripe : gestion des événements de paiement | 🔴 Critique | ☐ |

---

### 4.10 Phase 8 — Site marketing & onboarding (2 semaines)

| # | Tâche | Priorité | Statut |
|---|---|---|---|
| 8.1 | Landing page principale : valeur, fonctionnalités, témoignages | 🔴 Critique | ☐ |
| 8.2 | Simulateur de revenus public (formulaire adresse + estimation) | 🟠 Haute | ☐ |
| 8.3 | Page pricing : plans Starter/Pro/Agency, toggle mensuel/annuel | 🔴 Critique | ☐ |
| 8.4 | Flux d'inscription et d'onboarding guidé (création agence + 1er bien) | 🔴 Critique | ☐ |
| 8.5 | Pages légales : CGU, Politique de confidentialité, RGPD | 🔴 Critique | ☐ |
| 8.6 | SEO technique : meta, sitemap, schema.org, Open Graph | 🟡 Moyenne | ☐ |

---

### 4.11 Suivi de l'état d'avancement

Utiliser les états suivants dans le suivi des tâches :

| Icône | État |
|---|---|
| ☐ | À faire |
| 🔄 | En cours |
| ✅ | Terminé |
| ⏸️ | Bloqué |
| ⏭️ | Reporté |

Mettre à jour ce tableau dans le dépôt Git à chaque session de travail. Utiliser GitHub Projects ou Notion pour une vue Kanban si nécessaire.

---

## 5. Maquettes graphiques

Les maquettes suivantes décrivent le rendu attendu des écrans principaux. Elles sont réalisées en ASCII pour intégration dans ce document ; une version Figma peut être dérivée de ce contenu.

---

### 5.1 Dashboard back-office agence

```
╔══════════════════════════════════════════════════════════════════════════╗
║  [LOGO] ConciergeOS         🔔 Notifications  [Photo] Marie A.  ▾      ║
╠═════════════════╦════════════════════════════════════════════════════════╣
║                 ║                                                        ║
║  🏠 Tableau     ║   Bonjour Marie — Voici votre journée 📅 Mer 19 mai   ║
║  📋 Réservations║                                                        ║
║  🏘️ Biens       ║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ║
║  📅 Planning    ║  │ 92%      │ │ 187 €    │ │ 4.87★    │ │ 3        │ ║
║  💬 Messagerie  ║  │ Occupation│ │ RevPAR   │ │ Note moy.│ │ Incidents│ ║
║  🔧 Maintenance ║  └──────────┘ └──────────┘ └──────────┘ └──────────┘ ║
║  💰 Finance     ║                                                        ║
║  📊 Analytics   ║  Arrivées aujourd'hui (3)                              ║
║  ⚙️ Paramètres  ║  ┌─────────────────────────────────────────────────┐  ║
║                 ║  │ #R1042 · Villa Les Pins · Jean D. · 15h00       │  ║
║                 ║  │ ✅ Ménage validé  ✅ Code envoyé  ⏳ Arrivée    │  ║
║                 ║  ├─────────────────────────────────────────────────┤  ║
║                 ║  │ #R1043 · Appart Montmartre · Sarah M. · 16h00   │  ║
║                 ║  │ ✅ Ménage validé  ✅ Code envoyé  ⏳ Arrivée    │  ║
║                 ║  └─────────────────────────────────────────────────┘  ║
║                 ║                                                        ║
║                 ║  Tâches en attente (2)         ⚠️ Incident urgent (1) ║
║                 ║  ┌────────────────────────┐   ┌───────────────────┐   ║
║                 ║  │ Ménage — Studio Canal  │   │ 🔴 Fuite eau      │   ║
║                 ║  │ Karim B. — 12h30       │   │ Appart Pigalle    │   ║
║                 ║  │ [Voir]     [Réassigner]│   │ [Traiter →]       │   ║
║                 ║  └────────────────────────┘   └───────────────────┘   ║
╚═════════════════╩════════════════════════════════════════════════════════╝
```

---

### 5.2 Fiche réservation 360°

```
╔══════════════════════════════════════════════════════════════════════════╗
║  ← Réservations    Réservation #R1042 — Villa Les Pins       [Actions ▾]║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌─────────────────────────────────────────────────────────────────┐     ║
║  │ Jean Dupont  ★★★★★  Vérifié Airbnb  🇫🇷 Paris                  │     ║
║  │ Check-in : Mer 19 mai 15h00 → Check-out : Sam 22 mai 11h00      │     ║
║  │ 3 nuits · 2 adultes · 580 € total · Acompte reçu ✅              │     ║
║  └─────────────────────────────────────────────────────────────────┘     ║
║                                                                          ║
║  [Voyageur] [Accès] [Tâches] [Messages] [Finances] [Documents]           ║
║  ─── Onglet Accès ──────────────────────────────────────────────         ║
║                                                                          ║
║  🔑 Code boîte à clés      Badge        Débloqué à 14h00 le 19 mai      ║
║     ████                   Envoyé       [Renvoyer au voyageur]           ║
║                                                                          ║
║  📱 Guide d'arrivée        Badge        Lien envoyé par SMS + email      ║
║     bit.ly/vXkR2p          Envoyé       [Voir le guide]                  ║
║                                                                          ║
║  🚪 Serrure connectée      Badge        Nuki — Synchronisé il y a 2 min  ║
║     Verrou — Fermé         Actif        [Ouvrir à distance]              ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### 5.3 Planning opérationnel (vue semaine)

```
╔══════════════════════════════════════════════════════════════════════════╗
║  Planning opérationnel — Semaine du 19 au 25 mai          [+ Mission]   ║
╠══════════╦══════════╦══════════╦══════════╦══════════╦══════════════════╣
║          ║  Mer 19  ║  Jeu 20  ║  Ven 21  ║  Sam 22  ║  Dim 23         ║
╠══════════╬══════════╬══════════╬══════════╬══════════╬══════════════════╣
║ Villa    ║ 🟢 Ménage║          ║          ║ 🔴 Dép.  ║ 🟢 Ménage       ║
║ Les Pins ║ Karim B. ║          ║          ║ Jean D.  ║ Karim B.         ║
╠══════════╬══════════╬══════════╬══════════╬══════════╬══════════════════╣
║ Appart   ║          ║ 🟡 Maint.║          ║          ║ 🔵 Check-in     ║
║ Monmartre║          ║ Plomberie║          ║          ║ Agent : Leila   ║
╠══════════╬══════════╬══════════╬══════════╬══════════╬══════════════════╣
║ Studio   ║ 🟢 Check-║          ║ 🟢 Ménage║ 🔴 Dép.  ║                 ║
║ Canal    ║ in 15h   ║          ║ Sofia M. ║ Lucie F. ║                 ║
╚══════════╩══════════╩══════════╩══════════╩══════════╩══════════════════╝
  🟢 Ménage   🔵 Check-in physique   🟡 Maintenance   🔴 Départ
```

---

### 5.4 Portail propriétaire

```
╔══════════════════════════════════════════════════════════════════════════╗
║  [LOGO] ConciergeOS          Bonjour M. Bernard        [Déconnexion]    ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  MES BIENS (2)                                         [+ Ajouter]      ║
║  ┌──────────────────────────────┐  ┌──────────────────────────────┐     ║
║  │ 🏠 Villa Les Pins            │  │ 🏠 Studio Canal              │     ║
║  │ Cannes • 4 chambres          │  │ Paris 10e • Studio           │     ║
║  │ 94% d'occupation ce mois    │  │ 78% d'occupation ce mois    │     ║
║  │ Revenus mai : 2 340 €        │  │ Revenus mai : 980 €          │     ║
║  │ [Voir détail] [Bloquer dates]│  │ [Voir détail] [Bloquer dates]│     ║
║  └──────────────────────────────┘  └──────────────────────────────┘     ║
║                                                                          ║
║  PROCHAIN REVERSEMENT    15 juin 2026                                    ║
║  ┌──────────────────────────────────────────────────────────────┐        ║
║  │ Revenus bruts mai :   3 320 €                                │        ║
║  │ Commission agence :  − 498 € (15%)                           │        ║
║  │ Réparation douche :  − 120 €                                 │        ║
║  │ Net à percevoir :     2 702 €   ✅ Prévu le 15/06            │        ║
║  └──────────────────────────────────────────────────────────────┘        ║
║                                                                          ║
║  TICKET EN COURS (1)                                                     ║
║  ⚠️  Remplacement chauffe-eau — Devis 380 € — [Valider] [Refuser]       ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### 5.5 Portail voyageur (mobile)

```
┌─────────────────────────┐
│ ConciergeOS  🌙 19 mai  │
├─────────────────────────┤
│                         │
│ Bonjour Jean 👋         │
│ Votre séjour commence   │
│ aujourd'hui à 15h00     │
│                         │
│ ┌─────────────────────┐ │
│ │ 📍 Villa Les Pins   │ │
│ │ 12 Chemin des Pins  │ │
│ │ 06400 Cannes        │ │
│ │ [Naviguer →]        │ │
│ └─────────────────────┘ │
│                         │
│ 🔑 CODE D'ACCÈS         │
│ ┌─────────────────────┐ │
│ │   8  4  2  1        │ │
│ │   Boîte à clés :    │ │
│ │   portail gauche    │ │
│ └─────────────────────┘ │
│                         │
│ [📖 Guide arrivée]      │
│ [💬 Contacter agence]   │
│ [🛎️ Services +]         │
│ [⚠️ Signaler problème]  │
│                         │
└─────────────────────────┘
```

---

### 5.6 Application mobile prestataire (PWA)

```
┌─────────────────────────┐
│ ← Mes missions   Mer 19 │
├─────────────────────────┤
│                         │
│ ✅  Ménage terminé      │
│ Studio Canal — 9h30     │
│                         │
│ 🔄  EN COURS            │
│ ┌─────────────────────┐ │
│ │ 🧹 Ménage           │ │
│ │ Villa Les Pins      │ │
│ │ 12 Chemin des Pins  │ │
│ │ À faire avant 14h00 │ │
│ │                     │ │
│ │ Progression : 3/8   │ │
│ │ ████░░░░░ 37%       │ │
│ │                     │ │
│ │ [📷 Photo] [✅ Finir]│ │
│ └─────────────────────┘ │
│                         │
│ ⏳  À venir             │
│ ┌─────────────────────┐ │
│ │ 🔑 Check-in         │ │
│ │ Appart Montmartre   │ │
│ │ 16h00               │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

### 5.7 Site marketing — Page d'accueil

```
╔══════════════════════════════════════════════════════════════════════════╗
║  [LOGO] ConciergeOS   Fonctionnalités   Tarifs   Blog    [Essai gratuit]║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║          Gérez votre conciergerie Airbnb                                 ║
║          depuis une seule plateforme.                                    ║
║                                                                          ║
║          Réservations · Ménage · Propriétaires · Finance                 ║
║          Automatisez les tâches répétitives. Concentrez-vous             ║
║          sur la croissance.                                              ║
║                                                                          ║
║          [Essai gratuit 15 jours →]    [Voir la démo]                   ║
║                                                                          ║
║  ────────────────────────────────────────────────────────────────────── ║
║                                                                          ║
║  +230 agences     4.9/5 avis     38 000 biens gérés     -65% de tâches  ║
║                                                                          ║
║  ────────────────────────────────────────────────────────────────────── ║
║                                                                          ║
║  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐ ║
║  │ 📅 Réservations    │  │ 🧹 Opérations      │  │ 💰 Finance         │ ║
║  │ Channel manager,   │  │ Planning ménage,   │  │ Reversements auto, │ ║
║  │ pricing auto,      │  │ check-in, incidents│  │ factures, rapports │ ║
║  │ anti-surbooking    │  │ en temps réel      │  │ propriétaires      │ ║
║  └────────────────────┘  └────────────────────┘  └────────────────────┘ ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### 5.8 Page Pricing

```
╔══════════════════════════════════════════════════════════════════════════╗
║  Choisissez votre plan                    [Mensuel] / Annuel (−20%)     ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐        ║
║  │ Starter         │   │ ★ Pro           │   │ Agency          │        ║
║  │                 │   │  POPULAIRE      │   │                 │        ║
║  │ 9 €             │   │ 14 €            │   │ 19 €            │        ║
║  │ /logement/mois  │   │ /logement/mois  │   │ /logement/mois  │        ║
║  │                 │   │                 │   │                 │        ║
║  │ ✓ PMS           │   │ Tout Starter +  │   │ Tout Pro +      │        ║
║  │ ✓ Messagerie    │   │ ✓ Portail       │   │ ✓ Multi-users   │        ║
║  │ ✓ Planning ops  │   │   propriétaire  │   │ ✓ API           │        ║
║  │ ✗ Channel mgr   │   │ ✓ Channel mgr   │   │ ✓ Marque blanche│        ║
║  │ ✗ Analytics     │   │ ✓ Analytics     │   │ ✓ Support dédié │        ║
║  │                 │   │ ✓ Pricing auto  │   │ ✓ SLA garanti   │        ║
║  │ [Essai gratuit] │   │ [Essai gratuit] │   │ [Contacter]     │        ║
║  └─────────────────┘   └─────────────────┘   └─────────────────┘        ║
║                                                                          ║
║  Tous les plans incluent 15 jours d'essai gratuit · Sans CB requis      ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 6. Modèle économique & pricing

### 6.1 Structure tarifaire

| Plan | Prix | Cible | Inclus |
|---|---|---|---|
| **Starter** | 9 €/logement/mois | Indépendants 1-5 biens | PMS, messagerie, planning ops |
| **Pro** | 14 €/logement/mois | Agences 6-20 biens | + Portail propriétaire, channel manager, analytics, pricing auto |
| **Agency** | 19 €/logement/mois | Agences >20 biens | + Multi-utilisateurs, API, marque blanche, SLA, support dédié |
| **Freemium** | Gratuit | Découverte | 1 bien, fonctionnalités limitées, sans channel manager |

### 6.2 Projections de revenus

| Scénario | Agences | Biens moyens | Plan | MRR |
|---|---|---|---|---|
| **MVP — 3 mois** | 5 pilotes | 8 | Pro gratuit | 0 € (pilotes) |
| **Lancement — 6 mois** | 10 payants | 10 | Pro | 1 400 €/mois |
| **Croissance — 12 mois** | 30 payants | 12 | Mix Pro/Agency | 6 480 €/mois |
| **Expansion — 24 mois** | 80 payants | 15 | Mix Pro/Agency | ~22 800 €/mois |

### 6.3 Stratégie d'acquisition

- **Phase pilote (mois 1-6) :** 5 agences cooptées manuellement, accès Pro gratuit 12 mois contre retours et témoignage. Critères de sélection : agence avec 5-20 biens actifs, profil tech-friendly, engagée à participer aux sessions de feedback mensuel.
- **Phase lancement (mois 7-12) :** contenus SEO locaux (Paris, Lyon, Bordeaux, Marrakech), présence dans les communautés professionnelles conciergerie, programme de parrainage inter-agences (1 mois offert par parrainage).
- **Phase croissance (mois 13-24) :** partenariats fournisseurs (serrures IoT, linge, ménage), webinaires, salon professionnel RENT (Paris).

---

*Document maintenu dans le dépôt Git du projet — branche `docs/specifications`. Toute modification majeure doit faire l'objet d'une mise à jour de version et d'une note de changement.*

