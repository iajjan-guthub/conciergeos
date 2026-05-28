# ConciergeOS — Manuel Administrateur

> Ce manuel est destiné aux **Administrateurs d'agence** (rôle `agency_admin`) et aux **Managers opérations** (`operations_manager`) de la plateforme ConciergeOS.

---

## Table des matières

1. [Introduction](#1-introduction)
2. [Connexion et sécurité](#2-connexion-et-sécurité)
3. [Tableau de bord (Dashboard)](#3-tableau-de-bord-dashboard)
4. [Gestion des biens](#4-gestion-des-biens)
5. [Gestion des réservations](#5-gestion-des-réservations)
6. [Planning opérationnel](#6-planning-opérationnel)
7. [Gestion des prestataires](#7-gestion-des-prestataires)
8. [Incidents et maintenance](#8-incidents-et-maintenance)
9. [Messagerie unifiée](#9-messagerie-unifiée)
10. [Finance et comptabilité](#10-finance-et-comptabilité)
11. [Analytics et rapports](#11-analytics-et-rapports)
12. [Gestion des utilisateurs](#12-gestion-des-utilisateurs)
13. [Paramètres agence](#13-paramètres-agence)
14. [Maintenance et backups](#14-maintenance-et-backups)
15. [FAQ Administrateur](#15-faq-administrateur)

---

## 1. Introduction

### Qui est l'administrateur d'agence ?

L'administrateur d'agence est le responsable principal de l'instance ConciergeOS de sa structure. Il dispose des droits les plus étendus au sein de son périmètre : il peut créer, modifier et supprimer l'ensemble des ressources (biens, réservations, utilisateurs, contrats) liées à son agence.

**Exemples de profils :**
- Directeur d'une conciergerie Airbnb gérant 30 appartements à Lyon
- Responsable d'une agence de gestion locative à Paris avec 5 employés
- Gestionnaire indépendant administrant ses propres biens et ceux de 3 propriétaires partenaires

### Vue d'ensemble des droits

| Fonctionnalité | Super Admin | Admin Agence | Manager Ops | Commercial | Prestataire | Propriétaire |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Gérer les biens | ✅ | ✅ | ✅ | 👁 | ❌ | 👁 |
| Gérer les réservations | ✅ | ✅ | ✅ | ✅ | ❌ | 👁 |
| Créer des missions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gérer les prestataires | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Accéder aux finances | ✅ | ✅ | 👁 | 👁 | ❌ | 👁 |
| Gérer les utilisateurs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Modifier les paramètres | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Voir les analytics | ✅ | ✅ | ✅ | ✅ | ❌ | 👁 |

*✅ Accès complet — 👁 Lecture seule — ❌ Aucun accès*

---

## 2. Connexion et sécurité

### 2.1 Première connexion

Lors de la création de votre compte par le support ConciergeOS ou par votre Super Admin, vous recevez un email contenant un **lien magique** à usage unique valable 24 heures.

1. Ouvrez l'email intitulé **"Bienvenue sur ConciergeOS — Activez votre compte"**
2. Cliquez sur le bouton **"Accéder à mon espace"**
3. Vous êtes automatiquement connecté et redirigé vers l'assistant de configuration initiale
4. Définissez votre mot de passe (minimum 12 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)
5. Configurez votre profil (photo, téléphone) et validez

> ⚠️ **Note :** Si le lien magique est expiré, cliquez sur "Renvoyer un lien de connexion" sur la page de login et entrez votre email professionnel.

### 2.2 Réinitialisation du mot de passe

1. Sur `https://app.conciergeos.fr`, cliquez sur **"Mot de passe oublié"**
2. Entrez votre adresse email professionnelle
3. Vous recevez un email avec un lien de réinitialisation (valable 1 heure)
4. Suivez le lien et définissez un nouveau mot de passe
5. Toutes les sessions actives sont automatiquement révoquées

### 2.3 Configuration de l'authentification à deux facteurs (MFA)

La MFA est **fortement recommandée** pour les comptes Admin et Manager.

1. Allez dans **Mon compte > Sécurité > Authentification à deux facteurs**
2. Cliquez sur **"Configurer le MFA"**
3. Scannez le QR code avec une application d'authentification (Google Authenticator, Authy, 1Password)
4. Entrez le code à 6 chiffres affiché pour valider
5. Conservez précieusement les **codes de secours** (8 codes à usage unique) dans un endroit sûr

**Lors des prochaines connexions :**
- Entrez votre email + mot de passe
- Entrez le code à 6 chiffres de votre application d'authentification
- Optionnel : cochez "Se souvenir de cet appareil 30 jours" sur vos appareils de confiance

### 2.4 Gestion des sessions

Dans **Mon compte > Sécurité > Sessions actives**, vous pouvez consulter :
- Tous les appareils connectés à votre compte (navigateur, OS, localisation approximative, dernière activité)
- Révoquer une session spécifique en cliquant sur "Déconnecter cet appareil"
- Révoquer toutes les sessions sauf la session actuelle (en cas de compromission de compte)

Les sessions expirent automatiquement après **1 heure d'inactivité**. Le token de rafraîchissement est valable **7 jours**.

---

## 3. Tableau de bord (Dashboard)

### 3.1 Lecture des KPIs

Le tableau de bord est le point d'entrée de votre journée. Il présente une synthèse en temps réel de l'activité de votre portefeuille.

**Taux d'occupation (TO)**
> Pourcentage de nuits vendues par rapport aux nuits disponibles sur une période.
> 
> *Formule :* `TO = (Nuits vendues / Nuits disponibles) × 100`
> 
> *Exemple :* 22 biens × 30 jours = 660 nuits disponibles. 528 nuits vendues → TO = **80 %**
> 
> Un TO > 75 % est considéré excellent pour une conciergerie Airbnb française.

**RevPAR (Revenue Per Available Room)**
> Revenu moyen par nuit disponible, tous biens confondus.
> 
> *Formule :* `RevPAR = Revenus bruts / Nuits disponibles`
> 
> *Exemple :* 39 600 € de revenus / 660 nuits = RevPAR de **60 €/nuit**

**ADR (Average Daily Rate)**
> Prix moyen d'une nuit vendue.
> 
> *Formule :* `ADR = Revenus bruts / Nuits vendues`
> 
> *Exemple :* 39 600 € / 528 nuits vendues = ADR de **75 €/nuit**

**NPS (Net Promoter Score)**
> Score de satisfaction agrégé des voyageurs (de -100 à +100, issu des avis Airbnb synchronisés).
> 
> Un NPS > 50 est excellent. Un NPS < 20 signale des problèmes opérationnels à investiguer.

### 3.2 Alertes prioritaires

Le widget **Alertes** en haut du dashboard regroupe les actions urgentes :

| Couleur | Signification | Exemple |
|---|---|---|
| 🔴 Rouge | Action immédiate requise | Incident URGENT non assigné depuis > 2h |
| 🟠 Orange | À traiter dans la journée | Mission de ménage sans prestataire assigné pour demain |
| 🟡 Jaune | À planifier cette semaine | Réservation sans instructions d'accès configurées |
| 🟢 Vert | Informatif | 3 nouvelles réservations reçues cette nuit |

Cliquez sur une alerte pour être dirigé directement vers la ressource concernée.

### 3.3 Arrivées du jour

Le widget **Arrivées du jour** liste toutes les réservations avec check-in aujourd'hui :

- Nom du voyageur et nombre de personnes
- Bien concerné et adresse
- Heure d'arrivée prévue
- Statut de la mission de ménage associée
- Statut de l'envoi des instructions (✅ envoyé / ❌ non envoyé)

Cliquez sur n'importe quelle arrivée pour ouvrir la fiche réservation complète.

---

## 4. Gestion des biens

### 4.1 Créer un bien (guide étape par étape)

**Menu :** Biens > Nouveau bien

**Étape 1 — Informations générales**
1. Entrez le **Nom du bien** (ex : "Studio Prestige — République Lyon 3e")
2. Sélectionnez le **Propriétaire** dans la liste déroulante (ou cliquez "Créer un propriétaire")
3. Choisissez le **Type de bien** : Appartement / Maison / Studio / Villa / Loft
4. Renseignez la **capacité** : nombre de chambres, salles de bain, voyageurs max

**Étape 2 — Localisation**
1. Entrez l'adresse complète — la carte se met à jour automatiquement
2. Vérifiez le positionnement du marqueur sur la carte et ajustez si besoin
3. Renseignez les coordonnées GPS si la géolocalisation automatique est imprécise

**Étape 3 — Accès et équipements**
1. Entrez le **code d'accès** (code porte, code boîtier à clés, instruction digicode)
2. Renseignez le **SSID et mot de passe Wi-Fi**
3. Indiquez les **heures de check-in** (défaut : 15h00) et **check-out** (défaut : 11h00)
4. Cochez les équipements disponibles (piscine, parking, lave-vaisselle, etc.)

**Étape 4 — Tarification**
1. Entrez le **prix de base par nuit** (prix affiché sur Airbnb)
2. Renseignez les **frais de ménage** facturés au voyageur
3. Indiquez le **taux de commission agence** (défaut : celui du contrat propriétaire)

**Étape 5 — Photos**
1. Glissez-déposez jusqu'à 40 photos (JPG/PNG, max 10 Mo par photo)
2. Réordonnez-les par glisser-déposer (la première photo = photo principale)
3. Ajoutez un titre à chaque photo pour l'accessibilité

**Étape 6 — Finalisation**
1. Vérifiez le récapitulatif complet
2. Cliquez **Enregistrer et activer** pour rendre le bien disponible
3. Un email de confirmation est envoyé au propriétaire

### 4.2 Checklist de conformité d'un bien

Avant d'activer un bien, vérifiez ces points obligatoires :

- [ ] Adresse vérifiée et coordonnées GPS correctes
- [ ] Code d'accès renseigné et testé
- [ ] Wi-Fi configuré (SSID + mot de passe)
- [ ] Au moins 5 photos importées
- [ ] Heures de check-in/check-out définies
- [ ] Propriétaire associé avec IBAN renseigné
- [ ] Taux de commission défini dans le contrat
- [ ] Checklist de ménage assignée au bien
- [ ] Taxe de séjour configurée (obligatoire dans de nombreuses communes)

### 4.3 Activer / Désactiver un bien

- **Désactiver** : Menu ⋮ > "Désactiver ce bien". Le bien n'apparaît plus dans le planning et ne reçoit plus de nouvelles réservations. Les réservations existantes sont conservées.
- **Réactiver** : Biens > Filtrer par "Inactifs" > Menu ⋮ > "Réactiver".

> ⚠️ **Note :** La désactivation d'un bien ne résilie pas automatiquement les réservations futures. Traitez-les manuellement avant de désactiver.

### 4.4 Gestion des photos et médias

- **Formats acceptés** : JPG, PNG, WebP (conversion automatique en WebP pour optimisation)
- **Taille minimale recommandée** : 1920 × 1280 pixels
- **Limite** : 40 photos par bien
- **Stockage** : Supabase Storage (CDN Cloudflare)
- **Suppression** : cliquez sur la photo > icône corbeille > confirmation

### 4.5 Paramètres de prix par bien

Dans **Bien > Onglet Tarification** :

| Paramètre | Description | Exemple |
|---|---|---|
| Prix de base | Nuit standard hors saison | 75 € |
| Prix weekend | Vendredi-samedi | 90 € |
| Prix haute saison | Juillet-août | 120 € |
| Frais de ménage | Fixes par séjour | 45 € |
| Commission agence | % sur revenus bruts | 20 % |
| Taxe de séjour | Par nuit par voyageur | 1,50 € |
| Séjour minimum | Nuits minimum | 2 nuits |

---

## 5. Gestion des réservations

### 5.1 Vue liste et filtres

**Menu :** Réservations

La liste affiche toutes les réservations avec :
- Statut (Confirmée / En cours / Terminée / Annulée / No-show)
- Voyageur, bien, dates, montant
- Indicateurs : mission de ménage (✅/❌), messages non lus (badge)

**Filtres disponibles :**
- Période (arrivées cette semaine, ce mois, saisir une plage)
- Bien(s) spécifique(s)
- Plateforme (Airbnb, Booking.com, Direct)
- Statut
- Montant (min/max)

**Exports :** CSV ou Excel depuis le bouton **Exporter** en haut à droite.

### 5.2 Fiche réservation 360°

Cliquez sur une réservation pour ouvrir sa fiche complète avec 6 onglets :

**Onglet "Général"**
- Informations voyageur (nom, email, téléphone, plateforme)
- Dates de séjour, nombre de nuits, nombre de voyageurs
- Demandes spéciales et notes internes
- Statut de la réservation + historique des modifications

**Onglet "Finances"**
- Décomposition du montant total : loyer brut / frais ménage / taxe séjour / commission agence / reversement propriétaire
- Statut du paiement plateforme
- Statut du reversement propriétaire
- Lien vers la facture PDF

**Onglet "Opérations"**
- Mission de ménage associée (statut, prestataire assigné, heure prévue)
- Mission de check-in (si applicable)
- Mission de check-out
- Checklist de l'état des lieux

**Onglet "Messages"**
- Historique complet des échanges avec le voyageur (email + SMS)
- Zone de réponse rapide (manuelle ou via IA)
- Templates de messages pré-configurés

**Onglet "Incidents"**
- Liste des incidents liés à cette réservation
- Créer un nouvel incident directement depuis cette vue

**Onglet "Historique"**
- Journal de toutes les actions effectuées sur cette réservation (qui, quand, quoi)

### 5.3 Gérer une annulation

1. Ouvrez la fiche réservation > Bouton **Actions > Annuler**
2. Sélectionnez le **motif d'annulation** :
   - Demande voyageur
   - Force majeure (intempéries, travaux urgents)
   - Problème technique du bien
   - Autre (champ libre)
3. Vérifiez la **politique d'annulation** applicable (flexible / modérée / stricte)
4. Indiquez si un **remboursement** doit être traité (montant calculé automatiquement selon la politique)
5. Cliquez **Confirmer l'annulation**
6. ConciergeOS envoie automatiquement l'email d'annulation au voyageur et annule les missions associées

### 5.4 Gérer un no-show

Un no-show se produit lorsque le voyageur ne se présente pas à la date de check-in.

1. Dans la réservation > **Actions > Signaler un no-show**
2. Confirmez l'heure à laquelle vous avez constaté l'absence (après l'heure limite de check-in)
3. ConciergeOS envoie automatiquement un SMS de relance au voyageur
4. Attendez 2 heures avant de procéder à la déclaration définitive
5. Si le voyageur ne donne pas signe de vie : **Confirmer le no-show**
6. La mission de ménage est annulée, le bien est marqué disponible dès le lendemain

### 5.5 Modifier une réservation

Seules les réservations à statut **Confirmée** peuvent être modifiées.

Modifications possibles depuis **Actions > Modifier** :
- Dates de séjour (sans chevauchement avec une autre réservation)
- Nombre de voyageurs (dans la limite de la capacité)
- Montant total (modification tarifaire manuelle avec motif obligatoire)
- Notes internes

> ⚠️ **Note :** Les modifications de dates entraînent le recalcul automatique des missions de ménage. Vérifiez le planning après toute modification de date.

---

## 6. Planning opérationnel

### 6.1 Lire le planning semaine

**Menu :** Planning

Le planning affiche une vue semaine ou mois par bien. Chaque ligne = un bien. Chaque bloc coloré = une réservation ou une mission.

**Code couleur :**
| Couleur | Signification |
|---|---|
| 🔵 Bleu | Réservation en cours |
| 🟢 Vert | Mission de ménage planifiée |
| 🟡 Jaune | Mission sans prestataire assigné (à traiter) |
| 🔴 Rouge | Incident ouvert sur ce bien |
| ⬜ Gris | Période bloquée (maintenance, propriétaire) |

Survolez n'importe quel bloc pour voir le résumé. Cliquez pour ouvrir la fiche complète.

### 6.2 Créer une mission manuellement

1. Dans le planning, cliquez sur une plage horaire libre (cellule vide)
2. Sélectionnez le **type de mission** : Ménage / Check-in / Maintenance / Inspection
3. Renseignez :
   - Bien concerné (pré-rempli si sélection depuis la ligne du bien)
   - Date et heure de début
   - Durée estimée (en minutes)
   - Réservation associée (optionnel)
   - Description et instructions
4. Cliquez **Créer la mission** → elle apparaît en jaune dans le planning (sans prestataire)
5. Assignez ensuite un prestataire (voir section 6.3)

### 6.3 Réassigner une mission

Cas d'usage : un prestataire est malade ou indisponible au dernier moment.

1. Cliquez sur la mission dans le planning
2. Section **Prestataire** > Bouton **Réassigner**
3. ConciergeOS affiche les prestataires disponibles sur ce créneau avec leur distance au bien
4. Sélectionnez un prestataire disponible et cliquez **Confirmer la réassignation**
5. Le prestataire initial reçoit une notification SMS/email d'annulation de mission
6. Le nouveau prestataire reçoit une notification d'assignation avec tous les détails

### 6.4 Gérer les conflits d'horaire

ConciergeOS détecte automatiquement les conflits et les signale par une icône ⚠️ dans le planning.

**Types de conflits détectés :**
- Prestataire assigné à deux missions qui se chevauchent
- Mission de ménage planifiée après l'heure de check-in du voyageur suivant
- Check-out et check-in le même jour sans mission de ménage intermédiaire

**Résolution :**
1. Cliquez sur l'icône ⚠️ pour voir le détail du conflit
2. ConciergeOS propose des solutions automatiques (décaler d'une heure, réassigner, etc.)
3. Validez la solution proposée ou saisissez manuellement une nouvelle configuration

---

## 7. Gestion des prestataires

### 7.1 Ajouter un prestataire

**Menu :** Équipe > Prestataires > Nouveau prestataire

1. Renseignez les informations personnelles : prénom, nom, email, téléphone
2. Choisissez le **type de prestataire** : Cleaner / Agent de check-in / Technicien / Multi-compétences
3. Définissez son **tarif horaire** (ex : 15 €/h) et son **tarif à la prestation** si applicable
4. Renseignez son **IBAN** pour les virements automatiques de prestation
5. Définissez ses **disponibilités habituelles** (jours de la semaine, horaires)
6. Cliquez **Inviter le prestataire** : il reçoit un email avec son accès à l'application mobile PWA

### 7.2 Affecter une zone géographique

Pour optimiser les assignations automatiques, définissez la zone d'intervention de chaque prestataire :

1. Fiche prestataire > Onglet **Zone d'intervention**
2. Sur la carte, dessinez un polygone autour de sa zone de déplacement habituelle (glisser-déposer)
3. Ou entrez un rayon en km autour d'une adresse de référence (domicile, base de départ)
4. ConciergeOS prioritise les prestataires dont la zone inclut le bien lors des assignations automatiques

### 7.3 Voir les performances d'un prestataire

Fiche prestataire > Onglet **Performances** :

| Indicateur | Description | Objectif |
|---|---|---|
| Taux de complétion | Missions terminées / missions assignées | > 95 % |
| Ponctualité | % de missions démarrées à l'heure | > 85 % |
| Note voyageur | Avis collectés via portail | > 4,5/5 |
| Incidents signalés | Nombre d'incidents remontés | À surveiller |
| Missions ce mois | Volume total de missions réalisées | — |
| Chiffre d'affaires | Montant total à régler ce mois | — |

---

## 8. Incidents et maintenance

### 8.1 Créer un incident

**Depuis le dashboard, le planning ou une fiche réservation :**

1. Bouton **+ Incident** ou **Actions > Signaler un incident**
2. Renseignez :
   - **Titre** : bref et descriptif (ex : "Chauffe-eau en panne — Studio République")
   - **Description** : détails complets de la situation
   - **Bien concerné** (pré-rempli si depuis une fiche)
   - **Réservation liée** (optionnel — si voyageur en cours de séjour)
   - **Catégorie** : Dommage / Équipement / Sécurité / Propreté / Nuisances / Autre
   - **Criticité** : Urgent / Important / Normal
3. Joignez jusqu'à **10 photos** (faites glisser ou utilisez l'appareil photo sur mobile)
4. Estimez le **coût prévisible** si possible
5. Cliquez **Créer l'incident**

### 8.2 Escalade par criticité

| Criticité | Délai de traitement | Notifications automatiques | Exemple |
|---|---|---|---|
| 🔴 **URGENT** | < 2 heures | SMS + Email Admin + Manager | Fuite d'eau active, serrure bloquée, voyageur bloqué dehors |
| 🟠 **IMPORTANT** | < 24 heures | Email Admin + Manager | Chauffe-eau en panne, électroménager défaillant |
| 🟡 **NORMAL** | < 7 jours | Email Manager | Ampoule grillée, petit dommage, révision planifiée |

**Processus d'escalade automatique :**
- Un incident URGENT non assigné déclenche un SMS à l'admin après 30 minutes
- Un incident IMPORTANT non traité depuis 12h envoie un rappel par email
- Un incident NORMAL non traité depuis 5j remonte en alerte dashboard

### 8.3 Suivi et résolution

**Statuts d'un incident :**
1. **Ouvert** → créé, en attente d'assignation
2. **En cours** → prestataire ou technicien assigné, intervention planifiée
3. **Résolu** → intervention effectuée, en attente de validation
4. **Clôturé** → validé par le manager, archivé

**Pour clôturer un incident :**
1. Vérifiez que la résolution est documentée dans le champ "Résolution"
2. Renseignez le **coût réel** de l'intervention
3. Choisissez le **responsable financier** : agence / propriétaire / voyageur
4. Si applicable, créez une **demande de devis** pour un remboursement dommages
5. Cliquez **Clôturer l'incident**

---

## 9. Messagerie unifiée

### 9.1 Navigation dans l'inbox

**Menu :** Messages

L'inbox centralise tous les échanges : emails reçus des voyageurs, messages Airbnb synchronisés, SMS entrants.

**Filtres :**
- Canal : Email / SMS / Airbnb / Direct
- Statut : Non lus / En attente de réponse / Archivés
- Bien ou réservation associé

**Badges :** le chiffre rouge en haut à droite = nombre de messages non lus dans toute l'agence.

### 9.2 Répondre manuellement vs IA

**Réponse manuelle :**
1. Ouvrez un message
2. Tapez votre réponse dans la zone de texte en bas
3. Sélectionnez le **canal de réponse** (Email, SMS, ou même canal que l'entrant)
4. Cliquez **Envoyer**

**Réponse assistée par IA :**
1. Ouvrez un message
2. Cliquez sur le bouton **🤖 Suggérer une réponse**
3. ConciergeOS génère un brouillon contextualisé (basé sur la fiche réservation, l'historique, les FAQ)
4. Relisez et ajustez le brouillon
5. Cliquez **Envoyer** ou **Enregistrer comme brouillon**

> ⚠️ **Note :** Les réponses IA sont des suggestions. Relisez toujours avant d'envoyer, en particulier pour les sujets sensibles (annulations, remboursements, incidents).

### 9.3 Créer et gérer les templates

**Menu :** Messages > Templates

Les templates permettent de standardiser les communications récurrentes.

**Créer un template :**
1. Cliquez **+ Nouveau template**
2. Nommez-le (ex : "Instructions accès — Code boîte à clés")
3. Choisissez la **catégorie** : Arrivée / Départ / Incident / Commercial / Relance
4. Rédigez le contenu avec les **variables dynamiques** disponibles :
   - `{{voyageur.prenom}}` — prénom du voyageur
   - `{{bien.nom}}` — nom du bien
   - `{{reservation.checkin}}` — date d'arrivée
   - `{{bien.code_acces}}` — code d'accès
   - `{{agence.telephone}}` — téléphone de l'agence
5. Configurez les **déclenchements automatiques** (ex : envoyer J-1 avant arrivée)
6. Cliquez **Enregistrer**

---

## 10. Finance et comptabilité

### 10.1 Calculer un reversement propriétaire

**Menu :** Finance > Reversements

1. Sélectionnez le **propriétaire** et la **période** (mois ou plage de dates)
2. ConciergeOS calcule automatiquement :

| Élément | Exemple |
|---|---|
| Revenus bruts (loyers + ménage) | 3 200 € |
| − Frais de ménage (reversés aux prestataires) | − 450 € |
| − Commission agence (20 %) | − 640 € |
| − Taxe de séjour collectée | − 95 € |
| − Frais incidents imputés propriétaire | − 120 € |
| **= Reversement net propriétaire** | **1 895 €** |

3. Vérifiez le détail ligne par ligne dans l'onglet **Détail des réservations**
4. Cliquez **Valider le reversement** pour générer la facture et initier le virement Stripe Connect

### 10.2 Générer une facture PDF

1. Dans la fiche reversement validée, cliquez **Générer la facture PDF**
2. Le PDF est généré avec : logo agence, coordonnées légales, numéro de facture séquentiel, détail des réservations, TVA applicable
3. La facture est envoyée automatiquement au propriétaire par email
4. Elle est aussi disponible dans son portail propriétaire

> ⚠️ **Note :** La numérotation des factures est automatique et séquentielle (format `AGC-2026-0042`). Ne créez jamais deux factures manuellement avec le même numéro.

### 10.3 Exporter vers comptabilité

**Menu :** Finance > Exports

| Format | Destination | Contenu |
|---|---|---|
| CSV standard | Excel, LibreOffice | Toutes les transactions de la période |
| FEC (Fichier Échanges Comptables) | Expert-comptable | Format légal français |
| Pennylane | Intégration directe | Synchronisation automatique |

**Export mensuel :** configurez un export automatique le 1er de chaque mois dans **Paramètres > Automatisations**.

### 10.4 Gérer la taxe de séjour

La taxe de séjour est obligatoire dans la majorité des communes françaises pour les locations touristiques.

1. **Menu :** Paramètres > Fiscalité > Taxe de séjour
2. Renseignez le **taux applicable** pour chaque commune (vérifiez sur le site de votre mairie)
   - Exemple : Paris = 5 % du prix de la nuit (plafonné à 5,60 €/nuit/personne pour 2026)
   - Exemple : Lyon = 1,50 €/nuit/personne
3. ConciergeOS calcule et collecte automatiquement la taxe sur chaque réservation
4. Le rapport trimestriel de déclaration est disponible dans **Finance > Taxe de séjour**

---

## 11. Analytics et rapports

### 11.1 Lire les KPIs portefeuille

**Menu :** Analytics > Vue portefeuille

Graphiques disponibles :
- **Occupation par bien** : carte thermique mensuelle (vert = occupé, blanc = libre)
- **Évolution du RevPAR** : courbe sur 12 mois glissants
- **Répartition par plateforme** : camembert Airbnb vs Booking vs Direct
- **Classement des biens** : du plus performant au moins performant par RevPAR
- **Saisonnalité** : histogramme du taux d'occupation par mois de l'année

### 11.2 Générer le rapport mensuel propriétaire

1. **Menu :** Analytics > Rapports > Rapport propriétaire mensuel
2. Sélectionnez le **propriétaire** et le **mois**
3. ConciergeOS génère un rapport PDF professionnel comprenant :
   - Photo et nom du bien en couverture
   - KPIs du mois : nuits vendues, taux d'occupation, revenus, reversement net
   - Calendrier d'occupation visuel
   - Détail de chaque réservation
   - Résumé des incidents et travaux
   - Comparaison avec le mois précédent et l'année N-1
4. Envoyez le rapport par email directement depuis l'interface

### 11.3 Configurer les alertes intelligentes

**Menu :** Analytics > Alertes

| Alerte | Condition | Exemple de seuil |
|---|---|---|
| Taux d'occupation bas | TO < X % sur 30j | < 60 % → alerte email |
| ADR en baisse | ADR baisse de X % | − 15 % vs mois précédent |
| Bien sans réservation | X jours vides à venir | 14 jours sans réservation |
| Incident coûteux | Coût incident > X € | > 500 € → alerte immédiate |
| Note voyageur basse | Avis < X étoiles | < 4/5 → alerte |

### 11.4 Exporter les données

Tous les graphiques et tableaux peuvent être exportés :
- **PNG/SVG** : graphiques pour présentation
- **CSV** : données brutes pour analyse Excel
- **PDF** : rapport mise en page professionnelle

---

## 12. Gestion des utilisateurs

### 12.1 Inviter un utilisateur

**Menu :** Équipe > Utilisateurs > Inviter

1. Entrez l'**adresse email** du nouvel utilisateur
2. Sélectionnez son **rôle** (voir tableau des droits ci-dessous)
3. Optionnel : attribuez-lui des **biens spécifiques** en lecture (pour les Managers avec périmètre limité)
4. Cliquez **Envoyer l'invitation**
5. L'utilisateur reçoit un email d'invitation valable 48 heures

### 12.2 Modifier un rôle

1. Fiche utilisateur > Bouton **Modifier le rôle**
2. Sélectionnez le nouveau rôle dans la liste
3. Entrez le **motif** de la modification (archivé dans l'audit log)
4. Cliquez **Confirmer** → les droits prennent effet immédiatement

### 12.3 Désactiver un accès

En cas de départ d'un collaborateur :
1. Fiche utilisateur > **Actions > Désactiver le compte**
2. Toutes les sessions actives sont révoquées immédiatement
3. Les missions assignées à cet utilisateur passent en statut "Non assigné" et génèrent des alertes
4. Le compte reste visible dans les archives (pour l'audit trail) mais ne peut plus se connecter

### 12.4 Tableau complet des droits par rôle

| Action | Super Admin | Admin Agence | Manager Ops | Commercial | Prestataire | Propriétaire | Voyageur |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **BIENS** | | | | | | | |
| Créer un bien | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Modifier un bien | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Supprimer un bien | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Voir ses propres biens | ✅ | ✅ | ✅ | 👁 | ❌ | 👁 | ❌ |
| **RÉSERVATIONS** | | | | | | | |
| Créer une réservation | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Annuler une réservation | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Modifier les tarifs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MISSIONS** | | | | | | | |
| Créer une mission | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Réaliser une mission | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Valider une mission | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **FINANCES** | | | | | | | |
| Voir les reversements | ✅ | ✅ | 👁 | 👁 | ❌ | 👁 | ❌ |
| Valider les reversements | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Générer des factures | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **UTILISATEURS** | | | | | | | |
| Inviter un utilisateur | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Modifier les rôles | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Désactiver un accès | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PARAMÈTRES** | | | | | | | |
| Paramètres agence | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gérer les intégrations | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exporter les données | ✅ | ✅ | ✅ | 👁 | ❌ | 👁 | ❌ |

---

## 13. Paramètres agence

### 13.1 Profil de l'agence

**Menu :** Paramètres > Agence

- **Nom de l'agence** : affiché dans tous les emails et factures
- **Logo** : PNG ou SVG, fond transparent recommandé, 300 × 100 px minimum
- **Couleurs de marque** : personnalisation du portail propriétaire et voyageur
- **Email de contact** : affiché dans les communications aux voyageurs
- **Téléphone** : numéro principal affiché dans les SMS automatiques
- **Adresse légale** : obligatoire pour la facturation
- **SIRET** : requis pour les factures légalement conformes

### 13.2 Configuration des plans tarifaires

**Menu :** Paramètres > Facturation

| Plan | Prix | Biens inclus | Fonctionnalités |
|---|---|---|---|
| Freemium | 0 €/mois | 1 bien | Dashboard basique, planning, messages |
| Starter | 9 €/bien/mois | Illimité | + Analytics, rapports, finance |
| Pro | 14 €/bien/mois | Illimité | + IA messaging, intégrations avancées |
| Agency | 19 €/bien/mois | Illimité | + White-label, API, support prioritaire |

Pour changer de plan : **Paramètres > Facturation > Changer de plan** → redirection vers Stripe Billing.

### 13.3 Gestion des intégrations

**Menu :** Paramètres > Intégrations

| Intégration | Configuration requise | Documentation |
|---|---|---|
| Stripe (paiements) | Clé publique + Clé secrète | Voir Guide hébergeur §4 |
| Resend (emails) | Clé API + domaine vérifié | Voir Guide hébergeur §5 |
| Twilio (SMS) | SID + Auth Token + Numéro | Voir Guide hébergeur §6 |
| Airbnb | OAuth via connexion compte | Bouton "Connecter Airbnb" |
| Booking.com | Channel Manager iCal | URL iCal à importer |
| Pennylane | Clé API Pennylane | Paramètres > Intégrations > Pennylane |

---

## 14. Maintenance et backups

### 14.1 Vérifier les jobs Inngest

**Menu :** Paramètres > Système > Jobs Inngest

Ou directement sur [app.inngest.com](https://app.inngest.com) avec votre compte.

**Jobs critiques à surveiller :**
- `send-checkin-instructions` : envoi des instructions J-1 avant arrivée (lancé chaque jour à 10h)
- `calculate-owner-payout` : calcul des reversements en fin de mois
- `sync-airbnb-calendar` : synchronisation des calendriers toutes les 4h
- `send-task-reminders` : rappels de missions 2h avant aux prestataires
- `generate-monthly-reports` : génération des rapports propriétaires le 1er du mois

Si un job est en statut **FAILED** : cliquez dessus pour voir le stack trace, puis **Retry** si l'erreur est transitoire, ou corrigez la configuration et relancez.

### 14.2 Consulter les logs Sentry

Connectez-vous sur [sentry.io](https://sentry.io) > Organisation `conciergeos` > Projet `conciergeos-backend`.

**Filtres utiles :**
- `level:error` → toutes les erreurs
- `level:fatal` → erreurs critiques bloquantes
- `user.email:contact@monagence.fr` → erreurs liées à un utilisateur spécifique
- `transaction:/api/bookings/*` → erreurs sur les routes réservations

En cas d'erreur récurrente, assignez-la à un développeur via le bouton **Assign** dans Sentry.

### 14.3 Procédure de backup manuel

Supabase effectue des backups automatiques quotidiens (Plan Pro). Pour un backup manuel :

1. Connectez-vous sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet `conciergeos-prod`
3. Allez dans **Database > Backups**
4. Cliquez **Create manual backup** → le backup est prêt en quelques minutes
5. Téléchargez le fichier `.sql.gz` et conservez-le dans un stockage sécurisé (ex : Google Drive chiffré)

**Fréquence recommandée :**
- Backup automatique Supabase : quotidien (inclus dans le plan Pro)
- Backup manuel : avant toute migration de schéma ou mise à jour majeure
- Téléchargement local : hebdomadaire

---

## 15. FAQ Administrateur

**Q1 : Un propriétaire dit ne pas avoir reçu son rapport mensuel. Que faire ?**
> Vérifiez dans **Finance > Reversements** que le rapport du mois concerné est bien à l'état "Envoyé". Si non, cliquez "Renvoyer l'email". Si oui, demandez au propriétaire de vérifier ses spams et d'ajouter `noreply@conciergeos.fr` à ses contacts.

**Q2 : Comment ajouter un bien sur Booking.com en plus d'Airbnb ?**
> ConciergeOS supporte la synchronisation des calendriers Booking.com via iCal. Dans la fiche du bien > Onglet "Plateformes" > Importer un calendrier iCal, collez l'URL iCal de Booking.com. La synchronisation se fait toutes les 4 heures.

**Q3 : Un prestataire me dit qu'il ne reçoit pas les notifications de missions.**
> Vérifiez dans sa fiche prestataire que son numéro de téléphone est correct et au format international (+336XXXXXXXX). Vérifiez aussi que Twilio est correctement configuré dans Paramètres > Intégrations. En dernier recours, le prestataire peut activer les notifications push depuis l'application PWA.

**Q4 : Comment gérer une réservation directe (sans plateforme) ?**
> Dans Réservations > Nouvelle réservation, sélectionnez la plateforme "Direct". Renseignez les informations voyageur manuellement et le montant convenu. ConciergeOS génère un lien de portail voyageur personnalisé à envoyer au client.

**Q5 : Mon agence change de plan tarifaire. Les fonctionnalités sont-elles disponibles immédiatement ?**
> Oui. Le changement de plan via Stripe Billing est instantané. Les nouvelles fonctionnalités du plan supérieur sont accessibles dès la confirmation du paiement.

**Q6 : Comment supprimer définitivement un bien ?**
> Les biens ne peuvent pas être supprimés s'ils ont des réservations associées (passées ou futures). Désactivez d'abord le bien, traitez toutes les réservations restantes, puis contactez le support pour une suppression définitive (archivage RGPD).

**Q7 : Un voyageur conteste une réservation sur Airbnb. Comment gérer depuis ConciergeOS ?**
> La gestion des litiges Airbnb se fait directement sur la plateforme Airbnb. Dans ConciergeOS, documentez l'incident (photos, correspondances) via le module Incidents, et attachez-le à la réservation concernée pour constituer un dossier.

**Q8 : Peut-on avoir plusieurs administrateurs pour la même agence ?**
> Oui. Il n'y a pas de limite au nombre d'utilisateurs avec le rôle `agency_admin`. Cependant, assurez-vous que chaque admin dispose de son propre compte (ne partagez jamais les identifiants).

**Q9 : Comment configurer des règles de tarification dynamique ?**
> ConciergeOS propose des tarifs par saison (haute / basse) et par type de jour (semaine / weekend). Pour une tarification dynamique avancée (prix en temps réel selon la demande), connectez l'outil à Pricelabs ou Beyond Pricing via l'onglet Intégrations.

**Q10 : Que se passe-t-il si je dépasse le nombre de biens de mon plan ?**
> ConciergeOS vous envoie un email d'alerte dès que vous approchez de la limite. Si vous dépassez la limite, les nouveaux biens ne peuvent plus être activés. Mettez à jour votre plan dans Paramètres > Facturation pour débloquer immédiatement la capacité.

**Q11 : Comment configurer les heures creuses pour l'envoi des SMS (ne pas déranger la nuit) ?**
> Paramètres > Notifications > Plages horaires d'envoi. Définissez la plage autorisée (ex : 8h-21h). Les SMS générés en dehors de cette plage sont mis en file d'attente et envoyés à l'ouverture de la plage suivante.

**Q12 : Un prestataire a complété une mission mais elle n'est pas validée automatiquement.**
> La validation automatique n'est activée que si le prestataire a coché tous les items de la checklist ET uploadé au moins une photo "après". Si l'un de ces éléments manque, la mission passe en statut "À valider" et requiert une validation manuelle du manager.

**Q13 : Comment exporter les données RGPD d'un voyageur sur demande ?**
> Réservations > Rechercher le voyageur > Fiche réservation > Actions > "Exporter les données RGPD". Un fichier JSON contenant toutes les données personnelles liées à ce voyageur est généré et peut être envoyé par email sécurisé.

**Q14 : Les données sont-elles hébergées en Europe ?**
> Oui. Toutes les données ConciergeOS sont hébergées dans la région AWS `eu-west-1` (Irlande) via Supabase, et le backend Railway est déployé en Europe. Aucune donnée ne transite vers des serveurs hors UE.

**Q15 : Comment contacter le support ConciergeOS ?**
> Support disponible via :
> - **Chat** : bulle en bas à droite de votre interface (temps de réponse < 2h en jours ouvrés)
> - **Email** : support@conciergeos.fr
> - **Documentation** : docs.conciergeos.fr
> - **Urgences** (plan Agency uniquement) : téléphone dédié fourni à l'onboarding

---

*ConciergeOS — Documentation v1.0 — Mai 2026*
