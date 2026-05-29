# Cahier de test — ConciergeOS

**Version :** 1.0
**Date :** Mai 2026
**Statut :** Référence QA — MVP
**Rédigé par :** Équipe QA ConciergeOS
**Scope :** Tests fonctionnels, tests d'interface, tests de régression

---

## Table des matières

1. [Introduction et méthodologie](#1--introduction-et-méthodologie)
   - 1.1 Objectif du cahier de test
   - 1.2 Périmètre testé / hors périmètre
   - 1.3 Environnements de test
   - 1.4 Comptes de test disponibles
   - 1.5 Niveaux de sévérité des anomalies
   - 1.6 Statuts des cas de test
   - 1.7 Template de fiche d'anomalie
   - 1.8 Instructions d'exécution
2. [Matrice de couverture](#2--matrice-de-couverture)
3. [Tests par module](#3--tests-par-module)
   - Module 01 — Landing Page (TC-001 à TC-010)
   - Module 02 — Authentification (TC-011 à TC-025)
   - Module 03 — Dashboard (TC-026 à TC-040)
   - Module 04 — Gestion des Biens (TC-041 à TC-060)
   - Module 05 — Gestion des Réservations (TC-061 à TC-080)
   - Module 06 — Planning Opérationnel (TC-081 à TC-093)
   - Module 07 — Missions / Tâches (TC-094 à TC-106)
   - Module 08 — Incidents (TC-107 à TC-118)
   - Module 09 — Messagerie (TC-119 à TC-130)
   - Module 10 — Finances (TC-131 à TC-142)
   - Module 11 — Analytics (TC-143 à TC-152)
   - Module 12 — Paramètres (TC-153 à TC-162)
   - Module 13 — Portail Propriétaire (TC-163 à TC-172)
   - Module 14 — Portail Voyageur (TC-173 à TC-182)
   - Module 15 — App Prestataire PWA (TC-183 à TC-192)
   - Module 16 — Tests transversaux (TC-193 à TC-210)
4. [Scénarios de test end-to-end (E2E)](#4--scénarios-de-test-end-to-end-e2e)
5. [Tests de régression](#5--tests-de-régression)
6. [Matrice de tests par rôle](#6--matrice-de-tests-par-rôle)
7. [Fiche d'anomalie — Bug Report Template](#7--fiche-danomalic-bug-report-template)
8. [Tableau de suivi d'exécution](#8--tableau-de-suivi-dexécution)

---

## 1 — Introduction et méthodologie

### 1.1 Objectif du cahier de test

Ce cahier de test constitue le référentiel qualité officiel de la plateforme **ConciergeOS**, SaaS de gestion de conciergerie Airbnb. Il a pour objectifs de :

- Garantir la conformité fonctionnelle de chaque module par rapport aux spécifications produit
- Fournir un cadre structuré et reproductible pour l'exécution des campagnes de test
- Centraliser le suivi des anomalies détectées et de leur résolution
- Servir de base de référence pour les tests de régression lors de chaque déploiement
- Assurer la couverture de tous les parcours utilisateurs critiques (Admin, Manager, Prestataire, Propriétaire, Voyageur)

Le cahier couvre la version MVP de ConciergeOS, dont la stack technique est : **React 18 + Vite + Express.js + SQLite/Drizzle ORM + Tailwind CSS + shadcn/ui**.

---

### 1.2 Périmètre testé / hors périmètre

#### Dans le périmètre

| Domaine | Détail |
|---------|--------|
| Tests fonctionnels | Vérification du comportement de chaque fonctionnalité selon les specs |
| Tests d'interface | Rendu visuel, responsive, dark mode, états UI (chargement, vide, erreur) |
| Tests de régression | Rejouer les cas critiques après chaque déploiement |
| Tests E2E | Parcours utilisateurs complets simulant des scénarios réels |
| Tests de validation de formulaire | Champs obligatoires, formats, contraintes métier |
| Tests de navigation | Liens, redirections, routing protégé |
| Tests multi-rôles | Comportement selon le rôle connecté (Admin, Manager, Prestataire, etc.) |
| Tests de calcul financier | Vérification des formules de commission et de reversement |

#### Hors périmètre (non couvert dans ce document)

| Domaine | Raison d'exclusion |
|---------|-------------------|
| Tests de performance / charge | Couvert par un plan de tests de performance séparé |
| Tests de pénétration / sécurité | Couvert par un audit de sécurité dédié |
| Tests d'accessibilité WCAG | Couvert par un audit accessibilité dédié |
| Tests d'intégration Airbnb/Booking API | Dépendant de la disponibilité des environnements sandbox tiers |
| Tests de synchronisation calendrier (iCal) | Phase post-MVP |
| Tests de paiement Stripe en production | Couvert par les tests Stripe en mode test |
| Tests multi-navigateurs exhaustifs | Vérification sur Chrome, Firefox et Safari uniquement |

---

### 1.3 Environnements de test

| Environnement | URL | Base de données | Usage |
|--------------|-----|-----------------|-------|
| **Local Dev** | `http://localhost:5173` | SQLite locale (dev.db) | Développement et tests unitaires |
| **Staging** | `https://staging.concierge-os.app` | SQLite staging (données de démo) | Validation QA avant release |
| **Production** | `https://app.concierge-os.app` | SQLite production | Tests de fumée post-déploiement uniquement |

> **Important :** Les tests destructifs (suppression, annulation, modification de données critiques) doivent être exécutés exclusivement sur les environnements **Local Dev** ou **Staging**. L'environnement de Production ne doit faire l'objet que de tests de fumée non destructifs.

---

### 1.4 Comptes de test disponibles

Les comptes suivants sont préconfigurés dans la base de données de démo (environnements Dev et Staging) :

| Rôle | Prénom Nom | Email | Mot de passe | Périmètre |
|------|-----------|-------|-------------|-----------|
| **Admin** | Sophie Martin | `admin@concierge-paris.fr` | `Demo2026!` | Accès complet à toute l'agence |
| **Manager** | Pierre Durand | `manager@concierge-paris.fr` | `Demo2026!` | Gestion opérationnelle (sans paramètres financiers) |
| **Prestataire** | Fatima Benali | `prestataire@concierge-paris.fr` | `Demo2026!` | App prestataire uniquement |
| **Propriétaire** | Jean-Luc Rousseau | `proprio@concierge-paris.fr` | `Demo2026!` | Portail propriétaire (ses biens uniquement) |
| **Voyageur** | *(accès sans compte)* | Token dans l'URL | *(sans mot de passe)* | Portail voyageur via lien magique |

**Agence de démo :** Conciergerie Paris Elite
**Biens de démo disponibles :**
- Villa Les Pins — Cannes (06)
- Appartement Montmartre — Paris 18e
- Studio Canal — Paris 10e
- Appartement Marais — Paris 4e

---

### 1.5 Niveaux de sévérité des anomalies

| Niveau | Symbole | Description | Délai de résolution cible |
|--------|---------|-------------|--------------------------|
| **Bloquant** | 🔴 | Empêche complètement l'utilisation de la fonctionnalité ou de l'application. Aucun contournement possible. Exemple : impossible de se connecter, crash à l'ouverture d'une page. | Immédiat — bloque la release |
| **Majeur** | 🟠 | Fonctionnalité principale défaillante mais l'application reste partiellement utilisable. Un contournement peut exister. Exemple : calcul de commission erroné, tâche impossible à créer. | Avant la prochaine release |
| **Mineur** | 🟡 | Fonctionnalité secondaire dégradée ou comportement inattendu sans impact critique sur l'usage. Exemple : filtre qui ne se réinitialise pas, message de confirmation absent. | Sprint suivant |
| **Cosmétique** | 🟢 | Problème visuel sans impact fonctionnel. L'application fonctionne correctement mais l'affichage est imparfait. Exemple : alignement décalé, couleur incorrecte, typo dans un label. | Backlog — planifié |

---

### 1.6 Statuts des cas de test

| Statut | Symbole | Signification |
|--------|---------|---------------|
| **Passé** | ✅ | Le cas de test a été exécuté et le résultat obtenu correspond au résultat attendu |
| **Échoué** | ❌ | Le cas de test a été exécuté mais le résultat obtenu ne correspond pas au résultat attendu — une fiche d'anomalie doit être créée |
| **Ignoré** | ⏭️ | Le cas de test n'a pas été exécuté (fonctionnalité non disponible, dépendance bloquante, hors scope de la campagne) |
| **En cours** | 🔄 | Le cas de test est en cours d'exécution ou nécessite une investigation complémentaire |

---

### 1.7 Template de fiche d'anomalie (bug report)

```markdown
## BUG-XXX — Titre court et descriptif

**Date :** JJ/MM/AAAA
**Testeur :** Prénom Nom
**Environnement :** local / staging / production
**Version :** 1.0.0
**Navigateur :** Chrome 125 / Firefox 126 / Safari 17 / Mobile Chrome
**Cas de test associé :** TC-XXX

### Description
Description claire et concise du problème observé.

### Étapes pour reproduire
1. Se connecter avec le compte admin@concierge-paris.fr
2. Naviguer vers [module concerné]
3. Effectuer [action précise]

### Résultat obtenu
Ce qui s'est passé réellement (captures d'écran à joindre).

### Résultat attendu
Ce qui aurait dû se passer selon les spécifications.

### Sévérité
🔴 Bloquant / 🟠 Majeur / 🟡 Mineur / 🟢 Cosmétique

### Captures d'écran / vidéo
[joindre ici]

### Logs (console, réseau)
```
[coller ici les erreurs console ou les réponses API en erreur]
```

### Notes additionnelles
Contexte supplémentaire, fréquence de reproduction, contournement éventuel.
```

---

### 1.8 Instructions d'exécution

#### Prérequis avant de démarrer une campagne de test

1. **Réinitialiser la base de données de démo** : exécuter `npm run db:seed` pour rétablir un état connu
2. **Vérifier que le serveur est opérationnel** : s'assurer que le frontend (`:5173`) et le backend (`:3000`) sont démarrés
3. **Ouvrir les outils de développement** : garder la console et l'onglet Réseau ouverts pour surveiller les erreurs
4. **Sélectionner le navigateur cible** : commencer par Chrome, puis reproduire sur Firefox et Safari
5. **Préparer un tableur de suivi** : utiliser le tableau de la Section 8 pour noter les résultats au fur et à mesure

#### Ordre d'exécution recommandé

1. Tests d'authentification (TC-011 à TC-025) — prérequis de tous les autres
2. Tests du Dashboard (TC-026 à TC-040) — validation du point d'entrée principal
3. Tests des modules métier dans l'ordre des modules 04 à 11
4. Tests des portails externes (modules 13, 14, 15)
5. Tests transversaux (module 16)
6. Scénarios E2E en fin de campagne

#### Règles de signalement

- Tout cas ❌ Échoué doit immédiatement faire l'objet d'une **fiche BUG** dans l'outil de suivi (Jira / Linear / GitHub Issues)
- Les cas **Bloquants** doivent être signalés au Lead Dev dans l'heure
- Les captures d'écran sont **obligatoires** pour tout bug Bloquant ou Majeur
- Ne pas bloquer l'exécution sur un cas ignoré : le noter ⏭️ et poursuivre

---

## 2 — Matrice de couverture

| Module | Nb cas de test | 🔴 Critique | 🟠 Haute | 🟡 Moyenne | 🟢 Basse |
|--------|---------------|------------|---------|-----------|---------|
| 01 — Landing Page | 10 | 1 | 4 | 4 | 1 |
| 02 — Authentification | 15 | 5 | 6 | 3 | 1 |
| 03 — Dashboard | 15 | 5 | 6 | 3 | 1 |
| 04 — Gestion des Biens | 20 | 4 | 8 | 6 | 2 |
| 05 — Gestion des Réservations | 20 | 5 | 8 | 5 | 2 |
| 06 — Planning Opérationnel | 13 | 3 | 5 | 4 | 1 |
| 07 — Missions / Tâches | 13 | 3 | 5 | 4 | 1 |
| 08 — Incidents | 12 | 3 | 5 | 3 | 1 |
| 09 — Messagerie | 12 | 3 | 5 | 3 | 1 |
| 10 — Finances | 12 | 4 | 5 | 2 | 1 |
| 11 — Analytics | 10 | 2 | 4 | 3 | 1 |
| 12 — Paramètres | 10 | 2 | 4 | 3 | 1 |
| 13 — Portail Propriétaire | 10 | 3 | 4 | 2 | 1 |
| 14 — Portail Voyageur | 10 | 4 | 4 | 2 | 0 |
| 15 — App Prestataire PWA | 10 | 3 | 4 | 2 | 1 |
| 16 — Tests transversaux | 18 | 3 | 7 | 6 | 2 |
| **TOTAL** | **210** | **53** | **84** | **55** | **18** |

---

## 3 — Tests par module

---

### MODULE 01 — Landing Page

---

#### TC-001 — Affichage correct de la page d'accueil

**Module :** Landing Page
**Priorité :** 🔴 Critique
**Préconditions :** L'application est démarrée. L'utilisateur n'est pas connecté.
**Données de test :** URL `http://localhost:5173/`

**Étapes :**
1. Ouvrir un navigateur en navigation privée
2. Naviguer vers `http://localhost:5173/`
3. Attendre le chargement complet de la page

**Résultat attendu :** La landing page s'affiche sans erreur. Le titre principal "ConciergeOS" est visible. La section hero, la section fonctionnalités et la section tarification sont présentes. Aucune erreur console de type `Error` ou `Warning` critique n'est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier également que le favicon s'affiche dans l'onglet du navigateur.

---

#### TC-002 — Navigation vers la page pricing

**Module :** Landing Page
**Priorité :** 🟠 Haute
**Préconditions :** La landing page est affichée (TC-001 passé).
**Données de test :** Lien "Tarifs" dans le menu de navigation

**Étapes :**
1. Depuis la landing page, repérer le menu de navigation principal
2. Cliquer sur le lien "Tarifs" (ou "Pricing")
3. Observer le défilement ou la redirection

**Résultat attendu :** La page défile jusqu'à la section de tarification OU navigue vers `/pricing`. La section affichant les 3 plans tarifaires est visible à l'écran. L'URL est mise à jour en conséquence.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier le comportement sur ancre (#pricing) vs route dédiée.

---

#### TC-003 — Affichage des 3 plans tarifaires (Starter, Pro, Agency)

**Module :** Landing Page
**Priorité :** 🟠 Haute
**Préconditions :** La section pricing est visible.
**Données de test :** Plans attendus : Starter (29€/mois), Pro (79€/mois), Agency (149€/mois)

**Étapes :**
1. Naviguer vers la section Tarifs de la landing page
2. Identifier visuellement les 3 cartes de plan tarifaire
3. Vérifier le nom de chaque plan
4. Vérifier le prix affiché pour chaque plan
5. Vérifier que chaque plan liste ses fonctionnalités incluses

**Résultat attendu :** 3 cartes sont affichées côte à côte : **Starter**, **Pro**, **Agency**. Chaque carte affiche un nom, un prix mensuel, une liste de fonctionnalités et un bouton d'action. Le plan recommandé (Pro) est mis en évidence visuellement (badge, couleur de fond distincte).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-004 — Toggle mensuel/annuel sur le pricing (-20%)

**Module :** Landing Page
**Priorité :** 🟠 Haute
**Préconditions :** La section pricing est visible avec le toggle mensuel/annuel.
**Données de test :** Réduction annuelle attendue : -20% sur tous les plans

**Étapes :**
1. Vérifier que le toggle est positionné sur "Mensuel" par défaut
2. Relever les prix affichés en mode mensuel (ex : Starter 29€, Pro 79€, Agency 149€)
3. Cliquer sur le toggle pour passer en mode "Annuel"
4. Vérifier que les prix sont recalculés avec -20%
5. Repasser en mode "Mensuel" et vérifier que les prix initiaux reviennent

**Résultat attendu :** En mode annuel, les prix affichés sont réduits de 20% (ex : Starter ≈ 23€/mois, Pro ≈ 63€/mois, Agency ≈ 119€/mois). Le toggle bascule visuellement entre les deux états. Un label "Économisez 20%" ou équivalent est affiché.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier le calcul exact : prix_annuel = prix_mensuel × 0.8

---

#### TC-005 — CTA "Essai gratuit 15 jours" redirige vers /register

**Module :** Landing Page
**Priorité :** 🔴 Critique
**Préconditions :** La landing page est affichée. L'utilisateur n'est pas connecté.
**Données de test :** Bouton CTA principal dans la section hero

**Étapes :**
1. Repérer le bouton principal "Essai gratuit 15 jours" (ou "Démarrer gratuitement") dans la section hero
2. Cliquer sur ce bouton
3. Observer la navigation

**Résultat attendu :** L'utilisateur est redirigé vers la page `/register` (ou `/inscription`). La page d'inscription est chargée sans erreur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier également les CTA secondaires dans les cartes de pricing.

---

#### TC-006 — CTA "Voir la démo" fonctionne

**Module :** Landing Page
**Priorité :** 🟠 Haute
**Préconditions :** La landing page est affichée.
**Données de test :** Bouton "Voir la démo" dans la section hero ou la navigation

**Étapes :**
1. Repérer le bouton "Voir la démo"
2. Cliquer dessus
3. Observer le comportement (ouverture d'une modale vidéo, navigation vers /demo, ou connexion en mode démo)

**Résultat attendu :** Selon l'implémentation : (a) une modale s'ouvre avec une vidéo de démonstration, OU (b) l'utilisateur est connecté automatiquement avec un compte démo et redirigé vers le dashboard, OU (c) l'utilisateur est redirigé vers une page `/demo`. L'action est complète et sans erreur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Documenter le comportement exact de l'implémentation.

---

#### TC-007 — Affichage des statistiques (230 agences, 4.9/5, etc.)

**Module :** Landing Page
**Priorité :** 🟡 Moyenne
**Préconditions :** La landing page est affichée.
**Données de test :** Chiffres clés attendus : 230+ agences, note 4.9/5, 15 000+ réservations gérées

**Étapes :**
1. Identifier la section de statistiques / chiffres clés sur la landing page
2. Vérifier la présence et la lisibilité de chaque chiffre
3. Vérifier que les icônes ou illustrations associées s'affichent correctement

**Résultat attendu :** Les statistiques principales sont affichées clairement : nombre d'agences clientes, note de satisfaction, volume de réservations gérées. Les chiffres sont lisibles, correctement formatés et accompagnés de leur unité ou label.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-008 — Affichage correct sur mobile (responsive)

**Module :** Landing Page
**Priorité :** 🟠 Haute
**Préconditions :** La landing page est accessible.
**Données de test :** Viewport 375px × 812px (iPhone 14 Pro simulation)

**Étapes :**
1. Ouvrir les DevTools du navigateur
2. Activer le mode responsive et sélectionner "iPhone 14 Pro" (375×812)
3. Recharger la page
4. Faire défiler la page de haut en bas
5. Vérifier chaque section : hero, fonctionnalités, pricing, statistiques, footer

**Résultat attendu :** Toutes les sections s'affichent correctement sans débordement horizontal. Le texte est lisible sans zoom nécessaire. Les 3 cartes de pricing sont empilées verticalement. Les boutons CTA occupent toute la largeur ou sont suffisamment larges. Le menu de navigation est remplacé par un menu hamburger.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier aussi sur 768px (tablette).

---

#### TC-009 — Navigation header (logo, liens)

**Module :** Landing Page
**Priorité :** 🟡 Moyenne
**Préconditions :** La landing page est affichée sur desktop (≥ 1280px).
**Données de test :** Liens attendus dans le header : Logo, Fonctionnalités, Tarifs, À propos, Connexion, Essai gratuit

**Étapes :**
1. Observer le header de la landing page
2. Vérifier que le logo ConciergeOS est affiché
3. Cliquer sur le logo et vérifier qu'il ramène vers `/` ou le haut de page
4. Vérifier la présence de chaque lien de navigation
5. Cliquer sur "Connexion" et vérifier la redirection vers `/login`

**Résultat attendu :** Le logo est visible et cliquable. Tous les liens de navigation sont présents et fonctionnels. Le lien "Connexion" redirige vers la page d'authentification. Le header est fixe (sticky) lors du défilement.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-010 — Footer avec liens légaux

**Module :** Landing Page
**Priorité :** 🟡 Moyenne
**Préconditions :** La landing page est affichée.
**Données de test :** Liens attendus : Mentions légales, CGU, Politique de confidentialité, Contact

**Étapes :**
1. Faire défiler jusqu'en bas de la landing page
2. Identifier la section footer
3. Vérifier la présence des liens légaux
4. Cliquer sur "Mentions légales" et vérifier l'ouverture
5. Cliquer sur "Politique de confidentialité" et vérifier l'ouverture
6. Vérifier la présence du copyright (ex : © 2026 ConciergeOS)

**Résultat attendu :** Le footer contient les liens : Mentions légales, CGU, Politique de confidentialité, Contact. Chaque lien est cliquable et mène vers la page correspondante. Le copyright est affiché avec l'année en cours. Le footer contient le logo ou le nom de la marque.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 02 — Authentification

---

#### TC-011 — Accès à la page de connexion

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** L'application est démarrée. L'utilisateur n'est pas connecté.
**Données de test :** URL `http://localhost:5173/login`

**Étapes :**
1. Naviguer vers `http://localhost:5173/login`
2. Observer le chargement de la page

**Résultat attendu :** La page de connexion s'affiche avec : un champ "Email", un champ "Mot de passe" (masqué), un bouton "Se connecter", un lien "Mot de passe oublié", un lien vers la page d'inscription. Le logo ConciergeOS est visible. Aucune erreur console.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-012 — Connexion avec email/mot de passe valides (mode démo)

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** La page de connexion est affichée (TC-011 passé).
**Données de test :** Email : `admin@concierge-paris.fr` / Mot de passe : `Demo2026!`

**Étapes :**
1. Saisir `admin@concierge-paris.fr` dans le champ Email
2. Saisir `Demo2026!` dans le champ Mot de passe
3. Cliquer sur le bouton "Se connecter"
4. Attendre la réponse de l'API

**Résultat attendu :** L'utilisateur est authentifié avec succès et redirigé vers `/dashboard`. Le nom de l'agence "Conciergerie Paris Elite" et le nom de l'utilisateur "Sophie Martin" sont affichés dans le header ou la sidebar. Un token de session est stocké (localStorage ou cookie).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier aussi la connexion avec le compte manager et prestataire.

---

#### TC-013 — Connexion avec email invalide (format)

**Module :** Authentification
**Priorité :** 🟠 Haute
**Préconditions :** La page de connexion est affichée.
**Données de test :** Email : `admin@` (format invalide) / Mot de passe : `Demo2026!`

**Étapes :**
1. Saisir `admin@` dans le champ Email
2. Saisir `Demo2026!` dans le champ Mot de passe
3. Cliquer sur le bouton "Se connecter"
4. Observer le message d'erreur

**Résultat attendu :** La soumission est bloquée côté client (validation HTML5 ou React Hook Form). Un message d'erreur est affiché sous le champ Email : "Format d'email invalide" ou équivalent. Aucune requête API n'est envoyée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Tester également : "adminexemple.fr", "admin @exemple.fr" (avec espace).

---

#### TC-014 — Connexion avec mot de passe vide

**Module :** Authentification
**Priorité :** 🟠 Haute
**Préconditions :** La page de connexion est affichée.
**Données de test :** Email : `admin@concierge-paris.fr` / Mot de passe : *(vide)*

**Étapes :**
1. Saisir `admin@concierge-paris.fr` dans le champ Email
2. Laisser le champ Mot de passe vide
3. Cliquer sur le bouton "Se connecter"

**Résultat attendu :** La soumission est bloquée. Un message d'erreur s'affiche sous le champ Mot de passe : "Le mot de passe est obligatoire" ou équivalent. Le bouton "Se connecter" peut être désactivé si les champs sont vides.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-015 — Affichage du message d'erreur en cas d'échec

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** La page de connexion est affichée.
**Données de test :** Email : `admin@concierge-paris.fr` / Mot de passe : `MauvaisMotDePasse!`

**Étapes :**
1. Saisir `admin@concierge-paris.fr` dans le champ Email
2. Saisir `MauvaisMotDePasse!` dans le champ Mot de passe
3. Cliquer sur le bouton "Se connecter"
4. Attendre la réponse de l'API (401 Unauthorized)

**Résultat attendu :** Un message d'erreur s'affiche : "Email ou mot de passe incorrect" (ou équivalent). Le message ne doit PAS préciser lequel est incorrect (sécurité). L'utilisateur reste sur la page de connexion. Le champ mot de passe est vidé.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier que le message n'indique pas "utilisateur inexistant" vs "mauvais mot de passe".

---

#### TC-016 — Accès à la page d'inscription

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur n'est pas connecté.
**Données de test :** URL `http://localhost:5173/register`

**Étapes :**
1. Naviguer vers `http://localhost:5173/register`
2. Observer le chargement de la page

**Résultat attendu :** La page d'inscription s'affiche avec les champs : Nom de l'agence, Prénom, Nom, Email, Mot de passe, Confirmation du mot de passe. Un bouton "Créer mon compte" est présent. Un lien vers la page de connexion est disponible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-017 — Inscription avec tous les champs valides

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** La page d'inscription est affichée. L'email utilisé n'existe pas encore en base.
**Données de test :** Agence : "Conciergerie Lyon Sud", Prénom : "Claire", Nom : "Dupont", Email : `claire.dupont.test@gmail.com`, Mot de passe : `TestQA2026!`, Confirmation : `TestQA2026!`

**Étapes :**
1. Remplir le champ "Nom de l'agence" avec "Conciergerie Lyon Sud"
2. Remplir le champ "Prénom" avec "Claire"
3. Remplir le champ "Nom" avec "Dupont"
4. Remplir le champ "Email" avec `claire.dupont.test@gmail.com`
5. Remplir le champ "Mot de passe" avec `TestQA2026!`
6. Remplir le champ "Confirmation" avec `TestQA2026!`
7. Cliquer sur "Créer mon compte"

**Résultat attendu :** Le compte est créé. L'utilisateur est redirigé vers le dashboard (ou vers une page de confirmation). Un toast de bienvenue s'affiche : "Bienvenue sur ConciergeOS !" ou équivalent. L'essai gratuit de 15 jours est activé.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Réinitialiser la base après ce test pour éviter les conflits.

---

#### TC-018 — Inscription avec email déjà utilisé

**Module :** Authentification
**Priorité :** 🟠 Haute
**Préconditions :** Le compte `admin@concierge-paris.fr` existe en base.
**Données de test :** Email : `admin@concierge-paris.fr`

**Étapes :**
1. Accéder à la page d'inscription
2. Remplir tous les champs avec des données valides, en utilisant l'email `admin@concierge-paris.fr`
3. Cliquer sur "Créer mon compte"

**Résultat attendu :** L'API retourne une erreur 409 (Conflict). Un message d'erreur s'affiche : "Un compte existe déjà avec cet email" ou équivalent. L'utilisateur reste sur la page d'inscription avec ses données conservées.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-019 — Inscription avec mot de passe trop court

**Module :** Authentification
**Priorité :** 🟠 Haute
**Préconditions :** La page d'inscription est affichée.
**Données de test :** Mot de passe : `abc` (3 caractères, minimum attendu : 8)

**Étapes :**
1. Remplir tous les champs de manière valide
2. Saisir `abc` dans le champ "Mot de passe"
3. Saisir `abc` dans le champ "Confirmation"
4. Cliquer sur "Créer mon compte"

**Résultat attendu :** La validation bloque la soumission. Un message d'erreur s'affiche sous le champ Mot de passe : "Le mot de passe doit contenir au moins 8 caractères" (ou la règle exacte définie). Aucune requête API n'est émise.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-020 — Validation des champs obligatoires (inscription)

**Module :** Authentification
**Priorité :** 🟠 Haute
**Préconditions :** La page d'inscription est affichée avec tous les champs vides.
**Données de test :** Formulaire vide

**Étapes :**
1. Ne remplir aucun champ du formulaire d'inscription
2. Cliquer directement sur "Créer mon compte"
3. Observer les messages de validation

**Résultat attendu :** Des messages d'erreur s'affichent sous chaque champ obligatoire vide. Les messages indiquent clairement quel champ est requis. Le bouton ne déclenche aucun appel API. Au moins les champs Email, Mot de passe et Nom de l'agence sont marqués en erreur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-021 — Lien "Mot de passe oublié"

**Module :** Authentification
**Priorité :** 🟡 Moyenne
**Préconditions :** La page de connexion est affichée.
**Données de test :** Lien "Mot de passe oublié" sur la page de connexion

**Étapes :**
1. Repérer le lien "Mot de passe oublié ?" sur la page de connexion
2. Cliquer sur ce lien
3. Observer la navigation

**Résultat attendu :** L'utilisateur est redirigé vers une page de réinitialisation de mot de passe (`/forgot-password`) OU une modale s'ouvre avec un champ email. Un message explicatif indique la procédure à suivre.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Si la fonctionnalité n'est pas implémentée dans le MVP, le statut doit être ⏭️.

---

#### TC-022 — Option lien magique (magic link)

**Module :** Authentification
**Priorité :** 🟡 Moyenne
**Préconditions :** La page de connexion est affichée. L'option "Magic Link" est disponible.
**Données de test :** Email : `admin@concierge-paris.fr`

**Étapes :**
1. Repérer l'option "Se connecter avec un lien magique" sur la page de connexion
2. Cliquer sur cette option
3. Saisir `admin@concierge-paris.fr`
4. Valider l'envoi du lien

**Résultat attendu :** Un message de confirmation s'affiche : "Un lien de connexion a été envoyé à admin@concierge-paris.fr". La page indique à l'utilisateur de consulter sa boîte email. (La livraison effective de l'email n'est pas testée ici.)
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** En environnement de dev, vérifier dans les logs serveur que l'email serait envoyé.

---

#### TC-023 — Déconnexion depuis le menu utilisateur

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur est connecté en tant que `admin@concierge-paris.fr`.
**Données de test :** Menu utilisateur dans le header ou la sidebar

**Étapes :**
1. Depuis n'importe quelle page de l'application (ex : Dashboard)
2. Cliquer sur l'avatar ou le nom de l'utilisateur dans le header
3. Dans le menu déroulant, cliquer sur "Déconnexion" (ou "Se déconnecter")
4. Observer la navigation

**Résultat attendu :** La session est terminée. Le token est supprimé du localStorage/cookie. L'utilisateur est redirigé vers la page `/login`. Toute tentative de navigation vers une page protégée redirige vers `/login`.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-024 — Redirection vers /login si non authentifié

**Module :** Authentification
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur n'est pas connecté (session expirée ou navigation privée).
**Données de test :** URLs protégées : `/dashboard`, `/properties`, `/bookings`

**Étapes :**
1. Ouvrir un navigateur en navigation privée (aucune session active)
2. Saisir directement l'URL `http://localhost:5173/dashboard`
3. Observer la navigation
4. Répéter avec `/properties` et `/bookings`

**Résultat attendu :** L'utilisateur est automatiquement redirigé vers `/login` pour chaque URL protégée tentée. La page de login s'affiche. L'URL cible peut être conservée en paramètre (`?redirect=/dashboard`) pour redirection post-connexion.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier toutes les routes protégées.

---

#### TC-025 — Persistance de session après rechargement

**Module :** Authentification
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur vient de se connecter en tant que `admin@concierge-paris.fr` et est sur le dashboard.
**Données de test :** Rechargement complet de la page (F5 ou Ctrl+R)

**Étapes :**
1. Se connecter avec `admin@concierge-paris.fr` / `Demo2026!`
2. Vérifier que le dashboard est affiché
3. Appuyer sur F5 pour recharger la page
4. Attendre le chargement complet

**Résultat attendu :** Après le rechargement, l'utilisateur est toujours connecté et le dashboard s'affiche. Aucune redirection vers `/login` n'a lieu. Le nom et les données de l'agence sont toujours présents.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier la durée de validité du token (ex : 7 jours).

---

### MODULE 03 — Dashboard

---

#### TC-026 — Affichage du dashboard après connexion

**Module :** Dashboard
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur s'est connecté avec `admin@concierge-paris.fr`.
**Données de test :** Données de démo de l'agence "Conciergerie Paris Elite"

**Étapes :**
1. Se connecter avec `admin@concierge-paris.fr` / `Demo2026!`
2. Observer la page qui s'affiche après la connexion
3. Vérifier la présence de tous les éléments du dashboard

**Résultat attendu :** Le dashboard s'affiche à `/dashboard`. Les éléments suivants sont présents : KPI cards (taux d'occupation, RevPAR, note moyenne, incidents actifs), la liste des arrivées du jour, la liste des tâches en attente, les alertes urgentes. La sidebar de navigation est visible. Aucune erreur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-027 — Affichage du taux d'occupation (%)

**Module :** Dashboard
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur est connecté. Des données de réservation existent en base.
**Données de test :** Taux d'occupation attendu : environ 78% (données démo)

**Étapes :**
1. Depuis le dashboard, identifier la KPI card "Taux d'occupation"
2. Vérifier la valeur affichée
3. Vérifier que la valeur est un pourcentage entre 0% et 100%
4. Vérifier la présence d'un indicateur de tendance (flèche haut/bas, variation vs mois précédent)

**Résultat attendu :** La KPI card "Taux d'occupation" affiche un pourcentage cohérent avec les données de démo (environ 78%). Un indicateur de tendance est visible. L'unité "%" est affichée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-028 — Affichage du RevPAR (€)

**Module :** Dashboard
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur est connecté. Des données de réservation existent en base.
**Données de test :** RevPAR attendu : environ 124€ (données démo)

**Étapes :**
1. Identifier la KPI card "RevPAR" sur le dashboard
2. Vérifier la valeur affichée
3. Vérifier le format : nombre avec symbole "€"
4. Vérifier la présence d'un indicateur de variation

**Résultat attendu :** La KPI card "RevPAR" affiche une valeur en euros (ex : "124 €"). La valeur est cohérente (positive, réaliste pour de la location courte durée). Un indicateur de tendance mensuelle est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** RevPAR = Revenu total / Nombre de nuits disponibles.

---

#### TC-029 — Affichage de la note moyenne (étoiles)

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté. Des notes voyageurs existent en base.
**Données de test :** Note attendue : 4.8/5 (données démo)

**Étapes :**
1. Identifier la KPI card "Note moyenne" sur le dashboard
2. Vérifier la valeur numérique affichée (ex : "4.8")
3. Vérifier la présence d'étoiles visuelles ou d'une icône étoile
4. Vérifier que la valeur est sur 5

**Résultat attendu :** La KPI card "Note moyenne" affiche "4.8" (ou valeur démo) avec une représentation visuelle étoilée. La valeur est comprise entre 0.0 et 5.0.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-030 — Affichage du nombre d'incidents actifs

**Module :** Dashboard
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur est connecté. Au moins un incident est ouvert en base.
**Données de test :** 3 incidents actifs dans les données de démo

**Étapes :**
1. Identifier la KPI card "Incidents actifs" sur le dashboard
2. Vérifier le nombre affiché
3. Si le nombre est > 0, vérifier la couleur d'alerte (rouge ou orange)

**Résultat attendu :** La KPI card "Incidents actifs" affiche le nombre correct d'incidents ouverts (non clôturés). Si des incidents urgents existent, la card est mise en évidence visuellement (couleur d'alerte). Un clic sur la card navigue vers le module Incidents.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-031 — Liste des arrivées du jour

**Module :** Dashboard
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur est connecté. Des réservations avec check-in = aujourd'hui existent en base.
**Données de test :** Date du test = date courante. Réservation : Thomas Leclerc, Appartement Montmartre, check-in aujourd'hui.

**Étapes :**
1. Identifier la section "Arrivées du jour" sur le dashboard
2. Vérifier que les réservations dont le check-in est aujourd'hui sont listées
3. Pour chaque réservation, vérifier les informations affichées : nom du voyageur, nom du bien, heure d'arrivée estimée

**Résultat attendu :** La section "Arrivées du jour" liste toutes les réservations avec check-in = date du jour. Pour chaque arrivée : nom du voyageur, bien concerné, heure d'arrivée (si disponible), statut (ménage OK, code envoyé).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Si aucune arrivée aujourd'hui, vérifier TC-202 (état vide).

---

#### TC-032 — Affichage des statuts d'arrivée (ménage OK, code envoyé)

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** TC-031 passé. Des arrivées du jour sont listées.
**Données de test :** Réservation Thomas Leclerc (ménage validé, code non encore envoyé)

**Étapes :**
1. Dans la section "Arrivées du jour", observer les indicateurs de statut
2. Vérifier la présence du badge "Ménage OK" (vert) si la tâche ménage est terminée
3. Vérifier la présence du badge "Code envoyé" (vert) si le code d'accès a été transmis
4. Vérifier l'absence ou la couleur différente si un statut est manquant

**Résultat attendu :** Chaque arrivée affiche des badges de statut clairs et colorés : ✅ Ménage OK (vert), ✅ Code envoyé (vert), ou ⚠️ Ménage en attente (orange/rouge). Les badges reflètent l'état réel en base de données.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-033 — Liste des tâches en attente

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté. Des tâches avec statut "À faire" ou "En retard" existent en base.
**Données de test :** Tâches démo : ménage Villa Les Pins (aujourd'hui 10h00), check-in Studio Canal (14h00)

**Étapes :**
1. Identifier la section "Tâches en attente" sur le dashboard
2. Vérifier que les tâches non terminées sont listées
3. Vérifier les informations par tâche : type, bien, prestataire, heure
4. Vérifier que les tâches en retard sont signalées différemment

**Résultat attendu :** Les tâches avec statut "À faire" et "En retard" sont listées, triées par urgence ou par heure. Chaque tâche affiche : type de mission, bien concerné, nom du prestataire, heure planifiée. Les tâches en retard ont un badge rouge "En retard".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-034 — Carte d'incident urgent (alerte rouge)

**Module :** Dashboard
**Priorité :** 🔴 Critique
**Préconditions :** Au moins un incident avec sévérité "Urgent" et statut "Ouvert" existe en base.
**Données de test :** Incident urgent : "Fuite d'eau salle de bain" — Villa Les Pins, créé il y a 2h

**Étapes :**
1. Identifier la section des alertes ou incidents sur le dashboard
2. Vérifier la présence d'une carte ou bannière spécifique pour les incidents urgents
3. Vérifier l'affichage en rouge ou avec une icône d'alerte (⚠️ ou 🔴)
4. Vérifier les informations affichées : titre, bien, ancienneté

**Résultat attendu :** L'incident urgent "Fuite d'eau salle de bain" est mis en évidence avec une couleur rouge ou orange vif. Une icône d'alerte est visible. Un lien vers le détail de l'incident est présent. Si plusieurs incidents urgents existent, tous sont listés ou le nombre est indiqué.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-035 — Navigation vers détail réservation depuis dashboard

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** La section "Arrivées du jour" affiche au moins une réservation.
**Données de test :** Réservation Thomas Leclerc, Appartement Montmartre

**Étapes :**
1. Dans la section "Arrivées du jour", cliquer sur le nom du voyageur ou le nom du bien de la réservation
2. Observer la navigation

**Résultat attendu :** L'utilisateur est redirigé vers la fiche détail de la réservation (`/bookings/:id`). La fiche 360° de la réservation s'affiche avec toutes ses informations.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-036 — Navigation vers détail tâche depuis dashboard

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** La section "Tâches en attente" affiche au moins une tâche.
**Données de test :** Tâche : ménage Appartement Montmartre, Fatima Benali, 10h00

**Étapes :**
1. Dans la section "Tâches en attente", cliquer sur une tâche
2. Observer la navigation

**Résultat attendu :** L'utilisateur est redirigé vers le détail de la tâche (`/tasks/:id`) OU une modale de détail s'ouvre. Les informations complètes de la mission sont affichées.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-037 — Affichage du nom de l'agence et de l'utilisateur

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur `admin@concierge-paris.fr` est connecté.
**Données de test :** Agence : "Conciergerie Paris Elite", Utilisateur : "Sophie Martin"

**Étapes :**
1. Depuis le dashboard, observer le header de l'application
2. Vérifier l'affichage du nom de l'agence
3. Vérifier l'affichage du nom ou de l'initiale de l'utilisateur connecté

**Résultat attendu :** Le nom de l'agence "Conciergerie Paris Elite" est affiché dans le header ou la sidebar. Le nom "Sophie Martin" (ou ses initiales "SM") est visible dans la zone utilisateur du header.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-038 — Bouton de rafraîchissement des données

**Module :** Dashboard
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est connecté sur le dashboard.
**Données de test :** Bouton de rafraîchissement (icône ↻ ou "Actualiser")

**Étapes :**
1. Identifier le bouton de rafraîchissement sur le dashboard (si présent)
2. Cliquer sur ce bouton
3. Observer le comportement (indicateur de chargement, mise à jour des données)

**Résultat attendu :** Un indicateur de chargement apparaît brièvement. Les données du dashboard sont rechargées depuis l'API. Un toast ou un indicateur "Mis à jour il y a X secondes" est affiché.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Si absent, marquer ⏭️ et noter comme suggestion d'amélioration.

---

#### TC-039 — Affichage correct en dark mode

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté. Le dark mode est activé (TC-193).
**Données de test :** Toggle dark mode activé depuis le header

**Étapes :**
1. Activer le dark mode depuis le bouton de bascule dans le header
2. Vérifier le dashboard en mode sombre
3. Vérifier la lisibilité des KPI cards (texte clair sur fond sombre)
4. Vérifier la lisibilité des badges de statut
5. Vérifier que les graphiques ou indicateurs sont visibles

**Résultat attendu :** Toutes les sections du dashboard s'affichent correctement en dark mode. Le texte est lisible (contraste suffisant). Les couleurs des badges et alertes sont adaptées au mode sombre. Aucun texte noir sur fond noir ou blanc sur blanc.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-040 — Responsive mobile du dashboard

**Module :** Dashboard
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté.
**Données de test :** Viewport 375px × 812px (iPhone 14 Pro)

**Étapes :**
1. Activer le mode responsive (375×812) dans les DevTools
2. Recharger le dashboard
3. Vérifier l'affichage des KPI cards (empilées verticalement)
4. Vérifier la lisibilité des sections (arrivées, tâches, incidents)
5. Vérifier que la sidebar est remplacée par un menu hamburger

**Résultat attendu :** Le dashboard s'affiche correctement sur mobile. Les KPI cards sont empilées sur une colonne. Aucun débordement horizontal. Le contenu est lisible sans zoom. La navigation hamburger est fonctionnelle.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 04 — Gestion des Biens

---

#### TC-041 — Affichage de la liste des biens

**Module :** Gestion des Biens
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des biens existent en base.
**Données de test :** Biens démo : Villa Les Pins, Appartement Montmartre, Studio Canal, Appartement Marais

**Étapes :**
1. Naviguer vers `/properties` depuis la sidebar
2. Attendre le chargement de la liste

**Résultat attendu :** La liste des biens s'affiche avec les 4 biens de démo. Chaque bien est représenté par une carte ou une ligne de tableau. La page affiche le titre "Biens" ou "Mes biens". Le nombre total de biens est indiqué.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-042 — Informations affichées par bien (nom, ville, type, capacité, statut)

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** TC-041 passé. La liste des biens est affichée.
**Données de test :** Bien : "Villa Les Pins", Cannes, Villa, 8 personnes, Actif

**Étapes :**
1. Identifier la fiche de la "Villa Les Pins" dans la liste
2. Vérifier la présence du nom du bien
3. Vérifier la présence de la ville (Cannes)
4. Vérifier la présence du type (Villa)
5. Vérifier la présence de la capacité (8 personnes)
6. Vérifier la présence du statut (Actif)

**Résultat attendu :** La fiche de la Villa Les Pins affiche : nom "Villa Les Pins", ville "Cannes", type "Villa", capacité "8 personnes", statut "Actif" (badge vert). Ces informations sont lisibles et correctement formatées.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-043 — Filtrage par statut (actif/inactif)

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** La liste des biens contient des biens actifs et inactifs.
**Données de test :** Filtre "Inactif" — seul le bien "Appartement Marais" est inactif (données démo)

**Étapes :**
1. Depuis la liste des biens, repérer le filtre par statut
2. Sélectionner "Inactif"
3. Vérifier que seuls les biens inactifs apparaissent
4. Remettre le filtre sur "Tous" et vérifier que tous les biens reviennent

**Résultat attendu :** Après application du filtre "Inactif", seul(s) le(s) bien(s) inactif(s) sont listés. Le filtre "Tous" restaure la liste complète. Le nombre de résultats est mis à jour.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-044 — Filtrage par ville

**Module :** Gestion des Biens
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des biens contient des biens dans différentes villes.
**Données de test :** Filtre ville "Paris" → 3 biens attendus (Montmartre, Canal, Marais) ; filtre "Cannes" → 1 bien (Villa Les Pins)

**Étapes :**
1. Repérer le filtre par ville dans la liste des biens
2. Sélectionner "Cannes"
3. Vérifier que seule la Villa Les Pins apparaît
4. Sélectionner "Paris"
5. Vérifier que les 3 biens parisiens apparaissent

**Résultat attendu :** Le filtre par ville fonctionne correctement. Seuls les biens de la ville sélectionnée sont affichés. La liste se met à jour immédiatement après la sélection.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-045 — Recherche par nom de bien

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** La liste des biens est affichée.
**Données de test :** Recherche : "montmartre" (minuscules)

**Étapes :**
1. Saisir "montmartre" dans le champ de recherche
2. Observer la liste en temps réel (ou après soumission)
3. Vérifier que seul "Appartement Montmartre" apparaît

**Résultat attendu :** La recherche est insensible à la casse. Seul l'Appartement Montmartre est affiché. Si aucun résultat ne correspond, un message "Aucun bien trouvé" est affiché. La recherche peut être effacée pour revenir à la liste complète.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-046 — Affichage du taux d'occupation par bien

**Module :** Gestion des Biens
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des biens est affichée. Des réservations existent pour chaque bien.
**Données de test :** Villa Les Pins : taux d'occupation ~82% (données démo)

**Étapes :**
1. Identifier la colonne ou l'indicateur "Taux d'occupation" sur chaque fiche de bien
2. Vérifier que la valeur est affichée en pourcentage
3. Vérifier la cohérence avec les réservations (bien très reservé = taux élevé)

**Résultat attendu :** Chaque bien affiche son taux d'occupation mensuel en pourcentage. La valeur est comprise entre 0% et 100%. Un indicateur visuel (barre de progression ou couleur) peut accompagner la valeur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-047 — Affichage des revenus mensuels par bien

**Module :** Gestion des Biens
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des biens est affichée. Des réservations existent en base.
**Données de test :** Villa Les Pins : revenus mai 2026 ~4 800€ (données démo)

**Étapes :**
1. Identifier l'indicateur "Revenus" sur chaque fiche de bien
2. Vérifier le format : montant en euros avec 2 décimales (ou arrondi)
3. Vérifier que la valeur correspond au mois en cours

**Résultat attendu :** Chaque bien affiche ses revenus bruts du mois en cours en euros. Le symbole "€" est présent. La valeur est positive et cohérente avec les réservations.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-048 — Clic sur un bien → page détail

**Module :** Gestion des Biens
**Priorité :** 🔴 Critique
**Préconditions :** La liste des biens est affichée.
**Données de test :** Bien : "Appartement Montmartre"

**Étapes :**
1. Cliquer sur la fiche de l'Appartement Montmartre dans la liste
2. Observer la navigation

**Résultat attendu :** L'utilisateur est redirigé vers la page détail du bien (`/properties/:id`). La page affiche le nom du bien "Appartement Montmartre" en titre. Les onglets de navigation (Informations, Réservations, Finances) sont présents.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-049 — Bouton "Ajouter un bien" → ouverture du formulaire

**Module :** Gestion des Biens
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. La liste des biens est affichée.
**Données de test :** Bouton "Ajouter un bien" ou "+ Nouveau bien"

**Étapes :**
1. Repérer le bouton "Ajouter un bien" (généralement en haut à droite)
2. Cliquer dessus
3. Observer le comportement (ouverture d'une modale ou navigation vers un formulaire)

**Résultat attendu :** Une modale ou une nouvelle page de formulaire s'ouvre. Le formulaire contient au minimum les champs : Nom du bien, Adresse, Ville, Type, Capacité, Statut. Le formulaire est vide prêt à être rempli.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-050 — Création d'un bien avec tous les champs obligatoires

**Module :** Gestion des Biens
**Priorité :** 🔴 Critique
**Préconditions :** Le formulaire d'ajout de bien est ouvert (TC-049 passé).
**Données de test :** Nom : "Appartement Riviera", Adresse : "12 boulevard de la Croisette", Ville : "Cannes", Type : "Appartement", Capacité : 4, Statut : Actif, Propriétaire : Jean-Luc Rousseau

**Étapes :**
1. Remplir le champ "Nom du bien" avec "Appartement Riviera"
2. Remplir le champ "Adresse" avec "12 boulevard de la Croisette"
3. Remplir le champ "Ville" avec "Cannes"
4. Sélectionner le type "Appartement"
5. Saisir la capacité "4"
6. Sélectionner le propriétaire "Jean-Luc Rousseau"
7. Cliquer sur "Enregistrer" ou "Créer"

**Résultat attendu :** Le bien est créé. Un toast de confirmation s'affiche : "Bien créé avec succès". Le bien "Appartement Riviera" apparaît dans la liste des biens. La modale/page de formulaire se ferme.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Supprimer ce bien après le test pour ne pas polluer les données.

---

#### TC-051 — Validation : champ adresse obligatoire

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** Le formulaire d'ajout de bien est ouvert.
**Données de test :** Tous les champs remplis SAUF l'adresse (laissée vide)

**Étapes :**
1. Remplir tous les champs du formulaire sauf l'adresse
2. Cliquer sur "Enregistrer"
3. Observer le message de validation

**Résultat attendu :** La soumission est bloquée. Un message d'erreur s'affiche sous le champ Adresse : "L'adresse est obligatoire" ou équivalent. Aucune requête API n'est envoyée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-052 — Validation : capacité doit être un nombre positif

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** Le formulaire d'ajout de bien est ouvert.
**Données de test :** Capacité testée : -2, 0, "abc", vide

**Étapes :**
1. Remplir tous les champs valides
2. Saisir "-2" dans le champ Capacité et cliquer Enregistrer → observer l'erreur
3. Saisir "0" dans le champ Capacité et cliquer Enregistrer → observer l'erreur
4. Saisir "abc" dans le champ Capacité et cliquer Enregistrer → observer l'erreur

**Résultat attendu :** Pour chaque valeur invalide, une erreur de validation s'affiche : "La capacité doit être un nombre entier positif". Les valeurs -2, 0, "abc" sont toutes refusées. Seule une valeur ≥ 1 (entier) est acceptée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-053 — Sélection du type de bien (appartement, maison, villa, studio)

**Module :** Gestion des Biens
**Priorité :** 🟡 Moyenne
**Préconditions :** Le formulaire d'ajout de bien est ouvert.
**Données de test :** Types attendus : Appartement, Maison, Villa, Studio (minimum)

**Étapes :**
1. Cliquer sur le sélecteur "Type de bien"
2. Vérifier les options disponibles dans le menu déroulant
3. Sélectionner "Villa" et vérifier que la valeur est conservée
4. Changer pour "Studio" et vérifier la mise à jour

**Résultat attendu :** Le sélecteur propose au minimum : Appartement, Maison, Villa, Studio. La sélection est conservée lors de la navigation dans le formulaire. La valeur sélectionnée est bien transmise lors de la soumission.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-054 — Modification d'un bien existant

**Module :** Gestion des Biens
**Priorité :** 🔴 Critique
**Préconditions :** La page détail d'un bien est ouverte (ex : Appartement Montmartre).
**Données de test :** Modification : capacité 4 → 6 personnes

**Étapes :**
1. Naviguer vers la page détail de l'Appartement Montmartre (`/properties/2`)
2. Cliquer sur "Modifier" ou l'icône d'édition (crayon)
3. Modifier la capacité de 4 à 6
4. Cliquer sur "Enregistrer"

**Résultat attendu :** Les modifications sont sauvegardées. Un toast de confirmation s'affiche : "Bien modifié avec succès". La capacité affichée est maintenant "6 personnes". La mise à jour est persistante après rechargement.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Remettre la capacité à 4 après le test.

---

#### TC-055 — Changement de statut (actif → inactif)

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** Un bien actif est visible dans la liste (ex : Studio Canal).
**Données de test :** Bien : "Studio Canal", statut actuel : Actif

**Étapes :**
1. Sur la fiche du "Studio Canal", repérer le sélecteur de statut ou le bouton de bascule
2. Changer le statut de "Actif" à "Inactif"
3. Confirmer si une boîte de dialogue de confirmation s'affiche
4. Vérifier le changement de badge sur la fiche

**Résultat attendu :** Le statut du Studio Canal passe à "Inactif". Le badge change de couleur (vert → gris). Un toast de confirmation s'affiche. Le filtre par statut "Inactif" affiche maintenant ce bien. La modification est persistante après rechargement.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Remettre le statut à "Actif" après le test.

---

#### TC-056 — Page détail bien : onglet Informations

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** La page détail d'un bien est ouverte (ex : Villa Les Pins).
**Données de test :** Villa Les Pins : adresse "Route des Pins, Cannes", 8 personnes, 4 chambres, 3 SDB

**Étapes :**
1. Naviguer vers la page détail de la Villa Les Pins
2. Cliquer sur l'onglet "Informations" (si pas sélectionné par défaut)
3. Vérifier toutes les informations affichées

**Résultat attendu :** L'onglet Informations affiche : nom du bien, adresse complète, ville, type de bien, capacité en personnes, nombre de chambres, nombre de salles de bain, propriétaire associé, statut, description (si disponible). Toutes les données correspondent aux données de démo.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-057 — Page détail bien : onglet Réservations

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** La page détail d'un bien est ouverte. Des réservations existent pour ce bien.
**Données de test :** Villa Les Pins : 3 réservations en mai 2026

**Étapes :**
1. Depuis la page détail de la Villa Les Pins, cliquer sur l'onglet "Réservations"
2. Vérifier la liste des réservations affichées

**Résultat attendu :** L'onglet Réservations affiche uniquement les réservations de la Villa Les Pins. Les colonnes incluent : voyageur, check-in, check-out, montant, statut. Les réservations sont triées par date décroissante (plus récentes en premier).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-058 — Page détail bien : onglet Finances

**Module :** Gestion des Biens
**Priorité :** 🟠 Haute
**Préconditions :** La page détail d'un bien est ouverte. Des réservations terminées existent.
**Données de test :** Villa Les Pins : CA mai 2026 ~4 800€ brut, commission 20% = 960€, net = 3 840€

**Étapes :**
1. Depuis la page détail de la Villa Les Pins, cliquer sur l'onglet "Finances"
2. Vérifier le résumé financier affiché
3. Vérifier les montants : brut, commission, net

**Résultat attendu :** L'onglet Finances affiche : revenus bruts du bien pour la période en cours, montant de la commission déduite, montant net reversé au propriétaire. Le calcul net = brut − commission est correct (à 1 centime près).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-059 — Affichage de la photo du bien

**Module :** Gestion des Biens
**Priorité :** 🟡 Moyenne
**Préconditions :** Un bien avec une photo est en base (ex : Villa Les Pins).
**Données de test :** Villa Les Pins : photo principale (URL définie en base)

**Étapes :**
1. Naviguer vers la liste des biens ou la page détail de la Villa Les Pins
2. Vérifier que l'image s'affiche correctement
3. Vérifier que l'image n'est pas distordue, pixelisée ou coupée

**Résultat attendu :** La photo de la Villa Les Pins s'affiche correctement. L'image est bien proportionnée (ratio maintenu). Le chargement est rapide (ou un placeholder s'affiche pendant le chargement).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-060 — Bien sans photo → image placeholder correcte

**Module :** Gestion des Biens
**Priorité :** 🟡 Moyenne
**Préconditions :** Un bien sans photo est en base (ex : Studio Canal sans image définie).
**Données de test :** Studio Canal : aucune photo définie

**Étapes :**
1. Naviguer vers la liste des biens
2. Identifier la fiche du Studio Canal (bien sans photo)
3. Observer ce qui s'affiche à la place de l'image

**Résultat attendu :** Un placeholder est affiché à la place de la photo manquante. Le placeholder peut être : une icône de maison générique, une illustration, ou un fond coloré avec les initiales du bien. Aucun composant cassé ("broken image" avec croix rouge) n'est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 05 — Gestion des Réservations

---

#### TC-061 — Affichage de la liste des réservations

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des réservations existent en base.
**Données de test :** 12 réservations dans les données de démo

**Étapes :**
1. Cliquer sur "Réservations" dans la sidebar
2. Attendre le chargement de la liste

**Résultat attendu :** La liste des réservations s'affiche à `/bookings`. Les réservations sont listées sous forme de tableau ou de cartes. Le nombre total de réservations est indiqué. La page affiche un titre "Réservations".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-062 — Colonnes affichées : ID, bien, voyageur, check-in, check-out, montant, statut, canal

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La liste des réservations est affichée.
**Données de test :** Réservation BK-001 : Villa Les Pins, Thomas Leclerc, 15/05 → 22/05/2026, 1 960€, Confirmé, Airbnb

**Étapes :**
1. Observer les colonnes du tableau de réservations
2. Vérifier la présence de chaque colonne : ID, Bien, Voyageur, Check-in, Check-out, Montant, Statut, Canal
3. Vérifier les données de la réservation BK-001

**Résultat attendu :** Les 8 colonnes sont présentes et correctement intitulées. Pour la réservation BK-001 : ID "BK-001", Bien "Villa Les Pins", Voyageur "Thomas Leclerc", Check-in "15/05/2026", Check-out "22/05/2026", Montant "1 960,00 €", Statut "Confirmé", Canal "Airbnb".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-063 — Badge de statut coloré (confirmé=vert, annulé=rouge, etc.)

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La liste des réservations contient des réservations avec des statuts différents.
**Données de test :** Statuts présents en démo : Confirmé, En cours, Terminé, Annulé

**Étapes :**
1. Observer les badges de statut dans la colonne "Statut"
2. Vérifier la couleur du badge pour chaque statut : Confirmé → vert, En cours → bleu, Terminé → gris, Annulé → rouge

**Résultat attendu :** Les badges de statut respectent le code couleur : "Confirmé" en vert, "En cours" en bleu, "Terminé" en gris, "Annulé" en rouge. Le texte du badge est lisible (contraste suffisant). Les badges sont visuellement distincts les uns des autres.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-064 — Badge canal (Airbnb, Booking, Direct)

**Module :** Gestion des Réservations
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste contient des réservations de différents canaux.
**Données de test :** Canaux présents : Airbnb, Booking.com, Direct

**Étapes :**
1. Observer la colonne "Canal" dans la liste des réservations
2. Vérifier les badges ou icônes de canal
3. Identifier une réservation de chaque canal et vérifier le badge correspondant

**Résultat attendu :** Chaque canal est représenté par un badge distinctif : "Airbnb" (rouge), "Booking" (bleu), "Direct" (vert ou violet). Les badges peuvent inclure le logo du canal ou seulement un label texte coloré.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-065 — Filtrage par statut

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La liste des réservations est affichée avec plusieurs statuts.
**Données de test :** Filtre "Annulé" → 2 réservations annulées en démo

**Étapes :**
1. Repérer le filtre par statut
2. Sélectionner "Annulé"
3. Vérifier que seules les réservations annulées sont affichées
4. Remettre sur "Tous" et vérifier la restauration

**Résultat attendu :** Après sélection du filtre "Annulé", seules les 2 réservations annulées sont affichées. Le compteur de résultats est mis à jour. Le filtre "Tous" restaure la liste complète.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-066 — Filtrage par canal

**Module :** Gestion des Réservations
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des réservations contient des réservations de différents canaux.
**Données de test :** Filtre "Airbnb" → 7 réservations Airbnb en démo

**Étapes :**
1. Sélectionner "Airbnb" dans le filtre par canal
2. Vérifier que seules les réservations Airbnb sont affichées
3. Vérifier qu'aucune réservation "Booking" ou "Direct" n'apparaît

**Résultat attendu :** Seules les réservations Airbnb sont affichées (7 réservations). Toutes les badges "Canal" visibles indiquent "Airbnb". Le filtre peut être combiné avec le filtre par statut.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-067 — Filtrage par plage de dates

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La liste des réservations contient des réservations sur plusieurs mois.
**Données de test :** Plage : 01/05/2026 au 31/05/2026 → 8 réservations en mai

**Étapes :**
1. Repérer le sélecteur de plage de dates (date picker)
2. Saisir la date de début "01/05/2026"
3. Saisir la date de fin "31/05/2026"
4. Valider le filtre
5. Vérifier que seules les réservations dont le check-in est en mai 2026 apparaissent

**Résultat attendu :** Seules les réservations avec un check-in compris entre le 01/05/2026 et le 31/05/2026 sont affichées. Le sélecteur de date est ergonomique (calendrier visuel). Le filtre peut être réinitialisé.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Préciser si le filtre porte sur le check-in, le check-out, ou la période de séjour.

---

#### TC-068 — Recherche par nom de voyageur

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La liste des réservations est affichée.
**Données de test :** Recherche : "leclerc"

**Étapes :**
1. Saisir "leclerc" dans la barre de recherche
2. Observer les résultats filtrés

**Résultat attendu :** Seules les réservations au nom de "Thomas Leclerc" s'affichent. La recherche est insensible à la casse. Un résultat vide affiche le message "Aucune réservation trouvée".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-069 — Clic sur une réservation → fiche 360°

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** La liste des réservations est affichée.
**Données de test :** Réservation BK-001, Thomas Leclerc, Villa Les Pins

**Étapes :**
1. Cliquer sur la ligne de la réservation BK-001
2. Observer la navigation ou l'ouverture de la fiche

**Résultat attendu :** La fiche 360° de la réservation BK-001 s'ouvre (dans une modale ou une nouvelle page). Le titre affiche "Réservation BK-001 — Thomas Leclerc". Les onglets Voyageur, Accès, Tâches, Messages, Finances sont présents.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-070 — Fiche réservation : onglet Voyageur (nom, email, téléphone)

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** La fiche 360° de la réservation BK-001 est ouverte.
**Données de test :** Voyageur : Thomas Leclerc, thomas.leclerc@gmail.com, +33 6 12 34 56 78

**Étapes :**
1. Cliquer sur l'onglet "Voyageur"
2. Vérifier les informations affichées

**Résultat attendu :** L'onglet Voyageur affiche : Nom complet "Thomas Leclerc", email `thomas.leclerc@gmail.com` (cliquable), téléphone "+33 6 12 34 56 78" (cliquable sur mobile), nombre de voyageurs, date de naissance (si disponible), historique des séjours.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-071 — Fiche réservation : onglet Accès (code, guide d'arrivée)

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** La fiche 360° de la réservation BK-001 est ouverte.
**Données de test :** Code d'accès : "4789", guide d'arrivée : instructions de la Villa Les Pins

**Étapes :**
1. Cliquer sur l'onglet "Accès"
2. Vérifier les informations d'accès affichées

**Résultat attendu :** L'onglet Accès affiche : code d'accès "4789" de manière lisible et proéminente, instructions d'arrivée (adresse, étapes), lien vers le portail voyageur, option pour envoyer le code au voyageur par email/SMS.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-072 — Fiche réservation : onglet Tâches (missions liées)

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La fiche 360° est ouverte. Des tâches sont liées à cette réservation.
**Données de test :** Tâches liées à BK-001 : ménage (Fatima Benali, 15/05 09h00), check-in (Pierre Durand, 15/05 15h00)

**Étapes :**
1. Cliquer sur l'onglet "Tâches"
2. Vérifier la liste des missions liées à la réservation

**Résultat attendu :** L'onglet Tâches liste toutes les missions associées à cette réservation : ménage (15/05/2026 à 09h00, Fatima Benali, statut "Terminé"), check-in (15/05/2026 à 15h00, Pierre Durand, statut "À faire"). Un bouton "Ajouter une mission" est présent.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-073 — Fiche réservation : onglet Messages (thread)

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** La fiche 360° est ouverte. Des messages existent dans le thread.
**Données de test :** Thread BK-001 : message automatique de confirmation (Airbnb), réponse manuelle de Sophie Martin

**Étapes :**
1. Cliquer sur l'onglet "Messages"
2. Vérifier l'affichage du thread de messages

**Résultat attendu :** Le thread affiche les messages dans l'ordre chronologique. Le message de confirmation automatique est affiché avec un badge "Auto". La réponse manuelle de Sophie Martin est affichée en différentiant la direction (envoyé/reçu). Le canal de chaque message est indiqué (Airbnb).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-074 — Fiche réservation : onglet Finances (prix, commission, net)

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** La fiche 360° est ouverte.
**Données de test :** BK-001 : montant brut 1 960€, commission 20% = 392€, net propriétaire = 1 568€

**Étapes :**
1. Cliquer sur l'onglet "Finances"
2. Vérifier les montants affichés

**Résultat attendu :** L'onglet Finances affiche : montant brut "1 960,00 €", commission "392,00 € (20%)", montant net "1 568,00 €". Le calcul net = brut - commission est correct. Les montants sont en euros avec 2 décimales. Les taxes (si applicables) sont détaillées séparément.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-075 — Création d'une nouvelle réservation manuelle

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur admin est connecté. Des biens actifs existent.
**Données de test :** Bien : Studio Canal, Voyageur : Isabelle Moreau, isabel.moreau@email.fr, Check-in : 10/06/2026, Check-out : 14/06/2026, Montant : 580€, Canal : Direct

**Étapes :**
1. Cliquer sur le bouton "Nouvelle réservation"
2. Sélectionner le bien "Studio Canal"
3. Saisir le nom du voyageur "Isabelle Moreau"
4. Saisir l'email `isabel.moreau@email.fr`
5. Saisir les dates : check-in 10/06/2026, check-out 14/06/2026
6. Saisir le montant : 580
7. Sélectionner le canal : Direct
8. Cliquer sur "Créer la réservation"

**Résultat attendu :** La réservation est créée avec le statut "Confirmé". Un ID est généré automatiquement (ex : BK-013). La réservation apparaît dans la liste. Un toast "Réservation créée avec succès" est affiché.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-076 — Validation : dates check-out > check-in

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** Le formulaire de création de réservation est ouvert.
**Données de test :** Check-in : 20/06/2026, Check-out : 18/06/2026 (antérieur)

**Étapes :**
1. Saisir la date de check-in : 20/06/2026
2. Saisir la date de check-out : 18/06/2026 (date antérieure au check-in)
3. Cliquer sur "Créer la réservation"

**Résultat attendu :** La validation bloque la soumission. Un message d'erreur s'affiche : "La date de départ doit être postérieure à la date d'arrivée". Aucune requête API n'est envoyée. L'utilisateur peut corriger les dates.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Tester aussi check-out = check-in (séjour de 0 nuit).

---

#### TC-077 — Validation : nombre de voyageurs ≤ capacité du bien

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** Le formulaire de création de réservation est ouvert. Le bien sélectionné est le Studio Canal (capacité : 2 personnes).
**Données de test :** Studio Canal (capacité 2), nombre de voyageurs saisi : 5

**Étapes :**
1. Sélectionner le bien "Studio Canal" (capacité 2 personnes)
2. Saisir le nombre de voyageurs : 5
3. Tenter de soumettre le formulaire

**Résultat attendu :** Un message d'avertissement ou d'erreur s'affiche : "Le nombre de voyageurs (5) dépasse la capacité du bien (2 personnes)". La soumission peut être bloquée ou une confirmation d'override peut être demandée (selon l'implémentation).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-078 — Modification du statut d'une réservation

**Module :** Gestion des Réservations
**Priorité :** 🔴 Critique
**Préconditions :** La fiche 360° d'une réservation "Confirmée" est ouverte.
**Données de test :** Réservation BK-005, statut actuel "Confirmé" → modification vers "En cours"

**Étapes :**
1. Ouvrir la fiche de la réservation BK-005
2. Repérer le sélecteur de statut
3. Modifier le statut vers "En cours"
4. Confirmer si demandé

**Résultat attendu :** Le statut de la réservation BK-005 passe à "En cours". Le badge de statut est mis à jour visuellement (couleur bleue). Un toast de confirmation s'affiche. La modification est persistante.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-079 — Annulation d'une réservation (avec confirmation)

**Module :** Gestion des Réservations
**Priorité :** 🟠 Haute
**Préconditions :** Une réservation "Confirmée" est accessible (ex : BK-006).
**Données de test :** Réservation BK-006 — Annulation avec motif "Demande du voyageur"

**Étapes :**
1. Ouvrir la fiche de la réservation BK-006
2. Cliquer sur le bouton "Annuler la réservation"
3. Une boîte de dialogue de confirmation doit s'afficher
4. Saisir le motif "Demande du voyageur"
5. Confirmer l'annulation

**Résultat attendu :** Une boîte de confirmation s'affiche avant d'annuler ("Êtes-vous sûr de vouloir annuler cette réservation ?"). Après confirmation, le statut passe à "Annulé" (badge rouge). Un toast "Réservation annulée" s'affiche. La réservation reste dans la liste avec le statut "Annulé".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-080 — Pagination ou scroll infini sur la liste

**Module :** Gestion des Réservations
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des réservations contient plus de 10 éléments (données démo : 12 réservations).
**Données de test :** 12 réservations, page 1 affiche 10 items

**Étapes :**
1. Observer la liste des réservations (12 items)
2. Si pagination : vérifier les boutons "Page suivante" / "Page précédente"
3. Cliquer sur la page 2 et vérifier que les 2 réservations restantes s'affichent
4. Si scroll infini : faire défiler jusqu'en bas et vérifier le chargement des items suivants

**Résultat attendu :** La pagination ou le scroll infini fonctionne correctement. Le nombre total de réservations (12) est indiqué. La navigation entre pages est fluide et sans perte de filtres actifs.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 06 — Planning Opérationnel

---

#### TC-081 — Affichage de la vue semaine (grille biens × jours)

**Module :** Planning Opérationnel
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des tâches existent pour la semaine courante.
**Données de test :** Semaine du 12 au 18 mai 2026

**Étapes :**
1. Naviguer vers `/planning` depuis la sidebar
2. Observer l'affichage de la grille

**Résultat attendu :** La grille s'affiche avec les biens en lignes (Villa Les Pins, Appartement Montmartre, Studio Canal, Appartement Marais) et les jours de la semaine en colonnes (Lun. 12/05 à Dim. 18/05). Les tâches de chaque bien pour chaque jour sont visibles dans les cellules correspondantes.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-082 — Affichage des couleurs par type de tâche (ménage=vert, check-in=bleu, etc.)

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** La vue semaine est affichée. Des tâches de différents types sont présentes.
**Données de test :** Types : Ménage (vert), Check-in (bleu), Check-out (orange), Maintenance (rouge)

**Étapes :**
1. Observer les tâches affichées dans la grille du planning
2. Identifier une tâche de type "Ménage" et vérifier sa couleur verte
3. Identifier une tâche de type "Check-in" et vérifier sa couleur bleue
4. Identifier une tâche de type "Check-out" et vérifier sa couleur orange

**Résultat attendu :** Le code couleur est cohérent : Ménage = vert, Check-in = bleu, Check-out = orange/jaune, Maintenance = rouge, Autre = gris. La couleur est visible sur l'étiquette de la tâche dans la grille.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-083 — Navigation semaine précédente

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** La vue semaine courante est affichée.
**Données de test :** Semaine courante : 12-18 mai 2026. Semaine précédente attendue : 5-11 mai 2026.

**Étapes :**
1. Repérer le bouton de navigation "Semaine précédente" (← ou "<")
2. Cliquer dessus
3. Vérifier les dates affichées en en-tête

**Résultat attendu :** L'en-tête de la grille affiche "5-11 mai 2026". Les tâches de cette semaine sont chargées et affichées. La navigation est fluide sans rechargement complet de la page.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-084 — Navigation semaine suivante

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** La vue semaine courante est affichée.
**Données de test :** Semaine courante : 12-18 mai 2026. Semaine suivante attendue : 19-25 mai 2026.

**Étapes :**
1. Cliquer sur le bouton "Semaine suivante" (→ ou ">")
2. Vérifier les dates affichées

**Résultat attendu :** L'en-tête affiche "19-25 mai 2026". Les tâches de cette semaine sont affichées. Un bouton "Aujourd'hui" ou "Semaine courante" permet de revenir rapidement à la semaine actuelle.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-085 — Clic sur une tâche → détail de la mission

**Module :** Planning Opérationnel
**Priorité :** 🔴 Critique
**Préconditions :** La grille du planning affiche des tâches.
**Données de test :** Tâche : Ménage — Appartement Montmartre — Lundi 12/05 — Fatima Benali

**Étapes :**
1. Cliquer sur l'étiquette de la tâche "Ménage — Appartement Montmartre" dans la grille
2. Observer l'ouverture du détail

**Résultat attendu :** Une modale ou un panneau latéral s'ouvre avec le détail de la mission : type "Ménage", bien "Appartement Montmartre", date et heure "12/05/2026 à 09h00", prestataire "Fatima Benali", statut, notes, réservation associée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-086 — Tâches en retard surlignées en rouge

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** Des tâches dont la date/heure est passée et le statut est "À faire" ou "En cours" existent.
**Données de test :** Tâche en retard : Ménage Studio Canal — 10/05/2026 09h00 — statut "À faire"

**Étapes :**
1. Naviguer vers la semaine contenant des tâches en retard (semaine du 5-11 mai 2026)
2. Identifier les tâches en retard dans la grille

**Résultat attendu :** Les tâches en retard sont visuellement distinctes : étiquette rouge ou bordure rouge, icône d'alerte (⚠️), label "En retard". Ces tâches sont immédiatement identifiables parmi les autres tâches.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-087 — Bouton "Ajouter une mission" → formulaire

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** La vue planning est affichée.
**Données de test :** Bouton "Ajouter une mission" ou "+ Mission"

**Étapes :**
1. Cliquer sur le bouton "Ajouter une mission"
2. Observer l'ouverture du formulaire

**Résultat attendu :** Un formulaire de création de mission s'ouvre (modale ou page dédiée). Les champs disponibles sont : type de mission, bien concerné, prestataire, date, heure, notes. Les champs obligatoires sont indiqués.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-088 — Création d'une mission depuis le planning

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** Le formulaire de création de mission est ouvert.
**Données de test :** Type : Ménage, Bien : Villa Les Pins, Prestataire : Fatima Benali, Date : 20/05/2026, Heure : 10h00

**Étapes :**
1. Sélectionner le type "Ménage"
2. Sélectionner le bien "Villa Les Pins"
3. Sélectionner le prestataire "Fatima Benali"
4. Définir la date "20/05/2026" et l'heure "10h00"
5. Cliquer sur "Créer la mission"

**Résultat attendu :** La mission est créée et apparaît dans la grille du planning au jour 20/05 sur la ligne Villa Les Pins. Un toast "Mission créée avec succès" s'affiche. La couleur de l'étiquette est verte (Ménage).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-089 — Affichage du nom du prestataire affecté

**Module :** Planning Opérationnel
**Priorité :** 🟡 Moyenne
**Préconditions :** Des tâches avec des prestataires affectés existent dans la grille.
**Données de test :** Tâche ménage : Fatima Benali affectée

**Étapes :**
1. Observer les étiquettes de tâches dans la grille du planning
2. Vérifier que le nom du prestataire est visible sur chaque tâche

**Résultat attendu :** Chaque étiquette de tâche dans la grille affiche le nom (ou les initiales) du prestataire affecté. Si aucun prestataire n'est affecté, un label "Non affecté" ou une icône d'avertissement est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-090 — Légende des couleurs visible

**Module :** Planning Opérationnel
**Priorité :** 🟡 Moyenne
**Préconditions :** La vue planning est affichée.
**Données de test :** Légende attendue : Ménage (vert), Check-in (bleu), Check-out (orange), Maintenance (rouge)

**Étapes :**
1. Observer la présence d'une légende sur la page du planning
2. Vérifier que la légende liste tous les types de tâches avec leur couleur associée

**Résultat attendu :** Une légende des couleurs est visible, positionnée en haut ou en bas de la grille. Elle liste : Ménage (carré vert), Check-in (carré bleu), Check-out (carré orange), Maintenance (carré rouge). La légende est toujours visible sans défilement.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-091 — Affichage correct quand aucune tâche pour la semaine

**Module :** Planning Opérationnel
**Priorité :** 🟡 Moyenne
**Préconditions :** Aucune tâche n'est planifiée pour une semaine future lointaine.
**Données de test :** Naviguer vers la semaine du 01-07 septembre 2026 (vide)

**Étapes :**
1. Naviguer vers la semaine du 01/09/2026 (en avançant semaine par semaine)
2. Observer l'affichage de la grille vide

**Résultat attendu :** La grille s'affiche avec toutes les lignes (biens) et colonnes (jours) mais sans étiquettes de tâches. Un message "Aucune mission planifiée cette semaine" est affiché, ou les cellules sont vides mais la structure est maintenue. Un bouton "Ajouter une mission" est proposé.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-092 — Responsive : vue liste sur mobile

**Module :** Planning Opérationnel
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur accède au planning sur mobile (375px).
**Données de test :** Viewport 375px × 812px

**Étapes :**
1. Activer le mode responsive 375×812 dans les DevTools
2. Naviguer vers le planning
3. Observer le format d'affichage

**Résultat attendu :** Sur mobile, la grille hebdomadaire est remplacée par une vue liste chronologique des missions (plus lisible sur petit écran). Chaque mission est listée avec : bien, type, heure, prestataire, statut. La navigation semaine précédente/suivante reste disponible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-093 — Affichage du numéro de semaine et plage de dates

**Module :** Planning Opérationnel
**Priorité :** 🟡 Moyenne
**Préconditions :** La vue planning est affichée.
**Données de test :** Semaine du 12 au 18 mai 2026 = Semaine 20

**Étapes :**
1. Observer l'en-tête de la vue planning
2. Vérifier la présence du numéro de semaine
3. Vérifier la plage de dates (du lundi au dimanche)

**Résultat attendu :** L'en-tête affiche : "Semaine 20 — du 12 au 18 mai 2026". Le numéro de semaine ISO est correct. Les dates de début et de fin de semaine sont affichées.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 07 — Missions / Tâches

---

#### TC-094 — Affichage de la liste des tâches

**Module :** Missions / Tâches
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des tâches existent en base.
**Données de test :** 18 tâches dans les données de démo

**Étapes :**
1. Naviguer vers `/tasks` depuis la sidebar
2. Attendre le chargement

**Résultat attendu :** La liste de toutes les tâches s'affiche. Le nombre total de tâches est indiqué. La liste est scrollable si elle dépasse la hauteur de la page.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-095 — Colonnes : type, bien, prestataire, date/heure, statut

**Module :** Missions / Tâches
**Priorité :** 🟠 Haute
**Préconditions :** La liste des tâches est affichée.
**Données de test :** Tâche : Ménage, Villa Les Pins, Fatima Benali, 12/05/2026 09h00, Terminé

**Étapes :**
1. Observer les colonnes du tableau de tâches
2. Vérifier la présence des colonnes : Type, Bien, Prestataire, Date/Heure, Statut

**Résultat attendu :** Les 5 colonnes sont présentes. Pour la tâche de démo : Type "Ménage", Bien "Villa Les Pins", Prestataire "Fatima Benali", Date "12/05/2026 à 09h00", Statut "Terminé". Les données sont lisibles et correctement formatées.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-096 — Badge de statut : À faire, En cours, Terminé, En retard

**Module :** Missions / Tâches
**Priorité :** 🟠 Haute
**Préconditions :** La liste des tâches contient des tâches avec différents statuts.
**Données de test :** Statuts présents : À faire (gris), En cours (bleu), Terminé (vert), En retard (rouge)

**Étapes :**
1. Identifier une tâche avec chaque statut dans la liste
2. Vérifier la couleur et le libellé du badge de statut pour chaque tâche

**Résultat attendu :** Les badges de statut sont : "À faire" (gris), "En cours" (bleu), "Terminé" (vert), "En retard" (rouge). Chaque badge est lisible et visuellement distinct. Une tâche dont la date est passée et le statut est "À faire" affiche automatiquement "En retard".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-097 — Filtrage par statut

**Module :** Missions / Tâches
**Priorité :** 🟠 Haute
**Préconditions :** La liste des tâches est affichée.
**Données de test :** Filtre "En retard" → 2 tâches en retard en démo

**Étapes :**
1. Sélectionner le filtre "En retard"
2. Vérifier que seules les tâches en retard apparaissent
3. Vérifier le compteur de résultats
4. Remettre sur "Tous"

**Résultat attendu :** Après filtre "En retard" : seules les 2 tâches en retard sont affichées, chacune avec un badge rouge "En retard". Aucune tâche avec un autre statut n'apparaît.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-098 — Filtrage par type de mission

**Module :** Missions / Tâches
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des tâches contient des types variés.
**Données de test :** Filtre "Ménage" → 8 tâches ménage en démo

**Étapes :**
1. Sélectionner le filtre par type "Ménage"
2. Vérifier que seules les tâches de type "Ménage" apparaissent
3. Remettre le filtre sur "Tous les types"

**Résultat attendu :** Seules les 8 tâches de type "Ménage" sont affichées. La colonne "Type" de chaque ligne affiche "Ménage". Le compteur est mis à jour.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-099 — Filtrage par date

**Module :** Missions / Tâches
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des tâches couvre plusieurs dates.
**Données de test :** Filtre date : 12/05/2026 → 3 tâches ce jour-là

**Étapes :**
1. Sélectionner la date "12/05/2026" dans le filtre de date
2. Vérifier que seules les tâches du 12/05/2026 sont affichées

**Résultat attendu :** Les 3 tâches planifiées le 12/05/2026 sont listées. Aucune tâche d'une autre date n'apparaît. Le filtre de date peut être réinitialisé.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-100 — Création d'une mission (type, bien, prestataire, date)

**Module :** Missions / Tâches
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des biens et prestataires existent.
**Données de test :** Type : Check-out, Bien : Appartement Montmartre, Prestataire : Fatima Benali, Date : 25/05/2026, Heure : 11h00

**Étapes :**
1. Cliquer sur "Nouvelle mission" (ou "+ Mission")
2. Sélectionner le type "Check-out"
3. Sélectionner le bien "Appartement Montmartre"
4. Sélectionner le prestataire "Fatima Benali"
5. Saisir la date "25/05/2026" et l'heure "11h00"
6. Cliquer sur "Créer"

**Résultat attendu :** La mission est créée avec le statut "À faire". Elle apparaît dans la liste et dans le planning. Un toast "Mission créée avec succès" s'affiche. L'ID de la mission est généré automatiquement.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-101 — Modification d'une mission existante

**Module :** Missions / Tâches
**Priorité :** 🟠 Haute
**Préconditions :** Une mission "À faire" existe (ex : tâche ménage du 20/05/2026).
**Données de test :** Modification : heure de 09h00 → 10h30

**Étapes :**
1. Ouvrir la mission ménage du 20/05/2026
2. Cliquer sur "Modifier" ou l'icône crayon
3. Modifier l'heure de 09h00 à 10h30
4. Enregistrer

**Résultat attendu :** La mission est mise à jour. L'heure affichée est "10h30". Un toast "Mission modifiée" s'affiche. La modification est visible dans la liste et dans le planning.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-102 — Changement de statut d'une mission

**Module :** Missions / Tâches
**Priorité :** 🔴 Critique
**Préconditions :** Une mission avec le statut "À faire" est accessible.
**Données de test :** Mission : Ménage Studio Canal — statut "À faire" → "En cours"

**Étapes :**
1. Repérer la mission Ménage Studio Canal dans la liste
2. Modifier son statut de "À faire" à "En cours"
3. Vérifier la mise à jour visuelle

**Résultat attendu :** Le badge de statut passe de "À faire" (gris) à "En cours" (bleu). Un toast de confirmation s'affiche. La modification est persistante. Si la mission est liée à une réservation, le statut mis à jour est visible dans la fiche réservation.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-103 — Mission en retard → badge rouge automatique

**Module :** Missions / Tâches
**Priorité :** 🔴 Critique
**Préconditions :** Une mission dont la date/heure est passée a le statut "À faire".
**Données de test :** Mission : Ménage Appartement Marais — 05/05/2026 09h00 — statut "À faire" (date passée)

**Étapes :**
1. Repérer la mission Ménage Appartement Marais (date passée) dans la liste
2. Vérifier automatiquement son badge de statut

**Résultat attendu :** La mission affiche automatiquement le badge "En retard" (rouge) sans intervention manuelle. Ce badge est appliqué côté application (calcul basé sur la date courante vs date planifiée). La mission apparaît dans le filtre "En retard".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-104 — Affichage des notes de mission

**Module :** Missions / Tâches
**Priorité :** 🟡 Moyenne
**Préconditions :** Une mission avec des notes est en base.
**Données de test :** Mission ménage Villa Les Pins — Note : "Attention : remplacer les serviettes de la chambre bleue"

**Étapes :**
1. Ouvrir le détail de la mission ménage Villa Les Pins
2. Repérer la section "Notes"
3. Vérifier le contenu affiché

**Résultat attendu :** Les notes "Attention : remplacer les serviettes de la chambre bleue" sont affichées dans la section dédiée du détail de mission. Le texte est lisible et entier (non tronqué pour les notes courtes).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-105 — Suppression d'une mission (avec confirmation)

**Module :** Missions / Tâches
**Priorité :** 🟠 Haute
**Préconditions :** Une mission "À faire" peut être supprimée (non encore exécutée).
**Données de test :** Mission à supprimer : Check-out Studio Canal du 25/05/2026 (créée en TC-100)

**Étapes :**
1. Ouvrir le détail ou sélectionner la mission à supprimer
2. Cliquer sur "Supprimer" (icône poubelle ou bouton)
3. Observer la boîte de dialogue de confirmation
4. Confirmer la suppression

**Résultat attendu :** Une boîte de confirmation s'affiche : "Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible." Après confirmation, la mission est supprimée et disparaît de la liste et du planning. Un toast "Mission supprimée" s'affiche.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-106 — Lien vers la réservation associée

**Module :** Missions / Tâches
**Priorité :** 🟡 Moyenne
**Préconditions :** Une mission est liée à une réservation (ex : ménage lié à BK-001).
**Données de test :** Mission : Ménage Villa Les Pins — liée à la réservation BK-001

**Étapes :**
1. Ouvrir le détail de la mission ménage Villa Les Pins
2. Repérer le lien ou le bouton "Voir la réservation" ou "Réservation : BK-001"
3. Cliquer sur ce lien

**Résultat attendu :** L'utilisateur est redirigé vers la fiche 360° de la réservation BK-001. La navigation est correcte et la fiche se charge sans erreur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 08 — Incidents

---

#### TC-107 — Affichage de la liste des incidents

**Module :** Incidents
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des incidents existent en base.
**Données de test :** 5 incidents dans les données de démo

**Étapes :**
1. Naviguer vers `/incidents` depuis la sidebar
2. Attendre le chargement de la liste

**Résultat attendu :** La liste des incidents s'affiche à `/incidents`. Les 5 incidents de démo sont visibles. Le titre de la page est "Incidents". Le nombre total est indiqué.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-108 — Niveaux de sévérité : Urgent (rouge), Important (orange), Normal (gris)

**Module :** Incidents
**Priorité :** 🔴 Critique
**Préconditions :** La liste des incidents contient des incidents de différentes sévérités.
**Données de test :** Incident urgent : "Fuite d'eau" (rouge), Important : "Chauffe-eau en panne" (orange), Normal : "Ampoule à remplacer" (gris)

**Étapes :**
1. Observer les badges de sévérité dans la liste des incidents
2. Vérifier la couleur pour chaque niveau : Urgent = rouge, Important = orange, Normal = gris

**Résultat attendu :** Les badges de sévérité respectent le code couleur défini. "Urgent" est affiché en rouge avec priorité visuelle maximale. "Important" est orange. "Normal" est gris ou neutre. L'incident "Fuite d'eau" affiche "Urgent" en rouge.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-109 — Filtrage par sévérité

**Module :** Incidents
**Priorité :** 🟠 Haute
**Préconditions :** La liste des incidents contient des incidents de différentes sévérités.
**Données de test :** Filtre "Urgent" → 1 incident urgent en démo

**Étapes :**
1. Sélectionner le filtre "Urgent"
2. Vérifier que seul l'incident urgent apparaît
3. Remettre sur "Toutes les sévérités"

**Résultat attendu :** Seul l'incident "Fuite d'eau" (Urgent) est affiché. Le compteur indique "1 incident". Aucun incident d'une autre sévérité n'apparaît.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-110 — Filtrage par statut (ouvert, en cours, résolu)

**Module :** Incidents
**Priorité :** 🟠 Haute
**Préconditions :** La liste des incidents contient des statuts variés.
**Données de test :** Filtre "Résolu" → 2 incidents résolus en démo

**Étapes :**
1. Sélectionner le filtre de statut "Résolu"
2. Vérifier que seuls les incidents résolus apparaissent
3. Vérifier les badges de statut affichés

**Résultat attendu :** Les 2 incidents résolus sont affichés. Leurs badges de statut indiquent "Résolu" (badge vert ou grisé). Aucun incident "Ouvert" ou "En cours" n'est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-111 — Création d'un incident (titre, description, sévérité, bien)

**Module :** Incidents
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des biens existent.
**Données de test :** Titre : "Climatisation en panne", Description : "La clim de la chambre principale ne fonctionne plus depuis ce matin", Sévérité : Important, Bien : Appartement Montmartre

**Étapes :**
1. Cliquer sur "Signaler un incident" ou "+ Incident"
2. Saisir le titre "Climatisation en panne"
3. Saisir la description
4. Sélectionner la sévérité "Important"
5. Sélectionner le bien "Appartement Montmartre"
6. Cliquer sur "Créer l'incident"

**Résultat attendu :** L'incident est créé avec le statut "Ouvert". Il apparaît en tête de liste (triée par date de création décroissante). Un toast "Incident signalé avec succès" s'affiche. Un ID est généré (ex : INC-006).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-112 — Validation : titre obligatoire

**Module :** Incidents
**Priorité :** 🟠 Haute
**Préconditions :** Le formulaire de création d'incident est ouvert.
**Données de test :** Formulaire avec titre vide

**Étapes :**
1. Remplir tous les champs sauf le titre
2. Cliquer sur "Créer l'incident"

**Résultat attendu :** La soumission est bloquée. Un message d'erreur s'affiche sous le champ Titre : "Le titre est obligatoire". Aucune requête API n'est émise.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-113 — Détail d'un incident : toutes les informations affichées

**Module :** Incidents
**Priorité :** 🟠 Haute
**Préconditions :** La liste des incidents est affichée.
**Données de test :** Incident INC-001 "Fuite d'eau salle de bain" — Villa Les Pins — Urgent — Ouvert

**Étapes :**
1. Cliquer sur l'incident "Fuite d'eau salle de bain"
2. Vérifier toutes les informations de la page/modale de détail

**Résultat attendu :** La fiche détail affiche : titre, description complète, sévérité (badge rouge Urgent), statut, bien concerné (Villa Les Pins), date de création, utilisateur qui a signalé, responsable affecté (si défini), coût estimé, coût réel, historique des modifications.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-114 — Changement de statut d'un incident

**Module :** Incidents
**Priorité :** 🔴 Critique
**Préconditions :** La fiche détail d'un incident "Ouvert" est accessible.
**Données de test :** Incident INC-001 — statut "Ouvert" → "En cours"

**Étapes :**
1. Ouvrir la fiche de l'incident INC-001
2. Modifier le statut de "Ouvert" à "En cours"
3. Sauvegarder

**Résultat attendu :** Le statut de l'incident INC-001 passe à "En cours". Le badge de statut est mis à jour. Un toast de confirmation s'affiche. Le dashboard reflète la mise à jour (KPI incidents actifs).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-115 — Affectation d'un incident à un utilisateur

**Module :** Incidents
**Priorité :** 🟠 Haute
**Préconditions :** La fiche détail d'un incident est ouverte. Des utilisateurs existent.
**Données de test :** Incident INC-002 — Affectation à : Pierre Durand (Manager)

**Étapes :**
1. Ouvrir la fiche de l'incident INC-002
2. Repérer le champ "Responsable" ou "Affecté à"
3. Sélectionner "Pierre Durand" dans la liste des utilisateurs
4. Sauvegarder

**Résultat attendu :** L'incident INC-002 est maintenant affecté à Pierre Durand. Son nom s'affiche dans la fiche. Pierre Durand peut recevoir une notification (si la fonctionnalité est implémentée). La liste des incidents affiche l'assignation.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-116 — Incident Urgent → badge et icône d'alerte visibles

**Module :** Incidents
**Priorité :** 🔴 Critique
**Préconditions :** Un incident avec sévérité "Urgent" existe en base.
**Données de test :** Incident INC-001 "Fuite d'eau" — Sévérité : Urgent

**Étapes :**
1. Observer la liste des incidents
2. Identifier l'incident "Fuite d'eau" (Urgent)
3. Vérifier la présence du badge rouge "Urgent" et d'une icône d'alerte (⚠️ ou 🔴)

**Résultat attendu :** L'incident urgent est visuellement mis en évidence : badge rouge "Urgent", icône d'alerte visible, position en haut de la liste (tri par priorité). Le même badge est visible sur le dashboard (TC-034).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-117 — Coût estimé vs coût réel

**Module :** Incidents
**Priorité :** 🟡 Moyenne
**Préconditions :** La fiche détail d'un incident avec des coûts renseignés est ouverte.
**Données de test :** Incident INC-003 "Chauffe-eau en panne" — Coût estimé : 350€, Coût réel : 420€

**Étapes :**
1. Ouvrir la fiche de l'incident INC-003
2. Identifier les champs "Coût estimé" et "Coût réel"
3. Vérifier les valeurs affichées

**Résultat attendu :** Les deux coûts sont affichés : "Coût estimé : 350,00 €" et "Coût réel : 420,00 €". Si le coût réel dépasse le coût estimé, un indicateur visuel (couleur rouge) peut signaler la dérive. Les montants sont en euros avec 2 décimales.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-118 — Date de résolution renseignée à la clôture

**Module :** Incidents
**Priorité :** 🟡 Moyenne
**Préconditions :** Un incident est en cours de résolution.
**Données de test :** Incident INC-003 "Chauffe-eau en panne" — passage au statut "Résolu"

**Étapes :**
1. Ouvrir la fiche de l'incident INC-003
2. Modifier le statut vers "Résolu"
3. Sauvegarder
4. Vérifier la date de résolution affichée

**Résultat attendu :** Lors du passage au statut "Résolu", la date de résolution est automatiquement renseignée avec la date et l'heure courante. Cette date est visible dans la fiche : "Résolu le : 15/05/2026 à 14h32". La date ne peut pas être dans le futur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 09 — Messagerie

---

#### TC-119 — Affichage de la liste des conversations (sidebar)

**Module :** Messagerie
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des conversations existent.
**Données de test :** 6 conversations actives en démo

**Étapes :**
1. Naviguer vers `/messages` depuis la sidebar
2. Observer la liste des conversations dans le panneau gauche

**Résultat attendu :** La liste des conversations s'affiche dans une sidebar gauche. Chaque conversation montre : nom du voyageur, nom du bien, extrait du dernier message, date du dernier message. Les conversations avec des messages non lus affichent un indicateur (badge numéroté ou point bleu).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-120 — Sélection d'une conversation → thread de messages

**Module :** Messagerie
**Priorité :** 🔴 Critique
**Préconditions :** La liste des conversations est affichée.
**Données de test :** Conversation : Thomas Leclerc — Villa Les Pins

**Étapes :**
1. Cliquer sur la conversation "Thomas Leclerc — Villa Les Pins"
2. Observer le chargement du thread dans le panneau droit

**Résultat attendu :** Le thread de messages de Thomas Leclerc s'affiche dans le panneau central/droit. Les messages sont affichés dans l'ordre chronologique (plus ancien en haut, plus récent en bas). Un champ de saisie est disponible en bas pour envoyer un nouveau message.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-121 — Affichage des messages entrants et sortants (direction visuelle)

**Module :** Messagerie
**Priorité :** 🟠 Haute
**Préconditions :** Un thread de messages est affiché.
**Données de test :** Thread Thomas Leclerc : message reçu (voyageur) + message envoyé (agence)

**Étapes :**
1. Ouvrir la conversation de Thomas Leclerc
2. Identifier un message reçu (du voyageur)
3. Identifier un message envoyé (par l'agence)
4. Vérifier la distinction visuelle entre entrant et sortant

**Résultat attendu :** Les messages reçus (du voyageur) sont alignés à gauche avec un fond gris ou blanc. Les messages envoyés (par l'agence) sont alignés à droite avec un fond coloré (bleu ou vert). La distinction est claire et immédiate.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-122 — Badge de canal sur chaque message (Airbnb, Booking, Email, SMS)

**Module :** Messagerie
**Priorité :** 🟡 Moyenne
**Préconditions :** Un thread contenant des messages de différents canaux est ouvert.
**Données de test :** Thread contenant : message Airbnb, email, SMS

**Étapes :**
1. Ouvrir un thread de conversation avec des messages multi-canaux
2. Vérifier la présence d'un badge de canal sur chaque message

**Résultat attendu :** Chaque message affiche un badge indiquant le canal : "Airbnb" (rouge), "Booking" (bleu), "Email" (gris), "SMS" (vert). Ces badges permettent d'identifier rapidement la provenance de chaque message.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-123 — Envoi d'un nouveau message

**Module :** Messagerie
**Priorité :** 🔴 Critique
**Préconditions :** Un thread de conversation est ouvert.
**Données de test :** Message à envoyer : "Bonjour Thomas, votre code d'accès est le 4789. Bonne arrivée !"

**Étapes :**
1. Ouvrir la conversation de Thomas Leclerc
2. Cliquer dans le champ de saisie en bas du thread
3. Saisir "Bonjour Thomas, votre code d'accès est le 4789. Bonne arrivée !"
4. Appuyer sur Entrée ou cliquer sur le bouton "Envoyer"

**Résultat attendu :** Le message est envoyé et apparaît immédiatement dans le thread, aligné à droite (message sortant), avec la date et l'heure actuelles. Le champ de saisie est vidé. L'indicateur de canal affiche le canal sélectionné (ou le canal par défaut).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-124 — Message envoyé apparaît dans le thread

**Module :** Messagerie
**Priorité :** 🔴 Critique
**Préconditions :** TC-123 exécuté. Le message a été envoyé.
**Données de test :** Message envoyé en TC-123

**Étapes :**
1. Observer le thread après l'envoi du message en TC-123
2. Vérifier la présence du message dans le thread

**Résultat attendu :** Le message "Bonjour Thomas, votre code d'accès est le 4789. Bonne arrivée !" est visible dans le thread, positionné en bas (dernier message), aligné à droite. La date et l'heure d'envoi sont affichées.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Ce test est lié à TC-123.

---

#### TC-125 — Marquage automatique comme lu à l'ouverture

**Module :** Messagerie
**Priorité :** 🟡 Moyenne
**Préconditions :** Une conversation avec des messages non lus (badge bleu) existe.
**Données de test :** Conversation de Marie Dupont — 2 messages non lus (badge "2")

**Étapes :**
1. Identifier une conversation avec un badge de messages non lus dans la sidebar
2. Cliquer sur cette conversation pour l'ouvrir
3. Observer le badge après l'ouverture

**Résultat attendu :** Dès l'ouverture de la conversation, le badge de messages non lus disparaît. La conversation est marquée comme lue. La liste des conversations n'affiche plus d'indicateur de non-lu pour cette conversation.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-126 — Messages automatiques vs manuels (badge "Auto")

**Module :** Messagerie
**Priorité :** 🟡 Moyenne
**Préconditions :** Un thread contient des messages automatiques (envoyés par le système).
**Données de test :** Message automatique de confirmation de réservation Airbnb

**Étapes :**
1. Ouvrir un thread contenant un message automatique
2. Identifier le message automatique
3. Vérifier la présence d'un badge distinctif

**Résultat attendu :** Les messages envoyés automatiquement par le système (ex : confirmations, rappels) affichent un badge "Auto" ou "Automatique". Les messages manuels n'ont pas ce badge. La distinction est visuellement claire.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-127 — Affichage de la date/heure de chaque message

**Module :** Messagerie
**Priorité :** 🟠 Haute
**Préconditions :** Un thread de conversation est ouvert.
**Données de test :** Messages avec des dates différentes (hier, aujourd'hui)

**Étapes :**
1. Ouvrir un thread de conversation
2. Identifier la date/heure affichée pour chaque message

**Résultat attendu :** Chaque message affiche sa date et heure d'envoi. Le format est lisible : "12/05/2026 à 14h32" ou relatif "Hier à 14h32" pour les messages récents. Les messages du même jour peuvent être regroupés sous un séparateur de date.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-128 — Conversation vide → état vide avec CTA

**Module :** Messagerie
**Priorité :** 🟡 Moyenne
**Préconditions :** Aucune conversation n'est sélectionnée (ou aucune conversation n'existe).
**Données de test :** État initial de la page messages sans sélection

**Étapes :**
1. Naviguer vers `/messages`
2. Ne sélectionner aucune conversation dans la sidebar (ou créer un état sans conversations)
3. Observer le panneau central

**Résultat attendu :** Le panneau central affiche un état vide avec un message : "Sélectionnez une conversation" ou "Aucune conversation pour le moment". Un bouton CTA peut inviter à créer un nouveau message ou à connecter un canal de messagerie.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-129 — Recherche dans les conversations

**Module :** Messagerie
**Priorité :** 🟡 Moyenne
**Préconditions :** La page messagerie est affichée avec plusieurs conversations.
**Données de test :** Recherche : "Thomas"

**Étapes :**
1. Repérer le champ de recherche dans la sidebar des conversations
2. Saisir "Thomas"
3. Observer le filtre en temps réel

**Résultat attendu :** Seules les conversations dont le nom du voyageur ou le contenu contient "Thomas" sont affichées dans la sidebar. La recherche se fait en temps réel ou après soumission. Un bouton pour effacer la recherche est disponible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-130 — Lien vers la réservation depuis la conversation

**Module :** Messagerie
**Priorité :** 🟠 Haute
**Préconditions :** Un thread de conversation lié à une réservation est ouvert.
**Données de test :** Conversation Thomas Leclerc — liée à la réservation BK-001

**Étapes :**
1. Ouvrir la conversation de Thomas Leclerc
2. Repérer le lien ou bouton "Voir la réservation" ou "BK-001" dans le panneau de détail
3. Cliquer dessus

**Résultat attendu :** L'utilisateur est redirigé vers la fiche 360° de la réservation BK-001. La navigation est correcte. La fiche se charge sans erreur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 10 — Finances

---

#### TC-131 — Affichage du résumé financier mensuel (CA, commission, net)

**Module :** Finances
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des réservations terminées existent pour le mois en cours.
**Données de test :** Mai 2026 : CA brut 12 500€, commission 20% = 2 500€, net 10 000€

**Étapes :**
1. Naviguer vers `/finances` depuis la sidebar
2. Observer le résumé financier mensuel affiché en haut de page

**Résultat attendu :** Le résumé mensuel affiche : CA brut "12 500,00 €", commission "2 500,00 € (20%)", net reversé "10 000,00 €". Les montants sont en euros avec 2 décimales. Le mois de référence est indiqué (Mai 2026).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-132 — Liste des factures avec colonnes : propriétaire, période, brut, commission, net, statut

**Module :** Finances
**Priorité :** 🔴 Critique
**Préconditions :** La page Finances est affichée. Des factures existent en base.
**Données de test :** Facture : Jean-Luc Rousseau, Mai 2026, 4 800€ brut, 960€ comm, 3 840€ net, Envoyé

**Étapes :**
1. Identifier le tableau des factures de reversement
2. Vérifier les colonnes : Propriétaire, Période, Brut, Commission, Net, Statut

**Résultat attendu :** Le tableau des factures affiche bien les 6 colonnes. Pour la facture de Jean-Luc Rousseau : Propriétaire "Jean-Luc Rousseau", Période "Mai 2026", Brut "4 800,00 €", Commission "960,00 €", Net "3 840,00 €", Statut "Envoyé" (badge orange).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-133 — Badge statut facture : brouillon, envoyé, payé, en retard

**Module :** Finances
**Priorité :** 🟠 Haute
**Préconditions :** La liste des factures contient des factures avec différents statuts.
**Données de test :** Statuts présents : Brouillon (gris), Envoyé (orange), Payé (vert), En retard (rouge)

**Étapes :**
1. Identifier des factures avec chaque statut dans le tableau
2. Vérifier la couleur du badge pour chaque statut

**Résultat attendu :** Code couleur : "Brouillon" = gris, "Envoyé" = orange/jaune, "Payé" = vert, "En retard" = rouge. Les badges sont visibles et lisibles dans le tableau.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-134 — Filtrage par statut de facture

**Module :** Finances
**Priorité :** 🟡 Moyenne
**Préconditions :** La liste des factures contient des factures avec différents statuts.
**Données de test :** Filtre "En retard" → 1 facture en retard

**Étapes :**
1. Sélectionner le filtre "En retard" sur la liste des factures
2. Vérifier que seule la facture en retard apparaît

**Résultat attendu :** Seule la facture avec le statut "En retard" est affichée. Son badge est rouge. Le compteur de résultats est mis à jour.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-135 — Filtrage par propriétaire

**Module :** Finances
**Priorité :** 🟡 Moyenne
**Préconditions :** Plusieurs propriétaires ont des factures.
**Données de test :** Filtre propriétaire : "Jean-Luc Rousseau" → 2 factures

**Étapes :**
1. Sélectionner "Jean-Luc Rousseau" dans le filtre par propriétaire
2. Vérifier que seules ses factures sont affichées

**Résultat attendu :** Seules les 2 factures de Jean-Luc Rousseau sont affichées. La colonne "Propriétaire" indique "Jean-Luc Rousseau" pour chaque ligne.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-136 — Détail d'une facture (décomposition complète)

**Module :** Finances
**Priorité :** 🔴 Critique
**Préconditions :** Le tableau des factures est affiché.
**Données de test :** Facture Jean-Luc Rousseau — Mai 2026

**Étapes :**
1. Cliquer sur la facture de Jean-Luc Rousseau pour Mai 2026
2. Observer la décomposition dans le détail

**Résultat attendu :** Le détail de la facture affiche la liste de toutes les réservations du mois, chacune avec son montant brut. Le total brut, la commission globale (détaillée par réservation si possible), les éventuelles déductions (réparations, incidents), et le montant net final sont tous affichés. Un lien vers chaque réservation est présent.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-137 — Calcul correct : net = brut − commission − déductions

**Module :** Finances
**Priorité :** 🔴 Critique
**Préconditions :** Une facture avec des déductions existe en base.
**Données de test :** Brut : 4 800€, Commission 20% : 960€, Déduction réparation : 350€, Net attendu : 3 490€

**Étapes :**
1. Ouvrir le détail de la facture de Jean-Luc Rousseau avec déduction
2. Relever les montants : brut, commission, déductions, net

**Résultat attendu :** Le calcul est correct : Net = 4 800 − 960 − 350 = **3 490,00 €**. Chaque ligne de déduction est détaillée (libellé + montant). Le total net est en accord avec le calcul.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérifier à 1 centime près (problèmes d'arrondi potentiels).

---

#### TC-138 — Bouton "Générer reversement" → création d'une facture

**Module :** Finances
**Priorité :** 🔴 Critique
**Préconditions :** Des réservations terminées existent pour un propriétaire sans facture générée ce mois-ci.
**Données de test :** Propriétaire : Jean-Luc Rousseau, Période : Juin 2026 (sans facture)

**Étapes :**
1. Cliquer sur le bouton "Générer reversement" ou "Créer une facture"
2. Sélectionner le propriétaire "Jean-Luc Rousseau"
3. Sélectionner la période "Juin 2026"
4. Cliquer sur "Générer"

**Résultat attendu :** Une nouvelle facture est créée en statut "Brouillon" pour Jean-Luc Rousseau / Juin 2026. Elle apparaît dans la liste avec le badge "Brouillon" (gris). Le montant est pré-calculé à partir des réservations terminées en juin.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-139 — Bouton "Exporter CSV" → téléchargement d'un fichier

**Module :** Finances
**Priorité :** 🟠 Haute
**Préconditions :** La page Finances est affichée avec des données.
**Données de test :** Bouton "Exporter CSV" sur la page Finances

**Étapes :**
1. Cliquer sur le bouton "Exporter CSV" ou "Exporter"
2. Attendre le déclenchement du téléchargement
3. Vérifier que le fichier est téléchargé

**Résultat attendu :** Un fichier CSV est téléchargé par le navigateur. Le nom du fichier est descriptif (ex : `concierge-finances-mai-2026.csv`). Le fichier s'ouvre correctement dans un tableur (Excel, LibreOffice) avec les colonnes attendues (propriétaire, période, brut, commission, net, statut).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-140 — Affichage des montants en euros avec 2 décimales

**Module :** Finances
**Priorité :** 🟠 Haute
**Préconditions :** La page Finances est affichée avec des données financières.
**Données de test :** Montants à vérifier dans la liste des factures et le résumé

**Étapes :**
1. Observer tous les montants affichés sur la page Finances
2. Vérifier le format : nombre avec 2 décimales + symbole €

**Résultat attendu :** Tous les montants financiers affichent exactement 2 décimales (ex : "3 840,00 €" et non "3840" ou "3 840 €"). Le séparateur décimal est une virgule (format français). Le symbole "€" est présent à droite du nombre. Les grands montants utilisent le séparateur de milliers (espace ou point).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-141 — Facture avec déductions (réparations) → calcul correct

**Module :** Finances
**Priorité :** 🔴 Critique
**Préconditions :** TC-137 exécuté. Une facture avec déduction est accessible.
**Données de test :** Facture Jean-Luc Rousseau avec déduction de 350€ pour réparation chauffe-eau

**Étapes :**
1. Ouvrir le détail de la facture avec déduction
2. Identifier la ligne de déduction "Réparation chauffe-eau : −350,00 €"
3. Vérifier que le total net tient compte de cette déduction

**Résultat attendu :** La déduction "Réparation chauffe-eau : −350,00 €" est clairement listée dans la décomposition. Le net final intègre cette déduction dans le calcul. Le calcul est correct (cf. TC-137).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-142 — Aucune facture → état vide avec message

**Module :** Finances
**Priorité :** 🟡 Moyenne
**Préconditions :** Aucune facture n'existe pour la période sélectionnée.
**Données de test :** Filtre : Septembre 2026 (aucune facture)

**Étapes :**
1. Appliquer le filtre de période "Septembre 2026"
2. Observer l'état de la liste des factures

**Résultat attendu :** La liste des factures est vide. Un message s'affiche : "Aucune facture pour cette période" ou équivalent. Un bouton "Générer un reversement" est proposé comme action principale.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 11 — Analytics

---

#### TC-143 — Affichage des KPI cards (CA global, taux occupation, RevPAR, ADR)

**Module :** Analytics
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur admin est connecté. Des données existent.
**Données de test :** Données démo mai 2026 : CA 12 500€, taux occupation 78%, RevPAR 124€, ADR 158€

**Étapes :**
1. Naviguer vers `/analytics` depuis la sidebar
2. Observer les KPI cards en haut de page
3. Vérifier la présence et les valeurs de chaque KPI

**Résultat attendu :** 4 KPI cards sont affichées : CA global "12 500,00 €", Taux d'occupation "78%", RevPAR "124,00 €", ADR (Average Daily Rate) "158,00 €". Chaque card affiche une variation vs la période précédente (flèche + pourcentage).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** ADR = Revenu total / Nuits réservées.

---

#### TC-144 — Graphique en barres du CA mensuel (12 mois)

**Module :** Analytics
**Priorité :** 🟠 Haute
**Préconditions :** La page Analytics est affichée. Des données sur 12 mois existent.
**Données de test :** Données des 12 derniers mois de l'agence

**Étapes :**
1. Identifier le graphique en barres du CA mensuel sur la page Analytics
2. Vérifier que le graphique couvre 12 mois
3. Vérifier que les barres sont proportionnelles aux montants
4. Survoler une barre pour voir le détail

**Résultat attendu :** Un graphique en barres verticales affiche le CA mensuel des 12 derniers mois. L'axe X montre les mois (ex : Juin 25 à Mai 26), l'axe Y les montants en euros. Le survol d'une barre affiche une infobulle avec le mois et le CA exact. Le graphique est responsive.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-145 — Tableau de performance par bien

**Module :** Analytics
**Priorité :** 🟠 Haute
**Préconditions :** La page Analytics est affichée. Plusieurs biens existent.
**Données de test :** 4 biens dans les données de démo

**Étapes :**
1. Identifier le tableau de performance par bien sur la page Analytics
2. Vérifier que les 4 biens sont listés
3. Vérifier les données de chaque bien

**Résultat attendu :** Un tableau liste les 4 biens avec leurs indicateurs : Villa Les Pins, Appartement Montmartre, Studio Canal, Appartement Marais. Chaque ligne affiche les métriques de performance pour la période sélectionnée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-146 — Colonnes du tableau : bien, occupation, CA, RevPAR

**Module :** Analytics
**Priorité :** 🟠 Haute
**Préconditions :** Le tableau de performance par bien est visible.
**Données de test :** Villa Les Pins : occupation 82%, CA 4 800€, RevPAR 138€

**Étapes :**
1. Vérifier les colonnes du tableau : Bien, Taux d'occupation, CA, RevPAR
2. Vérifier les données de la Villa Les Pins
3. Vérifier le format des valeurs (%, €, €)

**Résultat attendu :** Les 4 colonnes sont présentes — Bien, Taux d'occupation (%), CA (€), RevPAR (€). La ligne Villa Les Pins affiche : 82%, 4 800,00€, 138,00€. Les valeurs monétaires ont 2 décimales.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-147 — Tri du tableau par colonne

**Module :** Analytics
**Priorité :** 🟡 Moyenne
**Préconditions :** Le tableau de performance par bien est visible avec au moins 3 biens.
**Données de test :** 4 biens de la démo

**Étapes :**
1. Cliquer sur l'en-tête de colonne "CA"
2. Vérifier l'ordre décroissant des lignes
3. Cliquer à nouveau sur "CA"
4. Vérifier l'ordre croissant
5. Cliquer sur "Taux d'occupation" et vérifier le tri

**Résultat attendu :** Le tableau se trie de manière décroissante au premier clic, puis croissante au second clic. Une icône de flèche indique la colonne triée et la direction (↑ / ↓). Le tri fonctionne pour toutes les colonnes numériques.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-148 — Sélecteur de période (filtre mois/trimestre/année)

**Module :** Analytics
**Priorité :** 🔴 Critique
**Préconditions :** La page Analytics est affichée.
**Données de test :** Données démo couvrant 12 mois

**Étapes :**
1. Repérer le sélecteur de période en haut de page
2. Sélectionner "Ce mois" (mai 2026)
3. Vérifier la mise à jour des KPIs
4. Sélectionner "Trimestre en cours" (T2 2026)
5. Vérifier la mise à jour des KPIs
6. Sélectionner "Année en cours" (2026)
7. Vérifier la mise à jour des KPIs

**Résultat attendu :** À chaque changement de période, les KPI cards, le graphique en barres et le tableau de performance se mettent à jour avec les données correspondant à la période sélectionnée. Le titre de la période est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-149 — Mise à jour des KPIs selon la période sélectionnée

**Module :** Analytics
**Priorité :** 🔴 Critique
**Préconditions :** Le sélecteur de période est opérationnel (TC-148 passé).
**Données de test :** CA attendu pour "Ce mois" : ≠ CA attendu pour "Trimestre"

**Étapes :**
1. Relever les valeurs des 4 KPI cards sur la période "Ce mois"
2. Changer la période pour "Trimestre en cours"
3. Comparer les nouvelles valeurs des 4 KPI cards
4. Vérifier que les valeurs ont changé de façon cohérente (trimestre > mois)

**Résultat attendu :** Les valeurs des KPI cards (CA global, Taux d'occupation, RevPAR, ADR) sont cohérentes avec la période sélectionnée. Le CA du trimestre est supérieur ou égal au CA du mois. Les valeurs ne sont pas identiques sur toutes les périodes.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-150 — Bouton "Exporter" → CSV des données

**Module :** Analytics
**Priorité :** 🟠 Haute
**Préconditions :** La page Analytics affiche des données. L'utilisateur est connecté en tant qu'Admin.
**Données de test :** Période "Année en cours" sélectionnée

**Étapes :**
1. Sélectionner la période "Année en cours"
2. Cliquer sur le bouton "Exporter" (ou "Exporter CSV")
3. Vérifier qu'un téléchargement se déclenche
4. Ouvrir le fichier téléchargé
5. Vérifier le contenu du fichier

**Résultat attendu :** Un fichier CSV est téléchargé automatiquement, nommé `analytics-2026.csv` ou similaire. Le fichier contient les colonnes : Bien, Taux d'occupation, CA, RevPAR, ADR. Les données correspondent à la période sélectionnée. L'encodage est UTF-8 (caractères accentués corrects).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-151 — Affichage correct si aucune donnée pour la période

**Module :** Analytics
**Priorité :** 🟡 Moyenne
**Préconditions :** La page Analytics est affichée.
**Données de test :** Sélectionner une période très ancienne sans données (ex : Janvier 2020)

**Étapes :**
1. Ouvrir le sélecteur de période
2. Sélectionner ou saisir une période sans données (ex : T1 2020)
3. Observer les KPI cards, le graphique et le tableau

**Résultat attendu :** Les KPI cards affichent 0 ou "N/A". Le graphique affiche des barres vides ou un message "Aucune donnée pour cette période". Le tableau affiche un état vide avec un message explicatif. Aucune erreur JavaScript dans la console.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-152 — Graphique responsive sur mobile

**Module :** Analytics
**Priorité :** 🟡 Moyenne
**Préconditions :** La page Analytics est accessible sur mobile (375px de largeur).
**Données de test :** Données démo standard

**Étapes :**
1. Réduire la fenêtre à 375px de largeur (ou utiliser DevTools > iPhone SE)
2. Naviguer vers la page Analytics
3. Observer l'affichage du graphique en barres
4. Vérifier la lisibilité des axes
5. Tester le scroll horizontal si applicable

**Résultat attendu :** Le graphique en barres s'adapte à la largeur mobile. Les axes sont lisibles. Les barres ne sont pas tronquées. Si le graphique nécessite un scroll horizontal, un indicateur visuel le signale. Les KPI cards passent en 2 colonnes (2×2) ou en liste.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 12 — Paramètres (TC-153 à TC-162)

---

#### TC-153 — Affichage du profil de l'agence (nom, email, plan)

**Module :** Paramètres
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté en tant qu'Admin de "Conciergerie Paris Elite".
**Données de test :** Agence : Conciergerie Paris Elite, email : contact@paris-elite.fr, plan : Pro

**Étapes :**
1. Cliquer sur "Paramètres" dans la sidebar
2. Vérifier l'onglet "Profil agence" ou section équivalente
3. Observer les informations affichées

**Résultat attendu :** La section affiche : Nom de l'agence "Conciergerie Paris Elite", Email de contact "contact@paris-elite.fr", Plan actuel "Pro", Date de fin d'essai ou date de renouvellement. Toutes les informations sont correctes et lisibles.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-154 — Modification du nom de l'agence

**Module :** Paramètres
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est Admin. La page Paramètres est affichée.
**Données de test :** Nouveau nom : "Conciergerie Paris Elite Premium"

**Étapes :**
1. Cliquer sur le champ "Nom de l'agence" (ou bouton "Modifier")
2. Effacer le nom actuel
3. Saisir "Conciergerie Paris Elite Premium"
4. Cliquer sur "Enregistrer"
5. Recharger la page
6. Vérifier que le nouveau nom est conservé

**Résultat attendu :** Après enregistrement, un toast de confirmation "Paramètres enregistrés" apparaît. Après rechargement, le nom "Conciergerie Paris Elite Premium" est affiché. Le nom est également mis à jour dans la sidebar (logo/nom de l'agence).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Remettre le nom original après le test.

---

#### TC-155 — Affichage du plan actuel et date de fin d'essai

**Module :** Paramètres
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté en compte d'essai gratuit.
**Données de test :** Compte démo en période d'essai (15 jours)

**Étapes :**
1. Accéder aux Paramètres
2. Repérer la section "Plan & Abonnement"
3. Vérifier l'affichage du plan actuel
4. Vérifier l'affichage de la date de fin d'essai
5. Vérifier la présence d'un bouton "Passer à Pro" ou "Upgrader"

**Résultat attendu :** La section affiche : Plan "Essai gratuit (15 jours)" ou "Pro — Période d'essai", la date de fin d'essai (ex : "Expire le 15 juin 2026"), un compteur de jours restants, et un CTA "Choisir un plan" ou "Upgrader maintenant".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-156 — Liste des utilisateurs de l'agence (nom, rôle, email, statut)

**Module :** Paramètres
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est Admin. L'agence a plusieurs utilisateurs.
**Données de test :** Utilisateurs démo : Marie Dupont (Admin), Jean Martin (Manager), Sophie Leblanc (Prestataire)

**Étapes :**
1. Accéder aux Paramètres > onglet "Utilisateurs" ou "Équipe"
2. Vérifier la liste des utilisateurs
3. Vérifier les colonnes affichées pour chaque utilisateur

**Résultat attendu :** Le tableau liste tous les utilisateurs de l'agence avec : Nom, Rôle (badge coloré : Admin=violet, Manager=bleu, Prestataire=vert), Email, Statut (Actif=vert, Inactif=gris). Les 3 utilisateurs démo sont visibles.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-157 — Invitation d'un nouvel utilisateur par email

**Module :** Paramètres
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est Admin. La page Utilisateurs est affichée.
**Données de test :** Email : nouveau@test-concierge.fr, Rôle : Manager

**Étapes :**
1. Cliquer sur "Inviter un utilisateur" ou "+ Ajouter"
2. Saisir l'email "nouveau@test-concierge.fr"
3. Sélectionner le rôle "Manager"
4. Cliquer sur "Envoyer l'invitation"
5. Vérifier le retour visuel

**Résultat attendu :** Un toast de confirmation "Invitation envoyée à nouveau@test-concierge.fr" apparaît. L'utilisateur invité apparaît dans la liste avec le statut "En attente" (badge orange). Le bouton d'invitation revient à son état initial.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** En mode démo, l'email n'est pas réellement envoyé.

---

#### TC-158 — Validation : email invalide pour invitation

**Module :** Paramètres
**Priorité :** 🟡 Moyenne
**Préconditions :** La modale d'invitation est ouverte.
**Données de test :** Email invalide : "pasunemail", "test@", "@domaine.fr"

**Étapes :**
1. Ouvrir la modale d'invitation
2. Saisir "pasunemail" dans le champ email
3. Cliquer sur "Envoyer"
4. Vérifier le message d'erreur
5. Recommencer avec "@domaine.fr"

**Résultat attendu :** Un message d'erreur "Adresse email invalide" s'affiche sous le champ. L'invitation n'est pas envoyée. Le bouton "Envoyer" reste disponible pour correction. Le champ email est mis en évidence (bordure rouge).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-159 — Modification du rôle d'un utilisateur

**Module :** Paramètres
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est Admin. Un Manager existe dans la liste.
**Données de test :** Jean Martin (Manager) → passer en rôle Prestataire

**Étapes :**
1. Localiser "Jean Martin" dans la liste des utilisateurs
2. Cliquer sur "Modifier" ou sur le badge de rôle
3. Changer le rôle de "Manager" à "Prestataire"
4. Confirmer la modification
5. Vérifier la mise à jour dans la liste

**Résultat attendu :** Le rôle de Jean Martin est mis à jour en "Prestataire" avec le badge vert correspondant. Un toast "Rôle mis à jour" apparaît. Les permissions de Jean Martin sont immédiatement adaptées à son nouveau rôle.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Remettre le rôle Manager après le test.

---

#### TC-160 — Désactivation d'un utilisateur

**Module :** Paramètres
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est Admin. L'utilisateur cible n'est pas l'Admin connecté.
**Données de test :** Sophie Leblanc (Prestataire, Actif)

**Étapes :**
1. Localiser "Sophie Leblanc" dans la liste
2. Cliquer sur "Désactiver" ou le menu action (⋮)
3. Confirmer la désactivation dans la modale de confirmation
4. Vérifier le statut de Sophie dans la liste

**Résultat attendu :** Une modale de confirmation "Désactiver cet utilisateur ?" avec les boutons "Annuler" et "Désactiver" apparaît. Après confirmation, le statut de Sophie Leblanc passe à "Inactif" (badge gris). Un toast "Utilisateur désactivé" apparaît. Sophie ne peut plus se connecter.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Réactiver Sophie après le test.

---

#### TC-161 — Affichage des intégrations configurées (Stripe, Resend, etc.)

**Module :** Paramètres
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est Admin. La page Paramètres > Intégrations est affichée.
**Données de test :** —

**Étapes :**
1. Accéder à Paramètres > onglet "Intégrations"
2. Vérifier la liste des intégrations disponibles
3. Identifier les intégrations configurées vs non configurées
4. Vérifier l'affichage des statuts

**Résultat attendu :** La page liste les intégrations disponibles : Stripe (paiements), Resend (emails), Airbnb API, Booking.com API. Chaque intégration affiche un badge "Connecté" (vert) ou "Non configuré" (gris). Les intégrations connectées affichent des informations partielles (ex : clé API masquée ••••••1234).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-162 — Sauvegarde des paramètres → confirmation toast

**Module :** Paramètres
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est Admin. Un champ de paramètre est modifiable.
**Données de test :** Modifier le numéro de téléphone de l'agence : +33 1 23 45 67 89

**Étapes :**
1. Modifier le numéro de téléphone de l'agence
2. Cliquer sur "Enregistrer" (ou "Sauvegarder")
3. Observer le retour visuel
4. Vérifier que la modification est persistée

**Résultat attendu :** Immédiatement après le clic, un toast de succès "Paramètres enregistrés avec succès" apparaît en bas à droite de l'écran pendant 3 à 5 secondes. Le bouton "Enregistrer" est temporairement désactivé pendant l'enregistrement. Après rechargement, la modification est conservée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 13 — Portail Propriétaire (TC-163 à TC-172)

---

#### TC-163 — Accès au portail propriétaire

**Module :** Portail Propriétaire
**Priorité :** 🔴 Critique
**Préconditions :** Un compte propriétaire existe dans la base de données démo. Identifiants : proprietaire@paris-elite.fr / demo1234
**Données de test :** URL : /owner-portal ou via lien dédié

**Étapes :**
1. Se déconnecter du compte Admin si connecté
2. Accéder à l'URL /owner-portal (ou cliquer sur le lien envoyé au propriétaire)
3. Saisir les identifiants proprietaire@paris-elite.fr / demo1234
4. Valider la connexion

**Résultat attendu :** Le propriétaire est authentifié et accède à son portail personnel. L'interface affiche uniquement ses biens (pas ceux des autres propriétaires). La navigation est simplifiée (pas d'accès aux fonctions d'administration).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-164 — Affichage des biens du propriétaire (uniquement les siens)

**Module :** Portail Propriétaire
**Priorité :** 🔴 Critique
**Préconditions :** Connecté en tant que propriétaire de "Villa Les Pins" et "Appartement Montmartre". D'autres biens appartiennent à d'autres propriétaires.
**Données de test :** Propriétaire : M. Bertrand, 2 biens : Villa Les Pins (Cannes) + Appartement Montmartre (Paris 18e)

**Étapes :**
1. Se connecter en tant que M. Bertrand (proprietaire@paris-elite.fr)
2. Observer la liste des biens affichés dans le portail
3. Vérifier qu'aucun bien d'un autre propriétaire n'est visible

**Résultat attendu :** Le portail affiche exactement 2 biens : Villa Les Pins (Cannes) et Appartement Montmartre (Paris 18e). Les biens des autres propriétaires (ex : Studio Canal) ne sont pas visibles. Le titre indique "Mes biens (2)".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Vérification de l'isolation des données critiques.

---

#### TC-165 — KPIs par bien : taux occupation, revenus mensuels

**Module :** Portail Propriétaire
**Priorité :** 🟠 Haute
**Préconditions :** Connecté en tant que propriétaire. Des réservations existent pour ses biens en mai 2026.
**Données de test :** Villa Les Pins : 82% occupation, 4 800€ revenus bruts mai 2026

**Étapes :**
1. Observer les KPI cards affichées pour Villa Les Pins
2. Vérifier le taux d'occupation du mois en cours
3. Vérifier les revenus bruts du mois en cours
4. Répéter pour Appartement Montmartre

**Résultat attendu :** Chaque bien affiche une card KPI avec : Taux d'occupation du mois (ex : 82% pour Villa Les Pins), Revenus bruts du mois (ex : 4 800€), Revenus nets estimés (après commission). Les valeurs sont cohérentes avec les réservations du mois.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-166 — Résumé du prochain reversement (brut, commission, net)

**Module :** Portail Propriétaire
**Priorité :** 🟠 Haute
**Préconditions :** Une facture de reversement est générée pour le propriétaire (mois d'avril 2026).
**Données de test :** Brut : 4 800€, Commission 20% : 960€, Net : 3 840€

**Étapes :**
1. Localiser la section "Prochain reversement" sur le portail propriétaire
2. Vérifier l'affichage du montant brut (4 800€)
3. Vérifier le taux de commission affiché (20%)
4. Vérifier le montant de la commission (960€)
5. Vérifier le montant net (3 840€)
6. Vérifier le calcul : 4 800 − 960 = 3 840€

**Résultat attendu :** La section "Prochain reversement" affiche une décomposition claire : Brut 4 800,00€, Commission (20%) −960,00€, Net à percevoir 3 840,00€. La date estimée de reversement est indiquée. Le calcul est arithmétiquement correct.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-167 — Calendrier du bien : affichage des réservations

**Module :** Portail Propriétaire
**Priorité :** 🟠 Haute
**Préconditions :** Connecté en tant que propriétaire. Des réservations existent pour Villa Les Pins en mai et juin 2026.
**Données de test :** Réservation 1 : 15-22 mai 2026. Réservation 2 : 1-8 juin 2026.

**Étapes :**
1. Sélectionner "Villa Les Pins" dans le portail
2. Cliquer sur l'onglet "Calendrier"
3. Observer l'affichage du mois de mai 2026
4. Vérifier que les jours 15-22 mai sont marqués comme occupés
5. Naviguer vers juin 2026
6. Vérifier que les jours 1-8 juin sont marqués comme occupés

**Résultat attendu :** Le calendrier affiche le mois en cours avec les jours occupés colorés (orange ou bleu). Les plages de réservation 15-22 mai et 1-8 juin sont visibles avec des barres ou couleurs distinctes. Les jours libres sont blancs/neutres. La navigation entre mois fonctionne.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-168 — Blocage de dates en libre-service

**Module :** Portail Propriétaire
**Priorité :** 🟠 Haute
**Préconditions :** Connecté en tant que propriétaire. Le calendrier de Villa Les Pins est visible.
**Données de test :** Dates à bloquer : 25-31 juillet 2026 (usage personnel)

**Étapes :**
1. Sur le calendrier de Villa Les Pins, naviguer vers juillet 2026
2. Cliquer sur le 25 juillet
3. Maintenir et glisser jusqu'au 31 juillet (ou cliquer sur 31 juillet)
4. Confirmer le blocage dans la modale qui apparaît (motif : "Usage personnel")
5. Vérifier que les jours 25-31 juillet sont bloqués

**Résultat attendu :** Une modale de confirmation "Bloquer ces dates ?" apparaît avec les dates sélectionnées et un champ motif optionnel. Après confirmation, les jours 25-31 juillet apparaissent en gris hachuré sur le calendrier avec un cadenas ou icône "Bloqué". Ces dates ne sont pas disponibles pour de nouvelles réservations.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-169 — Documents disponibles (liste)

**Module :** Portail Propriétaire
**Priorité :** 🟡 Moyenne
**Préconditions :** Connecté en tant que propriétaire. Des documents ont été mis à disposition par l'agence.
**Données de test :** Documents démo : Facture avril 2026 (PDF), Contrat de gestion 2026 (PDF)

**Étapes :**
1. Naviguer vers l'onglet "Documents" du portail propriétaire
2. Vérifier la liste des documents disponibles
3. Cliquer sur "Télécharger" pour un document
4. Vérifier que le téléchargement se lance

**Résultat attendu :** L'onglet Documents liste les fichiers disponibles avec : nom du document, type (PDF), date de mise à disposition, et bouton "Télécharger". Le clic sur "Télécharger" déclenche le téléchargement du fichier PDF. Si aucun document n'est disponible, un état vide s'affiche.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-170 — Ticket en cours → bouton Valider / Refuser devis

**Module :** Portail Propriétaire
**Priorité :** 🟠 Haute
**Préconditions :** Un incident avec devis existe pour un bien du propriétaire. Statut : "En attente de validation propriétaire". Devis : Réparation chauffe-eau, 450€ TTC.
**Données de test :** Incident INC-042 — Panne chauffe-eau Villa Les Pins, devis 450€

**Étapes :**
1. Naviguer vers l'onglet "Tickets" ou "Incidents" du portail propriétaire
2. Localiser l'incident INC-042 avec le devis en attente
3. Cliquer sur "Voir le devis"
4. Lire les détails (description, prestataire, montant 450€)
5. Cliquer sur "Valider le devis"
6. Confirmer dans la modale de confirmation

**Résultat attendu :** La modale de devis affiche : description de l'incident, nom du prestataire, montant HT/TTC (450€ TTC), et les boutons "Valider" et "Refuser". Après validation, le ticket passe au statut "Devis accepté". Le propriétaire voit un message de confirmation. L'agence est notifiée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-171 — Affichage correct si aucune réservation à venir

**Module :** Portail Propriétaire
**Priorité :** 🟡 Moyenne
**Préconditions :** Connecté en tant que propriétaire dont tous les biens n'ont aucune réservation future.
**Données de test :** Compte test vide : proprietaire-test@paris-elite.fr

**Étapes :**
1. Se connecter avec le compte propriétaire sans réservations futures
2. Observer le calendrier et la section "Prochaines réservations"
3. Observer les KPI cards

**Résultat attendu :** La section "Prochaines réservations" affiche un état vide avec le message "Aucune réservation à venir" et éventuellement une illustration. Les KPI cards affichent 0% d'occupation et 0€ de revenus. Aucune erreur JavaScript n'est présente.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-172 — Responsive mobile du portail propriétaire

**Module :** Portail Propriétaire
**Priorité :** 🟠 Haute
**Préconditions :** Le portail propriétaire est accessible. Taille d'écran : 375px (iPhone SE).
**Données de test :** Connecté en tant que M. Bertrand

**Étapes :**
1. Réduire la fenêtre à 375px de largeur
2. Accéder au portail propriétaire
3. Vérifier l'affichage des KPI cards (1 colonne)
4. Vérifier l'affichage du calendrier (compact)
5. Vérifier les boutons "Valider" / "Refuser" accessibles au doigt
6. Vérifier l'absence de scroll horizontal

**Résultat attendu :** L'ensemble du portail est utilisable sur mobile 375px. Les KPI cards sont empilées en 1 colonne. Le calendrier est compact et tactile. Les boutons d'action ont une hauteur minimale de 44px (ergonomie tactile). Aucun scroll horizontal n'est nécessaire.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 14 — Portail Voyageur (TC-173 à TC-182)

---

#### TC-173 — Accès au portail via token unique dans l'URL

**Module :** Portail Voyageur
**Priorité :** 🔴 Critique
**Préconditions :** Une réservation active existe. Un token unique a été généré pour le voyageur.
**Données de test :** URL de test : /guest/abc123def456 (token de la réservation BKG-2026-0142)

**Étapes :**
1. Ouvrir une fenêtre de navigation privée (sans session)
2. Accéder à l'URL /guest/abc123def456
3. Observer la page chargée

**Résultat attendu :** La page du portail voyageur s'affiche sans demande de connexion. Le token est valide et identifie la réservation BKG-2026-0142. Les informations du voyageur et du séjour sont affichées. Un token invalide ou expiré affiche un message d'erreur "Lien invalide ou expiré".
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-174 — Affichage du nom du voyageur et des dates du séjour

**Module :** Portail Voyageur
**Priorité :** 🔴 Critique
**Préconditions :** Accès au portail voyageur via token valide (TC-173 passé).
**Données de test :** Voyageur : Emma Lefebvre, Séjour : 20-27 mai 2026, Bien : Villa Les Pins

**Étapes :**
1. Accéder au portail via le token de la réservation de Emma Lefebvre
2. Vérifier l'affichage du nom du voyageur
3. Vérifier les dates de check-in et check-out
4. Vérifier le nom du bien

**Résultat attendu :** La page affiche en haut : "Bienvenue, Emma !" ou "Bonjour Emma Lefebvre". Les dates sont clairement affichées : "Arrivée : Mercredi 20 mai 2026" et "Départ : Mardi 27 mai 2026". Le nom du bien "Villa Les Pins" est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-175 — Affichage de l'adresse du bien avec lien navigation GPS

**Module :** Portail Voyageur
**Priorité :** 🔴 Critique
**Préconditions :** Accès au portail voyageur via token valide.
**Données de test :** Adresse : 12 Avenue des Pins, 06400 Cannes

**Étapes :**
1. Repérer la section adresse dans le portail voyageur
2. Vérifier l'affichage de l'adresse complète
3. Cliquer sur le lien/bouton "Ouvrir dans Maps" ou "Naviguer"
4. Vérifier que Google Maps (ou Apple Maps sur iOS) s'ouvre avec l'adresse

**Résultat attendu :** L'adresse "12 Avenue des Pins, 06400 Cannes" est affichée clairement. Un bouton "Ouvrir dans Maps" ou une icône de localisation est présent. Le clic ouvre une nouvelle fenêtre ou l'application GPS native avec l'adresse pré-remplie.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Tester sur mobile Chrome et Safari.

---

#### TC-176 — Code d'accès visible et lisible (grand, contrasté)

**Module :** Portail Voyageur
**Priorité :** 🔴 Critique
**Préconditions :** Accès au portail voyageur via token valide. Un code d'accès est configuré.
**Données de test :** Code d'accès : 4782 (boîte à clés) ou code clavier

**Étapes :**
1. Repérer la section "Accès" ou "Code d'entrée" dans le portail
2. Observer la taille et le contraste du code affiché
3. Vérifier que le code est facile à lire d'un coup d'œil

**Résultat attendu :** Le code "4782" est affiché en très grande police (minimum 48px), avec un fort contraste (texte foncé sur fond clair ou inversement). La section est bien visible sans avoir à scroller. Un bouton "Copier le code" est disponible et fonctionnel.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Test d'accessibilité visuelle important.

---

#### TC-177 — Instructions d'accès affichées

**Module :** Portail Voyageur
**Priorité :** 🟠 Haute
**Préconditions :** Accès au portail voyageur via token valide.
**Données de test :** Instructions configurées pour Villa Les Pins

**Étapes :**
1. Faire défiler le portail voyageur vers la section "Instructions d'arrivée"
2. Vérifier la présence des instructions étape par étape
3. Vérifier la lisibilité (taille de police, espacement)

**Résultat attendu :** Une section "Comment accéder au logement" affiche les instructions sous forme de liste numérotée (ex : 1. Entrer dans le code portail 2845, 2. Prendre l'ascenseur jusqu'au 3ème, 3. Saisir le code 4782 sur la serrure). Le texte est lisible sur mobile sans zoom.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-178 — Bouton "Contacter l'agence" → chat

**Module :** Portail Voyageur
**Priorité :** 🟠 Haute
**Préconditions :** Accès au portail voyageur via token valide.
**Données de test :** Message test : "Bonjour, j'ai une question sur le stationnement."

**Étapes :**
1. Repérer le bouton "Contacter l'agence" ou l'icône de chat
2. Cliquer sur le bouton
3. Saisir le message "Bonjour, j'ai une question sur le stationnement."
4. Envoyer le message
5. Vérifier le retour visuel

**Résultat attendu :** Un panneau de chat s'ouvre (ou une modale). Le voyageur peut saisir son message et l'envoyer. Après envoi, le message apparaît dans le thread avec horodatage. Un toast "Message envoyé" confirme l'envoi. Le message est également visible dans l'interface Admin > Messagerie.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-179 — Bouton "Signaler un problème" → formulaire

**Module :** Portail Voyageur
**Priorité :** 🟠 Haute
**Préconditions :** Accès au portail voyageur via token valide.
**Données de test :** —

**Étapes :**
1. Repérer le bouton "Signaler un problème" dans le portail
2. Cliquer sur ce bouton
3. Vérifier l'ouverture du formulaire de signalement
4. Vérifier les champs du formulaire

**Résultat attendu :** Un formulaire ou une modale s'ouvre avec les champs : Titre du problème, Description (textarea), Niveau de criticité (Urgent / Normal), et upload de photo. Les labels sont en français. Un bouton "Envoyer le signalement" est visible.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-180 — Formulaire signalement : photo + description + criticité

**Module :** Portail Voyageur
**Priorité :** 🟠 Haute
**Préconditions :** Le formulaire de signalement est ouvert (TC-179 passé).
**Données de test :** Titre : "Fuite sous l'évier", Description : "Il y a de l'eau qui coule sous l'évier de la cuisine.", Criticité : Urgent, Photo : fichier JPEG < 5 Mo

**Étapes :**
1. Saisir le titre "Fuite sous l'évier"
2. Saisir la description complète
3. Sélectionner la criticité "Urgent"
4. Joindre une photo (simuler l'upload)
5. Cliquer sur "Envoyer le signalement"
6. Vérifier la création de l'incident dans l'interface Admin

**Résultat attendu :** Le signalement est soumis avec succès. Un toast "Signalement envoyé, nous intervenons rapidement" apparaît. Dans l'interface Admin > Incidents, un nouvel incident apparaît avec le titre "Fuite sous l'évier", la sévérité "Urgent", le bien "Villa Les Pins", et la photo jointe.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-181 — Section "Services additionnels" listée

**Module :** Portail Voyageur
**Priorité :** 🟡 Moyenne
**Préconditions :** Accès au portail voyageur. Des services additionnels sont configurés pour le bien.
**Données de test :** Services démo : Ménage mi-séjour (30€), Location vélos (15€/j), Navette aéroport (45€)

**Étapes :**
1. Faire défiler le portail voyageur jusqu'à la section "Services additionnels"
2. Vérifier l'affichage des services disponibles
3. Vérifier les informations de chaque service (nom, prix, description)

**Résultat attendu :** La section "Services additionnels" liste les services disponibles : Ménage mi-séjour 30€, Location vélos 15€/jour, Navette aéroport 45€. Chaque service affiche une description courte et un bouton "Réserver" ou "Demander". La section est visible sans être envahissante.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-182 — Affichage optimisé mobile (portrait)

**Module :** Portail Voyageur
**Priorité :** 🔴 Critique
**Préconditions :** Accès au portail voyageur via mobile en mode portrait (375×667px).
**Données de test :** Navigateur mobile Chrome (Android) ou Safari (iOS)

**Étapes :**
1. Accéder au portail voyageur sur un appareil mobile (ou DevTools)
2. Vérifier l'affichage en mode portrait
3. Vérifier que le code d'accès est immédiatement visible sans scroll
4. Vérifier les zones tactiles (boutons ≥ 44px de hauteur)
5. Tester le scroll vertical
6. Vérifier l'absence de scroll horizontal

**Résultat attendu :** L'interface est conçue mobile-first : code d'accès visible en premier écran, boutons larges et tactiles, typographie lisible sans zoom (minimum 16px), navigation simple et intuitive. Aucun élément ne déborde en dehors de l'écran. Le portail est utilisable en une seule main.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Page la plus critique en mobile — utilisée par tous les voyageurs.

---

### MODULE 15 — App Prestataire PWA (TC-183 à TC-192)

---

#### TC-183 — Accès à l'app prestataire

**Module :** App Prestataire PWA
**Priorité :** 🔴 Critique
**Préconditions :** Un compte prestataire existe. Identifiants : prestataire@paris-elite.fr / demo1234
**Données de test :** URL : /provider-app

**Étapes :**
1. Accéder à l'URL /provider-app sur mobile ou navigateur
2. Se connecter avec les identifiants prestataire@paris-elite.fr / demo1234
3. Observer la page d'accueil de l'app prestataire

**Résultat attendu :** Le prestataire est authentifié et accède à son interface dédiée. L'interface est simplifiée (pas d'accès admin). La page d'accueil affiche les missions du jour avec un design orienté mobile/tactile.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-184 — Liste des missions du jour (triées par heure)

**Module :** App Prestataire PWA
**Priorité :** 🔴 Critique
**Préconditions :** Connecté en tant que prestataire. Des missions sont assignées pour aujourd'hui.
**Données de test :** Missions du 20 mai 2026 : Ménage Villa Les Pins 09h00, Check-in Appartement Montmartre 15h00

**Étapes :**
1. Observer la liste des missions affichées
2. Vérifier l'ordre chronologique (09h00 avant 15h00)
3. Vérifier les informations affichées pour chaque mission

**Résultat attendu :** La liste affiche les missions du jour en ordre chronologique croissant. Chaque mission affiche : heure, type de mission (ex : "Ménage"), nom du bien, adresse courte, statut. La mission de 09h00 apparaît en premier.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-185 — Mission terminée → affichée en bas avec badge vert

**Module :** App Prestataire PWA
**Priorité :** 🟠 Haute
**Préconditions :** Au moins une mission a été validée comme "Terminée" aujourd'hui.
**Données de test :** Mission "Ménage Villa Les Pins 09h00" terminée.

**Étapes :**
1. Observer la liste des missions après validation d'une mission
2. Vérifier la position de la mission terminée dans la liste
3. Vérifier le badge de statut de la mission terminée

**Résultat attendu :** La mission terminée ("Ménage Villa Les Pins 09h00") est déplacée en bas de la liste, séparée des missions actives par une ligne ou un séparateur "Terminées". Elle affiche un badge vert "Terminé" et une icône de coche. Elle est visuellement grisée pour indiquer qu'elle ne nécessite plus d'action.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-186 — Mission en cours → barre de progression

**Module :** App Prestataire PWA
**Priorité :** 🟡 Moyenne
**Préconditions :** Une mission est démarrée (statut "En cours") avec une checklist partiellement complétée.
**Données de test :** Mission "Ménage Appartement Montmartre" : 3 items sur 8 cochés

**Étapes :**
1. Démarrer une mission en cliquant sur "Commencer"
2. Cocher 3 items de la checklist (sur 8 au total)
3. Observer l'affichage de la mission dans la liste

**Résultat attendu :** La mission en cours affiche une barre de progression (ex : "3/8" ou une barre à 37,5%). Le badge de statut est "En cours" (orange). La barre de progression se met à jour en temps réel à chaque item coché.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-187 — Clic sur une mission → détail avec checklist

**Module :** App Prestataire PWA
**Priorité :** 🔴 Critique
**Préconditions :** La liste des missions du jour est affichée.
**Données de test :** Mission "Ménage Appartement Montmartre 15h00"

**Étapes :**
1. Cliquer sur la mission "Ménage Appartement Montmartre 15h00"
2. Observer la page de détail
3. Vérifier la présence de la checklist

**Résultat attendu :** La page détail affiche : nom de la mission, bien, adresse, heure, instructions spéciales, et une checklist avec les items spécifiques au type de mission (ex : pour un ménage : "Aspirer les sols", "Changer les draps", "Vérifier les consommables", "Nettoyer les sanitaires", etc.). Les items sont cochables.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-188 — Cocher un item de checklist → mise à jour immédiate

**Module :** App Prestataire PWA
**Priorité :** 🔴 Critique
**Préconditions :** Le détail d'une mission est affiché avec sa checklist.
**Données de test :** Item : "Aspirer les sols"

**Étapes :**
1. Observer l'état initial de la checklist (tous items décochés)
2. Cocher l'item "Aspirer les sols"
3. Vérifier l'état de l'item immédiatement après
4. Recharger la page
5. Vérifier que l'item reste coché

**Résultat attendu :** L'item "Aspirer les sols" passe immédiatement à l'état coché (coche verte, texte barré ou grisé). La mise à jour est sauvegardée en base de données (API call). Après rechargement de la page, l'item reste coché. La barre de progression se met à jour.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-189 — Bouton "Valider la mission" → confirmation

**Module :** App Prestataire PWA
**Priorité :** 🔴 Critique
**Préconditions :** Tous les items de la checklist d'une mission sont cochés.
**Données de test :** Mission "Ménage Appartement Montmartre" — 8/8 items cochés

**Étapes :**
1. Cocher tous les items de la checklist
2. Observer l'apparition ou l'activation du bouton "Valider la mission"
3. Cliquer sur "Valider la mission"
4. Observer la modale de confirmation
5. Confirmer la validation

**Résultat attendu :** Le bouton "Valider la mission" est activé uniquement quand tous les items sont cochés (ou accessible avant mais avec avertissement). Une modale de confirmation "Confirmer la fin de mission ?" apparaît. Après confirmation, la mission passe au statut "Terminée" dans le système.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-190 — Mission validée → disparaît de la liste "en cours"

**Module :** App Prestataire PWA
**Priorité :** 🟠 Haute
**Préconditions :** La validation d'une mission vient d'être confirmée (TC-189 passé).
**Données de test :** Mission "Ménage Appartement Montmartre" validée

**Étapes :**
1. Après validation de la mission, observer la liste des missions en cours
2. Vérifier que la mission n'est plus dans la section "En cours"
3. Vérifier qu'elle apparaît dans la section "Terminées" en bas
4. Vérifier le statut dans l'interface Admin

**Résultat attendu :** La mission "Ménage Appartement Montmartre" disparaît de la section "Missions en cours". Elle apparaît dans la section "Missions terminées" avec le badge vert. Dans l'interface Admin > Tâches, la mission affiche le statut "Terminé" avec l'heure de validation.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-191 — Affichage de l'adresse avec lien GPS

**Module :** App Prestataire PWA
**Priorité :** 🟠 Haute
**Préconditions :** Le détail d'une mission est affiché.
**Données de test :** Mission à l'adresse : 45 Rue Lepic, 75018 Paris (Appartement Montmartre)

**Étapes :**
1. Ouvrir le détail d'une mission
2. Repérer la section adresse
3. Cliquer sur l'adresse ou le bouton "Naviguer" / "Ouvrir dans Maps"
4. Vérifier que l'application GPS s'ouvre

**Résultat attendu :** L'adresse "45 Rue Lepic, 75018 Paris" est affichée clairement. Un bouton ou lien "Naviguer" / "Ouvrir dans Google Maps" est visible. Le clic ouvre l'application de navigation native (Google Maps, Apple Maps, Waze) avec l'adresse de destination pré-remplie.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-192 — Affichage correct si aucune mission du jour

**Module :** App Prestataire PWA
**Priorité :** 🟡 Moyenne
**Préconditions :** Connecté en tant que prestataire sans mission planifiée pour aujourd'hui.
**Données de test :** Compte prestataire-libre@paris-elite.fr (sans mission assignée aujourd'hui)

**Étapes :**
1. Se connecter avec le compte prestataire sans mission du jour
2. Observer la page d'accueil de l'app
3. Vérifier l'état affiché

**Résultat attendu :** La page affiche un état vide avec un message positif : "Aucune mission planifiée pour aujourd'hui" accompagné d'une illustration ou icône. Un bouton "Voir mes missions de la semaine" est optionnellement disponible. Aucune erreur JavaScript dans la console.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

### MODULE 16 — Tests transversaux (TC-193 à TC-210)

---

#### TC-193 — Dark mode : toggle fonctionne depuis le header

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est connecté. Le mode clair (light) est actif.
**Données de test :** —

**Étapes :**
1. Repérer l'icône de basculement dark/light mode dans le header (icône soleil ou lune)
2. Cliquer sur l'icône
3. Observer le changement de thème
4. Cliquer à nouveau pour repasser en mode clair
5. Recharger la page et vérifier que la préférence est conservée

**Résultat attendu :** Le clic sur l'icône bascule instantanément l'interface en dark mode (fond sombre, texte clair). Un nouveau clic repasse en light mode. La préférence est sauvegardée (localStorage ou cookie) et persiste après rechargement de la page.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-194 — Dark mode : toutes les pages s'affichent correctement en dark

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Le dark mode est activé.
**Données de test :** Naviguer sur : Dashboard, Properties, Bookings, Planning, Tasks, Incidents, Messages, Finances, Analytics, Settings

**Étapes :**
1. Activer le dark mode
2. Naviguer successivement sur chaque page de l'application
3. Vérifier l'absence d'éléments en fond blanc ou texte invisible sur chaque page

**Résultat attendu :** Sur toutes les pages, le fond est sombre (gris foncé ou noir). Le texte est clair (blanc ou gris clair). Les cards, tableaux, modales, toasts, et badges utilisent tous des variantes dark appropriées. Aucune zone ne reste en fond blanc avec texte blanc.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Documenter les pages problématiques si trouvées.

---

#### TC-195 — Dark mode : pas de texte illisible (contraste suffisant)

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Le dark mode est activé.
**Données de test :** Pages à vérifier : Finances (tableaux), Analytics (graphiques), Messages (thread)

**Étapes :**
1. En dark mode, naviguer vers la page Finances
2. Vérifier la lisibilité des données dans les tableaux
3. Naviguer vers Analytics
4. Vérifier les labels du graphique et les valeurs des KPI
5. Naviguer vers Messages
6. Vérifier la lisibilité des messages entrants et sortants

**Résultat attendu :** Le ratio de contraste WCAG AA est respecté (minimum 4.5:1 pour le texte normal). Les labels de graphiques, les badges de statut, et les données de tableaux sont lisibles sur fond sombre. Aucun texte n'est gris clair sur fond gris (faible contraste).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** Utiliser DevTools > Accessibility pour vérifier les ratios de contraste si nécessaire.

---

#### TC-196 — Navigation sidebar : tous les liens fonctionnent

**Module :** Transversal
**Priorité :** 🔴 Critique
**Préconditions :** L'utilisateur Admin est connecté. La sidebar est visible.
**Données de test :** Liens à tester : Dashboard, Biens, Réservations, Planning, Tâches, Incidents, Messages, Finances, Analytics, Paramètres

**Étapes :**
1. Cliquer sur le lien "Dashboard" dans la sidebar
2. Vérifier que la page Dashboard se charge
3. Répéter pour chacun des 9 autres liens de navigation

**Résultat attendu :** Chaque lien de la sidebar charge la page correspondante sans erreur. La navigation se fait sans rechargement complet de la page (SPA). L'URL change correctement (ex : /dashboard, /properties, /bookings, etc.). Aucun lien ne génère d'erreur 404.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-197 — Navigation sidebar : lien actif mis en évidence

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est connecté et se trouve sur la page Bookings.
**Données de test :** Page courante : Réservations (/bookings)

**Étapes :**
1. Naviguer vers la page Réservations
2. Observer le lien "Réservations" dans la sidebar
3. Observer les autres liens de la sidebar
4. Naviguer vers Planning
5. Vérifier que "Planning" devient actif et "Réservations" redevient inactif

**Résultat attendu :** Le lien de la page courante est mis en évidence dans la sidebar : fond coloré (ex : indigo/violet léger), texte en gras ou coloré, bordure gauche colorée. Les autres liens restent dans leur état normal. La mise en évidence change correctement lors de chaque navigation.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-198 — Sidebar collapse sur mobile → menu hamburger

**Module :** Transversal
**Priorité :** 🟠 Haute
**Préconditions :** Fenêtre de 375px de largeur (mobile).
**Données de test :** —

**Étapes :**
1. Réduire la fenêtre à 375px
2. Vérifier que la sidebar n'est plus visible en permanence
3. Repérer l'icône hamburger (☰) dans le header
4. Cliquer sur l'icône hamburger
5. Vérifier l'ouverture du menu
6. Cliquer sur un lien du menu
7. Vérifier que le menu se ferme après navigation

**Résultat attendu :** Sur mobile, la sidebar est masquée par défaut. L'icône hamburger est visible dans le header. Le clic sur l'icône ouvre un menu latéral (drawer) depuis la gauche avec tous les liens de navigation. Après clic sur un lien, le menu se ferme automatiquement et la page correspondante se charge.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-199 — Toast de confirmation après chaque action (créer, modifier, supprimer)

**Module :** Transversal
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté et peut effectuer des actions CRUD.
**Données de test :** Actions : créer un bien, modifier une réservation, supprimer une tâche

**Étapes :**
1. Créer un nouveau bien (formulaire complet) → cliquer "Enregistrer"
2. Observer l'apparition d'un toast de succès
3. Modifier une réservation existante → cliquer "Enregistrer"
4. Observer le toast de succès
5. Supprimer une tâche → confirmer la suppression
6. Observer le toast de succès

**Résultat attendu :** Après chaque action réussie, un toast de confirmation verte apparaît en bas à droite de l'écran pendant 3 à 5 secondes. Le message est contextualisé (ex : "Bien créé avec succès", "Réservation mise à jour", "Tâche supprimée"). Le toast disparaît automatiquement sans action de l'utilisateur.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-200 — Toast d'erreur en cas d'échec d'une action

**Module :** Transversal
**Priorité :** 🟠 Haute
**Préconditions :** Simuler une erreur serveur (désactiver le réseau ou provoquer un conflit).
**Données de test :** Tentative de création d'un bien sans connexion réseau

**Étapes :**
1. Désactiver le réseau (DevTools > Network > Offline)
2. Tenter de sauvegarder un formulaire (ex : créer un bien)
3. Observer le retour visuel
4. Réactiver le réseau

**Résultat attendu :** Un toast d'erreur rouge ou orange apparaît avec un message user-friendly (ex : "Erreur lors de la sauvegarde. Vérifiez votre connexion."). Aucun toast de succès n'apparaît. L'interface reste dans un état cohérent (le formulaire n'est pas réinitialisé, les données saisies sont préservées).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-201 — État de chargement (skeleton) pendant les requêtes API

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** L'utilisateur est connecté. Le réseau est en mode "Slow 3G" (DevTools).
**Données de test :** Pages à tester : Dashboard, Bookings list, Analytics

**Étapes :**
1. Activer le mode "Slow 3G" dans DevTools > Network
2. Naviguer vers le Dashboard
3. Observer l'état pendant le chargement
4. Naviguer vers Réservations
5. Observer l'état pendant le chargement de la liste

**Résultat attendu :** Pendant le chargement des données API, des skeleton loaders (rectangles gris animés) s'affichent à la place des données. Aucune page ne reste blanche pendant le chargement. Les skeletons ont la forme approximative des éléments finaux (cartes KPI, lignes de tableau, etc.).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-202 — État vide avec CTA sur toutes les listes sans données

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Un compte de test vierge est disponible (aucune donnée).
**Données de test :** Compte : test-vide@paris-elite.fr

**Étapes :**
1. Se connecter avec le compte vide
2. Naviguer vers Biens → vérifier l'état vide
3. Naviguer vers Réservations → vérifier l'état vide
4. Naviguer vers Tâches → vérifier l'état vide
5. Naviguer vers Incidents → vérifier l'état vide
6. Naviguer vers Finances → vérifier l'état vide

**Résultat attendu :** Sur chaque page sans données, un état vide s'affiche avec : une illustration ou icône, un titre explicatif (ex : "Aucun bien pour l'instant"), un texte descriptif, et un bouton d'action principal (ex : "Ajouter votre premier bien"). Aucune liste ne s'affiche vide sans message.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-203 — Gestion des erreurs réseau (message d'erreur user-friendly)

**Module :** Transversal
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur est connecté. Le réseau peut être coupé via DevTools.
**Données de test :** Simuler une perte réseau après chargement initial de l'application

**Étapes :**
1. Charger le Dashboard complètement
2. Désactiver le réseau (DevTools > Network > Offline)
3. Cliquer sur le bouton de rafraîchissement des données (si présent)
4. Observer le message d'erreur

**Résultat attendu :** Un message d'erreur user-friendly s'affiche (ex : "Impossible de charger les données. Vérifiez votre connexion internet."). Le message est en français. Il n'y a pas de message d'erreur technique (stack trace, JSON, code HTTP). Un bouton "Réessayer" est proposé.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-204 — Responsive : toutes les pages sur 375px (iPhone SE)

**Module :** Transversal
**Priorité :** 🟠 Haute
**Préconditions :** DevTools activé avec preset "iPhone SE" (375×667px).
**Données de test :** Pages : Dashboard, Biens, Réservations, Planning, Tâches, Incidents, Messages

**Étapes :**
1. Activer DevTools > Device : iPhone SE (375px)
2. Naviguer sur chaque page listée
3. Vérifier l'absence de scroll horizontal
4. Vérifier la lisibilité du contenu
5. Vérifier que les boutons d'action sont accessibles

**Résultat attendu :** Chaque page s'affiche correctement sur 375px sans scroll horizontal. Le texte est lisible (min 14px). Les boutons principaux sont visibles sans scroll excessif. Les tableaux se transforment en listes ou défilent horizontalement avec indicateur. Aucun élément n'est tronqué de manière problématique.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-205 — Responsive : toutes les pages sur 768px (iPad)

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** DevTools activé avec preset "iPad" (768×1024px).
**Données de test :** Pages : Dashboard, Analytics, Finances, Planning

**Étapes :**
1. Activer DevTools > Device : iPad (768px)
2. Naviguer sur Dashboard, Analytics, Finances et Planning
3. Vérifier l'affichage de la sidebar (compacte ou drawer)
4. Vérifier les grilles de cards (2 ou 3 colonnes)

**Résultat attendu :** Sur 768px, la sidebar est soit compacte (icônes uniquement) soit accessible via hamburger. Les grilles passent en 2 colonnes. Les tableaux sont lisibles sans scroll horizontal ou avec un scroll horizontal doux. Le planning affiche 7 jours (ou se scroll horizontalement avec indicateur).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-206 — Responsive : toutes les pages sur 1280px (desktop)

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Fenêtre de navigateur à 1280px de largeur.
**Données de test :** Pages : toutes les pages de l'application

**Étapes :**
1. Régler la fenêtre à 1280px de largeur
2. Naviguer sur chaque page principale
3. Vérifier l'affichage optimal (sidebar visible, tableaux complets, graphiques lisibles)

**Résultat attendu :** À 1280px, la sidebar est visible et déployée. Le contenu principal utilise l'espace disponible de manière équilibrée (pas de marges excessives, pas de contenu trop large). Les tableaux affichent toutes leurs colonnes. Les graphiques occupent l'espace de manière appropriée.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-207 — Tableau avec pagination : navigation entre pages

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Une liste avec plus de 10 éléments existe (ex : Réservations avec 25+ entrées).
**Données de test :** Liste Réservations avec données démo (20+ réservations)

**Étapes :**
1. Naviguer vers la liste des Réservations
2. Vérifier la présence des contrôles de pagination en bas
3. Cliquer sur "Page suivante" ou le numéro 2
4. Vérifier le chargement de la page 2
5. Cliquer sur "Page précédente"
6. Vérifier le retour à la page 1

**Résultat attendu :** Les contrôles de pagination affichent : numéros de page, boutons précédent/suivant, et indicateur "Affichage 1-10 sur 25". La navigation entre pages fonctionne sans rechargement complet. La page courante est mise en évidence. Les boutons précédent/suivant sont désactivés aux extrémités.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-208 — Formulaire : touche Entrée soumet le formulaire

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Un formulaire est ouvert (ex : formulaire de connexion ou d'ajout de bien).
**Données de test :** Formulaire de connexion : marie@concierge-paris.fr / demo1234

**Étapes :**
1. Ouvrir la page de connexion
2. Saisir l'email marie@concierge-paris.fr
3. Appuyer sur Tab pour passer au champ mot de passe
4. Saisir demo1234
5. Appuyer sur la touche Entrée (sans cliquer sur le bouton)

**Résultat attendu :** La touche Entrée soumet le formulaire de connexion. La connexion s'effectue normalement. Ce comportement doit également fonctionner sur les formulaires de création/modification (création de bien, création d'incident, etc.) avec le bouton de soumission correspondant.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-209 — Formulaire : fermeture modale par Échap ou clic extérieur

**Module :** Transversal
**Priorité :** 🟡 Moyenne
**Préconditions :** Une modale est ouverte (ex : formulaire "Ajouter un bien").
**Données de test :** Modale "Ajouter un bien" partiellement remplie

**Étapes :**
1. Ouvrir la modale "Ajouter un bien"
2. Saisir quelques champs (nom, ville)
3. Appuyer sur la touche Échap
4. Vérifier la fermeture de la modale
5. Rouvrir la modale
6. Cliquer en dehors de la modale (sur l'overlay sombre)
7. Vérifier la fermeture de la modale

**Résultat attendu :** La touche Échap ferme la modale. Le clic sur l'overlay (fond assombri) ferme également la modale. Une modale de confirmation "Abandonner les modifications ?" peut apparaître si des données ont été saisies. Après fermeture, les données saisies ne sont pas conservées (état réinitialisé).
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

#### TC-210 — Tous les boutons ont un état disabled pendant le chargement

**Module :** Transversal
**Priorité :** 🟠 Haute
**Préconditions :** L'utilisateur peut soumettre des formulaires. Le réseau est en "Slow 3G".
**Données de test :** Formulaire de connexion ou de création de bien

**Étapes :**
1. Activer le mode "Slow 3G" dans DevTools
2. Remplir le formulaire de connexion
3. Cliquer sur le bouton "Se connecter"
4. Observer immédiatement l'état du bouton pendant le chargement
5. Vérifier qu'un double-clic pendant le chargement n'envoie pas 2 requêtes

**Résultat attendu :** Après le premier clic, le bouton passe immédiatement en état "disabled" (grisé, non cliquable) et affiche un indicateur de chargement (spinner ou texte "Connexion en cours..."). Le bouton reste désactivé jusqu'à la fin de la requête. Un double-clic ne provoque pas de double soumission.
**Résultat obtenu :** [ à remplir lors de l'exécution ]
**Statut :** [ ✅ / ❌ / ⏭️ ]
**Notes :** —

---

## 4 — Scénarios de test end-to-end (E2E)

Les scénarios E2E simulent des parcours complets d'utilisation, enchaînant plusieurs modules. Chaque scénario doit être exécuté dans un ordre séquentiel strict.

---

### E2E-001 — Onboarding d'un nouveau bien

**Objectif :** Vérifier le flux complet d'ajout d'un nouveau bien géré, de la connexion à l'apparition dans la liste.
**Durée estimée :** 10-15 minutes
**Prérequis :** Compte Admin disponible (admin@paris-elite.fr / demo1234). Aucun bien nommé "Villa Azur" n'existe.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Se connecter avec admin@paris-elite.fr / demo1234 | Dashboard affiché, nom de l'agence visible |
| 2 | Naviguer vers Paramètres > Utilisateurs | Liste des utilisateurs affichée |
| 3 | Créer un nouveau compte propriétaire : M. Henri Moreau, moreau@villa-azur.fr | Toast "Invitation envoyée", utilisateur en attente |
| 4 | Naviguer vers Biens > "+ Ajouter un bien" | Formulaire de création de bien ouvert |
| 5 | Remplir : Nom "Villa Azur", Adresse "8 Promenade de la Croisette, 06400 Cannes", Type "Villa", Capacité 8 personnes, Propriétaire "M. Henri Moreau" | Formulaire valide, champs remplis |
| 6 | Ajouter une photo (image JPEG test) | Photo prévisualisée dans le formulaire |
| 7 | Cliquer sur "Enregistrer" | Toast "Bien créé avec succès" |
| 8 | Vérifier que "Villa Azur" apparaît dans la liste des biens | Bien visible avec statut "Actif" |
| 9 | Cliquer sur "Villa Azur" pour ouvrir la page détail | Page détail avec informations correctes |
| 10 | Vérifier l'onglet "Finances" → aucune réservation | État vide avec message approprié |

**Résultat global attendu :** Le bien "Villa Azur" est créé et visible dans la liste avec toutes les informations saisies. Le propriétaire M. Henri Moreau est associé au bien. Les onglets du détail fonctionnent correctement.

**Notes :** Supprimer "Villa Azur" après le test pour ne pas polluer les données.

---

### E2E-002 — Cycle complet d'une réservation

**Objectif :** Vérifier la création d'une réservation, la génération automatique de la tâche de ménage, et la validation de cette tâche.
**Durée estimée :** 15-20 minutes
**Prérequis :** Au moins un bien actif (Appartement Montmartre). Un prestataire ménage existe (Sophie Leblanc, prestataire@paris-elite.fr).

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Se connecter en tant qu'Admin | Dashboard affiché |
| 2 | Naviguer vers Réservations > "+ Nouvelle réservation" | Formulaire de création ouvert |
| 3 | Remplir : Bien "Appartement Montmartre", Voyageur "Lucas Durand / lucas@email.fr", Check-in 10 juin 2026, Check-out 15 juin 2026, Canal "Direct", Montant 1 250€ | Formulaire valide |
| 4 | Cliquer sur "Créer la réservation" | Toast "Réservation créée", ID BKG-XXXX attribué |
| 5 | Naviguer vers Tâches | Liste des tâches affichée |
| 6 | Vérifier qu'une tâche "Ménage — Appartement Montmartre" du 15 juin est créée automatiquement | Tâche visible avec statut "À faire", assignée à Sophie Leblanc |
| 7 | Cliquer sur la tâche ménage | Détail de la tâche affiché |
| 8 | Changer le statut en "Terminé" | Toast "Tâche mise à jour", statut "Terminé" |
| 9 | Naviguer vers la réservation BKG-XXXX > onglet Tâches | La tâche ménage apparaît comme "Terminée" |
| 10 | Vérifier le planning de la semaine du 8-14 juin | La réservation apparaît sur la grille de l'Appartement Montmartre |

**Résultat global attendu :** La réservation est créée, la tâche de ménage est générée automatiquement pour le jour du départ, et peut être marquée comme terminée. La liaison réservation↔tâche est vérifiée.

---

### E2E-003 — Gestion d'un incident urgent

**Objectif :** Vérifier le flux complet d'un incident urgent, de sa création à sa clôture, avec vérification des alertes.
**Durée estimée :** 10-15 minutes
**Prérequis :** Connexion Admin. Le bien "Villa Les Pins" existe.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Se connecter en tant qu'Admin | Dashboard affiché |
| 2 | Vérifier le compteur d'incidents actifs sur le Dashboard | Nombre X d'incidents actifs |
| 3 | Naviguer vers Incidents > "+ Créer un incident" | Formulaire ouvert |
| 4 | Remplir : Titre "Inondation salle de bain", Bien "Villa Les Pins", Sévérité "Urgent", Description "Fuite importante sous la baignoire, eau sur le sol", Coût estimé 800€ | Formulaire valide |
| 5 | Cliquer sur "Créer l'incident" | Toast "Incident créé", badge "Urgent" rouge visible |
| 6 | Retourner au Dashboard | Le compteur d'incidents actifs a augmenté de 1 |
| 7 | Vérifier qu'une alerte rouge pour l'incident "Inondation salle de bain" est visible sur le Dashboard | Card d'alerte rouge avec titre visible |
| 8 | Naviguer vers l'incident > Changer le statut en "En cours" + affecter à "Jean Martin" | Statut mis à jour, utilisateur assigné |
| 9 | Renseigner le coût réel : 720€ | Champ coût réel mis à jour |
| 10 | Changer le statut en "Résolu" | Date de résolution automatiquement renseignée (aujourd'hui), badge "Résolu" vert |
| 11 | Retourner au Dashboard | Le compteur d'incidents actifs a diminué de 1, l'alerte rouge de cet incident a disparu |

**Résultat global attendu :** L'incident urgent est visible immédiatement sur le Dashboard. Le cycle de vie (Ouvert → En cours → Résolu) fonctionne correctement. La date de résolution est auto-renseignée.

---

### E2E-004 — Génération d'une facture propriétaire

**Objectif :** Vérifier que les réservations terminées contribuent au calcul financier et qu'une facture de reversement peut être générée avec les bons montants.
**Durée estimée :** 10-12 minutes
**Prérequis :** Des réservations terminées existent pour Appartement Montmartre (M. Bertrand). Commission agence : 20%.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Se connecter en tant qu'Admin | Dashboard affiché |
| 2 | Naviguer vers Finances | Résumé financier mensuel affiché |
| 3 | Repérer le CA brut total du mois (ex : 8 200€ toutes réservations confondues) | Valeur cohérente avec les réservations actives |
| 4 | Repérer la section reversements ou cliquer sur "+ Générer reversement" | Formulaire ou liste des propriétaires éligibles |
| 5 | Sélectionner le propriétaire "M. Bertrand" pour la période "Mai 2026" | Détail du reversement : brut 4 800€, commission 20% (-960€), net 3 840€ |
| 6 | Vérifier le calcul : 4 800 − 960 = 3 840€ | Calcul arithmétiquement correct |
| 7 | Cliquer sur "Générer la facture" | Facture créée avec statut "Brouillon" |
| 8 | Ouvrir la facture générée | Décomposition complète : brut, commission, déductions, net |
| 9 | Vérifier les lignes de détail (une ligne par réservation du mois) | Chaque réservation est détaillée avec dates et montant |
| 10 | Changer le statut de la facture à "Envoyé" | Statut mis à jour, date d'envoi renseignée |

**Résultat global attendu :** La facture de reversement est générée avec les bons montants (brut, commission, net). Le calcul financier est correct. Le statut de la facture peut être mis à jour.

---

### E2E-005 — Parcours voyageur complet

**Objectif :** Simuler le parcours d'un voyageur depuis l'accès au portail jusqu'au signalement d'un incident.
**Durée estimée :** 8-10 minutes
**Prérequis :** Réservation active de Emma Lefebvre à Villa Les Pins (20-27 mai 2026). Token : /guest/emma-token-2026.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Ouvrir une fenêtre privée | Aucune session active |
| 2 | Accéder à /guest/emma-token-2026 | Portail voyageur de Emma Lefebvre affiché |
| 3 | Vérifier : "Bienvenue Emma Lefebvre", "Arrivée 20 mai 2026", "Villa Les Pins" | Informations correctes |
| 4 | Repérer et copier le code d'accès "4782" | Code visible en grand, bouton "Copier" fonctionnel |
| 5 | Cliquer sur l'adresse / "Naviguer" | Lien GPS ouvert (Google Maps ou équivalent) |
| 6 | Cliquer sur "Contacter l'agence" | Interface de chat ouverte |
| 7 | Envoyer le message "Y a-t-il du parking privé ?" | Message envoyé, confirmation affichée |
| 8 | Vérifier dans l'Admin > Messages que le message est reçu | Message visible dans la conversation de Emma Lefebvre |
| 9 | Cliquer sur "Signaler un problème" | Formulaire de signalement ouvert |
| 10 | Remplir : Titre "Ampoule grillée dans la chambre", Criticité "Normal", envoyer | Toast confirmation, incident créé dans l'Admin |
| 11 | Vérifier dans Admin > Incidents que l'incident "Ampoule grillée" est créé | Incident visible avec lien vers la réservation de Emma |

**Résultat global attendu :** Le voyageur accède au portail sans connexion, obtient toutes les informations nécessaires, peut contacter l'agence et signaler un problème. Les communications sont visibles côté Admin.

---

### E2E-006 — Journée d'un prestataire

**Objectif :** Vérifier le flux complet d'une journée de travail d'un prestataire depuis l'app mobile.
**Durée estimée :** 10-12 minutes
**Prérequis :** 2 missions assignées à Sophie Leblanc pour aujourd'hui : Ménage Studio Canal 09h00, Ménage Appartement Montmartre 14h00.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Accéder à /provider-app sur mobile (375px) | Page de connexion de l'app prestataire |
| 2 | Se connecter : prestataire@paris-elite.fr / demo1234 | Interface prestataire affichée avec les 2 missions du jour |
| 3 | Vérifier l'ordre : Ménage Studio Canal 09h00 en premier | Ordre chronologique correct |
| 4 | Cliquer sur "Ménage Studio Canal 09h00" | Page détail avec checklist de ménage |
| 5 | Cliquer sur "Commencer la mission" | Statut passe à "En cours", chronomètre démarré |
| 6 | Cocher tous les items de la checklist (ex : 6 items) | Barre de progression : 6/6, 100% |
| 7 | Cliquer sur "Valider la mission" > Confirmer | Mission passée à "Terminée", toast de confirmation |
| 8 | Observer la liste : Ménage Studio Canal déplacé en bas avec badge vert | Seule "Ménage Appartement Montmartre 14h00" reste active |
| 9 | Cliquer sur l'adresse de l'Appartement Montmartre | Lien GPS ouvert vers 45 Rue Lepic, 75018 Paris |
| 10 | Vérifier dans Admin > Tâches que "Ménage Studio Canal" est "Terminé" | Statut mis à jour avec heure de validation |

**Résultat global attendu :** Le prestataire peut gérer l'ensemble de ses missions depuis l'app mobile. Les validations se reflètent en temps réel dans l'interface Admin.

---

### E2E-007 — Portail propriétaire

**Objectif :** Vérifier le flux complet d'utilisation du portail propriétaire, des revenus au blocage de dates.
**Durée estimée :** 8-10 minutes
**Prérequis :** Compte propriétaire M. Bertrand (proprietaire@paris-elite.fr / demo1234). Incident INC-042 avec devis en attente de validation.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Accéder au portail propriétaire | Page de connexion dédiée |
| 2 | Se connecter : proprietaire@paris-elite.fr / demo1234 | Portail M. Bertrand affiché, 2 biens |
| 3 | Vérifier les KPIs de "Villa Les Pins" : occupation 82%, revenus 4 800€ | Valeurs affichées correctement |
| 4 | Cliquer sur "Villa Les Pins" > onglet "Calendrier" | Calendrier mai/juin 2026 affiché avec réservations |
| 5 | Naviguer vers juillet 2026 | Calendrier juillet sans réservation (disponible) |
| 6 | Sélectionner 25-31 juillet → Bloquer (motif : "Vacances famille") | Jours bloqués en gris, toast "Dates bloquées" |
| 7 | Vérifier que 25-31 juillet apparaissent bloqués | Jours grisés avec icône cadenas |
| 8 | Naviguer vers onglet "Tickets" | Incident INC-042 visible avec devis 450€ |
| 9 | Cliquer sur "Voir le devis" | Détail : Panne chauffe-eau, prestataire, 450€ TTC |
| 10 | Cliquer "Valider le devis" > Confirmer | Statut incident → "Devis accepté", Admin notifié |

**Résultat global attendu :** M. Bertrand peut consulter ses revenus, bloquer des dates et valider un devis de réparation, le tout sans accès aux données des autres propriétaires.

---

### E2E-008 — Consultation analytics

**Objectif :** Vérifier le flux complet d'utilisation du module Analytics, du filtrage à l'export CSV.
**Durée estimée :** 5-8 minutes
**Prérequis :** Données démo sur 12 mois disponibles. Connexion Admin.

**Parcours :**

| Étape | Action | Résultat attendu |
|-------|--------|-----------------|
| 1 | Se connecter en tant qu'Admin | Dashboard affiché |
| 2 | Naviguer vers Analytics | KPI cards affichées (CA, occupation, RevPAR, ADR) |
| 3 | Relever les valeurs de la période par défaut (ex : "Année en cours") | 4 KPI cards avec valeurs non nulles |
| 4 | Changer la période sur "Ce mois" (mai 2026) | KPIs mis à jour avec valeurs du mois |
| 5 | Observer le graphique en barres | Seule la barre de mai 2026 est remplie |
| 6 | Observer le tableau des biens | 4 biens avec métriques du mois |
| 7 | Cliquer sur l'en-tête "CA" pour trier | Tableau trié par CA décroissant |
| 8 | Changer la période sur "Trimestre en cours" (T2 2026) | KPIs et graphique mis à jour |
| 9 | Vérifier que le CA du trimestre > CA du mois | Cohérence des données |
| 10 | Cliquer sur "Exporter CSV" | Téléchargement du fichier analytics-T2-2026.csv |
| 11 | Ouvrir le CSV et vérifier les colonnes : Bien, Occupation, CA, RevPAR | Données présentes et correctes |

**Résultat global attendu :** Le module Analytics permet de filtrer les données par période, trier le tableau, et exporter les données en CSV. Les valeurs sont cohérentes entre elles.

---

## 5 — Tests de régression

Liste des 20 cas de test prioritaires à rejouer **obligatoirement après chaque déploiement** en production ou staging.

Ces cas couvrent les flux les plus critiques de l'application.

| # | Référence | Titre | Module | Justification |
|---|-----------|-------|--------|---------------|
| 1 | TC-012 | Connexion avec email/mot de passe valides (mode démo) | Authentification | Point d'entrée de toute l'application |
| 2 | TC-024 | Redirection vers /login si non authentifié | Authentification | Sécurité : accès non autorisé |
| 3 | TC-026 | Affichage du dashboard après connexion | Dashboard | Première page vue après connexion |
| 4 | TC-050 | Création d'un bien avec tous les champs obligatoires | Gestion des Biens | CRUD principal de l'application |
| 5 | TC-054 | Modification d'un bien existant | Gestion des Biens | Intégrité des données |
| 6 | TC-075 | Création d'une nouvelle réservation manuelle | Réservations | Flux business principal |
| 7 | TC-076 | Validation : dates check-out > check-in | Réservations | Intégrité des données critique |
| 8 | TC-100 | Création d'une mission (type, bien, prestataire, date) | Tâches | Opérationnel quotidien |
| 9 | TC-111 | Création d'un incident (titre, description, sévérité, bien) | Incidents | Gestion des urgences |
| 10 | TC-123 | Envoi d'un nouveau message | Messagerie | Communication voyageur |
| 11 | TC-131 | Affichage du résumé financier mensuel (CA, commission, net) | Finances | Données financières critiques |
| 12 | TC-137 | Calcul correct : net = brut − commission − déductions | Finances | Exactitude des calculs financiers |
| 13 | TC-143 | Affichage des KPI cards (CA global, taux occupation, RevPAR, ADR) | Analytics | Reporting agence |
| 14 | TC-163 | Accès au portail propriétaire | Portail Propriétaire | Accès client isolé |
| 15 | TC-164 | Affichage des biens du propriétaire (uniquement les siens) | Portail Propriétaire | Isolation des données |
| 16 | TC-173 | Accès au portail via token unique dans l'URL | Portail Voyageur | Accès sans compte voyageur |
| 17 | TC-176 | Code d'accès visible et lisible (grand, contrasté) | Portail Voyageur | Information critique pour le voyageur |
| 18 | TC-183 | Accès à l'app prestataire | App Prestataire PWA | Accès opérationnel terrain |
| 19 | TC-196 | Navigation sidebar : tous les liens fonctionnent | Transversal | Navigation globale de l'application |
| 20 | TC-199 | Toast de confirmation après chaque action | Transversal | Feedback utilisateur sur toutes les actions |

**Fréquence recommandée :** Avant chaque mise en production. Durée estimée de la régression complète : 45 à 60 minutes.

---

## 6 — Matrice de tests par rôle

Tableau indiquant quels cas de test sont applicables selon le rôle de l'utilisateur. La colonne "Applicable" indique si le rôle peut exécuter ce cas de test dans ses conditions normales d'utilisation.

| TC | Module | Admin | Manager | Prestataire | Propriétaire | Voyageur |
|----|--------|-------|---------|-------------|--------------|---------|
| TC-001 à TC-010 | Landing Page | ✅ | ✅ | ✅ | ✅ | ✅ |
| TC-011 à TC-025 | Authentification | ✅ | ✅ | ✅ | ✅ | ⬛ |
| TC-026 à TC-040 | Dashboard | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-041 à TC-060 | Biens | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-049 à TC-055 | Biens — Création/Modification | ✅ | ⚠️ | ⬛ | ⬛ | ⬛ |
| TC-061 à TC-080 | Réservations | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-075 | Création réservation manuelle | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-081 à TC-093 | Planning | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-094 à TC-106 | Tâches | ✅ | ✅ | ⚠️ | ⬛ | ⬛ |
| TC-100 | Création de mission | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-102 | Changement statut mission | ✅ | ✅ | ⚠️ | ⬛ | ⬛ |
| TC-107 à TC-118 | Incidents | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-115 | Affectation incident | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-119 à TC-130 | Messagerie | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-131 à TC-142 | Finances | ✅ | ⚠️ | ⬛ | ⬛ | ⬛ |
| TC-138 | Générer reversement | ✅ | ⬛ | ⬛ | ⬛ | ⬛ |
| TC-143 à TC-152 | Analytics | ✅ | ✅ | ⬛ | ⬛ | ⬛ |
| TC-153 à TC-162 | Paramètres | ✅ | ⚠️ | ⬛ | ⬛ | ⬛ |
| TC-157 à TC-160 | Gestion utilisateurs | ✅ | ⬛ | ⬛ | ⬛ | ⬛ |
| TC-163 à TC-172 | Portail Propriétaire | ⬛ | ⬛ | ⬛ | ✅ | ⬛ |
| TC-173 à TC-182 | Portail Voyageur | ⬛ | ⬛ | ⬛ | ⬛ | ✅ |
| TC-183 à TC-192 | App Prestataire PWA | ⬛ | ⬛ | ✅ | ⬛ | ⬛ |
| TC-193 à TC-210 | Tests transversaux | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |

**Légende :**
- ✅ Applicable dans le rôle
- ⚠️ Partiellement applicable (sous-ensemble de fonctionnalités)
- ⬛ Non applicable (accès non autorisé ou interface inexistante pour ce rôle)

**Note sur les droits par rôle :**
- **Admin** : Accès complet à toutes les fonctions
- **Manager** : Accès opérationnel (pas de gestion utilisateurs ni facturation avancée)
- **Prestataire** : Accès limité à l'app prestataire + consultation de ses tâches
- **Propriétaire** : Accès uniquement au portail propriétaire (ses biens uniquement)
- **Voyageur** : Accès uniquement au portail voyageur via token (sans compte)

---

## 7 — Fiche d'anomalie — Bug Report Template

Template standardisé à utiliser pour tout signalement d'anomalie détectée lors des campagnes de test.

```markdown
## BUG-XXX — Titre court et descriptif

**Date :** JJ/MM/AAAA
**Testeur :** Prénom Nom
**Environnement :** local / staging / production
**Version :** 1.0.0
**Navigateur :** Chrome 125 / Firefox 126 / Safari 17 / Mobile Chrome / Mobile Safari
**Cas de test associé :** TC-XXX

---

### Description
Description claire et concise du problème observé. Indiquer quel comportement est incorrect et en quoi il diffère du comportement attendu.

### Étapes pour reproduire
1. Accéder à [URL ou page]
2. Effectuer [action précise]
3. Observer [ce qui se passe]

### Résultat obtenu
Description précise de ce qui s'est passé réellement (ce qui est incorrect).

### Résultat attendu
Description précise de ce qui aurait dû se passer selon les spécifications.

### Sévérité
🔴 Bloquant — Empêche complètement l'utilisation d'une fonctionnalité majeure
🟠 Majeur — Fonctionnalité principale défaillante mais contournable
🟡 Mineur — Fonctionnalité secondaire dégradée, contournement facile
🟢 Cosmétique — Problème visuel sans impact fonctionnel

> *Sévérité retenue pour ce bug :* [ remplir ]

### Fréquence de reproduction
- [ ] Systématique (100% du temps)
- [ ] Fréquente (>50% du temps)
- [ ] Intermittente (<50% du temps)
- [ ] Rare (difficile à reproduire)

### Captures d'écran / vidéo
[Joindre ici les captures d'écran ou vidéo illustrant le problème]

### Logs (console navigateur)
```
[Coller ici les erreurs de la console JavaScript si disponibles]
```

### Logs (réseau)
```
[Coller ici les requêtes HTTP en erreur si disponibles (URL, status code, réponse)]
```

### Impact métier
Décrire l'impact pour les utilisateurs finaux (bloque-t-il une agence ? un voyageur ? une opération ?).

### Notes additionnelles
Toute information complémentaire utile : contexte, hypothèses de cause, contournement temporaire connu.

---
*Bug reporté par :* ______________________
*Assigné à :* ______________________
*Statut :* Ouvert / En cours / Résolu / Fermé
*Version de correction :* ______________________
```

---

### Exemples de bugs types

**BUG-001 — Le calcul du net propriétaire est incorrect quand une déduction est présente**

**Date :** 15/05/2026
**Testeur :** Marie Dupont
**Environnement :** staging
**Version :** 1.0.0-rc1
**Navigateur :** Chrome 125
**Cas de test associé :** TC-141

**Description :** Lors de la génération d'une facture de reversement avec une déduction pour réparation de 200€, le montant net affiché est erroné. Le système calcule net = brut − commission au lieu de net = brut − commission − déductions.

**Étapes pour reproduire :**
1. Se connecter en tant qu'Admin
2. Naviguer vers Finances > Générer reversement
3. Sélectionner M. Bertrand pour mai 2026 (brut 4 800€, commission 20%, déduction réparation 200€)
4. Observer le montant net affiché

**Résultat obtenu :** Net affiché : 3 840€ (déduction non prise en compte)

**Résultat attendu :** Net affiché : 3 640€ (4 800 − 960 − 200 = 3 640€)

**Sévérité :** 🔴 Bloquant — Erreur financière directe impactant les reversements propriétaires.

---

## 8 — Tableau de suivi d'exécution

Tableau récapitulatif à compléter lors de chaque campagne de test. Une ligne par cas de test exécuté.

| ID | Titre | Module | Priorité | Statut | Testeur | Date | Bug associé | Notes |
|----|-------|--------|----------|--------|---------|------|-------------|-------|
| TC-001 | Affichage correct de la page d'accueil | Landing Page | 🟠 Haute | | | | | |
| TC-002 | Navigation vers la page pricing | Landing Page | 🟡 Moyenne | | | | | |
| TC-003 | Affichage des 3 plans tarifaires | Landing Page | 🟠 Haute | | | | | |
| TC-004 | Toggle mensuel/annuel sur le pricing | Landing Page | 🟠 Haute | | | | | |
| TC-005 | CTA "Essai gratuit 15 jours" redirige vers /register | Landing Page | 🔴 Critique | | | | | |
| TC-006 | CTA "Voir la démo" fonctionne | Landing Page | 🟠 Haute | | | | | |
| TC-007 | Affichage des statistiques | Landing Page | 🟡 Moyenne | | | | | |
| TC-008 | Affichage correct sur mobile | Landing Page | 🟠 Haute | | | | | |
| TC-009 | Navigation header | Landing Page | 🟡 Moyenne | | | | | |
| TC-010 | Footer avec liens légaux | Landing Page | 🟢 Basse | | | | | |
| TC-011 | Accès à la page de connexion | Authentification | 🔴 Critique | | | | | |
| TC-012 | Connexion valide (mode démo) | Authentification | 🔴 Critique | | | | | |
| TC-013 | Connexion avec email invalide | Authentification | 🟠 Haute | | | | | |
| TC-014 | Connexion avec mot de passe vide | Authentification | 🟠 Haute | | | | | |
| TC-015 | Message d'erreur en cas d'échec | Authentification | 🟠 Haute | | | | | |
| TC-016 | Accès à la page d'inscription | Authentification | 🔴 Critique | | | | | |
| TC-017 | Inscription avec champs valides | Authentification | 🔴 Critique | | | | | |
| TC-018 | Inscription email déjà utilisé | Authentification | 🟠 Haute | | | | | |
| TC-019 | Inscription mot de passe trop court | Authentification | 🟠 Haute | | | | | |
| TC-020 | Validation champs obligatoires inscription | Authentification | 🟠 Haute | | | | | |
| TC-021 | Lien "Mot de passe oublié" | Authentification | 🟡 Moyenne | | | | | |
| TC-022 | Option magic link | Authentification | 🟡 Moyenne | | | | | |
| TC-023 | Déconnexion depuis menu utilisateur | Authentification | 🔴 Critique | | | | | |
| TC-024 | Redirection si non authentifié | Authentification | 🔴 Critique | | | | | |
| TC-025 | Persistance de session | Authentification | 🟠 Haute | | | | | |
| TC-026 | Affichage du dashboard après connexion | Dashboard | 🔴 Critique | | | | | |
| TC-027 | Taux d'occupation | Dashboard | 🔴 Critique | | | | | |
| TC-028 | RevPAR | Dashboard | 🔴 Critique | | | | | |
| TC-029 | Note moyenne | Dashboard | 🟠 Haute | | | | | |
| TC-030 | Nombre d'incidents actifs | Dashboard | 🟠 Haute | | | | | |
| TC-031 | Arrivées du jour | Dashboard | 🔴 Critique | | | | | |
| TC-032 | Statuts d'arrivée | Dashboard | 🟠 Haute | | | | | |
| TC-033 | Tâches en attente | Dashboard | 🟠 Haute | | | | | |
| TC-034 | Carte d'incident urgent | Dashboard | 🔴 Critique | | | | | |
| TC-035 | Navigation vers détail réservation | Dashboard | 🟠 Haute | | | | | |
| TC-036 | Navigation vers détail tâche | Dashboard | 🟠 Haute | | | | | |
| TC-037 | Nom agence et utilisateur | Dashboard | 🟡 Moyenne | | | | | |
| TC-038 | Bouton rafraîchissement | Dashboard | 🟡 Moyenne | | | | | |
| TC-039 | Dark mode dashboard | Dashboard | 🟡 Moyenne | | | | | |
| TC-040 | Responsive mobile dashboard | Dashboard | 🟠 Haute | | | | | |
| TC-041 | Liste des biens | Biens | 🟠 Haute | | | | | |
| TC-042 | Informations par bien | Biens | 🟠 Haute | | | | | |
| TC-043 | Filtrage par statut | Biens | 🟡 Moyenne | | | | | |
| TC-044 | Filtrage par ville | Biens | 🟡 Moyenne | | | | | |
| TC-045 | Recherche par nom | Biens | 🟡 Moyenne | | | | | |
| TC-046 | Taux d'occupation par bien | Biens | 🟠 Haute | | | | | |
| TC-047 | Revenus mensuels par bien | Biens | 🟠 Haute | | | | | |
| TC-048 | Clic bien → page détail | Biens | 🟠 Haute | | | | | |
| TC-049 | Bouton "Ajouter un bien" | Biens | 🔴 Critique | | | | | |
| TC-050 | Création bien (champs obligatoires) | Biens | 🔴 Critique | | | | | |
| TC-051 | Validation adresse obligatoire | Biens | 🟠 Haute | | | | | |
| TC-052 | Validation capacité positive | Biens | 🟠 Haute | | | | | |
| TC-053 | Sélection type de bien | Biens | 🟡 Moyenne | | | | | |
| TC-054 | Modification bien existant | Biens | 🔴 Critique | | | | | |
| TC-055 | Changement de statut | Biens | 🟠 Haute | | | | | |
| TC-056 | Détail bien — onglet Informations | Biens | 🟠 Haute | | | | | |
| TC-057 | Détail bien — onglet Réservations | Biens | 🟠 Haute | | | | | |
| TC-058 | Détail bien — onglet Finances | Biens | 🟠 Haute | | | | | |
| TC-059 | Photo du bien | Biens | 🟡 Moyenne | | | | | |
| TC-060 | Bien sans photo → placeholder | Biens | 🟡 Moyenne | | | | | |
| TC-061 | Liste des réservations | Réservations | 🔴 Critique | | | | | |
| TC-062 | Colonnes affichées | Réservations | 🟠 Haute | | | | | |
| TC-063 | Badge statut coloré | Réservations | 🟠 Haute | | | | | |
| TC-064 | Badge canal | Réservations | 🟡 Moyenne | | | | | |
| TC-065 | Filtrage par statut | Réservations | 🟡 Moyenne | | | | | |
| TC-066 | Filtrage par canal | Réservations | 🟡 Moyenne | | | | | |
| TC-067 | Filtrage par plage de dates | Réservations | 🟡 Moyenne | | | | | |
| TC-068 | Recherche par voyageur | Réservations | 🟡 Moyenne | | | | | |
| TC-069 | Clic → fiche 360° | Réservations | 🔴 Critique | | | | | |
| TC-070 | Fiche — onglet Voyageur | Réservations | 🟠 Haute | | | | | |
| TC-071 | Fiche — onglet Accès | Réservations | 🔴 Critique | | | | | |
| TC-072 | Fiche — onglet Tâches | Réservations | 🟠 Haute | | | | | |
| TC-073 | Fiche — onglet Messages | Réservations | 🟠 Haute | | | | | |
| TC-074 | Fiche — onglet Finances | Réservations | 🟠 Haute | | | | | |
| TC-075 | Création réservation manuelle | Réservations | 🔴 Critique | | | | | |
| TC-076 | Validation dates | Réservations | 🔴 Critique | | | | | |
| TC-077 | Validation capacité | Réservations | 🔴 Critique | | | | | |
| TC-078 | Modification statut | Réservations | 🟠 Haute | | | | | |
| TC-079 | Annulation réservation | Réservations | 🟠 Haute | | | | | |
| TC-080 | Pagination / scroll infini | Réservations | 🟡 Moyenne | | | | | |
| TC-081 | Vue semaine grille | Planning | 🔴 Critique | | | | | |
| TC-082 | Couleurs par type de tâche | Planning | 🟠 Haute | | | | | |
| TC-083 | Navigation semaine précédente | Planning | 🟠 Haute | | | | | |
| TC-084 | Navigation semaine suivante | Planning | 🟠 Haute | | | | | |
| TC-085 | Clic tâche → détail | Planning | 🟠 Haute | | | | | |
| TC-086 | Tâches en retard | Planning | 🔴 Critique | | | | | |
| TC-087 | Bouton "Ajouter mission" | Planning | 🟠 Haute | | | | | |
| TC-088 | Création mission depuis planning | Planning | 🟠 Haute | | | | | |
| TC-089 | Nom prestataire affiché | Planning | 🟡 Moyenne | | | | | |
| TC-090 | Légende des couleurs | Planning | 🟡 Moyenne | | | | | |
| TC-091 | État vide planning | Planning | 🟡 Moyenne | | | | | |
| TC-092 | Responsive mobile planning | Planning | 🟠 Haute | | | | | |
| TC-093 | Numéro semaine et plage dates | Planning | 🟡 Moyenne | | | | | |
| TC-094 | Liste des tâches | Tâches | 🟠 Haute | | | | | |
| TC-095 | Colonnes affichées | Tâches | 🟠 Haute | | | | | |
| TC-096 | Badge de statut | Tâches | 🟠 Haute | | | | | |
| TC-097 | Filtrage par statut | Tâches | 🟡 Moyenne | | | | | |
| TC-098 | Filtrage par type | Tâches | 🟡 Moyenne | | | | | |
| TC-099 | Filtrage par date | Tâches | 🟡 Moyenne | | | | | |
| TC-100 | Création mission | Tâches | 🔴 Critique | | | | | |
| TC-101 | Modification mission | Tâches | 🟠 Haute | | | | | |
| TC-102 | Changement statut | Tâches | 🟠 Haute | | | | | |
| TC-103 | Mission en retard → badge rouge | Tâches | 🔴 Critique | | | | | |
| TC-104 | Notes de mission | Tâches | 🟡 Moyenne | | | | | |
| TC-105 | Suppression mission | Tâches | 🟡 Moyenne | | | | | |
| TC-106 | Lien réservation associée | Tâches | 🟡 Moyenne | | | | | |
| TC-107 | Liste des incidents | Incidents | 🟠 Haute | | | | | |
| TC-108 | Niveaux de sévérité | Incidents | 🔴 Critique | | | | | |
| TC-109 | Filtrage par sévérité | Incidents | 🟡 Moyenne | | | | | |
| TC-110 | Filtrage par statut | Incidents | 🟡 Moyenne | | | | | |
| TC-111 | Création incident | Incidents | 🔴 Critique | | | | | |
| TC-112 | Validation titre obligatoire | Incidents | 🟠 Haute | | | | | |
| TC-113 | Détail incident | Incidents | 🟠 Haute | | | | | |
| TC-114 | Changement statut | Incidents | 🟠 Haute | | | | | |
| TC-115 | Affectation incident | Incidents | 🟡 Moyenne | | | | | |
| TC-116 | Incident urgent → alerte | Incidents | 🔴 Critique | | | | | |
| TC-117 | Coût estimé vs réel | Incidents | 🟡 Moyenne | | | | | |
| TC-118 | Date de résolution | Incidents | 🟡 Moyenne | | | | | |
| TC-119 | Liste conversations | Messagerie | 🟠 Haute | | | | | |
| TC-120 | Sélection conversation | Messagerie | 🟠 Haute | | | | | |
| TC-121 | Direction visuelle messages | Messagerie | 🟠 Haute | | | | | |
| TC-122 | Badge canal | Messagerie | 🟡 Moyenne | | | | | |
| TC-123 | Envoi message | Messagerie | 🔴 Critique | | | | | |
| TC-124 | Message dans le thread | Messagerie | 🟠 Haute | | | | | |
| TC-125 | Marquage lu | Messagerie | 🟡 Moyenne | | | | | |
| TC-126 | Messages auto vs manuels | Messagerie | 🟡 Moyenne | | | | | |
| TC-127 | Date/heure des messages | Messagerie | 🟡 Moyenne | | | | | |
| TC-128 | Conversation vide | Messagerie | 🟡 Moyenne | | | | | |
| TC-129 | Recherche conversations | Messagerie | 🟡 Moyenne | | | | | |
| TC-130 | Lien réservation | Messagerie | 🟡 Moyenne | | | | | |
| TC-131 | Résumé financier mensuel | Finances | 🔴 Critique | | | | | |
| TC-132 | Liste des factures | Finances | 🟠 Haute | | | | | |
| TC-133 | Badge statut facture | Finances | 🟠 Haute | | | | | |
| TC-134 | Filtrage statut facture | Finances | 🟡 Moyenne | | | | | |
| TC-135 | Filtrage propriétaire | Finances | 🟡 Moyenne | | | | | |
| TC-136 | Détail facture | Finances | 🟠 Haute | | | | | |
| TC-137 | Calcul net correct | Finances | 🔴 Critique | | | | | |
| TC-138 | Génération reversement | Finances | 🔴 Critique | | | | | |
| TC-139 | Export CSV | Finances | 🟡 Moyenne | | | | | |
| TC-140 | Montants en euros (2 décimales) | Finances | 🟠 Haute | | | | | |
| TC-141 | Calcul avec déductions | Finances | 🔴 Critique | | | | | |
| TC-142 | État vide finances | Finances | 🟡 Moyenne | | | | | |
| TC-143 | KPI cards analytics | Analytics | 🔴 Critique | | | | | |
| TC-144 | Graphique CA mensuel | Analytics | 🟠 Haute | | | | | |
| TC-145 | Tableau performance par bien | Analytics | 🟠 Haute | | | | | |
| TC-146 | Colonnes tableau | Analytics | 🟠 Haute | | | | | |
| TC-147 | Tri tableau | Analytics | 🟡 Moyenne | | | | | |
| TC-148 | Sélecteur de période | Analytics | 🔴 Critique | | | | | |
| TC-149 | Mise à jour KPIs selon période | Analytics | 🔴 Critique | | | | | |
| TC-150 | Export CSV analytics | Analytics | 🟠 Haute | | | | | |
| TC-151 | Aucune donnée pour la période | Analytics | 🟡 Moyenne | | | | | |
| TC-152 | Graphique responsive mobile | Analytics | 🟡 Moyenne | | | | | |
| TC-153 | Profil de l'agence | Paramètres | 🟠 Haute | | | | | |
| TC-154 | Modification nom agence | Paramètres | 🟡 Moyenne | | | | | |
| TC-155 | Plan actuel et essai | Paramètres | 🟠 Haute | | | | | |
| TC-156 | Liste utilisateurs | Paramètres | 🟠 Haute | | | | | |
| TC-157 | Invitation utilisateur | Paramètres | 🟠 Haute | | | | | |
| TC-158 | Validation email invitation | Paramètres | 🟡 Moyenne | | | | | |
| TC-159 | Modification rôle | Paramètres | 🟡 Moyenne | | | | | |
| TC-160 | Désactivation utilisateur | Paramètres | 🟡 Moyenne | | | | | |
| TC-161 | Intégrations configurées | Paramètres | 🟡 Moyenne | | | | | |
| TC-162 | Sauvegarde → toast | Paramètres | 🟠 Haute | | | | | |
| TC-163 | Accès portail propriétaire | Portail Propriétaire | 🔴 Critique | | | | | |
| TC-164 | Biens du propriétaire uniquement | Portail Propriétaire | 🔴 Critique | | | | | |
| TC-165 | KPIs par bien | Portail Propriétaire | 🟠 Haute | | | | | |
| TC-166 | Résumé reversement | Portail Propriétaire | 🟠 Haute | | | | | |
| TC-167 | Calendrier réservations | Portail Propriétaire | 🟠 Haute | | | | | |
| TC-168 | Blocage de dates | Portail Propriétaire | 🟠 Haute | | | | | |
| TC-169 | Documents disponibles | Portail Propriétaire | 🟡 Moyenne | | | | | |
| TC-170 | Valider / Refuser devis | Portail Propriétaire | 🟠 Haute | | | | | |
| TC-171 | Aucune réservation à venir | Portail Propriétaire | 🟡 Moyenne | | | | | |
| TC-172 | Responsive mobile portail prop. | Portail Propriétaire | 🟠 Haute | | | | | |
| TC-173 | Accès via token unique | Portail Voyageur | 🔴 Critique | | | | | |
| TC-174 | Nom voyageur et dates | Portail Voyageur | 🔴 Critique | | | | | |
| TC-175 | Adresse + lien GPS | Portail Voyageur | 🔴 Critique | | | | | |
| TC-176 | Code d'accès lisible | Portail Voyageur | 🔴 Critique | | | | | |
| TC-177 | Instructions d'accès | Portail Voyageur | 🟠 Haute | | | | | |
| TC-178 | Bouton contacter l'agence | Portail Voyageur | 🟠 Haute | | | | | |
| TC-179 | Bouton signaler un problème | Portail Voyageur | 🟠 Haute | | | | | |
| TC-180 | Formulaire signalement complet | Portail Voyageur | 🟠 Haute | | | | | |
| TC-181 | Services additionnels | Portail Voyageur | 🟡 Moyenne | | | | | |
| TC-182 | Optimisation mobile portrait | Portail Voyageur | 🔴 Critique | | | | | |
| TC-183 | Accès app prestataire | App Prestataire | 🔴 Critique | | | | | |
| TC-184 | Missions du jour triées | App Prestataire | 🔴 Critique | | | | | |
| TC-185 | Mission terminée → badge vert | App Prestataire | 🟠 Haute | | | | | |
| TC-186 | Mission en cours → progression | App Prestataire | 🟡 Moyenne | | | | | |
| TC-187 | Détail mission + checklist | App Prestataire | 🔴 Critique | | | | | |
| TC-188 | Cocher item checklist | App Prestataire | 🔴 Critique | | | | | |
| TC-189 | Valider la mission | App Prestataire | 🔴 Critique | | | | | |
| TC-190 | Mission validée → hors liste en cours | App Prestataire | 🟠 Haute | | | | | |
| TC-191 | Adresse + lien GPS prestataire | App Prestataire | 🟠 Haute | | | | | |
| TC-192 | Aucune mission du jour | App Prestataire | 🟡 Moyenne | | | | | |
| TC-193 | Toggle dark mode | Transversal | 🟡 Moyenne | | | | | |
| TC-194 | Dark mode toutes pages | Transversal | 🟡 Moyenne | | | | | |
| TC-195 | Contraste dark mode | Transversal | 🟡 Moyenne | | | | | |
| TC-196 | Navigation sidebar — tous liens | Transversal | 🔴 Critique | | | | | |
| TC-197 | Lien actif mis en évidence | Transversal | 🟡 Moyenne | | | | | |
| TC-198 | Sidebar hamburger mobile | Transversal | 🟠 Haute | | | | | |
| TC-199 | Toast confirmation actions | Transversal | 🟠 Haute | | | | | |
| TC-200 | Toast erreur | Transversal | 🟠 Haute | | | | | |
| TC-201 | Skeleton loading | Transversal | 🟡 Moyenne | | | | | |
| TC-202 | État vide + CTA | Transversal | 🟡 Moyenne | | | | | |
| TC-203 | Erreurs réseau user-friendly | Transversal | 🟠 Haute | | | | | |
| TC-204 | Responsive 375px | Transversal | 🟠 Haute | | | | | |
| TC-205 | Responsive 768px | Transversal | 🟡 Moyenne | | | | | |
| TC-206 | Responsive 1280px | Transversal | 🟡 Moyenne | | | | | |
| TC-207 | Pagination | Transversal | 🟡 Moyenne | | | | | |
| TC-208 | Entrée soumet formulaire | Transversal | 🟡 Moyenne | | | | | |
| TC-209 | Fermeture modale (Échap / clic) | Transversal | 🟡 Moyenne | | | | | |
| TC-210 | Bouton disabled pendant chargement | Transversal | 🟠 Haute | | | | | |
| E2E-001 | Onboarding nouveau bien | E2E | 🔴 Critique | | | | | |
| E2E-002 | Cycle complet réservation | E2E | 🔴 Critique | | | | | |
| E2E-003 | Gestion incident urgent | E2E | 🔴 Critique | | | | | |
| E2E-004 | Génération facture propriétaire | E2E | 🔴 Critique | | | | | |
| E2E-005 | Parcours voyageur complet | E2E | 🔴 Critique | | | | | |
| E2E-006 | Journée prestataire | E2E | 🔴 Critique | | | | | |
| E2E-007 | Portail propriétaire complet | E2E | 🔴 Critique | | | | | |
| E2E-008 | Consultation analytics | E2E | 🟠 Haute | | | | | |

---

*ConciergeOS — Cahier de test v1.0 — Mai 2026*
