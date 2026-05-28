# ConciergeOS — Référence API

> **Version :** 1.0  
> **Base URL :** `https://api.conciergeos.app/api`  
> **Format :** JSON  
> **Encodage :** UTF-8

---

## Table des matières

1. [Authentification JWT](#authentification-jwt)
2. [Format des erreurs](#format-des-erreurs-standard)
3. [Rate Limiting](#rate-limiting)
4. [Versioning](#versioning)
5. [Endpoints](#endpoints)
   - [Authentification](#authentification)
   - [Dashboard](#dashboard)
   - [Propriétés](#propriétés-properties)
   - [Propriétaires](#propriétaires-owners)
   - [Réservations](#réservations-bookings)
   - [Missions](#missions-tasks)
   - [Incidents](#incidents)
   - [Messages](#messages)
   - [Factures](#factures-invoices)
   - [Utilisateurs](#utilisateurs-users)
   - [Analytics](#analytics)
   - [Webhooks](#webhooks)

---

## Authentification JWT

Toutes les routes protégées requièrent un token JWT passé dans le header HTTP `Authorization`.

```
Authorization: Bearer <token>
```

Le token est obtenu via `POST /api/auth/login` ou `POST /api/auth/magic-link`. Il a une durée de validité de **24 heures**. Passé ce délai, une nouvelle connexion est requise.

Le payload JWT contient :

```json
{
  "sub": "user_01HXYZ",
  "agencyId": "agency_01HXYZ",
  "role": "admin",
  "iat": 1716300000,
  "exp": 1716386400
}
```

**Champs du payload :**

| Champ | Type | Description |
|---|---|---|
| `sub` | string | ID de l'utilisateur |
| `agencyId` | string | ID de l'agence de conciergerie |
| `role` | string | Rôle : `admin`, `manager`, `operator`, `provider` |
| `iat` | number | Timestamp d'émission (Unix) |
| `exp` | number | Timestamp d'expiration (Unix) |

---

## Format des erreurs standard

Toutes les erreurs retournent un objet JSON homogène :

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "La propriété demandée n'existe pas.",
    "statusCode": 404,
    "timestamp": "2026-05-01T10:23:45.000Z",
    "path": "/api/properties/prop_999"
  }
}
```

**Codes d'erreur applicatifs :**

| Code | HTTP | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Token absent, invalide ou expiré |
| `FORBIDDEN` | 403 | Permissions insuffisantes pour cette ressource |
| `RESOURCE_NOT_FOUND` | 404 | Ressource introuvable |
| `VALIDATION_ERROR` | 422 | Corps de la requête invalide (détails dans `errors[]`) |
| `CONFLICT` | 409 | Conflit (ex. : email déjà utilisé, dates bloquées) |
| `RATE_LIMIT_EXCEEDED` | 429 | Quota de requêtes dépassé |
| `INTERNAL_ERROR` | 500 | Erreur serveur inattendue |

Pour les erreurs de validation (422), le champ `errors` détaille chaque champ invalide :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides.",
    "statusCode": 422,
    "errors": [
      { "field": "email", "message": "Format d'email invalide." },
      { "field": "password", "message": "Minimum 8 caractères requis." }
    ]
  }
}
```

---

## Rate Limiting

| Contexte | Limite |
|---|---|
| Routes publiques (auth) | 20 req/min par IP |
| Routes authentifiées | 300 req/min par token |
| Webhooks entrants | 100 req/min par source |
| Génération de factures | 10 req/heure par agence |

Les headers de réponse indiquent l'état du quota :

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1716300060
```

---

## Versioning

L'API est actuellement en version **v1** (implicite dans toutes les routes `/api/...`).

Une future version majeure sera préfixée `/api/v2/...`. La version précédente est maintenue pendant **6 mois** après la publication d'une nouvelle version majeure.

---

## Endpoints

---

## Authentification

### POST /api/auth/register

**Description :** Créer un compte agence (inscription). Crée simultanément l'agence et le premier utilisateur avec le rôle `admin`.

**Auth requis :** Non

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "agencyName": "Conciergerie Prestige Lyon",
  "email": "contact@prestige-lyon.fr",
  "password": "MonMotDePasse123!",
  "firstName": "Sophie",
  "lastName": "Martin"
}
```

| Champ | Type | Requis | Description |
|---|---|---|---|
| `agencyName` | string | Oui | Nom commercial de l'agence |
| `email` | string | Oui | Email de l'administrateur |
| `password` | string | Oui | Min. 8 caractères, 1 majuscule, 1 chiffre |
| `firstName` | string | Oui | Prénom de l'administrateur |
| `lastName` | string | Oui | Nom de l'administrateur |

**Réponse 201 :**

```json
{
  "user": {
    "id": "user_01HXYZ1234",
    "email": "contact@prestige-lyon.fr",
    "firstName": "Sophie",
    "lastName": "Martin",
    "role": "admin"
  },
  "agency": {
    "id": "agency_01HXYZ5678",
    "name": "Conciergerie Prestige Lyon",
    "createdAt": "2026-05-01T09:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 409 | `CONFLICT` | Email déjà utilisé |
| 422 | `VALIDATION_ERROR` | Champs manquants ou invalides |
| 500 | `INTERNAL_ERROR` | Erreur serveur |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "agencyName": "Conciergerie Prestige Lyon",
    "email": "contact@prestige-lyon.fr",
    "password": "MonMotDePasse123!",
    "firstName": "Sophie",
    "lastName": "Martin"
  }'
```

---

### POST /api/auth/login

**Description :** Connexion par email + mot de passe. Retourne un token JWT à stocker côté client.

**Auth requis :** Non

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "email": "contact@prestige-lyon.fr",
  "password": "MonMotDePasse123!"
}
```

**Réponse 200 :**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-05-02T09:00:00.000Z",
  "user": {
    "id": "user_01HXYZ1234",
    "email": "contact@prestige-lyon.fr",
    "firstName": "Sophie",
    "lastName": "Martin",
    "role": "admin",
    "agencyId": "agency_01HXYZ5678"
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Email ou mot de passe incorrect |
| 422 | `VALIDATION_ERROR` | Champs manquants |
| 429 | `RATE_LIMIT_EXCEEDED` | Trop de tentatives |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "contact@prestige-lyon.fr", "password": "MonMotDePasse123!"}'
```

---

### POST /api/auth/logout

**Description :** Invalide le token JWT côté serveur (liste noire en mémoire/Redis). Le client doit également supprimer le token localement.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "message": "Déconnexion réussie."
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token absent ou déjà invalide |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/auth/magic-link

**Description :** Envoie un lien de connexion magique par email. Le lien est valable 15 minutes et à usage unique.

**Auth requis :** Non

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "email": "contact@prestige-lyon.fr"
}
```

**Réponse 200 :**

```json
{
  "message": "Un lien de connexion a été envoyé à contact@prestige-lyon.fr.",
  "expiresInMinutes": 15
}
```

> **Note :** La réponse est identique que l'email existe ou non dans la base (sécurité anti-énumération).

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Format d'email invalide |
| 429 | `RATE_LIMIT_EXCEEDED` | Trop de demandes pour cet email |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email": "contact@prestige-lyon.fr"}'
```

---

### GET /api/auth/me

**Description :** Retourne le profil complet de l'utilisateur actuellement authentifié ainsi que les informations de son agence.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "user": {
    "id": "user_01HXYZ1234",
    "email": "contact@prestige-lyon.fr",
    "firstName": "Sophie",
    "lastName": "Martin",
    "role": "admin",
    "avatarUrl": "https://cdn.conciergeos.app/avatars/user_01HXYZ1234.jpg",
    "createdAt": "2026-05-01T09:00:00.000Z",
    "lastLoginAt": "2026-05-20T08:30:00.000Z"
  },
  "agency": {
    "id": "agency_01HXYZ5678",
    "name": "Conciergerie Prestige Lyon",
    "plan": "pro",
    "propertiesCount": 24
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token absent, invalide ou expiré |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Dashboard

### GET /api/dashboard/stats

**Description :** Retourne les indicateurs clés de performance (KPIs) globaux de l'agence pour la période en cours (mois en cours par défaut). Données agrégées sur l'ensemble du portefeuille de biens.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `from` | string (ISO 8601) | Non | Date de début (défaut : 1er du mois courant) |
| `to` | string (ISO 8601) | Non | Date de fin (défaut : aujourd'hui) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "period": {
    "from": "2026-05-01",
    "to": "2026-05-20"
  },
  "kpis": {
    "occupancyRate": 78.4,
    "revPAR": 142.50,
    "avgRating": 4.82,
    "activeIncidents": 3,
    "todayArrivals": 5,
    "pendingTasks": 12,
    "totalRevenue": 34200.00,
    "activeProperties": 24
  },
  "trends": {
    "occupancyRateChange": +3.2,
    "revPARChange": +8.7,
    "avgRatingChange": -0.05
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 422 | `VALIDATION_ERROR` | Format de date invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/dashboard/stats?from=2026-05-01&to=2026-05-20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Propriétés (Properties)

### GET /api/properties

**Description :** Retourne la liste paginée des biens immobiliers de l'agence, avec filtres optionnels.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `status` | string | Non | Filtre par statut : `active`, `inactive`, `maintenance` |
| `city` | string | Non | Filtre par ville (recherche partielle) |
| `ownerId` | string | Non | Filtre par propriétaire |
| `page` | number | Non | Page (défaut : 1) |
| `limit` | number | Non | Éléments par page (défaut : 20, max : 100) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "prop_01HXYZ",
      "name": "Studio Prestige - Part-Dieu",
      "address": "12 rue de la République, 69002 Lyon",
      "city": "Lyon",
      "status": "active",
      "bedrooms": 1,
      "maxGuests": 2,
      "nightlyRate": 95.00,
      "ownerId": "owner_01HXYZ",
      "ownerName": "Jean Dupont",
      "currentOccupancy": true,
      "nextCheckout": "2026-05-22",
      "rating": 4.9
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 24,
    "totalPages": 2
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 422 | `VALIDATION_ERROR` | Valeur de filtre invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/properties?status=active&city=Lyon&page=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/properties

**Description :** Crée un nouveau bien dans le portefeuille de l'agence.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "name": "Studio Prestige - Part-Dieu",
  "address": "12 rue de la République",
  "city": "Lyon",
  "zipCode": "69002",
  "country": "FR",
  "ownerId": "owner_01HXYZ",
  "bedrooms": 1,
  "bathrooms": 1,
  "maxGuests": 2,
  "nightlyRate": 95.00,
  "cleaningFee": 40.00,
  "description": "Studio moderne au cœur de Lyon.",
  "amenities": ["wifi", "parking", "kitchen"],
  "status": "active"
}
```

**Réponse 201 :**

```json
{
  "id": "prop_01HXYZ9999",
  "name": "Studio Prestige - Part-Dieu",
  "createdAt": "2026-05-01T10:00:00.000Z",
  "status": "active"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | `ownerId` inexistant |
| 422 | `VALIDATION_ERROR` | Champs requis manquants |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/properties \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"name": "Studio Prestige - Part-Dieu", "city": "Lyon", "ownerId": "owner_01HXYZ", "nightlyRate": 95}'
```

---

### GET /api/properties/:id

**Description :** Retourne le détail complet d'un bien, incluant les statistiques agrégées et la liste des dernières réservations.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "prop_01HXYZ",
  "name": "Studio Prestige - Part-Dieu",
  "address": "12 rue de la République, 69002 Lyon",
  "city": "Lyon",
  "status": "active",
  "bedrooms": 1,
  "bathrooms": 1,
  "maxGuests": 2,
  "nightlyRate": 95.00,
  "cleaningFee": 40.00,
  "description": "Studio moderne au cœur de Lyon.",
  "amenities": ["wifi", "parking", "kitchen"],
  "owner": {
    "id": "owner_01HXYZ",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com"
  },
  "stats": {
    "occupancyRateMTD": 82.3,
    "revenueMTD": 2280.00,
    "avgRating": 4.9,
    "totalBookings": 87
  },
  "upcomingBookings": [
    {
      "id": "book_01HXYZ",
      "guestName": "Marie Curie",
      "checkIn": "2026-05-22",
      "checkOut": "2026-05-25",
      "status": "confirmed"
    }
  ],
  "createdAt": "2025-01-15T00:00:00.000Z",
  "updatedAt": "2026-05-01T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Bien appartenant à une autre agence |
| 404 | `RESOURCE_NOT_FOUND` | ID de propriété inexistant |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/properties/prop_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PATCH /api/properties/:id

**Description :** Mise à jour partielle d'un bien. Seuls les champs fournis sont modifiés (PATCH sémantique).

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "nightlyRate": 105.00,
  "status": "maintenance",
  "description": "Studio rénové - nouvelle literie premium."
}
```

**Réponse 200 :**

```json
{
  "id": "prop_01HXYZ",
  "updatedAt": "2026-05-20T14:30:00.000Z",
  "changes": ["nightlyRate", "status", "description"]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Bien introuvable |
| 422 | `VALIDATION_ERROR` | Valeur de champ invalide |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/properties/prop_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"nightlyRate": 105.00, "status": "maintenance"}'
```

---

### DELETE /api/properties/:id

**Description :** Supprime un bien (soft delete — le bien est archivé, pas supprimé physiquement). Les réservations passées sont conservées.

**Auth requis :** Oui (rôle `admin` uniquement)

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "message": "Bien archivé avec succès.",
  "id": "prop_01HXYZ",
  "archivedAt": "2026-05-20T15:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle non-admin |
| 404 | `RESOURCE_NOT_FOUND` | Bien introuvable |
| 409 | `CONFLICT` | Réservations actives en cours |

**Exemple curl :**

```bash
curl -X DELETE https://api.conciergeos.app/api/properties/prop_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### GET /api/properties/:id/calendar

**Description :** Retourne le calendrier de disponibilités d'un bien sur une plage de dates, incluant les réservations, blocages et dates libres.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `from` | string (ISO 8601) | Oui | Date de début |
| `to` | string (ISO 8601) | Oui | Date de fin (max 365 jours) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "propertyId": "prop_01HXYZ",
  "period": {
    "from": "2026-05-01",
    "to": "2026-05-31"
  },
  "days": [
    {
      "date": "2026-05-01",
      "status": "booked",
      "bookingId": "book_01HXYZ",
      "guestName": "Marie Curie",
      "checkIn": false,
      "checkOut": false
    },
    {
      "date": "2026-05-10",
      "status": "available",
      "bookingId": null,
      "price": 95.00
    },
    {
      "date": "2026-05-15",
      "status": "blocked",
      "blockReason": "Travaux plomberie"
    }
  ]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Bien introuvable |
| 422 | `VALIDATION_ERROR` | Paramètres `from`/`to` manquants ou plage > 365 jours |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/properties/prop_01HXYZ/calendar?from=2026-05-01&to=2026-05-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/properties/:id/block

**Description :** Bloque des dates sur un bien (propriétaire absent, travaux, etc.). Les dates bloquées sont indisponibles à la réservation.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "from": "2026-06-01",
  "to": "2026-06-07",
  "reason": "Séjour propriétaire",
  "notes": "M. Dupont en vacances"
}
```

**Réponse 201 :**

```json
{
  "blockId": "block_01HXYZ",
  "propertyId": "prop_01HXYZ",
  "from": "2026-06-01",
  "to": "2026-06-07",
  "reason": "Séjour propriétaire",
  "createdAt": "2026-05-20T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Bien introuvable |
| 409 | `CONFLICT` | Des réservations existantes couvrent ces dates |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/properties/prop_01HXYZ/block \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"from": "2026-06-01", "to": "2026-06-07", "reason": "Séjour propriétaire"}'
```

---

## Propriétaires (Owners)

### GET /api/owners

**Description :** Retourne la liste des propriétaires associés à l'agence.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `search` | string | Non | Recherche par nom ou email |
| `page` | number | Non | Page (défaut : 1) |
| `limit` | number | Non | Éléments par page (défaut : 20) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "owner_01HXYZ",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com",
      "phone": "+33612345678",
      "propertiesCount": 3,
      "totalRevenueMTD": 6840.00,
      "createdAt": "2025-03-10T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/owners?search=Dupont" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/owners

**Description :** Crée un nouveau propriétaire et l'associe à l'agence.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33612345678",
  "address": "45 avenue de la Paix, 69006 Lyon",
  "iban": "FR7630004000031234567890143",
  "commissionRate": 20.0,
  "notes": "Propriétaire historique depuis 2022"
}
```

**Réponse 201 :**

```json
{
  "id": "owner_01HXYZ9999",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "createdAt": "2026-05-20T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 409 | `CONFLICT` | Email déjà utilisé pour ce propriétaire |
| 422 | `VALIDATION_ERROR` | IBAN invalide ou champs requis manquants |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/owners \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Jean", "lastName": "Dupont", "email": "jean.dupont@example.com", "commissionRate": 20}'
```

---

### GET /api/owners/:id

**Description :** Retourne le détail d'un propriétaire, ses biens et ses statistiques financières.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "owner_01HXYZ",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+33612345678",
  "address": "45 avenue de la Paix, 69006 Lyon",
  "iban": "FR76****0143",
  "commissionRate": 20.0,
  "notes": "Propriétaire historique depuis 2022",
  "properties": [
    {
      "id": "prop_01HXYZ",
      "name": "Studio Prestige - Part-Dieu",
      "status": "active"
    }
  ],
  "financials": {
    "totalRevenueYTD": 18400.00,
    "totalCommissionsYTD": 3680.00,
    "totalReversementsYTD": 14720.00,
    "lastInvoiceDate": "2026-04-30"
  },
  "createdAt": "2025-03-10T00:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Propriétaire introuvable |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/owners/owner_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PATCH /api/owners/:id

**Description :** Mise à jour partielle des informations d'un propriétaire.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "phone": "+33698765432",
  "commissionRate": 18.5,
  "iban": "FR7630004000039876543210987"
}
```

**Réponse 200 :**

```json
{
  "id": "owner_01HXYZ",
  "updatedAt": "2026-05-20T11:00:00.000Z",
  "changes": ["phone", "commissionRate", "iban"]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Propriétaire introuvable |
| 422 | `VALIDATION_ERROR` | IBAN invalide |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/owners/owner_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"commissionRate": 18.5}'
```

---

## Réservations (Bookings)

### GET /api/bookings

**Description :** Retourne la liste paginée des réservations avec filtres multiples.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `status` | string | Non | `pending`, `confirmed`, `checkedIn`, `checkedOut`, `cancelled` |
| `propertyId` | string | Non | Filtrer par bien |
| `channel` | string | Non | `airbnb`, `booking`, `direct`, `vrbo` |
| `dateFrom` | string (ISO 8601) | Non | Réservations dont le check-in est après cette date |
| `dateTo` | string (ISO 8601) | Non | Réservations dont le check-out est avant cette date |
| `page` | number | Non | Page (défaut : 1) |
| `limit` | number | Non | Éléments par page (défaut : 20) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "book_01HXYZ",
      "propertyId": "prop_01HXYZ",
      "propertyName": "Studio Prestige - Part-Dieu",
      "guestName": "Marie Curie",
      "guestEmail": "marie.curie@example.com",
      "checkIn": "2026-05-22",
      "checkOut": "2026-05-25",
      "nights": 3,
      "guests": 2,
      "totalPrice": 325.00,
      "channel": "airbnb",
      "status": "confirmed",
      "createdAt": "2026-05-10T14:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 87,
    "totalPages": 5
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 422 | `VALIDATION_ERROR` | Valeur de filtre invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/bookings?status=confirmed&channel=airbnb&page=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/bookings

**Description :** Crée une réservation manuelle (réservation directe, hors canal externe). Vérifie automatiquement la disponibilité du bien.

**Auth requis :** Oui (rôle `admin`, `manager` ou `operator`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "propertyId": "prop_01HXYZ",
  "guestFirstName": "Marie",
  "guestLastName": "Curie",
  "guestEmail": "marie.curie@example.com",
  "guestPhone": "+33612345678",
  "checkIn": "2026-05-22",
  "checkOut": "2026-05-25",
  "guests": 2,
  "channel": "direct",
  "totalPrice": 325.00,
  "notes": "Allergie aux animaux"
}
```

**Réponse 201 :**

```json
{
  "id": "book_01HXYZ9999",
  "propertyId": "prop_01HXYZ",
  "status": "confirmed",
  "checkIn": "2026-05-22",
  "checkOut": "2026-05-25",
  "totalPrice": 325.00,
  "createdAt": "2026-05-20T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Bien introuvable |
| 409 | `CONFLICT` | Dates déjà réservées ou bloquées |
| 422 | `VALIDATION_ERROR` | Dates invalides ou champs manquants |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"propertyId": "prop_01HXYZ", "guestFirstName": "Marie", "guestLastName": "Curie", "checkIn": "2026-05-22", "checkOut": "2026-05-25", "guests": 2, "channel": "direct", "totalPrice": 325}'
```

---

### GET /api/bookings/:id

**Description :** Retourne la vue détail 360° d'une réservation : informations voyageur, bien, financières, tâches associées, incidents et historique de messages.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "book_01HXYZ",
  "status": "confirmed",
  "channel": "airbnb",
  "guest": {
    "firstName": "Marie",
    "lastName": "Curie",
    "email": "marie.curie@example.com",
    "phone": "+33612345678",
    "nationality": "FR",
    "previousStays": 2
  },
  "property": {
    "id": "prop_01HXYZ",
    "name": "Studio Prestige - Part-Dieu",
    "address": "12 rue de la République, 69002 Lyon"
  },
  "dates": {
    "checkIn": "2026-05-22",
    "checkOut": "2026-05-25",
    "nights": 3
  },
  "financials": {
    "nightlyRate": 95.00,
    "cleaningFee": 40.00,
    "totalPrice": 325.00,
    "commission": 65.00,
    "ownerShare": 260.00,
    "paymentStatus": "paid"
  },
  "tasks": [
    {
      "id": "task_01HXYZ",
      "type": "cleaning",
      "status": "scheduled",
      "scheduledAt": "2026-05-25T11:00:00.000Z"
    }
  ],
  "incidents": [],
  "messages": {
    "count": 3,
    "lastMessageAt": "2026-05-20T09:00:00.000Z"
  },
  "notes": "Allergie aux animaux",
  "createdAt": "2026-05-10T14:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Réservation introuvable |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/bookings/book_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PATCH /api/bookings/:id

**Description :** Modifie une réservation (statut, dates ou prix). Valide la cohérence des nouvelles dates si modifiées.

**Auth requis :** Oui (rôle `admin`, `manager` ou `operator`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "status": "checkedIn",
  "checkOut": "2026-05-26",
  "totalPrice": 420.00,
  "notes": "Extension d'une nuit confirmée"
}
```

**Réponse 200 :**

```json
{
  "id": "book_01HXYZ",
  "updatedAt": "2026-05-22T15:00:00.000Z",
  "changes": ["status", "checkOut", "totalPrice", "notes"]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Réservation introuvable |
| 409 | `CONFLICT` | Nouvelles dates en conflit |
| 422 | `VALIDATION_ERROR` | Transition de statut invalide |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/bookings/book_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"status": "checkedIn"}'
```

---

### DELETE /api/bookings/:id

**Description :** Annule une réservation. Déclenche automatiquement les workflows d'annulation (notification propriétaire, libération du calendrier, annulation des tâches liées).

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "reason": "Demande du voyageur",
  "refundAmount": 250.00
}
```

**Réponse 200 :**

```json
{
  "id": "book_01HXYZ",
  "status": "cancelled",
  "cancelledAt": "2026-05-20T16:00:00.000Z",
  "refundAmount": 250.00,
  "tasksAffected": 2
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Réservation introuvable |
| 409 | `CONFLICT` | Réservation déjà annulée ou terminée |

**Exemple curl :**

```bash
curl -X DELETE https://api.conciergeos.app/api/bookings/book_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"reason": "Demande du voyageur", "refundAmount": 250}'
```

---

## Missions (Tasks)

### GET /api/tasks

**Description :** Retourne la liste des missions (ménage, check-in, maintenance, etc.) avec filtres avancés.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `status` | string | Non | `scheduled`, `inProgress`, `completed`, `cancelled` |
| `type` | string | Non | `cleaning`, `checkin`, `checkout`, `maintenance`, `inspection` |
| `propertyId` | string | Non | Filtrer par bien |
| `assigneeId` | string | Non | Filtrer par prestataire assigné |
| `date` | string (ISO 8601) | Non | Missions du jour (format `YYYY-MM-DD`) |
| `page` | number | Non | Page (défaut : 1) |
| `limit` | number | Non | Éléments par page (défaut : 20) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "task_01HXYZ",
      "type": "cleaning",
      "status": "scheduled",
      "propertyId": "prop_01HXYZ",
      "propertyName": "Studio Prestige - Part-Dieu",
      "bookingId": "book_01HXYZ",
      "assignee": {
        "id": "user_01HXYZ",
        "firstName": "Emma",
        "lastName": "Bernard"
      },
      "scheduledAt": "2026-05-22T11:00:00.000Z",
      "estimatedDuration": 120,
      "priority": "high"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/tasks?type=cleaning&date=2026-05-22" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/tasks

**Description :** Crée une nouvelle mission. Peut être liée à une réservation ou créée indépendamment (maintenance planifiée).

**Auth requis :** Oui (rôle `admin`, `manager` ou `operator`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "type": "cleaning",
  "propertyId": "prop_01HXYZ",
  "bookingId": "book_01HXYZ",
  "assigneeId": "user_01HXYZ",
  "scheduledAt": "2026-05-22T11:00:00.000Z",
  "estimatedDuration": 120,
  "priority": "high",
  "instructions": "Changer literie chambre, nettoyer terrasse",
  "checklist": ["literie", "salle_de_bain", "cuisine", "terrasse"]
}
```

**Réponse 201 :**

```json
{
  "id": "task_01HXYZ9999",
  "type": "cleaning",
  "status": "scheduled",
  "scheduledAt": "2026-05-22T11:00:00.000Z",
  "createdAt": "2026-05-20T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Bien ou assigné introuvable |
| 422 | `VALIDATION_ERROR` | Type ou date invalide |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"type": "cleaning", "propertyId": "prop_01HXYZ", "assigneeId": "user_01HXYZ", "scheduledAt": "2026-05-22T11:00:00.000Z"}'
```

---

### GET /api/tasks/:id

**Description :** Retourne le détail complet d'une mission, incluant la checklist et l'historique des modifications de statut.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "task_01HXYZ",
  "type": "cleaning",
  "status": "scheduled",
  "property": {
    "id": "prop_01HXYZ",
    "name": "Studio Prestige - Part-Dieu",
    "address": "12 rue de la République, 69002 Lyon"
  },
  "booking": {
    "id": "book_01HXYZ",
    "guestName": "Marie Curie",
    "checkOut": "2026-05-25"
  },
  "assignee": {
    "id": "user_01HXYZ",
    "firstName": "Emma",
    "lastName": "Bernard",
    "phone": "+33612345678"
  },
  "scheduledAt": "2026-05-22T11:00:00.000Z",
  "estimatedDuration": 120,
  "priority": "high",
  "instructions": "Changer literie chambre, nettoyer terrasse",
  "checklist": [
    { "item": "literie", "completed": false },
    { "item": "salle_de_bain", "completed": false },
    { "item": "cuisine", "completed": false }
  ],
  "statusHistory": [
    { "status": "scheduled", "at": "2026-05-20T10:00:00.000Z", "by": "user_01HXYZ" }
  ],
  "photos": [],
  "createdAt": "2026-05-20T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Mission introuvable |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/tasks/task_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PATCH /api/tasks/:id

**Description :** Modifie une mission ou change son statut. Réservé aux administrateurs et managers.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "assigneeId": "user_02HXYZ",
  "scheduledAt": "2026-05-22T14:00:00.000Z",
  "priority": "normal"
}
```

**Réponse 200 :**

```json
{
  "id": "task_01HXYZ",
  "updatedAt": "2026-05-20T11:00:00.000Z",
  "changes": ["assigneeId", "scheduledAt", "priority"]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Mission introuvable |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/tasks/task_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"priority": "normal"}'
```

---

### PATCH /api/tasks/:id/complete

**Description :** Permet à un prestataire (rôle `provider`) de valider une mission terminée. Accepte optionnellement des photos et la checklist complétée.

**Auth requis :** Oui (rôle `provider`, `operator`, `manager` ou `admin`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "checklist": [
    { "item": "literie", "completed": true },
    { "item": "salle_de_bain", "completed": true },
    { "item": "cuisine", "completed": true }
  ],
  "photos": ["https://cdn.conciergeos.app/photos/task_01HXYZ_1.jpg"],
  "notes": "RAS, appartement en bon état",
  "completedAt": "2026-05-22T13:15:00.000Z"
}
```

**Réponse 200 :**

```json
{
  "id": "task_01HXYZ",
  "status": "completed",
  "completedAt": "2026-05-22T13:15:00.000Z",
  "completedBy": "user_01HXYZ"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | L'utilisateur n'est pas assigné à cette mission |
| 404 | `RESOURCE_NOT_FOUND` | Mission introuvable |
| 409 | `CONFLICT` | Mission déjà complétée ou annulée |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/tasks/task_01HXYZ/complete \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"notes": "RAS, appartement en bon état", "completedAt": "2026-05-22T13:15:00.000Z"}'
```

---

## Incidents

### GET /api/incidents

**Description :** Retourne la liste des incidents déclarés sur les biens de l'agence.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `severity` | string | Non | `low`, `medium`, `high`, `critical` |
| `status` | string | Non | `open`, `inProgress`, `resolved`, `closed` |
| `propertyId` | string | Non | Filtrer par bien |
| `page` | number | Non | Page (défaut : 1) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "incident_01HXYZ",
      "title": "Fuite sous l'évier cuisine",
      "severity": "high",
      "status": "inProgress",
      "propertyId": "prop_01HXYZ",
      "propertyName": "Studio Prestige - Part-Dieu",
      "reportedBy": "user_01HXYZ",
      "assignedTo": "user_02HXYZ",
      "reportedAt": "2026-05-18T09:30:00.000Z",
      "resolvedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/incidents?severity=high&status=open" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/incidents

**Description :** Déclare un nouvel incident. Déclenche une notification aux managers.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "title": "Fuite sous l'évier cuisine",
  "description": "Présence d'eau sous l'évier, joint abîmé visible.",
  "severity": "high",
  "propertyId": "prop_01HXYZ",
  "bookingId": "book_01HXYZ",
  "photos": ["https://cdn.conciergeos.app/photos/incident_fuite.jpg"]
}
```

**Réponse 201 :**

```json
{
  "id": "incident_01HXYZ9999",
  "title": "Fuite sous l'évier cuisine",
  "severity": "high",
  "status": "open",
  "reportedAt": "2026-05-18T09:30:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Bien introuvable |
| 422 | `VALIDATION_ERROR` | Titre ou sévérité manquant |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/incidents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"title": "Fuite sous lévier", "severity": "high", "propertyId": "prop_01HXYZ", "description": "Joint abîmé."}'
```

---

### GET /api/incidents/:id

**Description :** Retourne le détail complet d'un incident avec son historique de statuts et les actions entreprises.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "incident_01HXYZ",
  "title": "Fuite sous l'évier cuisine",
  "description": "Présence d'eau sous l'évier, joint abîmé visible.",
  "severity": "high",
  "status": "inProgress",
  "property": {
    "id": "prop_01HXYZ",
    "name": "Studio Prestige - Part-Dieu"
  },
  "booking": {
    "id": "book_01HXYZ",
    "guestName": "Marie Curie",
    "checkOut": "2026-05-25"
  },
  "reportedBy": {
    "id": "user_01HXYZ",
    "firstName": "Emma",
    "lastName": "Bernard"
  },
  "assignedTo": {
    "id": "user_02HXYZ",
    "firstName": "Marc",
    "lastName": "Plombier"
  },
  "photos": ["https://cdn.conciergeos.app/photos/incident_fuite.jpg"],
  "timeline": [
    { "status": "open", "at": "2026-05-18T09:30:00.000Z", "note": "Déclaré par Emma Bernard" },
    { "status": "inProgress", "at": "2026-05-18T10:00:00.000Z", "note": "Assigné à Marc Plombier" }
  ],
  "estimatedCost": 150.00,
  "reportedAt": "2026-05-18T09:30:00.000Z",
  "resolvedAt": null
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Incident introuvable |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/incidents/incident_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PATCH /api/incidents/:id

**Description :** Met à jour le statut d'un incident et/ou affecte un prestataire.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "status": "resolved",
  "assignedTo": "user_02HXYZ",
  "estimatedCost": 150.00,
  "resolution": "Joint remplacé, fuite stoppée.",
  "resolvedAt": "2026-05-19T14:00:00.000Z"
}
```

**Réponse 200 :**

```json
{
  "id": "incident_01HXYZ",
  "status": "resolved",
  "updatedAt": "2026-05-19T14:00:00.000Z",
  "changes": ["status", "estimatedCost", "resolution", "resolvedAt"]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Incident introuvable |
| 422 | `VALIDATION_ERROR` | Transition de statut invalide |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/incidents/incident_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved", "resolution": "Joint remplacé."}'
```

---

## Messages

### GET /api/messages

**Description :** Retourne la liste des conversations actives (groupées par réservation), triées par dernier message.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `unreadOnly` | boolean | Non | Afficher uniquement les conversations non lues |
| `page` | number | Non | Page (défaut : 1) |
| `limit` | number | Non | Éléments par page (défaut : 20) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "bookingId": "book_01HXYZ",
      "guestName": "Marie Curie",
      "propertyName": "Studio Prestige - Part-Dieu",
      "lastMessage": {
        "content": "À quelle heure puis-je arriver ?",
        "sentAt": "2026-05-20T09:00:00.000Z",
        "fromGuest": true
      },
      "unreadCount": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 7,
    "totalPages": 1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/messages?unreadOnly=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### GET /api/messages/:bookingId

**Description :** Retourne le thread complet de messages d'une réservation, dans l'ordre chronologique.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `page` | number | Non | Page (défaut : 1) |
| `limit` | number | Non | Messages par page (défaut : 50) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "bookingId": "book_01HXYZ",
  "guest": {
    "firstName": "Marie",
    "lastName": "Curie"
  },
  "messages": [
    {
      "id": "msg_01HXYZ",
      "content": "Bonjour, j'ai une question sur le parking.",
      "fromGuest": true,
      "sentAt": "2026-05-19T14:00:00.000Z",
      "readAt": "2026-05-19T14:05:00.000Z",
      "channel": "airbnb"
    },
    {
      "id": "msg_02HXYZ",
      "content": "Bonjour Marie, un parking gratuit est disponible en face du bien.",
      "fromGuest": false,
      "sentBy": { "id": "user_01HXYZ", "firstName": "Sophie" },
      "sentAt": "2026-05-19T14:30:00.000Z",
      "readAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 3
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Réservation introuvable |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/messages/book_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/messages

**Description :** Envoie un message à un voyageur. Le message est transmis au canal de la réservation (Airbnb, Booking.com, etc.) si un connecteur est configuré.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "bookingId": "book_01HXYZ",
  "content": "Bonjour Marie, un parking gratuit est disponible en face du bien.",
  "sendViaChannel": true
}
```

**Réponse 201 :**

```json
{
  "id": "msg_02HXYZ",
  "bookingId": "book_01HXYZ",
  "content": "Bonjour Marie, un parking gratuit est disponible en face du bien.",
  "sentAt": "2026-05-19T14:30:00.000Z",
  "channelStatus": "delivered"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Réservation introuvable |
| 422 | `VALIDATION_ERROR` | Contenu vide |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"bookingId": "book_01HXYZ", "content": "Bonjour Marie, un parking gratuit est disponible.", "sendViaChannel": true}'
```

---

### PATCH /api/messages/:id/read

**Description :** Marque un message (ou tous les messages d'une conversation) comme lus.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "markAllInBooking": false
}
```

**Réponse 200 :**

```json
{
  "id": "msg_01HXYZ",
  "readAt": "2026-05-20T10:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Message introuvable |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/messages/msg_01HXYZ/read \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"markAllInBooking": false}'
```

---

## Factures (Invoices)

### GET /api/invoices

**Description :** Retourne la liste des factures de reversement propriétaire avec filtres.

**Auth requis :** Oui

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `ownerId` | string | Non | Filtrer par propriétaire |
| `status` | string | Non | `draft`, `sent`, `paid`, `overdue` |
| `period` | string | Non | Période au format `YYYY-MM` (ex : `2026-04`) |
| `page` | number | Non | Page (défaut : 1) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "inv_01HXYZ",
      "ownerId": "owner_01HXYZ",
      "ownerName": "Jean Dupont",
      "period": "2026-04",
      "status": "sent",
      "totalRevenue": 3800.00,
      "commissionAmount": 760.00,
      "reversementAmount": 3040.00,
      "sentAt": "2026-05-02T10:00:00.000Z",
      "paidAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/invoices?period=2026-04&status=sent" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/invoices/generate

**Description :** Génère les factures de reversement pour tous les propriétaires actifs sur une période donnée. Opération idempotente : les factures existantes pour la période ne sont pas recréées.

**Auth requis :** Oui (rôle `admin` uniquement)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "period": "2026-04",
  "ownerIds": ["owner_01HXYZ", "owner_02HXYZ"]
}
```

> `ownerIds` est optionnel. Si absent, les factures sont générées pour tous les propriétaires actifs.

**Réponse 201 :**

```json
{
  "period": "2026-04",
  "generated": 8,
  "skipped": 1,
  "invoices": [
    { "id": "inv_01HXYZ", "ownerId": "owner_01HXYZ", "reversementAmount": 3040.00 }
  ]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle non-admin |
| 422 | `VALIDATION_ERROR` | Format de période invalide |
| 429 | `RATE_LIMIT_EXCEEDED` | Quota de génération dépassé |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/invoices/generate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"period": "2026-04"}'
```

---

### GET /api/invoices/:id

**Description :** Retourne le détail complet d'une facture, incluant le détail des réservations incluses et l'URL du PDF téléchargeable.

**Auth requis :** Oui

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "inv_01HXYZ",
  "owner": {
    "id": "owner_01HXYZ",
    "firstName": "Jean",
    "lastName": "Dupont",
    "iban": "FR76****0143"
  },
  "period": "2026-04",
  "status": "sent",
  "bookings": [
    {
      "id": "book_01HXYZ",
      "propertyName": "Studio Prestige - Part-Dieu",
      "checkIn": "2026-04-10",
      "checkOut": "2026-04-14",
      "nights": 4,
      "revenue": 420.00,
      "commission": 84.00,
      "ownerShare": 336.00
    }
  ],
  "summary": {
    "totalRevenue": 3800.00,
    "commissionRate": 20.0,
    "commissionAmount": 760.00,
    "reversementAmount": 3040.00
  },
  "pdfUrl": "https://cdn.conciergeos.app/invoices/inv_01HXYZ.pdf",
  "pdfExpiresAt": "2026-06-20T10:00:00.000Z",
  "sentAt": "2026-05-02T10:00:00.000Z",
  "createdAt": "2026-05-01T23:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 404 | `RESOURCE_NOT_FOUND` | Facture introuvable |

**Exemple curl :**

```bash
curl https://api.conciergeos.app/api/invoices/inv_01HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### PATCH /api/invoices/:id/send

**Description :** Envoie la facture par email au propriétaire. Génère le PDF si non encore créé et enregistre la date d'envoi.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "emailOverride": "comptable@prestige-lyon.fr",
  "message": "Veuillez trouver ci-joint votre reversement d'avril 2026."
}
```

> `emailOverride` et `message` sont optionnels. Par défaut, l'email du propriétaire est utilisé.

**Réponse 200 :**

```json
{
  "id": "inv_01HXYZ",
  "status": "sent",
  "sentAt": "2026-05-20T11:30:00.000Z",
  "sentTo": "jean.dupont@example.com"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 404 | `RESOURCE_NOT_FOUND` | Facture introuvable |
| 409 | `CONFLICT` | Facture déjà envoyée (renvoyer est possible, mais loggué) |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/invoices/inv_01HXYZ/send \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Utilisateurs (Users)

### GET /api/users

**Description :** Retourne la liste des utilisateurs de l'agence (équipe interne et prestataires externes).

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `role` | string | Non | `admin`, `manager`, `operator`, `provider` |
| `status` | string | Non | `active`, `inactive`, `invited` |
| `page` | number | Non | Page (défaut : 1) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "data": [
    {
      "id": "user_01HXYZ",
      "firstName": "Sophie",
      "lastName": "Martin",
      "email": "contact@prestige-lyon.fr",
      "role": "admin",
      "status": "active",
      "lastLoginAt": "2026-05-20T08:30:00.000Z",
      "createdAt": "2026-05-01T09:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 6,
    "totalPages": 1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/users?role=provider" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### POST /api/users/invite

**Description :** Invite un utilisateur par email. Un email d'invitation avec un lien de création de compte est envoyé. L'utilisateur apparaît avec le statut `invited` jusqu'à acceptation.

**Auth requis :** Oui (rôle `admin` uniquement)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "email": "emma.bernard@example.com",
  "firstName": "Emma",
  "lastName": "Bernard",
  "role": "operator"
}
```

**Réponse 201 :**

```json
{
  "id": "user_03HXYZ",
  "email": "emma.bernard@example.com",
  "status": "invited",
  "role": "operator",
  "invitedAt": "2026-05-20T12:00:00.000Z",
  "inviteExpiresAt": "2026-05-27T12:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle non-admin |
| 409 | `CONFLICT` | Email déjà utilisé dans l'agence |
| 422 | `VALIDATION_ERROR` | Rôle invalide ou email invalide |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/users/invite \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"email": "emma.bernard@example.com", "firstName": "Emma", "lastName": "Bernard", "role": "operator"}'
```

---

### PATCH /api/users/:id

**Description :** Modifie le rôle ou le statut d'un utilisateur. Un administrateur ne peut pas modifier son propre rôle.

**Auth requis :** Oui (rôle `admin` uniquement)

**Paramètres query :** Aucun

**Body (JSON) :**

```json
{
  "role": "manager",
  "status": "active"
}
```

**Réponse 200 :**

```json
{
  "id": "user_03HXYZ",
  "updatedAt": "2026-05-20T13:00:00.000Z",
  "changes": ["role"]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Tentative d'auto-modification de rôle |
| 404 | `RESOURCE_NOT_FOUND` | Utilisateur introuvable |
| 422 | `VALIDATION_ERROR` | Rôle invalide |

**Exemple curl :**

```bash
curl -X PATCH https://api.conciergeos.app/api/users/user_03HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"role": "manager"}'
```

---

### DELETE /api/users/:id

**Description :** Désactive un utilisateur (soft delete). L'utilisateur ne peut plus se connecter. Ses données historiques (missions, messages) sont conservées.

**Auth requis :** Oui (rôle `admin` uniquement)

**Paramètres query :** Aucun

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "id": "user_03HXYZ",
  "status": "inactive",
  "deactivatedAt": "2026-05-20T14:00:00.000Z"
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Tentative d'auto-désactivation |
| 404 | `RESOURCE_NOT_FOUND` | Utilisateur introuvable |
| 409 | `CONFLICT` | Impossible de désactiver le dernier admin |

**Exemple curl :**

```bash
curl -X DELETE https://api.conciergeos.app/api/users/user_03HXYZ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Analytics

### GET /api/analytics/overview

**Description :** Retourne les KPIs financiers et opérationnels agrégés sur une période définie.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `from` | string (ISO 8601) | Oui | Date de début de la période |
| `to` | string (ISO 8601) | Oui | Date de fin de la période |
| `propertyIds` | string | Non | IDs de biens séparés par virgule (filtre) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "period": {
    "from": "2026-01-01",
    "to": "2026-04-30"
  },
  "kpis": {
    "totalRevenue": 142800.00,
    "occupancyRate": 74.2,
    "revPAR": 138.40,
    "adr": 186.52,
    "totalBookings": 312,
    "avgStayLength": 3.8,
    "cancellationRate": 6.4,
    "avgGuestRating": 4.81
  },
  "comparison": {
    "revenueGrowth": +12.3,
    "occupancyGrowth": +4.1
  }
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |
| 422 | `VALIDATION_ERROR` | Paramètres `from`/`to` manquants |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/analytics/overview?from=2026-01-01&to=2026-04-30" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### GET /api/analytics/properties

**Description :** Retourne les performances individuelles de chaque bien sur une période donnée, triées par revenu décroissant.

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `from` | string (ISO 8601) | Oui | Date de début |
| `to` | string (ISO 8601) | Oui | Date de fin |
| `sortBy` | string | Non | `revenue`, `occupancy`, `rating` (défaut : `revenue`) |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "period": {
    "from": "2026-01-01",
    "to": "2026-04-30"
  },
  "properties": [
    {
      "id": "prop_01HXYZ",
      "name": "Studio Prestige - Part-Dieu",
      "revenue": 18400.00,
      "occupancyRate": 82.3,
      "revPAR": 162.00,
      "adr": 196.80,
      "bookings": 47,
      "avgRating": 4.9,
      "cancellations": 2
    }
  ]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 422 | `VALIDATION_ERROR` | Paramètres manquants |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/analytics/properties?from=2026-01-01&to=2026-04-30&sortBy=occupancy" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### GET /api/analytics/monthly

**Description :** Retourne les données mensuelles des 12 derniers mois, formatées pour l'affichage de graphiques (revenus, taux d'occupation, RevPAR, ADR).

**Auth requis :** Oui (rôle `admin` ou `manager`)

**Paramètres query :**

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `propertyId` | string | Non | Restreindre à un bien spécifique |
| `metrics` | string | Non | Métriques séparées par virgule : `revenue,occupancy,revpar,adr` |

**Body (JSON) :** Aucun

**Réponse 200 :**

```json
{
  "months": [
    {
      "month": "2025-06",
      "revenue": 28400.00,
      "occupancyRate": 68.0,
      "revPAR": 124.00,
      "adr": 182.35,
      "bookings": 64
    },
    {
      "month": "2026-05",
      "revenue": 34200.00,
      "occupancyRate": 78.4,
      "revPAR": 142.50,
      "adr": 181.76,
      "bookings": 78
    }
  ]
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token invalide |
| 403 | `FORBIDDEN` | Rôle insuffisant |

**Exemple curl :**

```bash
curl "https://api.conciergeos.app/api/analytics/monthly?metrics=revenue,occupancy" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Webhooks

### POST /api/webhooks/stripe

**Description :** Point d'entrée pour les événements Stripe. Valide la signature `Stripe-Signature` avant traitement. Les événements supportés sont `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.

**Auth requis :** Non (signature Stripe requise)

**Headers requis :**

```
Stripe-Signature: t=1716300000,v1=abc123...
Content-Type: application/json
```

**Body (JSON) :** Payload Stripe standard

```json
{
  "id": "evt_01HXYZ",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_01HXYZ",
      "amount": 32000,
      "currency": "eur",
      "metadata": {
        "invoiceId": "inv_01HXYZ"
      }
    }
  }
}
```

**Réponse 200 :**

```json
{
  "received": true
}
```

> **Important :** Répondre en moins de 5 secondes ou Stripe retente l'envoi. Le traitement lourd est délégué à un job asynchrone.

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 400 | — | Signature invalide |
| 422 | — | Type d'événement non géré |

**Exemple curl :**

```bash
# Simulation via Stripe CLI
stripe trigger payment_intent.succeeded
```

---

### POST /api/webhooks/booking

**Description :** Reçoit les nouvelles réservations depuis les canaux externes (Airbnb, Booking.com via channel manager). Crée automatiquement la réservation dans la base et déclenche les workflows associés (tâches de ménage, etc.).

**Auth requis :** Non (clé API secrète dans le header)

**Headers requis :**

```
X-Webhook-Secret: whsec_votre_cle_secrete
Content-Type: application/json
```

**Body (JSON) :**

```json
{
  "channel": "airbnb",
  "externalId": "HM1234567890",
  "propertyExternalId": "airbnb_prop_9876",
  "guest": {
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.j@example.com",
    "phone": "+33687654321"
  },
  "checkIn": "2026-06-01",
  "checkOut": "2026-06-05",
  "guests": 2,
  "totalPrice": 480.00,
  "currency": "EUR",
  "status": "confirmed"
}
```

**Réponse 201 :**

```json
{
  "received": true,
  "bookingId": "book_01HXYZ9999",
  "created": true
}
```

**Erreurs :**

| Code HTTP | Code applicatif | Condition |
|---|---|---|
| 401 | — | Clé secrète absente ou invalide |
| 409 | — | Réservation avec cet `externalId` déjà existante |
| 422 | — | Payload invalide ou bien non mappé |

**Exemple curl :**

```bash
curl -X POST https://api.conciergeos.app/api/webhooks/booking \
  -H "X-Webhook-Secret: whsec_votre_cle_secrete" \
  -H "Content-Type: application/json" \
  -d '{"channel": "airbnb", "externalId": "HM1234567890", "propertyExternalId": "airbnb_prop_9876", "checkIn": "2026-06-01", "checkOut": "2026-06-05", "totalPrice": 480}'
```

---

*ConciergeOS — Documentation v1.0 — Mai 2026*
