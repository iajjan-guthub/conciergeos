# ConciergeOS — Glossaire Métier

> Référence pédagogique destinée aux développeurs qui découvrent le secteur de la conciergerie et de la location courte durée.  
> Chaque terme est défini dans son contexte métier et mis en relation avec le modèle de données ConciergeOS.

**150+ termes organisés en 9 catégories.**

---

## Catégorie 1 — Plateformes OTA (Online Travel Agencies)

Les OTA sont les places de marché sur lesquelles les voyageurs trouvent et réservent des logements. Elles prélèvent une commission sur chaque transaction et imposent leurs règles (annulation, avis, paiements).

---

### Airbnb
**Catégorie :** Plateformes OTA  
**Définition :** La plus grande plateforme mondiale de location courte durée entre particuliers (et professionnels). Fondée en 2008, elle opère dans plus de 220 pays. Airbnb prélève une commission de 3% côté hôte et jusqu'à 15% côté voyageur.  
**Exemple concret :** Un appartement parisien génère 80% de ses réservations via Airbnb ; l'agence reçoit les fonds 24h après le check-in du voyageur.  
**Lien avec ConciergeOS :** `bookings.channel = 'airbnb'`. L'`externalBookingId` stocke la référence Airbnb (ex: `HMXXXXXXXX`). Les messages Airbnb sont centralisés dans `messages.channel = 'airbnb'`.  
**Termes associés :** Booking.com, Extranet, Channel Manager, OTA, Commission

---

### Booking.com
**Catégorie :** Plateformes OTA  
**Définition :** Plateforme de réservation en ligne (groupe Booking Holdings) initialement spécialisée dans les hôtels, désormais incontournable pour la location courte durée. Commission côté hôte : 15% à 18% selon les accords.  
**Exemple concret :** Une villa sur la Côte d'Azur attire des voyageurs européens via Booking.com grâce à son programme de visibilité "Preferred Partner".  
**Lien avec ConciergeOS :** `bookings.channel = 'booking'`. Booking.com communique par email et webhooks (pas d'API publique ouverte), d'où la nécessité d'un channel manager intermédiaire.  
**Termes associés :** Airbnb, Vrbo, Extranet, Rate Parity

---

### Vrbo
**Catégorie :** Plateformes OTA  
**Définition :** "Vacation Rentals By Owner" — plateforme américaine (groupe Expedia) populaire pour les grandes maisons et villas, notamment sur le marché anglophone. Anciennement HomeAway en Europe.  
**Exemple concret :** Une villa de 6 chambres en Provence tire 40% de ses réservations de Vrbo, avec des séjours de 7 à 14 nuits en moyenne.  
**Lien avec ConciergeOS :** `bookings.channel = 'vrbo'`. Séjours plus longs → revenus plus élevés mais moins de rotations → impact sur la planification des tâches.  
**Termes associés :** HomeAway, Airbnb, Longueur de séjour

---

### HomeAway
**Catégorie :** Plateformes OTA  
**Définition :** Ancien nom européen de Vrbo avant son absorption par le groupe Expedia. Encore utilisé dans le jargon métier pour désigner les réservations historiquement issues de cette plateforme.  
**Exemple concret :** Des réservations anciennes peuvent encore référencer "HomeAway" dans les systèmes hérités.  
**Lien avec ConciergeOS :** Historique uniquement. Les nouvelles intégrations utilisent `'vrbo'` comme valeur de `channel`.  
**Termes associés :** Vrbo, Expedia

---

### Abritel
**Catégorie :** Plateformes OTA  
**Définition :** Marque française de HomeAway/Vrbo, très populaire auprès des familles françaises pour les locations de vacances en France. Fusionnée sous la bannière Vrbo depuis 2020.  
**Exemple concret :** Une propriété en Bretagne génère encore des demandes depuis le moteur de recherche Abritel, même si les contrats passent par Vrbo.  
**Lien avec ConciergeOS :** Identique à Vrbo dans le système. Mentionné dans la documentation pour les propriétaires qui utilisent encore ce nom.  
**Termes associés :** Vrbo, HomeAway

---

### TripAdvisor Rentals
**Catégorie :** Plateformes OTA  
**Définition :** Bras location de courte durée de TripAdvisor. Moins dominant qu'Airbnb ou Booking mais apporte un trafic complémentaire, notamment sur les destinations touristiques fortes.  
**Exemple concret :** Un chalet de montagne peut recevoir 10% de ses réservations via TripAdvisor grâce aux avis de la destination.  
**Lien avec ConciergeOS :** Non intégré nativement dans la V1. Les réservations manuelles issues de TripAdvisor sont saisies comme `channel = 'direct'` avec une note.  
**Termes associés :** OTA, Avis, Réputation

---

### Direct (réservation directe)
**Catégorie :** Plateformes OTA  
**Définition :** Réservation faite sans intermédiaire OTA : via le site web de l'agence, par téléphone, ou email. Aucune commission OTA n'est prélevée. C'est le canal le plus rentable pour l'agence.  
**Exemple concret :** Un voyageur fidèle qui a découvert le logement sur Airbnb réserve directement la prochaine fois via le site de l'agence.  
**Lien avec ConciergeOS :** `bookings.channel = 'direct'`. La commission (`bookings.commission`) est 0 ou réduite. Le paiement est géré directement (Stripe) plutôt que par la plateforme.  
**Termes associés :** Commission, Stripe, Rate Parity

---

### Extranet
**Catégorie :** Plateformes OTA  
**Définition :** Interface back-office fournie par chaque OTA (Airbnb Host Dashboard, Booking.com Extranet) permettant de gérer ses annonces, calendriers, tarifs et réservations directement sur la plateforme.  
**Exemple concret :** L'agence utilise l'extranet Booking.com pour mettre à jour les photos ou modifier les conditions d'annulation d'un bien.  
**Lien avec ConciergeOS :** ConciergeOS remplace la nécessité de gérer chaque extranet séparément grâce au channel manager. Mais l'extranet reste accessible pour les paramètres non couverts par l'API.  
**Termes associés :** Channel Manager, OTA, Synchronisation bidirectionnelle

---

## Catégorie 2 — Métriques de performance

Les KPIs (Key Performance Indicators) de la location courte durée permettent de mesurer l'efficacité commerciale et opérationnelle d'un portefeuille de biens.

---

### ADR — Average Daily Rate
**Catégorie :** Métriques de performance  
**Définition :** Tarif moyen par nuit calculé sur les réservations confirmées. Formule : `Revenus totaux / Nombre de nuitées vendues`. Ne tient pas compte des nuits non vendues.  
**Exemple concret :** Un appartement génère 3 000€ pour 25 nuitées vendues en mai → ADR = 120€/nuit.  
**Lien avec ConciergeOS :** Calculé à partir de `bookings.totalPrice` et du nombre de nuitées (`checkOut - checkIn`). Affiché dans le tableau de bord agence par bien et par période.  
**Termes associés :** RevPAR, Taux d'occupation, Tarification dynamique

---

### RevPAR — Revenue Per Available Room/Night
**Catégorie :** Métriques de performance  
**Définition :** Revenu par nuitée disponible (vendue ou non). Formule : `ADR × Taux d'occupation`. Mesure la performance globale, tenant compte des jours vides.  
**Exemple concret :** ADR = 120€, taux d'occupation = 70% → RevPAR = 84€. C'est le vrai indicateur de rentabilité.  
**Lien avec ConciergeOS :** Croisement de `bookings` (revenus réels) et du calendrier disponible (`properties.occupancyRateTarget` sert de benchmark).  
**Termes associés :** ADR, Taux d'occupation, RevPAN

---

### RevPAN — Revenue Per Available Night
**Catégorie :** Métriques de performance  
**Définition :** Équivalent du RevPAR mais spécifique à la location courte durée (le terme "room" est inadapté pour les villas ou maisons). Même calcul, terminologie adaptée au secteur.  
**Exemple concret :** Une villa de 6 chambres : RevPAN de 250€ par nuit disponible.  
**Lien avec ConciergeOS :** Synonyme de RevPAR dans le contexte du dashboard ConciergeOS. Utilisé dans les rapports PDF des reversements propriétaires.  
**Termes associés :** RevPAR, ADR, Taux d'occupation

---

### Taux d'occupation
**Catégorie :** Métriques de performance  
**Définition :** Pourcentage de nuitées vendues sur une période. Formule : `Nuitées vendues / Nuitées disponibles`. Un bien "disponible" est un bien en statut `active` non bloqué.  
**Exemple concret :** 25 nuits vendues sur 31 jours en mai → taux d'occupation = 80,6%.  
**Lien avec ConciergeOS :** Calculé à partir de `bookings` (status ≠ cancelled/no_show). `properties.occupancyRateTarget` définit l'objectif. Une alerte est déclenchée si le taux est inférieur à la cible.  
**Termes associés :** ADR, RevPAR, Trou de planning

---

### NPS — Net Promoter Score
**Catégorie :** Métriques de performance  
**Définition :** Score de recommandation client. Mesure la satisfaction des voyageurs sur une échelle de 0 à 10. Formule : `% promoteurs (9-10) - % détracteurs (0-6)`. Score entre -100 et +100.  
**Exemple concret :** 70% de voyageurs mettent 9 ou 10, 10% mettent 6 ou moins → NPS = 60 (excellent dans le secteur).  
**Lien avec ConciergeOS :** Calculé à partir des avis collectés post-séjour. Non stocké directement dans le schéma V1, mais dérivable des données de messages/retours.  
**Termes associés :** Avis, Note globale, Expérience client

---

### GoRev — Gross Operating Revenue
**Catégorie :** Métriques de performance  
**Définition :** Revenu brut d'exploitation d'un bien ou d'un portefeuille : somme de toutes les réservations (totalPrice) avant déduction des commissions OTA, frais de ménage et taxes.  
**Exemple concret :** GoRev mai 2026 = 8 400€ pour 4 appartements. La commission agence est ensuite déduite pour obtenir le reversement propriétaire.  
**Lien avec ConciergeOS :** `invoices.grossRevenue` = GoRev de la période pour un propriétaire donné.  
**Termes associés :** Commission, netAmount, Reversement

---

### Taux de conversion
**Catégorie :** Métriques de performance  
**Définition :** Ratio entre le nombre de vues/demandes d'une annonce et le nombre de réservations confirmées. Mesure l'attractivité de l'annonce (photos, prix, avis).  
**Exemple concret :** 500 vues de l'annonce → 15 réservations → taux de conversion = 3%.  
**Lien avec ConciergeOS :** Non calculé directement dans le schéma V1 (données OTA). Peut être importé depuis les APIs Airbnb/Booking.com.  
**Termes associés :** ADR, Tarification dynamique, Saisonnalité

---

### Délai de réservation moyen (Lead Time)
**Catégorie :** Métriques de performance  
**Définition :** Nombre de jours moyen entre la date de réservation (`createdAt`) et la date d'arrivée (`checkIn`). Indicateur clé pour la tarification dynamique.  
**Exemple concret :** Lead time moyen = 45 jours → les voyageurs réservent 6 semaines à l'avance en moyenne. Un lead time faible indique une forte demande last-minute.  
**Lien avec ConciergeOS :** Calculé comme `AVG(checkIn - DATE(createdAt))` sur la table `bookings`.  
**Termes associés :** Last-minute, Tarification dynamique, Saisonnalité

---

### Longueur de séjour moyenne (Average Length of Stay — ALOS)
**Catégorie :** Métriques de performance  
**Définition :** Durée moyenne des séjours en nuitées. Formule : `SUM(checkOut - checkIn) / COUNT(reservations)`. Influe sur les coûts opérationnels (plus c'est court, plus il y a de ménages).  
**Exemple concret :** ALOS = 3,5 nuits. Un bien avec beaucoup de week-ends courts a des coûts de ménage proportionnellement plus élevés qu'un bien avec des séjours d'une semaine.  
**Lien avec ConciergeOS :** Calculé sur `bookings`. Utilisé pour optimiser les minimums de nuits (`minNights`, colonne à ajouter en V2).  
**Termes associés :** Trou de planning, Long séjour, Taux d'occupation

---

## Catégorie 3 — Opérations terrain

Les opérations terrain regroupent toutes les activités physiques nécessaires au bon fonctionnement d'un logement : accueil des voyageurs, ménage, maintenance, inspection.

---

### Turnover (remise en état entre séjours)
**Catégorie :** Opérations terrain  
**Définition :** Ensemble des opérations réalisées entre deux séjours : ménage complet, changement du linge, vérification des équipements, réapprovisionnement des consommables. C'est le cœur de l'activité opérationnelle.  
**Exemple concret :** Départ à 11h, arrivée à 16h → 5h pour réaliser le turnover. Une prestataire de ménage a une fenêtre de 5 heures maximum.  
**Lien avec ConciergeOS :** Génère automatiquement une tâche `type = 'cleaning'` lors de la confirmation d'une réservation. La fenêtre de temps est calculée entre `checkOut` du séjour sortant et `checkIn` du suivant.  
**Termes associés :** Ménage, Tâche, Linge, État des lieux

---

### Check-in
**Catégorie :** Opérations terrain  
**Définition :** Arrivée du voyageur dans le logement. Peut être physique (accueil en personne), autonome (accès par code/SmartLock) ou hybride (vidéo + code). Moment clé de l'expérience client.  
**Exemple concret :** Le voyageur arrive à 17h. Le gestionnaire envoie un message automatique la veille avec le code de la boîte à clés et les instructions d'accès.  
**Lien avec ConciergeOS :** Tâche `type = 'checkin'` planifiée à `bookings.checkIn`. L'heure de check-in est définie dans `properties.checkInTime`. Les instructions viennent de `properties.accessInstructions`.  
**Termes associés :** Check-out, SmartLock, Accès autonome, Livret de maison

---

### Check-out
**Catégorie :** Opérations terrain  
**Définition :** Départ du voyageur. Peut inclure un état des lieux sortant (physique ou via photos). L'heure est contractuelle et son non-respect peut entraîner des frais.  
**Exemple concret :** Check-out à 11h. Si le voyageur part à 13h sans autorisation, l'agence peut facturer un late check-out.  
**Lien avec ConciergeOS :** Tâche `type = 'checkout'` planifiée à `bookings.checkOut`. Des photos sont requises dans `tasks.photos` pour valider la tâche.  
**Termes associés :** Check-in, État des lieux, Late check-out

---

### État des lieux (entrée/sortie)
**Catégorie :** Opérations terrain  
**Définition :** Constat contradictoire (ou unilatéral) de l'état du logement et de ses équipements à l'arrivée et au départ du voyageur. Sert de preuve en cas de litige sur la caution.  
**Exemple concret :** À la sortie, le gestionnaire photographie une tache sur le canapé. Ces photos permettent de déduire le nettoyage professionnel sur la caution.  
**Lien avec ConciergeOS :** Photos dans `tasks.photos` pour les tâches `checkout` et `checkin`. Un incident `incidents` peut être créé et lié à la réservation (`bookingId`) en cas de dégâts.  
**Termes associés :** Caution, Dépôt de garantie, Incident, Check-out

---

### Ménage (remise en état)
**Catégorie :** Opérations terrain  
**Définition :** Nettoyage complet du logement entre deux séjours : aspirateur, sols, sanitaires, cuisine, poussière, vitres. Distinct du grand nettoyage saisonnier (deep clean).  
**Exemple concret :** Le ménage d'un studio prend 1h30. Celui d'une villa de 4 chambres peut nécessiter 4h avec une équipe de 2 personnes.  
**Lien avec ConciergeOS :** Tâche `type = 'cleaning'`. La checklist (`checklistJson`) liste les points à contrôler. Le `cleaningFee` de la réservation couvre ce coût.  
**Termes associés :** Turnover, Prestataire, Linge, Checklist

---

### Linge (literie, serviettes)
**Catégorie :** Opérations terrain  
**Définition :** Ensemble du linge de maison fourni au voyageur : draps, housses de couette, taies, serviettes de bain, torchons. La gestion du linge (rotation, lavage, stock) est un enjeu opérationnel majeur.  
**Exemple concret :** Une agence gérant 20 biens a besoin d'un stock de 3 jeux de linge par lit pour assurer les rotations sans délai.  
**Lien avec ConciergeOS :** Partie de la checklist de ménage (`checklistJson`). L'item "Changer le linge" est obligatoire dans le template de tâche `cleaning`.  
**Termes associés :** Ménage, Turnover, Prestataire

---

### Caution / Dépôt de garantie
**Catégorie :** Opérations terrain  
**Définition :** Somme préautorisée (pré-autorisation bancaire) ou versée par le voyageur pour couvrir les éventuels dommages. Elle est libérée à la fin du séjour si tout est conforme, ou déduite en cas de dégâts.  
**Exemple concret :** Caution de 300€ préautorisée sur la CB du voyageur. Si aucun incident, libérée sous 7 jours. Si le canapé est taché, 150€ sont déduits.  
**Lien avec ConciergeOS :** `bookings.depositAmount` (montant), `bookings.depositStatus` (pending/captured/released/deducted). Un incident lié à la réservation peut déclencher `depositStatus = 'deducted'`.  
**Termes associés :** Incident, État des lieux, Chargeback, Litige

---

### Code de boîte à clés
**Catégorie :** Opérations terrain  
**Définition :** Boîtier sécurisé fixé près de la porte d'entrée contenant les clés du logement. Accessible via un code à 4 chiffres. Solution économique pour le check-in autonome sans SmartLock.  
**Exemple concret :** "Boîte à clés verte sur la rambarde gauche, code : 4821#."  
**Lien avec ConciergeOS :** `properties.accessCode` (le code). `properties.accessInstructions` (les instructions complètes envoyées au voyageur). Ces champs doivent être chiffrés en production.  
**Termes associés :** SmartLock, Accès autonome, Check-in, accessInstructions

---

### Serrure connectée / SmartLock
**Catégorie :** Opérations terrain  
**Définition :** Serrure électronique connectée (ex: Nuki, Igloohome, Yale) permettant de générer des codes d'accès temporaires par réservation, sans clé physique. Code automatiquement invalidé après le check-out.  
**Exemple concret :** Le code 7892 est généré automatiquement pour la réservation du 10 au 15 mai et expire le 15 à 12h.  
**Lien avec ConciergeOS :** L'intégration SmartLock (V2) permet de renseigner automatiquement `properties.accessCode` avec le code temporaire généré par l'API de la serrure. Tracé dans `audit_log`.  
**Termes associés :** Accès autonome, IoT, Check-in, Code de boîte à clés

---

### Accès autonome (Self Check-in)
**Catégorie :** Opérations terrain  
**Définition :** Mode d'arrivée où le voyageur accède au logement seul, sans présence physique de l'agence. Rendu possible par une boîte à clés ou une SmartLock. Préféré pour sa flexibilité.  
**Exemple concret :** 90% des check-ins d'une agence sont autonomes. Cela élimine le coût d'un accueil physique (30 min × tarif horaire).  
**Lien avec ConciergeOS :** `properties.accessInstructions` contient le guide complet envoyé automatiquement au voyageur (message automatisé, `messages.isAutomated = true`) J-1 avant l'arrivée.  
**Termes associés :** Check-in physique, SmartLock, Livret de maison

---

### Check-in physique
**Catégorie :** Opérations terrain  
**Définition :** Accueil en personne du voyageur par un membre de l'agence ou un prestataire. Permet une présentation du logement et un lien humain, mais implique des contraintes horaires.  
**Exemple concret :** Pour les biens premium (villas, chalets haut de gamme), le check-in physique est souvent inclus dans la prestation pour justifier un tarif élevé.  
**Lien avec ConciergeOS :** Tâche `type = 'checkin'` assignée à un utilisateur (`assigneeId`). L'heure de rendez-vous est dans `scheduledAt`.  
**Termes associés :** Accès autonome, Check-in hybride, Tâche

---

### Check-in hybride
**Catégorie :** Opérations terrain  
**Définition :** Combinaison d'accès autonome et de présence à distance : le voyageur entre seul mais l'hôte est disponible en visioconférence pour répondre aux questions et faire une visite virtuelle.  
**Exemple concret :** L'agence appelle le voyageur sur WhatsApp au moment de son arrivée pour s'assurer que tout va bien et présenter les équipements.  
**Lien avec ConciergeOS :** Tâche `type = 'checkin'` avec notes indiquant l'appel vidéo prévu. Le message est tracé dans `messages.channel = 'whatsapp'`.  
**Termes associés :** Accès autonome, Check-in physique, Messages

---

### Mission
**Catégorie :** Opérations terrain  
**Définition :** Dans ConciergeOS, synonyme de "tâche" (`task`). Désigne toute intervention planifiée sur un bien : ménage, check-in, maintenance, inspection. Terme utilisé dans l'interface pour les prestataires.  
**Exemple concret :** "Vous avez 3 missions aujourd'hui : ménage à Cannes à 11h, check-in à Nice à 16h, inspection à Antibes à 18h."  
**Lien avec ConciergeOS :** Table `tasks`. Chaque mission a un `type`, un `scheduledAt`, un `assigneeId` et une `priority`.  
**Termes associés :** Tâche, Prestataire, Planning, Checklist

---

### Checklist
**Catégorie :** Opérations terrain  
**Définition :** Liste de contrôle structurée que le prestataire doit compléter pendant son intervention. Chaque point est coché ou non, avec possibilité d'ajouter un commentaire ou une photo.  
**Exemple concret :** Checklist ménage : ✅ Changer literie, ✅ Nettoyer cuisine, ⬜ Vérifier WiFi, ✅ Réapprovisionner café.  
**Lien avec ConciergeOS :** `tasks.checklistJson` — tableau JSON : `[{"item": "Changer literie", "done": true, "comment": ""}, ...]`. Initialisé depuis un template selon le type de tâche et le type de bien.  
**Termes associés :** Tâche, Mission, Ménage, Inspection

---

### Prestataire
**Catégorie :** Opérations terrain  
**Définition :** Personne ou société externe à l'agence réalisant des missions terrain : femme de ménage, société de nettoyage, plombier, électricien, serrurier. Peuvent avoir un accès limité à l'app pour voir leurs tâches.  
**Exemple concret :** "Nettoyage Express SARL" est prestataire de ménage pour 15 biens de l'agence dans les Alpes-Maritimes.  
**Lien avec ConciergeOS :** Table `service_providers` (annuaire). Peut aussi avoir un compte `users` avec `role = 'provider'` pour accéder à l'app mobile. Assigné via `tasks.assigneeId`.  
**Termes associés :** Mission, Tâche, Zone géographique, Spécialité

---

### Zone géographique
**Catégorie :** Opérations terrain  
**Définition :** Périmètre géographique (défini par des codes postaux) dans lequel un prestataire est disponible et peut intervenir. Utilisé pour l'assignation automatique des tâches.  
**Exemple concret :** La prestataire de ménage couvre les codes postaux 06000, 06100, 06200 (Nice et alentours). Elle ne peut pas être assignée à un bien à Cannes (06400).  
**Lien avec ConciergeOS :** `service_providers.zones` — tableau JSON de codes postaux. Croisé avec `properties.postalCode` pour l'assignation automatique. Index GIN sur ce champ.  
**Termes associés :** Prestataire, Assignation automatique, Mission

---

### SLA opérationnel (Service Level Agreement)
**Catégorie :** Opérations terrain  
**Définition :** Engagement de délai pour la réalisation d'une opération. En conciergerie : délai maximum entre la confirmation d'une réservation et la planification des tâches, ou délai de réponse aux incidents urgents.  
**Exemple concret :** SLA incident urgent : intervention sous 4 heures. SLA création de tâches après réservation : automatique en moins de 5 minutes.  
**Lien avec ConciergeOS :** `tasks.status = 'late'` quand le `scheduledAt` est dépassé. `incidents.severity = 'urgent'` déclenche une notification immédiate. Le CRON de vérification tourne toutes les 15 minutes.  
**Termes associés :** Incident, Tâche, Priorité, Late

---

## Catégorie 4 — Finance et comptabilité

La finance de la conciergerie implique des flux complexes : revenus OTA, commissions, frais de ménage, taxes, cautions, réparations. Tout aboutit au "reversement" mensuel au propriétaire.

---

### Reversement
**Catégorie :** Finance et comptabilité  
**Définition :** Virement mensuel effectué par l'agence au propriétaire, correspondant aux revenus bruts de ses biens, déduction faite de la commission agence, des frais de réparation et autres charges.  
**Exemple concret :** Revenus bruts mai : 3 200€. Commission agence (20%) : -640€. Réparations : -150€. Net reversé : 2 410€.  
**Lien avec ConciergeOS :** `invoices.netAmount` = montant du reversement. Calculé à partir de `grossRevenue - commission - repairs - extras`.  
**Termes associés :** Commission, Facture, netAmount, IBAN

---

### Commission agence
**Catégorie :** Finance et comptabilité  
**Définition :** Rémunération de l'agence de conciergerie, exprimée en pourcentage des revenus bruts. Généralement entre 15% et 25% selon les services inclus (ménage, gestion, marketing).  
**Exemple concret :** Commission de 20% sur un loyer de 1 500€ = 300€ pour l'agence. Le propriétaire reçoit 1 200€ avant déduction des autres frais.  
**Lien avec ConciergeOS :** `bookings.commission` (montant) et `invoices.commissionRate` (taux, snapshoté à la génération de facture). `invoices.commission` = total commissions de la période.  
**Termes associés :** Reversement, GoRev, commissionRate

---

### Frais de ménage
**Catégorie :** Finance et comptabilité  
**Définition :** Montant facturé au voyageur en supplément du prix de la nuitée pour couvrir le coût du ménage entre deux séjours. Distinct de la commission agence.  
**Exemple concret :** Nuit à 100€ + frais de ménage 45€ = prix total 145€ pour une nuit. Pour un séjour de 3 nuits : 300€ + 45€ = 345€.  
**Lien avec ConciergeOS :** `properties.cleaningFee` (valeur par défaut du bien). `bookings.cleaningFee` (valeur appliquée à la réservation, peut être surchargée). Inclus dans le `totalPrice`.  
**Termes associés :** Ménage, Turnover, Commission, totalPrice

---

### Taxe de séjour
**Catégorie :** Finance et comptabilité  
**Définition :** Taxe locale collectée par l'hébergeur pour le compte des collectivités territoriales. En France, calculée par nuit et par personne, avec un barème variable selon la commune et la catégorie du bien.  
**Exemple concret :** Nice, appartement 3 étoiles : 1,65€/nuit/personne. Séjour de 5 nuits × 2 personnes = 16,50€ de taxe de séjour.  
**Lien avec ConciergeOS :** `bookings.touristTax` — montant total de la taxe pour le séjour. Doit être déclarée et reversée trimestriellement à la commune. Non inclus dans la commission agence.  
**Termes associés :** Déclaration en mairie, Régime fiscal, Reversement

---

### TVA sur location
**Catégorie :** Finance et comptabilité  
**Définition :** En France, les locations meublées courtes durées sont en principe exonérées de TVA, sauf si des services para-hôteliers sont fournis (petit-déjeuner, ménage quotidien, réception...). La frontière est complexe.  
**Exemple concret :** Une conciergerie proposant le petit-déjeuner peut basculer dans le régime TVA (10%). La plupart des agences restent en exonération.  
**Lien avec ConciergeOS :** Non modélisé en V1 (dépend du régime fiscal de chaque agence). À prendre en compte lors de la génération des PDFs de factures.  
**Termes associés :** LMNP, micro-BIC, Commission

---

### Charges récupérables
**Catégorie :** Finance et comptabilité  
**Définition :** Dépenses engagées par l'agence pour le compte du propriétaire et refacturées sur le relevé mensuel : petites fournitures, réparations mineures, frais de blanchisserie exceptionnels.  
**Exemple concret :** Remplacement d'une ampoule cassée : 5€. Nettoyage exceptionnel après dégradation : 80€. Ces montants apparaissent dans "extras" sur la facture.  
**Lien avec ConciergeOS :** `invoices.extras` — ligne "frais additionnels" sur la facture. `incidents.actualCost` peut être basculé en `repairs` ou `extras` selon la nature.  
**Termes associés :** Incident, actualCost, Reversement, Facture

---

### Déduction
**Catégorie :** Finance et comptabilité  
**Définition :** Montant retenu sur le reversement au propriétaire pour couvrir une dépense : coût d'un incident, réparation, remplacement de matériel cassé par un voyageur.  
**Exemple concret :** La télévision a été cassée pendant un séjour. Remplacement : 450€. Déduit du reversement de novembre, avec la facture du prestataire en pièce jointe.  
**Lien avec ConciergeOS :** `invoices.repairs` — somme des déductions sur la période. `incidents.actualCost` alimente ce champ lors de la génération de facture.  
**Termes associés :** Incident, Caution, actualCost, repairs

---

### Acompte
**Catégorie :** Finance et comptabilité  
**Définition :** Paiement partiel effectué par le voyageur à la réservation (généralement 30 à 50%), le solde étant dû à l'approche du séjour. Pratique courante sur les réservations directes et Booking.com.  
**Exemple concret :** Réservation d'une villa à 2 000€ : acompte de 600€ à la réservation (30%), solde de 1 400€ dû 30 jours avant l'arrivée.  
**Lien avec ConciergeOS :** `bookings.depositAmount` peut représenter un acompte dans certains contextes. La gestion complète (acompte + solde) nécessite une modélisation des paiements plus fine (V2).  
**Termes associés :** totalPrice, Stripe, Payout

---

### Solde
**Catégorie :** Finance et comptabilité  
**Définition :** Montant restant dû après versement d'un acompte. Doit être réglé avant le check-in (généralement 30 à 60 jours avant).  
**Exemple concret :** Villa à 2 000€, acompte 600€ → solde 1 400€ à régler avant le 15 avril pour un séjour du 15 mai.  
**Lien avec ConciergeOS :** Non modélisé séparément en V1. Le `totalPrice` représente le montant total. Les étapes de paiement sont gérées par Stripe.  
**Termes associés :** Acompte, Stripe, totalPrice

---

### Stripe Connect
**Catégorie :** Finance et comptabilité  
**Définition :** Produit Stripe permettant à une plateforme (ConciergeOS) de gérer les paiements pour le compte de ses clients (les agences) et de ventiler les fonds. Architecture "marketplace" : les fonds transitent par ConciergeOS avant d'être reversés.  
**Exemple concret :** Un voyageur paie 500€ sur la plateforme → Stripe retient 1,4% + 0,25€ de frais → ConciergeOS garde sa commission SaaS → le reste est transféré sur le compte Stripe de l'agence.  
**Lien avec ConciergeOS :** `agencies.stripeCustomerId` — identifiant Stripe de l'agence. Les paiements des réservations directes (`bookings.channel = 'direct'`) transitent par Stripe.  
**Termes associés :** Payout, Commission, Chargeback, PCI DSS

---

### Payout
**Catégorie :** Finance et comptabilité  
**Définition :** Virement automatique de Stripe vers le compte bancaire de l'agence (ou du prestataire). Configurable (quotidien, hebdomadaire) avec un délai de roulement (généralement J+7 pour la France).  
**Exemple concret :** Les réservations Stripe sont consolidées chaque lundi et virées sur le compte bancaire de l'agence le lundi suivant.  
**Lien avec ConciergeOS :** Géré côté Stripe. ConciergeOS écoute les webhooks Stripe `payout.paid` pour mettre à jour les statuts de paiement.  
**Termes associés :** Stripe Connect, Reversement, IBAN

---

### Litige
**Catégorie :** Finance et comptabilité  
**Définition :** Contestation formelle d'une transaction par le voyageur auprès de sa banque ou de la plateforme OTA. Peut aboutir à un remboursement forcé (chargeback) si l'agence ne fournit pas de preuves suffisantes.  
**Exemple concret :** Un voyageur conteste le prélèvement de la caution suite à des dégâts. L'agence doit fournir photos, état des lieux et devis dans les 7 jours.  
**Lien avec ConciergeOS :** Les photos dans `tasks.photos` (état des lieux) et `incidents.photos` servent de preuves. Un incident lié à la réservation (`incidents.bookingId`) documente le litige.  
**Termes associés :** Chargeback, Caution, Incident, photos

---

### Chargeback
**Catégorie :** Finance et comptabilité  
**Définition :** Remboursement forcé ordonné par la banque du voyageur en cas de litige non résolu en faveur de l'agence. Coûteux (frais Stripe ~15€ + montant remboursé). À éviter absolument.  
**Exemple concret :** Chargeback suite à une annulation contestée : 400€ remboursés + 15€ de frais Stripe = 415€ de perte pour l'agence.  
**Lien avec ConciergeOS :** Géré via webhook Stripe `charge.dispute.created`. Déclenche une alerte admin et la création d'un incident de type litige.  
**Termes associés :** Litige, Stripe, Remboursement, Caution

---

### Remboursement
**Catégorie :** Finance et comptabilité  
**Définition :** Restitution volontaire ou contrainte d'une somme au voyageur. Peut être partiel (ex: nuits non utilisées) ou total. Distinct du chargeback (le remboursement est initié par l'agence).  
**Exemple concret :** Annulation 48h avant l'arrivée (politique flexible) → remboursement de 70% du montant total.  
**Lien avec ConciergeOS :** Le statut de réservation devient `cancelled`. Le montant remboursé peut être tracé dans `bookings.notes` en V1. Une colonne `refundAmount` est prévue en V2.  
**Termes associés :** Annulation, Chargeback, status, Stripe

---

### Facture
**Catégorie :** Finance et comptabilité  
**Définition :** Document comptable mensuel émis par l'agence au propriétaire, détaillant les revenus de la période, la commission prélevée et le net reversé. Doit mentionner les mentions légales obligatoires.  
**Exemple concret :** Facture mai 2026 : revenus bruts 3 200€, commission 20% (-640€), réparations (-150€) = net reversé 2 410€. PDF signé, envoyé par email.  
**Lien avec ConciergeOS :** Table `invoices`. `pdfUrl` pointe vers le PDF généré et stocké (ex: Supabase Storage). `status` suit le cycle : draft → sent → paid.  
**Termes associés :** Reversement, commission, pdfUrl, netAmount

---

### Avoir
**Catégorie :** Finance et comptabilité  
**Définition :** Document comptable qui annule partiellement ou totalement une facture. Utilisé en cas d'erreur de facturation ou de remboursement partiel au propriétaire.  
**Exemple concret :** Une commission calculée trop élevée → émission d'un avoir de 50€ → déduction sur la prochaine facture.  
**Lien avec ConciergeOS :** Non modélisé en V1. Les corrections manuelles sont effectuées via `invoices.extras` (valeur négative). Une table `credit_notes` est prévue en V2.  
**Termes associés :** Facture, Commission, Remboursement

---

## Catégorie 5 — Revenue Management

Le revenue management (gestion des revenus) consiste à optimiser les tarifs pour maximiser les revenus en fonction de la demande, de la saisonnalité et de la concurrence.

---

### Tarification dynamique
**Catégorie :** Revenue Management  
**Définition :** Stratégie de prix où le tarif par nuit varie automatiquement en fonction de la demande, des événements locaux, de la saisonnalité et de la concurrence. L'objectif est de maximiser le RevPAR.  
**Exemple concret :** Un appartement à Nice passe de 80€/nuit en octobre à 180€/nuit pendant le Festival de Cannes.  
**Lien avec ConciergeOS :** `properties.basePricePerNight` est le tarif de base. Les règles dynamiques (V2) créent des majorations/réductions stockées dans une table `pricing_rules`. Les réservations enregistrent le prix final dans `bookings.totalPrice`.  
**Termes associés :** ADR, RevPAR, Saisonnalité, Prix plancher, Prix plafond

---

### Tarif de base (Base Rate)
**Catégorie :** Revenue Management  
**Définition :** Prix standard par nuit en dehors de toute règle de tarification dynamique. Point de départ à partir duquel les majorations et réductions sont calculées.  
**Exemple concret :** Tarif de base : 100€/nuit. En juillet, majoration +80% → 180€/nuit. En novembre, réduction -30% → 70€/nuit.  
**Lien avec ConciergeOS :** `properties.basePricePerNight` — valeur de référence. Stocké au niveau du bien. Les variations sont appliquées à la réservation.  
**Termes associés :** Tarification dynamique, Prix plancher, Prix plafond, Saisonnalité

---

### Saisonnalité
**Catégorie :** Revenue Management  
**Définition :** Variation prévisible de la demande selon les saisons, les vacances scolaires et les habitudes touristiques. Détermine les périodes de haute et basse saison.  
**Exemple concret :** Bord de mer : haute saison juillet-août, basse saison novembre-janvier. Montagne : haute saison décembre-janvier et février (ski) + juillet-août (randonnée).  
**Lien avec ConciergeOS :** Informations stockées dans des règles de tarification (V2). `properties.occupancyRateTarget` peut varier selon la saison.  
**Termes associés :** Haute/basse saison, Tarification dynamique, ADR

---

### Haute saison / Basse saison
**Catégorie :** Revenue Management  
**Définition :** Périodes où la demande (et donc les prix) est respectivement au plus haut et au plus bas. La frontière varie selon la destination.  
**Exemple concret :** Côte d'Azur : haute saison = juin à septembre. Basse saison = novembre à mars. Les tarifs peuvent tripler entre les deux.  
**Lien avec ConciergeOS :** Règles de tarification dynamique (V2) définissant des multiplicateurs par période. En V1, l'agence ajuste manuellement le `basePricePerNight`.  
**Termes associés :** Saisonnalité, Tarification dynamique, ADR

---

### Last-minute (réduction)
**Catégorie :** Revenue Management  
**Définition :** Réduction accordée sur les réservations effectuées peu de temps avant la date d'arrivée (typiquement J-7 à J-1). Permet de réduire les trous de planning et d'optimiser le taux d'occupation.  
**Exemple concret :** Appartement libre pour le week-end prochain → réduction de 25% appliquée automatiquement à J-5 pour attirer des réservations de dernière minute.  
**Lien avec ConciergeOS :** Règle de tarification (V2) basée sur `checkIn - NOW()`. Le prix réduit s'applique à `bookings.totalPrice`. Le `basePricePerNight` n'est pas modifié.  
**Termes associés :** Trou de planning, Délai de réservation, Tarification dynamique

---

### Long séjour (réduction)
**Catégorie :** Revenue Management  
**Définition :** Réduction accordée pour les séjours de longue durée (généralement 7 nuits+ ou 28 nuits+). Fidélise les voyageurs et réduit le nombre de turnovers.  
**Exemple concret :** Séjour de 7 nuits : -10%. Séjour mensuel : -25%. La réduction est appliquée sur le tarif total.  
**Lien avec ConciergeOS :** Calculé à partir de `checkOut - checkIn` dans la table `bookings`. Règle de tarification (V2).  
**Termes associés :** ALOS, Tarification dynamique, Turnover

---

### Trou de planning (Gap Night)
**Catégorie :** Revenue Management  
**Définition :** Nuit isolée ou courte période non réservée coincée entre deux réservations, difficile à vendre car trop courte pour attirer de nouveaux voyageurs.  
**Exemple concret :** Réservation du 10 au 13, puis du 15 au 20 → "trou" du 13 au 15 (2 nuits) difficile à vendre. Solution : combler avec une réduction ou ajuster le minimum de nuits.  
**Lien avec ConciergeOS :** Détectable par une requête sur `bookings` pour trouver les gaps entre réservations confirmées sur un même bien. Alerte V2 dans le tableau de bord.  
**Termes associés :** Taux d'occupation, Last-minute, Longueur de séjour

---

### Événement local
**Catégorie :** Revenue Management  
**Définition :** Événement (concert, festival, salon, match sportif, marathon) générant un pic de demande dans une ville. Justifie une majoration temporaire des tarifs.  
**Exemple concret :** Festival de Cannes, Grand Prix de Monaco, Roland-Garros → la demande explose, les tarifs peuvent être multipliés par 3 à 5.  
**Lien avec ConciergeOS :** Base de données d'événements (V2) croisée avec `properties.city` et `properties.postalCode`. Génère des règles de majoration automatiques.  
**Termes associés :** Tarification dynamique, Saisonnalité, Majoration

---

### Majoration
**Catégorie :** Revenue Management  
**Définition :** Supplément appliqué au tarif de base pour une période spécifique (high season, événement, week-end). Exprimée en pourcentage ou en valeur fixe.  
**Exemple concret :** Week-end +15%, Juillet-Août +80%, Festival de Cannes +200%.  
**Lien avec ConciergeOS :** Règle de tarification (V2) appliquée sur `basePricePerNight` pour calculer le prix final dans `bookings.totalPrice`.  
**Termes associés :** Tarification dynamique, Saisonnalité, Prix plafond

---

### Yield Management
**Catégorie :** Revenue Management  
**Définition :** Stratégie d'optimisation des revenus par ajustement continu des prix en fonction de l'offre et de la demande en temps réel. Concept issu de l'hôtellerie et de l'aérien, adapté à la location courte durée.  
**Exemple concret :** Si le taux d'occupation prévu pour le mois prochain est de 95%, augmenter les prix des dernières nuitées disponibles pour maximiser le RevPAR.  
**Lien avec ConciergeOS :** Module revenue management (V2). S'appuie sur les données `bookings`, `properties.occupancyRateTarget` et les données de marché externes (API PriceLabs, Beyond).  
**Termes associés :** RevPAR, ADR, Tarification dynamique, Taux d'occupation

---

### Prix plancher (Floor Price)
**Catégorie :** Revenue Management  
**Définition :** Tarif minimum en dessous duquel une nuitée ne doit jamais être vendue, même avec des réductions. Protège la rentabilité et l'image du bien.  
**Exemple concret :** Prix plancher = 60€/nuit. Même en basse saison avec réduction last-minute, le bien ne descendra jamais sous 60€.  
**Lien avec ConciergeOS :** Colonne `minPricePerNight` à ajouter sur `properties` en V2. Contrôle lors de l'application des règles de tarification.  
**Termes associés :** Prix plafond, Tarif de base, Tarification dynamique

---

### Prix plafond (Ceiling Price)
**Catégorie :** Revenue Management  
**Définition :** Tarif maximum au-delà duquel une nuitée ne doit pas être proposée, pour éviter de paraître excessif et préserver l'image du bien.  
**Exemple concret :** Prix plafond = 400€/nuit. Même pendant le Grand Prix de Monaco, le bien ne dépasse pas ce seuil pour rester crédible.  
**Lien avec ConciergeOS :** Colonne `maxPricePerNight` à ajouter sur `properties` en V2.  
**Termes associés :** Prix plancher, Tarification dynamique, Majoration

---

## Catégorie 6 — Expérience client

L'expérience client (guest experience) couvre tout le parcours du voyageur, de la réservation à l'avis post-séjour. Elle est déterminante pour les avis, la réputation et les revenus futurs.

---

### Voyageur (Guest)
**Catégorie :** Expérience client  
**Définition :** Personne qui séjourne dans le logement. Distinct du client (qui peut être une entreprise), le voyageur est la personne physique présente sur place.  
**Exemple concret :** Jean Dupont réserve pour lui et 3 amis → Jean est le voyageur de contact (guestName), les autres sont des occupants non nommés.  
**Lien avec ConciergeOS :** `bookings.guestName`, `bookings.guestEmail`, `bookings.guestPhone`, `bookings.guestCountry`, `bookings.adults`, `bookings.children`.  
**Termes associés :** Réservation, Check-in, Messages, Avis

---

### Livret de maison (Guestbook)
**Catégorie :** Expérience client  
**Définition :** Document (PDF ou numérique) remis au voyageur contenant toutes les informations utiles pour son séjour : règles de la maison, WiFi, instructions des équipements, bons plans locaux, contacts d'urgence.  
**Exemple concret :** "Livret de maison Villa Azur" : 12 pages avec photos, plan de la maison, liste des restaurants recommandés, numéro d'urgence.  
**Lien avec ConciergeOS :** Généré automatiquement à partir des données de `properties` (wifi, accès, équipements) et envoyé via `messages` J-2 avant l'arrivée. URL du PDF stockée en référence.  
**Termes associés :** Guide d'arrivée, accessInstructions, wifiName, wifiPassword, amenities

---

### Guide d'arrivée
**Catégorie :** Expérience client  
**Définition :** Message ou document envoyé au voyageur quelques jours avant son arrivée, contenant uniquement les informations pratiques d'accès : code, adresse exacte, parking, transport.  
**Exemple concret :** Message automatique J-2 : "Bonjour Jean ! Votre logement est au 3e étage, code d'entrée : 4821#, WiFi : Villa_Azur / azur2026."  
**Lien avec ConciergeOS :** Message automatique (`messages.isAutomated = true`) généré à partir de `properties.accessInstructions`, `properties.accessCode`, `properties.wifiName`, `properties.wifiPassword`.  
**Termes associés :** Livret de maison, accessInstructions, Messages, Automatisation

---

### Instructions d'accès
**Catégorie :** Expérience client  
**Définition :** Description détaillée permettant au voyageur de trouver le logement et d'y entrer : adresse précise, étage, parking, interphone, code de boîte à clés, clé cachée, etc.  
**Exemple concret :** "Sonner à 'Dupont' sur l'interphone, 2e porte à gauche dans la cour, boîte à clés orange code 4567# sur le mur à droite de la porte."  
**Lien avec ConciergeOS :** `properties.accessInstructions` — champ texte long. `properties.accessCode` — le code seul. Ces données sont chiffrées en production.  
**Termes associés :** accessCode, SmartLock, Guide d'arrivée, Check-in autonome

---

### Règlement intérieur
**Catégorie :** Expérience client  
**Définition :** Ensemble des règles que le voyageur s'engage à respecter : pas de fête, pas de fumée, horaires de silence, nombre maximum d'occupants, règles pour les animaux.  
**Exemple concret :** "Pas de fête. Pas d'animaux. Silence après 22h. Max 4 personnes. Pas de chaussures dans le salon."  
**Lien avec ConciergeOS :** Inclus dans le livret de maison. Peut être stocké dans `properties` (champ `houseRules TEXT` à ajouter en V2). Les violations peuvent déclencher un `incident`.  
**Termes associés :** Livret de maison, Incident, Avis, Voyageur

---

### Services additionnels (Upsell)
**Catégorie :** Expérience client  
**Définition :** Prestations optionnelles proposées au voyageur en plus du loyer de base : accueil personnalisé, panier de bienvenue, transfert aéroport, ménage en cours de séjour, location de vélos, cours de cuisine.  
**Exemple concret :** Panier de bienvenue (+35€), transfert aéroport (+45€) → ces options sont proposées lors de la confirmation et après la réservation.  
**Lien avec ConciergeOS :** `invoices.extras` pour les services facturés au voyageur et reversés au propriétaire. Table `extras` dédiée prévue en V2.  
**Termes associés :** Commission, Reversement, Expérience client

---

### Avis (Review)
**Catégorie :** Expérience client  
**Définition :** Évaluation laissée par le voyageur sur la plateforme après son séjour. Facteur clé de visibilité et de confiance. La note globale impacte le classement dans les résultats de recherche.  
**Exemple concret :** Airbnb : note de 4,8/5 avec avis "Logement impeccable, hôte très réactif." Une note sous 4,5 entraîne des pénalités de visibilité sur Airbnb.  
**Lien avec ConciergeOS :** Non stocké directement en V1 (données OTA propriétaires). Un message automatique de demande d'avis est envoyé J+1 après le check-out (`messages.isAutomated = true`).  
**Termes associés :** NPS, Note globale, Réponse aux avis, OTA

---

### Note globale
**Catégorie :** Expérience client  
**Définition :** Moyenne des notes attribuées par les voyageurs sur l'ensemble des critères (propreté, communication, emplacement, équipements, rapport qualité/prix). Varie de 1 à 5.  
**Exemple concret :** Airbnb calcule la note globale comme moyenne de 6 sous-critères. Une note de 4,9 place le bien dans la catégorie "Superhôte".  
**Lien avec ConciergeOS :** Colonne `rating NUMERIC(3,2)` à ajouter sur `properties` en V2. Mis à jour régulièrement via l'API OTA.  
**Termes associés :** Avis, NPS, Superhôte, OTA

---

### Réponse aux avis
**Catégorie :** Expérience client  
**Définition :** Réponse publique de l'hôte à un avis voyageur. Importante pour l'image : montre le professionnalisme et permet de rectifier un avis négatif abusif.  
**Exemple concret :** Avis négatif sur la propreté → réponse : "Nous avons enquêté et pris des mesures correctives. Toutes nos excuses pour cette expérience."  
**Lien avec ConciergeOS :** Fonctionnalité de gestion des avis (V2). En V1, les réponses sont rédigées manuellement dans les extranets OTA.  
**Termes associés :** Avis, Note globale, Réputation, OTA

---

### Chat
**Catégorie :** Expérience client  
**Définition :** Communication textuelle en temps réel avec le voyageur, via les messageries des plateformes (Airbnb, Booking.com) ou d'autres canaux (WhatsApp, SMS, email). Central dans la gestion de l'expérience voyageur.  
**Exemple concret :** "Le chauffage ne fonctionne pas." → Réponse en 5 minutes : "Nous envoyons un technicien dans l'heure."  
**Lien avec ConciergeOS :** Table `messages`. `channel` indique la plateforme. `direction` indique le sens. `readAt` suit la lecture. `isAutomated` distingue les réponses automatiques.  
**Termes associés :** Messages, Canal, direction, isAutomated, Incident

---

### Escalade
**Catégorie :** Expérience client  
**Définition :** Processus par lequel un problème signalé par un voyageur est transmis à un niveau supérieur (manager, directeur) car il dépasse les capacités de réponse standard.  
**Exemple concret :** Un voyageur se plaint d'une infestation d'insectes → escalade immédiate au directeur d'agence + déclenchement d'un incident de sévérité urgente.  
**Lien avec ConciergeOS :** Création d'un `incident` avec `severity = 'urgent'`, notification push au manager. Un message interne (`channel = 'internal'`) documente l'escalade.  
**Termes associés :** Incident, severity, SLA, Messages

---

### No-show
**Catégorie :** Expérience client  
**Définition :** Voyageur qui ne se présente pas à la date de check-in sans avoir annulé. L'agence conserve généralement les fonds selon la politique d'annulation.  
**Exemple concret :** Le voyageur devait arriver le 15 mai à 16h. À 20h, toujours pas présent et injoignable → no-show déclaré.  
**Lien avec ConciergeOS :** `bookings.status = 'no_show'`. La caution (`depositStatus`) reste en attente jusqu'à décision manuelle. Une tâche de re-vérification du logement est créée.  
**Termes associés :** status, depositStatus, Annulation, Check-in

---

### Annulation
**Catégorie :** Expérience client  
**Définition :** Annulation d'une réservation avant le check-in. Les conditions de remboursement dépendent de la politique d'annulation (flexible, modérée, stricte) choisie pour chaque bien.  
**Exemple concret :** Politique modérée : annulation 5 jours avant → remboursement 50%. Annulation la veille → aucun remboursement.  
**Lien avec ConciergeOS :** `bookings.status = 'cancelled'`. Les tâches associées sont passées en `cancelled`. Le remboursement est géré via Stripe webhook.  
**Termes associés :** status, Remboursement, No-show, Stripe

---

## Catégorie 7 — Profils utilisateurs

Les différents acteurs de la plateforme ConciergeOS ont des rôles, des besoins et des droits d'accès distincts.

---

### Conciergerie / Agence de conciergerie
**Catégorie :** Profils utilisateurs  
**Définition :** Entreprise professionnelle qui gère des logements de vacances pour le compte de propriétaires : mise en ligne des annonces, gestion des réservations, accueil des voyageurs, ménage, maintenance. Le client principal de ConciergeOS.  
**Exemple concret :** "Villa Azur Conciergerie" gère 45 appartements à Nice pour 30 propriétaires différents.  
**Lien avec ConciergeOS :** Table `agencies`. Chaque agence est un tenant isolé. Tous ses collaborateurs sont dans `users` avec `agencyId` correspondant.  
**Termes associés :** Agence, Owner, Multi-tenant, Plan SaaS

---

### Propriétaire (Owner)
**Catégorie :** Profils utilisateurs  
**Définition :** Personne physique ou morale qui possède le bien immobilier mis en location. Délègue la gestion à la conciergerie contre une commission. Peut consulter ses revenus et son planning via le portail propriétaire.  
**Exemple concret :** M. Bernard possède 3 appartements à Nice et les confie à Villa Azur. Il consulte chaque mois son tableau de bord pour voir les revenus et télécharger ses factures.  
**Lien avec ConciergeOS :** Table `owners`. Peut avoir un compte `users` avec `role = 'owner'` si accès portail. Reçoit les `invoices` chaque mois.  
**Termes associés :** Portail propriétaire, Reversement, Facture, IBAN

---

### Voyageur (Guest)
**Catégorie :** Profils utilisateurs  
**Définition :** Personne qui réserve et séjourne dans le logement. Peut avoir un compte limité sur ConciergeOS pour accéder à ses informations de séjour (check-in autonome, livret de maison numérique).  
**Exemple concret :** Marie réserve un appartement pour 5 nuits via Airbnb. Elle reçoit automatiquement le guide d'arrivée et peut poser des questions via la messagerie intégrée.  
**Lien avec ConciergeOS :** `bookings.guestName` etc. Peut avoir un `users` avec `role = 'guest'` en V2 pour l'accès au portail voyageur.  
**Termes associés :** Réservation, Check-in, Messages, Avis

---

### Prestataire (Provider/Cleaner)
**Catégorie :** Profils utilisateurs  
**Définition :** Intervenant terrain externe à l'agence (ménage, maintenance). Utilise l'application mobile pour voir ses missions du jour, compléter les checklists et uploader des photos.  
**Exemple concret :** Fatima est prestataire de ménage. Chaque matin, elle ouvre l'app ConciergeOS et voit ses 4 missions du jour avec les adresses, horaires et checklists.  
**Lien avec ConciergeOS :** `users.role = 'provider'` pour l'accès app. `service_providers` pour le référentiel et les zones. `tasks.assigneeId` pour l'assignation. RLS : voit uniquement ses tâches.  
**Termes associés :** Mission, Tâche, Checklist, Zone géographique

---

### Super Admin
**Catégorie :** Profils utilisateurs  
**Définition :** Administrateur de la plateforme ConciergeOS (l'équipe ConciergeOS elle-même). Accès illimité à toutes les agences. Peut impersonner n'importe quel utilisateur pour le support.  
**Exemple concret :** Un développeur ConciergeOS accède à l'agence "Villa Azur" en tant que super_admin pour diagnostiquer un bug sans avoir les credentials de l'agence.  
**Lien avec ConciergeOS :** `users.role = 'super_admin'`. Contourne toutes les policies RLS (`current_user_role() = 'super_admin'`). Toutes les actions sont tracées dans `audit_log`.  
**Termes associés :** RBAC, RLS, audit_log, super_admin

---

### Manager opérations
**Catégorie :** Profils utilisateurs  
**Définition :** Employé de l'agence en charge de la coordination terrain : assignation des tâches, suivi des prestataires, gestion des incidents, contrôle qualité. Interface quotidienne principale.  
**Exemple concret :** Sophie, manager opérations, vérifie chaque matin le planning du jour, assigne les ménages aux prestataires disponibles et gère les incidents en cours.  
**Lien avec ConciergeOS :** `users.role = 'manager'`. Accès complet aux `tasks`, `incidents`, `bookings` de son agence. Reçoit les notifications push pour les incidents urgents.  
**Termes associés :** Mission, Incident, Planning, Assignation

---

### Commercial
**Catégorie :** Profils utilisateurs  
**Définition :** Employé de l'agence en charge du développement commercial : acquisition de nouveaux propriétaires, gestion de la relation client, suivi des revenus.  
**Exemple concret :** Pierre, commercial, utilise ConciergeOS pour présenter aux prospects les performances de taux d'occupation et ADR des biens gérés.  
**Lien avec ConciergeOS :** `users.role = 'commercial'`. Accès en lecture aux données financières (`bookings`, `invoices`) et métriques de performance. Pas d'accès aux opérations terrain.  
**Termes associés :** ADR, RevPAR, Taux d'occupation, Commission

---

## Catégorie 8 — Technique et SaaS

Concepts techniques spécifiques à l'écosystème SaaS de gestion de locations courtes durées.

---

### Channel Manager
**Catégorie :** Technique et SaaS  
**Définition :** Logiciel (souvent une API tierce) qui synchronise les calendriers de disponibilité et les tarifs entre tous les canaux de distribution (Airbnb, Booking.com, Vrbo, site direct) en temps réel. Évite les surbookings.  
**Exemple concret :** Smoobu, Lodgify, Beds24 : quand une réservation arrive sur Airbnb, le channel manager bloque automatiquement les mêmes dates sur Booking.com et Vrbo.  
**Lien avec ConciergeOS :** ConciergeOS s'intègre avec un channel manager externe (via webhook) pour recevoir les réservations (`bookings`) et envoyer les mises à jour de disponibilité.  
**Termes associés :** Synchronisation bidirectionnelle, iCal, Webhook, Surbooking

---

### PMS — Property Management System
**Catégorie :** Technique et SaaS  
**Définition :** Système de gestion de propriétés. Logiciel central pour gérer les réservations, les opérations, les finances et la communication d'un portefeuille de locations. ConciergeOS est un PMS.  
**Exemple concret :** ConciergeOS est un PMS SaaS : il remplace des outils comme Hostaway, Guesty, Hospitable pour les conciergeries francophones.  
**Lien avec ConciergeOS :** ConciergeOS est lui-même un PMS. Le schéma de données documenté dans ce fichier constitue le cœur du PMS.  
**Termes associés :** Channel Manager, SaaS, Multi-tenant, API REST

---

### iCal
**Catégorie :** Technique et SaaS  
**Définition :** Format standard de calendrier (`.ics`) permettant la synchronisation des disponibilités entre plateformes. Méthode de synchronisation simple mais unidirectionnelle et avec délai (pas de temps réel).  
**Exemple concret :** Airbnb exporte l'iCal d'un bien → Booking.com l'importe → les dates réservées sur Airbnb apparaissent bloquées sur Booking.com (délai : jusqu'à 1h).  
**Lien avec ConciergeOS :** Méthode de synchronisation de secours (fallback) quand l'API du channel manager n'est pas disponible. Génération d'un iCal par bien à partir des `bookings` actifs.  
**Termes associés :** Channel Manager, Synchronisation, Surbooking

---

### API REST
**Catégorie :** Technique et SaaS  
**Définition :** Interface de programmation basée sur HTTP, permettant à des systèmes externes d'interagir avec ConciergeOS (créer des réservations, récupérer des données, déclencher des actions).  
**Exemple concret :** L'API REST de ConciergeOS permet à un channel manager d'envoyer une nouvelle réservation en POST `/api/bookings` avec un JSON de données.  
**Lien avec ConciergeOS :** Couche applicative qui expose les données des tables du schéma via des endpoints sécurisés par JWT. La RLS Supabase filtre automatiquement les données par `agencyId`.  
**Termes associés :** Webhook, JWT, RLS, Supabase

---

### Webhook
**Catégorie :** Technique et SaaS  
**Définition :** Mécanisme de notification HTTP "push" : au lieu de poller une API régulièrement, le système externe envoie une requête HTTP dès qu'un événement se produit.  
**Exemple concret :** Stripe envoie un webhook `payment.succeeded` dès qu'un paiement est validé → ConciergeOS met à jour `bookings.depositStatus = 'captured'`.  
**Lien avec ConciergeOS :** ConciergeOS reçoit des webhooks de : Stripe (paiements), Airbnb (nouvelles réservations), Booking.com (modifications). Et en émet vers des systèmes externes.  
**Termes associés :** API REST, Stripe, Channel Manager, Événement

---

### Synchronisation bidirectionnelle
**Catégorie :** Technique et SaaS  
**Définition :** Synchronisation en temps réel dans les deux sens : ConciergeOS envoie les mises à jour vers les OTA, ET reçoit les nouvelles réservations des OTA. Garantit la cohérence des données.  
**Exemple concret :** Une réservation directe sur le site de l'agence est immédiatement bloquée sur Airbnb et Booking.com via le channel manager. Et vice versa.  
**Lien avec ConciergeOS :** Géré par le module d'intégration channel manager (webhooks + API). La table `bookings` est la source de vérité, `externalBookingId` fait le lien avec les OTA.  
**Termes associés :** Channel Manager, iCal, Surbooking, Webhook

---

### Surbooking
**Catégorie :** Technique et SaaS  
**Définition :** Situation où deux réservations se chevauchent sur le même bien pour les mêmes dates. Catastrophique opérationnellement et financièrement (relogement du voyageur aux frais de l'agence).  
**Exemple concret :** Airbnb confirme une réservation du 10 au 15, et Booking.com en confirme une autre du 12 au 17 avant la synchronisation → surbooking du 12 au 15.  
**Lien avec ConciergeOS :** Prévenu par la contrainte `UNIQUE (channel, externalBookingId)` + vérification de chevauchement de dates avant insertion dans `bookings`. Index sur `(propertyId, checkIn, checkOut)`.  
**Termes associés :** Channel Manager, Synchronisation, iCal, bookings

---

### Rate Parity
**Catégorie :** Technique et SaaS  
**Définition :** Principe (parfois obligation contractuelle avec les OTA) d'afficher le même tarif sur toutes les plateformes. En pratique, les réservations directes peuvent être moins chères (sans commission OTA).  
**Exemple concret :** Airbnb impose la rate parity : un appartement à 100€/nuit sur Airbnb ne peut pas être à 90€ sur Booking.com. En revanche, le site direct peut proposer 90€ (sans commission OTA).  
**Lien avec ConciergeOS :** `properties.basePricePerNight` est le tarif de référence. La gestion fine de la rate parity est dans le module revenue management (V2).  
**Termes associés :** Tarification dynamique, OTA, Direct, Commission

---

### Multi-tenant
**Catégorie :** Technique et SaaS  
**Définition :** Architecture logicielle où une seule instance de l'application sert plusieurs clients (les "tenants", ici les agences), avec isolation complète de leurs données.  
**Exemple concret :** ConciergeOS héberge 50 agences sur la même base de données et la même infrastructure. Chaque agence ne voit que ses propres données.  
**Lien avec ConciergeOS :** Isolation par `agencyId` présent dans toutes les tables. Renforcé par RLS PostgreSQL : chaque requête est automatiquement filtrée au tenant courant via `current_agency_id()`.  
**Termes associés :** RLS, agencyId, Tenant, RBAC, JWT

---

### Onboarding
**Catégorie :** Technique et SaaS  
**Définition :** Processus d'intégration d'un nouvel utilisateur ou d'une nouvelle agence dans la plateforme : création du compte, configuration initiale, import des données, formation.  
**Exemple concret :** Une nouvelle agence s'inscrit, renseigne ses informations, importe ses biens via CSV, connecte son channel manager → elle est opérationnelle en 2 heures.  
**Lien avec ConciergeOS :** La création d'une `agency` déclenche le flow d'onboarding. `agencies.plan = 'freemium'` + `trialEndsAt = NOW() + 14 days`. Les étapes d'onboarding sont tracées dans `audit_log`.  
**Termes associés :** agencies, trialEndsAt, plan, slug

---

### RBAC — Role-Based Access Control
**Catégorie :** Technique et SaaS  
**Définition :** Contrôle d'accès basé sur les rôles : les droits sont attribués selon le rôle de l'utilisateur, pas individuellement. Simplifie la gestion des permissions à grande échelle.  
**Exemple concret :** Tous les `manager` peuvent créer des tâches. Seuls les `admin` peuvent modifier les tarifs. Les `provider` ne voient que leurs propres tâches.  
**Lien avec ConciergeOS :** `users.role` définit le rôle. Implémenté en combinaison avec la RLS Supabase pour un double niveau de sécurité (application + base de données).  
**Termes associés :** RLS, JWT, role, Permissions, Multi-tenant

---

### RLS — Row Level Security
**Catégorie :** Technique et SaaS  
**Définition :** Fonctionnalité PostgreSQL permettant de filtrer automatiquement les lignes accessibles à un utilisateur directement au niveau de la base de données, avant que l'application ne reçoive les données.  
**Exemple concret :** Même si un développeur fait une requête `SELECT * FROM bookings`, PostgreSQL ne retourne que les réservations de l'agence de l'utilisateur connecté.  
**Lien avec ConciergeOS :** Policies RLS définies dans la section 7 du schéma ERD. Basé sur `current_agency_id()` qui lit le JWT Supabase. Dernier rempart de sécurité multi-tenant.  
**Termes associés :** PostgreSQL, Supabase, JWT, RBAC, Multi-tenant

---

### JWT — JSON Web Token
**Catégorie :** Technique et SaaS  
**Définition :** Standard de token d'authentification encodant des informations (claims) vérifiables cryptographiquement. Contient l'identité de l'utilisateur et ses attributs (rôle, agencyId) sans nécessiter de requête base de données.  
**Exemple concret :** JWT payload : `{"sub": "42", "role": "manager", "agency_id": 7, "exp": 1717200000}`. Ce token est vérifié par PostgreSQL pour appliquer la RLS.  
**Lien avec ConciergeOS :** Supabase génère le JWT lors de la connexion. Les claims `role` et `agency_id` sont ajoutés via le hook `auth.uid()`. Utilisés dans les fonctions RLS `current_agency_id()` et `current_user_role()`.  
**Termes associés :** RLS, RBAC, Supabase, Authentification

---

### MFA — Multi-Factor Authentication
**Catégorie :** Technique et SaaS  
**Définition :** Authentification à plusieurs facteurs : en plus du mot de passe, l'utilisateur doit valider un second facteur (SMS, application TOTP, clé physique). Fortement recommandé pour les rôles à privilèges élevés.  
**Exemple concret :** L'admin de l'agence active le MFA via une application comme Google Authenticator. À chaque connexion, il saisit son mot de passe + le code à 6 chiffres.  
**Lien avec ConciergeOS :** Géré par Supabase Auth (support natif TOTP). Obligatoire pour les rôles `admin` et `super_admin`. Tracé dans `audit_log` à chaque connexion.  
**Termes associés :** JWT, Sécurité, audit_log, RBAC

---

### RGPD — Règlement Général sur la Protection des Données
**Catégorie :** Technique et SaaS  
**Définition :** Règlement européen (2018) encadrant la collecte, le traitement et la conservation des données personnelles. Impose des droits aux individus (accès, rectification, suppression, portabilité).  
**Exemple concret :** Un voyageur demande la suppression de ses données → ConciergeOS doit anonymiser ses données dans `bookings` (pas de suppression car l'historique financier doit être conservé).  
**Lien avec ConciergeOS :** `audit_log` trace toutes les accès aux données personnelles. Les champs sensibles (`iban`, `accessCode`, `wifiPassword`) sont chiffrés. Une procédure de "droit à l'oubli" doit être implémentée (anonymisation des champs personnels).  
**Termes associés :** audit_log, IBAN, Chiffrement, Données personnelles

---

### PCI DSS
**Catégorie :** Technique et SaaS  
**Définition :** Standard de sécurité pour les données de carte bancaire. ConciergeOS ne stocke jamais les numéros de carte : Stripe (certifié PCI DSS niveau 1) gère entièrement les paiements.  
**Exemple concret :** La caution voyageur est gérée via une pré-autorisation Stripe. ConciergeOS stocke uniquement l'identifiant Stripe du paiement, jamais le PAN de la carte.  
**Lien avec ConciergeOS :** `agencies.stripeCustomerId` + webhooks Stripe. Les données de carte ne transitent jamais par ConciergeOS.  
**Termes associés :** Stripe, Caution, Paiement, Sécurité

---

### Signature électronique
**Catégorie :** Technique et SaaS  
**Définition :** Processus permettant de signer numériquement un document (contrat de gestion, état des lieux) avec valeur légale. Remplace la signature papier.  
**Exemple concret :** Avant la première réservation, le propriétaire signe le mandat de gestion électroniquement via DocuSign ou HelloSign.  
**Lien avec ConciergeOS :** Intégration prévue en V2 pour les mandats de gestion et états des lieux. URL du document signé stockée dans `owners.notes` en attendant.  
**Termes associés :** Owner, Contrat, Mandat de gestion, RGPD

---

### IoT — Internet of Things
**Catégorie :** Technique et SaaS  
**Définition :** Appareils connectés dans le logement : serrures connectées, thermostats intelligents, capteurs de bruit (NoiseAware), détecteurs de fumée connectés. Permettent la gestion à distance.  
**Exemple concret :** Un capteur de bruit alerte l'agence si le niveau sonore dépasse 75dB après 22h (détection de fête non autorisée).  
**Lien avec ConciergeOS :** Intégration IoT prévue en V2 : les événements des appareils connectés déclenchent des `incidents` automatiques ou des notifications.  
**Termes associés :** SmartLock, Incident, Automatisation

---

### PWA — Progressive Web App
**Catégorie :** Technique et SaaS  
**Définition :** Application web qui se comporte comme une application mobile native : installable sur l'écran d'accueil, fonctionnelle hors ligne, notifications push. Évite de publier sur les app stores.  
**Exemple concret :** Les prestataires de ménage accèdent à leurs missions via une PWA installée sur leur smartphone Android, sans passer par le Play Store.  
**Lien avec ConciergeOS :** L'interface prestataire est une PWA (Service Worker pour le mode hors ligne, notifications push pour les nouvelles missions). Les photos de checklist sont uploadées depuis la PWA.  
**Termes associés :** Provider, Mission, Checklist, Notifications

---

## Catégorie 9 — Réglementation

Le cadre réglementaire français encadre strictement la location meublée courte durée. La non-conformité expose à des amendes significatives.

---

### Déclaration en mairie
**Catégorie :** Réglementation  
**Définition :** Obligation légale en France (article L.324-1-1 du Code du tourisme) de déclarer tout meublé de tourisme auprès de la mairie de la commune où se situe le bien. Applicable dans les communes de +200 000 habitants et les communes ayant instauré cette obligation.  
**Exemple concret :** À Paris, Nice, Lyon : obligation de déclarer le bien en mairie avant toute mise en location. La déclaration génère un numéro d'enregistrement.  
**Lien avec ConciergeOS :** `properties` devrait inclure un champ `registrationNumber` (à ajouter en V2) stockant ce numéro, obligatoire à afficher sur les annonces OTA.  
**Termes associés :** Numéro d'enregistrement, Limite des 120 jours, OTA

---

### Numéro d'enregistrement
**Catégorie :** Réglementation  
**Définition :** Identifiant délivré par la mairie après déclaration du meublé de tourisme. Doit figurer sur toutes les annonces publiées sur les plateformes OTA depuis 2019. Son absence peut être sanctionnée.  
**Exemple concret :** Numéro : `75-XXX-XXXXXXXXX-X`. Doit apparaître sur l'annonce Airbnb et Booking.com. Airbnb peut désactiver les annonces sans ce numéro dans les communes concernées.  
**Lien avec ConciergeOS :** Colonne `registrationNumber VARCHAR(30)` à ajouter sur `properties` en V2. Affiché dans les exports et les annonces synchronisées via le channel manager.  
**Termes associés :** Déclaration en mairie, Limite des 120 jours, OTA

---

### Taxe de séjour — définition légale France
**Catégorie :** Réglementation  
**Définition :** Taxe locale (articles L.2333-26 à L.2333-47 du CGCT) reversée aux communes et intercommunalités. En France, collectée par les plateformes OTA pour les hébergeurs non professionnels, ou directement par l'agence pour les réservations directes.  
**Exemple concret :** Grille tarifaire 2025 pour un appartement 3* à Nice : 1,65€/nuit/personne. Pour un séjour de 5 nuits avec 2 adultes : 16,50€ à reverser à la Métropole Nice Côte d'Azur.  
**Lien avec ConciergeOS :** `bookings.touristTax` — montant collecté. Rapport mensuel de reversement aux collectivités à générer (V2). Airbnb collecte et reverse directement pour ses propres réservations dans la plupart des communes.  
**Termes associés :** Déclaration fiscale, Reversement, bookings

---

### Régime LMNP — Loueur en Meublé Non Professionnel
**Catégorie :** Réglementation  
**Définition :** Statut fiscal français permettant aux propriétaires de louer en meublé sous conditions (revenus locatifs < 23 000€/an OU < 50% des revenus globaux). Permet la déduction des charges et des amortissements.  
**Exemple concret :** M. Bernard, salarié percevant 45 000€/an, loue son studio et perçoit 8 000€ de loyers. Il est en LMNP car 8 000 < 23 000€. Il peut amortir le bien et déduire les charges.  
**Lien avec ConciergeOS :** `owners.taxId` stocke le numéro SIRET ou fiscal. Les factures de reversement incluent les informations nécessaires à la déclaration fiscale LMNP du propriétaire.  
**Termes associés :** micro-BIC, Assurance PNO, Reversement, taxId

---

### Régime micro-BIC
**Catégorie :** Réglementation  
**Définition :** Régime fiscal simplifié pour les revenus de location meublée. Abattement forfaitaire de 50% (ou 71% pour les meublés classés) sur les recettes brutes. Applicable si recettes < 77 700€/an (seuil 2024).  
**Exemple concret :** Revenus locatifs 2026 : 15 000€. Avec micro-BIC : abattement 50% → revenu imposable 7 500€. Simple mais moins avantageux que le régime réel si les charges sont élevées.  
**Lien avec ConciergeOS :** Le régime fiscal est propre à chaque propriétaire (`owners`). Les factures de reversement ConciergeOS fournissent les données brutes nécessaires pour la déclaration.  
**Termes associés :** LMNP, Reversement, GoRev, invoices

---

### Assurance PNO — Propriétaire Non Occupant
**Catégorie :** Réglementation  
**Définition :** Assurance spécifique couvrant un bien immobilier mis en location, protégeant le propriétaire contre les dommages et les sinistres en l'absence d'occupant ou en cas de carence du locataire.  
**Exemple concret :** Un dégât des eaux survient entre deux séjours. L'assurance PNO prend en charge les réparations que ni la caution voyageur ni l'assurance habitation du locataire ne couvre.  
**Lien avec ConciergeOS :** `owners.notes` peut référencer le numéro de contrat. Un `incident` grave (dégât des eaux, incendie) peut déclencher une procédure de sinistre tracée dans le système.  
**Termes associés :** Incident, Owner, Caution, estimatedCost

---

### Autorisation de changement d'usage
**Catégorie :** Réglementation  
**Définition :** Dans certaines villes (Paris, Bordeaux, Nantes...), transformer un logement destiné à la résidence principale en location touristique nécessite une autorisation administrative (compensation par la création d'un logement équivalent).  
**Exemple concret :** À Paris, transformer un appartement de résidence principale en location Airbnb à l'année nécessite une autorisation de changement d'usage + une compensation (acheter un local commercial à convertir en logement).  
**Lien avec ConciergeOS :** Non modélisé directement. Champ `legalStatus` à ajouter sur `properties` en V2 pour tracker la conformité réglementaire du bien.  
**Termes associés :** Déclaration en mairie, Limite des 120 jours, properties

---

### Limite des 120 jours (Paris)
**Catégorie :** Réglementation  
**Définition :** Règle spécifique à Paris (et quelques autres communes) : une résidence principale ne peut être louée en meublé touristique plus de 120 jours par an (environ 4 mois). Au-delà, il s'agit d'un changement d'usage soumis à autorisation.  
**Exemple concret :** M. Dubois loue son appartement parisien sur Airbnb. Le 1er janvier 2026, le compteur repart à zéro. Il doit s'assurer de ne pas dépasser 120 nuitées louées avant le 31 décembre.  
**Lien avec ConciergeOS :** Calculable à partir de `bookings` : `SUM(checkOut - checkIn)` par bien par année calendaire. Un indicateur de suivi et d'alerte est prévu pour les biens parisiens (V2).  
**Termes associés :** Déclaration en mairie, Numéro d'enregistrement, Taux d'occupation

---

*ConciergeOS — Documentation v1.0 — Mai 2026*
