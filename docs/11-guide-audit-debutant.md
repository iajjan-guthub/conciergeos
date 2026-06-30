# Guide d'audit post-déploiement — Pour débutants
## ConciergeOS — Vérifie ton site toi-même en 2 heures

> Ce guide te permet de vérifier que ton site est sécurisé, rapide, conforme et fonctionnel,
> sans être développeur. Tout ce dont tu as besoin : un ordinateur, ton téléphone, et ce guide.

**Temps estimé :** 2 heures
**Niveau requis :** Aucun — si tu sais naviguer sur internet, tu peux faire cet audit
**Matériel nécessaire :** Un ordinateur + un smartphone
**Prérequis :** Ton site ConciergeOS est déployé et accessible en ligne

---

## 📖 Pourquoi faire cet audit ?

Imagine que tu viens de recevoir une voiture neuve. Elle est belle, elle démarre. Mais est-ce qu'elle a passé le contrôle technique ? Est-ce que les freins fonctionnent ? Est-ce que la ceinture de sécurité tient ?

**Un site web, c'est pareil.** Il peut avoir l'air de marcher, mais si personne ne l'a vérifié sérieusement avant de l'ouvrir au public, tu prends des risques.

### Les 3 risques concrets si tu sautes l'audit

1. **🔓 Fuite de données clients** — Si une page mal protégée laisse voir les données de tes voyageurs, tu peux être tenu responsable. Et perdre la confiance de tes clients du jour au lendemain.

2. **🐌 Site lent = clients qui partent** — Un site qui met plus de 3 secondes à charger fait fuir 53 % de ses visiteurs sur mobile. Des clients perdus sans même savoir pourquoi.

3. **⚖️ Amende RGPD** — La loi européenne sur les données personnelles (le RGPD) peut coûter jusqu'à 4 % de ton chiffre d'affaires si tu n'es pas en règle. Quelques vérifications simples suffisent à éviter les problèmes les plus courants.

**La bonne nouvelle :** tu n'as pas besoin de comprendre la technique pour faire cet audit. Tu as juste besoin de suivre les étapes de ce guide, une par une.

---

## 🗺️ Comment utiliser ce guide

1. **Suis les sections dans l'ordre** — chaque partie est conçue pour être faite dans la séquence indiquée
2. **Coche chaque point** au fur et à mesure (tu peux imprimer ce guide ou le noter sur papier)
3. **Si un point est ❌** : note le numéro du point et envoie la liste à ton développeur à la fin
4. **Ne panique pas** si certains points sont en rouge — c'est normal lors d'un premier audit. L'objectif est de trouver les problèmes, pas d'avoir tout parfait dès le départ

> 💡 Chaque section est **autonome** : si tu ouvres directement la section 4, tu peux la faire sans avoir lu le reste.

---

## ✅ Checklist rapide (à cocher au fil de l'audit)

Reviens remplir ce tableau au fur et à mesure — tu trouveras le récapitulatif complet à la fin du guide.

| Section | ✅ OK | ❌ Problème | Notes |
|---------|-------|------------|-------|
| 1. Sécurité | | | |
| 2. Vitesse | | | |
| 3. RGPD | | | |
| 4. Stripe | | | |
| 5. E-mails | | | |
| 6. Expérience | | | |
| 7. Monitoring | | | |

---

# PARTIE 1 — Sécurité de base 🔐
**Durée estimée : 30 minutes**

La sécurité, c'est la fondation. Si cette partie n'est pas en ordre, tout le reste est fragilisé. Ces vérifications ne nécessitent aucune compétence technique — juste ton navigateur et 30 minutes.

---

## Étape 1.1 — Vérifier le cadenas HTTPS ⏱️ 5 min

### C'est quoi HTTPS ?

Le cadenas 🔒 dans la barre d'adresse de ton navigateur signifie que la connexion entre ton site et l'utilisateur est **chiffrée** (= codée, illisible par quelqu'un qui essaierait d'espionner). Sans ce cadenas, les mots de passe et les données bancaires circulent en clair sur internet — comme envoyer une carte postale avec ton code de carte bleue écrit dessus.

### Ce que tu vas faire

1. Ouvre ton navigateur (Chrome ou Firefox)
2. Tape l'URL de ton site (ex : `https://conciergeos.fr`)
3. Regarde la **barre d'adresse** tout en haut — à gauche de l'URL

   *(tu dois voir quelque chose qui ressemble à : un petit cadenas fermé 🔒 suivi de "conciergeos.fr")*

4. Clique sur le cadenas
5. Un petit menu s'ouvre — cherche la phrase "**La connexion est sécurisée**" ou "**Connection is secure**"

**Résultats :**
- ✅ Tu vois le cadenas 🔒 et "La connexion est sécurisée" : **parfait**
- ❌ Tu vois "Non sécurisé" ou un triangle orange ⚠️ : **problème à signaler au dev**
- ❌ Tu vois un message d'avertissement rouge : **URGENT — signaler immédiatement**

### Test avancé (gratuit, 2 minutes de plus)

Ce test va donner une **note à ton certificat HTTPS** — comme un contrôle technique plus poussé.

1. Va sur [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)
2. Dans le grand champ blanc, tape l'URL de ton site
3. Clique sur le bouton **"Submit"**
4. Attends 2 à 3 minutes (le site analyse ton certificat — c'est normal que ça prenne du temps)

   *(tu dois voir une page avec une grande lettre — A+, A, B, C... comme une note scolaire)*

**Résultats :**
- ✅ Note **A ou A+** : excellent, ton certificat est impeccable
- ⚠️ Note **B** : acceptable mais ton dev devrait l'améliorer
- ❌ Note **C ou moins** : **à signaler immédiatement au dev**

---

## Étape 1.2 — Vérifier les en-têtes de sécurité ⏱️ 5 min

### C'est quoi les en-têtes de sécurité ?

Quand ton site s'affiche dans le navigateur, il envoie des **instructions invisibles** en coulisses pour dire "n'accepte pas de contenu venant d'ailleurs", "protège-toi contre telle attaque", etc. Ces instructions s'appellent des "en-têtes de sécurité" (security headers). Tu ne les vois pas, mais les hackers, si.

### Ce que tu vas faire

1. Va sur [securityheaders.com](https://securityheaders.com)
2. Dans le champ en haut de la page, **tape l'URL de ton site**
3. Clique sur le bouton bleu (scan / analyser)
4. Attends quelques secondes

   *(tu dois voir une grande lettre et un résumé coloré — vert/orange/rouge)*

**Résultats :**
- ✅ Note **A ou B** : ton site est bien protégé contre les attaques courantes
- ⚠️ Note **C** : protection partielle, à améliorer
- ❌ Note **D, E ou F** : protection insuffisante — **envoie le rapport à ton dev**

**Pour envoyer le rapport :**
Cherche le bouton "**Share**" ou "**Copy link**" sur la page de résultats. Copie ce lien et envoie-le à ton développeur — il verra exactement quoi corriger.

---

## Étape 1.3 — Vérifier que les pages protégées sont bien protégées ⏱️ 10 min

### Pourquoi c'est critique ?

Si quelqu'un peut accéder à ton dashboard (tableau de bord) ou à la liste de tes réservations **sans être connecté**, toutes les données de tes clients sont visibles par n'importe qui. C'est l'équivalent de laisser la porte de ton bureau grande ouverte la nuit.

### Ce que tu vas faire

1. Ouvre une **fenêtre de navigation privée**
   - Sur Windows/Chrome : appuie sur `Ctrl + Maj + N`
   - Sur Mac/Chrome : appuie sur `Cmd + Maj + N`
   - Sur Firefox : appuie sur `Ctrl + Maj + P` (Windows) ou `Cmd + Maj + P` (Mac)

   *(la fenêtre privée est sombre ou a une icône d'espion — c'est normal, ça signifie que tu n'es connecté à rien)*

2. Dans cette fenêtre privée, essaie d'accéder **directement** à ces URLs — remplace `ton-site.fr` par ton vrai domaine :
   - `https://ton-site.fr/#/dashboard`
   - `https://ton-site.fr/#/properties`
   - `https://ton-site.fr/#/bookings`
   - `https://ton-site.fr/#/finances`

3. Pour chaque URL, note ce qui se passe

**Résultats :**
- ✅ Tu es **redirigé vers la page de connexion** à chaque fois : **parfait, les pages sont bien protégées**
- ❌ Tu **vois le contenu** (un tableau, des données, des chiffres) sans être connecté : **URGENT — signaler immédiatement au dev**

---

## Étape 1.4 — Vérifier la solidité du système de connexion ⏱️ 5 min

### Pourquoi vérifier ça ?

Un site bien protégé doit :
1. Refuser clairement les mauvais mots de passe
2. Bloquer quelqu'un qui essaie des centaines de mots de passe différents (c'est ce qu'on appelle une "attaque par force brute")

### Test 1 — Refus d'un mauvais mot de passe

1. Va sur la page de connexion de ton site
2. Tape un email valide et le mot de passe `123456`
3. Clique sur "Se connecter"

**Résultats :**
- ✅ Tu vois un message d'erreur comme **"Email ou mot de passe incorrect"** : parfait
- ❌ La connexion réussit avec `123456` : **problème critique — signaler au dev immédiatement**

### Test 2 — Blocage après plusieurs tentatives échouées

1. Sur la page de connexion, essaie de te connecter **10 fois de suite** avec un mauvais mot de passe (attends 2 secondes entre chaque tentative)
2. Après 5 à 10 tentatives, observe ce qui se passe

**Résultats :**
- ✅ Tu vois un message comme **"Trop de tentatives, réessaie dans X minutes"** ou un captcha (puzzle à résoudre) : **parfait, le système se protège**
- ❌ Tu peux essayer indéfiniment sans jamais être bloqué : **signaler au dev** (risque de brute force — quelqu'un pourrait tester des milliers de mots de passe automatiquement)

---

## Étape 1.5 — Vérifier que les secrets ne sont pas exposés ⏱️ 5 min

### C'est quoi les "clés API" ?

Les clés API (Application Programming Interface) sont comme des **mots de passe ultra-sensibles** qui permettent à ton site de communiquer avec des services comme Stripe (paiements), Resend (emails), etc. Si ces clés sont visibles dans le code sur GitHub, n'importe qui peut les copier et les utiliser à ta place — pour envoyer des emails en ton nom, ou pire, faire des transactions Stripe.

### Ce que tu vas faire

1. Va sur [github.com/iajjan-guthub/conciergeos](https://github.com/iajjan-guthub/conciergeos)
2. Cherche l'icône de **recherche 🔍** (en haut de la page, à droite du nom du repo)
3. Clique dessus et tape `sk_live_` puis appuie sur **Entrée**

**Résultats :**
- ✅ **Aucun résultat** trouvé : tes clés Stripe de production ne sont pas dans le code — **parfait**
- ❌ Des résultats apparaissent avec de vraies clés : **URGENT — signaler immédiatement au dev**

4. Refais la même recherche avec ces termes (un par un) :
   - `password=`
   - `secret=`
   - `api_key=`

**Résultats :**
- ✅ Aucun résultat, ou seulement des résultats avec des valeurs fictives comme `=your-value-here` ou `=xxx` : **parfait**
- ❌ Tu trouves de vraies valeurs (longues chaînes de caractères après le `=`) : **signaler au dev**

---

# PARTIE 2 — Vitesse du site 🚀
**Durée estimée : 20 minutes**

La vitesse de ton site a un impact direct sur tes clients et sur ton référencement Google. Cette partie t'explique comment mesurer la vitesse en quelques clics.

---

## Étape 2.1 — Test de vitesse Google ⏱️ 10 min

### Pourquoi la vitesse est-elle si importante ?

- **Google** intègre la vitesse dans son classement — un site lent est moins bien placé dans les résultats de recherche
- **53 % des visiteurs mobile** quittent un site qui met plus de 3 secondes à charger
- Un site rapide = une meilleure expérience = plus de clients qui restent

### Ce que tu vas faire

1. Va sur [pagespeed.web.dev](https://pagespeed.web.dev/)
2. Dans le champ central, **tape l'URL de ta page d'accueil**
3. Clique sur le bouton **"Analyser"**
4. Attends environ 30 secondes

   *(tu vas voir deux scores s'afficher : un pour mobile 📱 et un pour ordinateur 💻 — les deux sont importants)*

### Lire les résultats — le score principal

- 🟢 Score **90-100** : excellent, ton site est très rapide
- 🟡 Score **50-89** : moyen, des améliorations sont possibles
- 🔴 Score **0-49** : lent, à corriger en priorité avant l'ouverture au public

### Les 3 métriques les plus importantes

En dessous du score, tu verras des métriques avec des noms techniques. Voici comment les lire :

| Métrique | Ce que ça mesure | Objectif |
|----------|-----------------|---------|
| **LCP** (Largest Contentful Paint) | Temps avant que la page soit lisible | < 4 secondes |
| **INP** (Interaction to Next Paint) | Réactivité quand tu cliques | < 200 millisecondes |
| **CLS** (Cumulative Layout Shift) | Est-ce que la page "saute" pendant le chargement | < 0,1 |

*(tu dois voir ces métriques avec une couleur — vert = bien, orange = moyen, rouge = à corriger)*

### Si le score est inférieur à 50

1. Descends dans la page jusqu'à la section **"Opportunités"**
2. Fais une **capture d'écran** (touche `Impr. écran` sur Windows, ou `Cmd + Maj + 4` sur Mac)
3. Envoie cette capture à ton développeur avec le message : *"Voici les points à optimiser en priorité selon PageSpeed"*

---

## Étape 2.2 — Test de vitesse sur mobile ⏱️ 10 min

Le test Google mesure la vitesse théorique. Ce test, lui, mesure ce que **tes vrais utilisateurs vivent** sur leur téléphone.

### Test sur réseau wifi

1. Sur ton **smartphone**, ouvre ton navigateur (Safari sur iPhone, Chrome sur Android)
2. Tape l'URL de ton site
3. **Chronomètre** le temps entre le moment où tu appuies sur Entrée et le moment où la page s'affiche complètement

**Résultats :**
- ✅ Moins de **3 secondes sur wifi** : excellent
- ⚠️ Entre **3 et 5 secondes sur wifi** : acceptable mais à surveiller
- ❌ Plus de **5 secondes sur wifi** : **à signaler au dev**

### Test sur réseau mobile (4G)

1. Désactive le wifi de ton téléphone (garde la 4G activée)
2. Recharge ton site
3. Chronomètre à nouveau

**Résultats :**
- ✅ Moins de **5 secondes sur 4G** : acceptable
- ❌ Plus de **5 secondes sur 4G** : **à signaler**

### Test du cache (mémoire du site)

Le cache, c'est la capacité de ton site à se souvenir de ce qu'il a déjà chargé pour aller plus vite la prochaine fois.

1. Active le **mode avion** sur ton téléphone (ça coupe tout)
2. Attends 5 secondes
3. Désactive le mode avion
4. Recharge immédiatement ton site

**Résultats :**
- ✅ La page se charge normalement (même si un peu plus lentement) : le cache fonctionne
- ❌ Page blanche, erreur, ou rien ne s'affiche pendant plus de 10 secondes : **à signaler**

---

# PARTIE 3 — RGPD & Légal ⚖️
**Durée estimée : 20 minutes**

Le RGPD (Règlement Général sur la Protection des Données), c'est la loi européenne qui protège les données personnelles de tes utilisateurs. Ne pas la respecter peut coûter jusqu'à **4 % de ton chiffre d'affaires annuel** en amende. Mais les vérifications de base prennent seulement 20 minutes et ne nécessitent aucune compétence juridique.

---

## Étape 3.1 — Vérifier les pages légales obligatoires ⏱️ 10 min

### Ce dont tu as besoin

Tout site qui collecte des données personnelles (= des adresses email, des noms, des informations de paiement) doit obligatoirement afficher certaines pages. Si ces pages manquent, tu peux recevoir un avertissement de la CNIL (l'autorité française de protection des données).

### Ce que tu vas faire

1. Va sur la **page d'accueil** de ton site
2. Fais **défiler tout en bas** de la page (le "footer" — le pied de page)
3. Vérifie que ces 3 liens existent et sont cliquables :
   - [ ] "**Politique de confidentialité**" ou "Protection des données" ou "Privacy Policy"
   - [ ] "**Mentions légales**"
   - [ ] "**CGU**" ou "Conditions Générales d'Utilisation" ou "Conditions d'utilisation"

4. **Clique sur chacun de ces liens** et vérifie que la page s'ouvre correctement

**Résultats :**
- ✅ Les 3 liens existent et les 3 pages s'ouvrent sans erreur : **parfait**
- ❌ Un lien manque ou donne une erreur "404" (page introuvable) : **à faire corriger avant ouverture**

### Ce que doit contenir la Politique de confidentialité — vérification rapide

Ouvre la Politique de confidentialité et vérifie qu'elle mentionne :
- [ ] Le **nom de l'entreprise** responsable des données (ou ton nom si tu es auto-entrepreneur)
- [ ] **Pourquoi** vous collectez des données ("pour gérer les réservations, facturer les abonnements...")
- [ ] **Combien de temps** vous les gardez ("3 ans après la fin du contrat...")
- [ ] Comment les utilisateurs peuvent **demander la suppression** de leurs données
- [ ] Une **adresse email de contact** (ex: `rgpd@conciergeos.fr` ou ton email professionnel)

- ✅ Ces 5 éléments sont présents : **conforme aux exigences minimales**
- ❌ Un ou plusieurs éléments manquent : **à compléter avec l'aide d'un dev ou d'un juriste**

---

## Étape 3.2 — Vérifier le bandeau cookies 🍪 ⏱️ 5 min

### C'est quoi les cookies ?

Les cookies sont de petits fichiers que les sites web stockent dans ton navigateur pour se souvenir de toi, analyser ton comportement, ou t'afficher de la publicité. Si ton site utilise Google Analytics ou d'autres outils de tracking, la loi exige que tu demandes la permission à l'utilisateur **avant** de les activer.

### Ce que tu vas faire

1. Ouvre ton site dans une **fenêtre de navigation privée** (voir Étape 1.3 pour comment faire)
   *(la navigation privée simule un visiteur qui arrive pour la première fois — sans aucun cookie)*
2. Regarde si un **bandeau cookies** apparaît dans les premières secondes

   *(tu dois voir quelque chose qui ressemble à : une barre ou une fenêtre en bas ou en haut de l'écran avec les mots "cookies", "accepter", "refuser")*

3. Clique sur "**Refuser**" (ou "Refuser tout")
4. Navigue sur 2 ou 3 pages du site

**Résultats :**
- ✅ Un bandeau apparaît et le site fonctionne normalement après avoir refusé : **conforme**
- ⚠️ Un bandeau apparaît mais le site ne fonctionne plus après avoir refusé : **à corriger**
- ❌ Aucun bandeau n'apparaît et tu sais que le site utilise Google Analytics ou d'autres trackers : **non conforme — à signaler**

> 💡 Si ton site ne collecte **aucun cookie** de tracking (pas de Google Analytics, pas de Facebook Pixel, etc.), le bandeau n'est pas obligatoire. Demande à ton dev ce qui est utilisé si tu n't sais pas.

---

## Étape 3.3 — Vérifier la suppression de compte ⏱️ 5 min

### Pourquoi c'est obligatoire ?

Le RGPD donne à chaque utilisateur le **droit à l'effacement** (aussi appelé "droit à l'oubli"). Ça signifie que n'importe quel client peut demander que toutes ses données soient supprimées. Ton site doit permettre cette démarche — au moins par email, idéalement en autonome.

### Ce que tu vas faire

1. **Connecte-toi** avec un compte de test (pas ton compte principal)
2. Va dans les **paramètres du compte** (souvent accessible en cliquant sur ton nom ou avatar en haut à droite)
3. Cherche un bouton ou un lien comme :
   - "Supprimer mon compte"
   - "Demande de suppression de données"
   - "Fermer mon compte"
   - "Effacer mes données"

**Résultats :**
- ✅ Un bouton ou une option existe pour supprimer le compte : **conforme**
- ❌ Aucune option de suppression nulle part dans les paramètres : **à ajouter — exigence RGPD obligatoire**

---

# PARTIE 4 — Paiements Stripe 💳
**Durée estimée : 20 minutes**

Stripe est un des services de paiement les plus fiables au monde. Mais il faut quand même vérifier que la connexion entre ton site et Stripe fonctionne correctement — sinon, tu peux rater des paiements sans même t'en rendre compte.

> ⚠️ **Important** : pour cette section, tu as besoin d'un accès à ton tableau de bord Stripe. Si tu ne l'as pas encore, demande l'accès à ton développeur avant de commencer.

---

## Étape 4.1 — Vérifier la page de paiement ⏱️ 5 min

### Ce que tu vas vérifier

Le formulaire de paiement sur ton site doit être fourni directement par Stripe (via un composant qu'on appelle "iframe Stripe"). Ça garantit que les données de carte bancaire ne passent jamais par tes serveurs — elles vont directement à Stripe, ce qui est plus sécurisé et requis par la norme PCI DSS (les règles de sécurité des cartes bancaires).

### Ce que tu vas faire

1. Navigue jusqu'à la **page de paiement** ou d'abonnement de ton site
2. Regarde le **formulaire de carte bancaire**

   *(tu dois voir quelque chose qui ressemble à : des champs propres et bien stylisés avec les étiquettes "Numéro de carte", "Date d'expiration", "CVC", et souvent un logo Stripe ou la mention "Powered by Stripe" en bas)*

3. Vérifie que le **cadenas HTTPS** 🔒 est toujours présent dans la barre d'adresse

**Résultats :**
- ✅ Le formulaire a l'aspect Stripe (propre, avec logo Stripe ou "Powered by Stripe") et le cadenas est visible : **parfait**
- ❌ Le formulaire ressemble à de simples champs texte ordinaires sans aucune référence à Stripe : **URGENT — signaler immédiatement au dev**

---

## Étape 4.2 — Faire un paiement test ⏱️ 10 min

### C'est quoi les cartes de test Stripe ?

Stripe fournit des numéros de carte bancaire **fictifs** pour tester les paiements sans débiter de l'argent réel. Ces cartes ne fonctionnent que dans l'environnement de test — elles sont parfaites pour vérifier que le processus de paiement fonctionne de bout en bout.

### Carte de test — paiement qui réussit

```
Numéro : 4242 4242 4242 4242
Date d'expiration : n'importe quelle date future (ex : 12/28)
CVC : n'importe quels 3 chiffres (ex : 123)
Code postal : 75001
```

### Test 1 — Paiement réussi

1. Passe par le processus d'abonnement de ton site depuis le début
2. Arrive à l'étape de paiement
3. Utilise **exactement** la carte de test ci-dessus
4. Valide le paiement

**Résultats attendus :**
- ✅ La transaction réussit et tu arrives sur une page de confirmation : **parfait**
- ✅ Tu reçois un email de confirmation dans les 5 minutes : **parfait**
- ❌ Une erreur s'affiche ou rien ne se passe : **noter l'erreur et signaler au dev**

5. Maintenant va sur [dashboard.stripe.com](https://dashboard.stripe.com) → menu **"Paiements"**
6. Cherche le paiement test que tu viens de faire

**Résultats :**
- ✅ Le paiement apparaît avec le statut **"Réussi"** (ou "Succeeded") : **parfait**
- ❌ Aucun paiement n'apparaît ou le statut est différent : **signaler au dev**

### Test 2 — Paiement refusé

Maintenant, on vérifie que le site gère bien les refus de paiement.

```
Numéro : 4000 0000 0000 0002
(toutes les autres infos identiques)
```

1. Refais le processus de paiement avec cette carte
2. Observe ce qui se passe

**Résultats :**
- ✅ Un message d'erreur clair apparaît comme **"Votre carte a été refusée"** ou "Payment declined" : **parfait**
- ❌ Aucun message d'erreur ou la transaction "passe" quand même : **signaler au dev**

---

## Étape 4.3 — Vérifier les webhooks Stripe ⏱️ 5 min

### C'est quoi un webhook ?

Quand Stripe traite un paiement, il envoie une notification à ton site pour lui dire "hé, le paiement a réussi — active l'abonnement de cet utilisateur !". Cette notification s'appelle un **webhook**. Si les webhooks ne fonctionnent pas, les paiements peuvent réussir côté Stripe mais l'abonnement ne s'active pas côté site — c'est un problème silencieux très courant.

### Ce que tu vas faire

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Dans le menu de gauche, cherche **"Développeurs"** puis **"Webhooks"**
3. Tu dois voir une liste d'**endpoints** (= adresses qui reçoivent les notifications)

   *(tu dois voir quelque chose qui ressemble à : une URL avec ton nom de domaine + `/api/webhooks/stripe` ou similaire)*

4. Clique sur l'endpoint de ton site
5. Cherche la section **"Événements récents"** ou "Recent events"

**Résultats :**
- ✅ Les derniers événements affichent le statut **"200"** en vert : **parfait, les notifications arrivent bien**
- ❌ Tu vois des erreurs **"500"** ou **"4xx"** en rouge récemment : **signaler au dev — des paiements ont peut-être été perdus**
- ❌ Aucun endpoint configuré : **signaler au dev**

---

# PARTIE 5 — E-mails 📧
**Durée estimée : 20 minutes**

Les emails transactionnels (bienvenue, confirmation, réinitialisation de mot de passe) sont souvent la première chose qu'un nouveau client reçoit. S'ils n'arrivent pas ou finissent en spam, l'expérience est gâchée dès le départ.

---

## Étape 5.1 — Tester la réception des emails ⏱️ 10 min

Pour ce test, utilise **ton adresse email personnelle** — celle que tu utilises vraiment, pas une adresse de test.

### Email 1 — Email de bienvenue

1. Ouvre ton site en **navigation privée**
2. **Crée un nouveau compte** avec ton adresse email personnelle
3. ✅ Va dans ta boîte mail — tu dois recevoir un email de bienvenue dans les **5 minutes**
4. ✅ L'email s'affiche correctement (logo, texte lisible, pas de code bizarre)
5. ❌ Vérifie aussi le **dossier "Spams"** — si l'email est là : **problème à signaler au dev**

### Email 2 — Réinitialisation de mot de passe

1. Va sur la **page de connexion** de ton site
2. Clique sur le lien **"Mot de passe oublié"** (ou "Forgot password")
3. Entre ton adresse email et valide
4. ✅ Tu reçois l'email de réinitialisation en moins de **5 minutes**
5. ✅ Clique sur le lien dans l'email — une page pour choisir un nouveau mot de passe s'ouvre
6. ✅ Utilise le lien une deuxième fois — il doit être **expiré** (message "Ce lien n'est plus valide")
7. ❌ Si le lien fonctionne encore après utilisation : **signaler au dev** (risque de sécurité)

### Email 3 — Confirmation de réservation

1. Crée une **réservation de test** dans ton application
2. ✅ L'email de confirmation arrive chez le **voyageur** (ton adresse de test)
3. ✅ L'email de notification arrive aussi chez l'**agence** (l'email du gestionnaire)
4. ❌ Si un des deux emails manque : **signaler au dev**

---

## Étape 5.2 — Vérifier la délivrabilité ⏱️ 5 min

### C'est quoi la délivrabilité ?

La délivrabilité mesure la probabilité que tes emails arrivent bien dans la boîte de réception plutôt que dans les spams. Même si tu reçois bien les emails pendant tes tests, d'autres fournisseurs de messagerie (Gmail, Outlook...) peuvent les filtrer différemment.

### Ce que tu vas faire

1. Va sur [mail-tester.com](https://www.mail-tester.com)
2. Le site te donne automatiquement une **adresse email temporaire** unique (ex: `test-xyz123@mail-tester.com`)

   *(tu dois voir quelque chose qui ressemble à : une grande adresse email affichée en bleu au centre de la page)*

3. **Copie cette adresse email temporaire**
4. Dans ton site, **invite cette adresse** comme nouvel utilisateur, ou envoie-lui une notification de test (n'importe quel email transactionnel fonctionne)
5. Retourne sur mail-tester.com et clique sur **"Vérifier mon score"**
6. Attends quelques secondes

**Résultats :**
- ✅ Score **9/10 ou 10/10** : excellent, tes emails arrivent bien en boîte de réception
- ⚠️ Score **7-8/10** : acceptable mais certains emails peuvent aller en spam chez certains destinataires
- ❌ Score **inférieur à 7/10** : **beaucoup d'emails iront en spam** — faire une capture d'écran et envoyer au dev

---

## Étape 5.3 — Vérifier les enregistrements DNS email ⏱️ 5 min

### C'est quoi SPF, DKIM, DMARC ?

Ce sont des **protections anti-usurpation** configurées dans les paramètres de ton nom de domaine. Sans eux, n'importe qui pourrait envoyer des emails en prétendant venir de `@ton-site.fr`. Avec eux, les serveurs de messagerie peuvent vérifier que l'email vient vraiment de toi.

En résumé :
- **SPF** = liste des serveurs autorisés à envoyer des emails pour ton domaine
- **DKIM** = signature cryptographique sur chaque email (comme un cachet officiel)
- **DMARC** = politique qui dit quoi faire si SPF ou DKIM échoue

### Ce que tu vas faire

1. Va sur [mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)
2. Dans le champ de saisie, **tape ton nom de domaine** (ex: `conciergeos.fr`)
3. Dans le menu déroulant à droite, sélectionne **"SPF Lookup"**
4. Clique sur **"Go"** ou **"MX Lookup"**

**Résultats SPF :**
- ✅ Tu vois une ligne verte avec `v=spf1` dedans : **SPF est configuré**
- ❌ La zone est rouge ou vide : **signaler au dev**

5. Recommence avec **"DKIM Lookup"** (si un sélecteur t'est demandé, essaie `resend` ou `default`)
6. Recommence avec **"DMARC Lookup"**

**Résultats :**
- ✅ Les **3 (SPF + DKIM + DMARC) sont en vert** : excellent, tes emails sont bien authentifiés
- ⚠️ 1 ou 2 manquent : à signaler au dev, c'est important pour la délivrabilité
- ❌ Aucun des 3 n'est configuré : **priorité — signaler au dev**

---

# PARTIE 6 — Expérience utilisateur & Onboarding 📱
**Durée estimée : 20 minutes**

Tu peux avoir le site le plus sécurisé et le plus rapide du monde — si c'est difficile à utiliser sur téléphone, tes clients partiront. Cette section te permet de tester l'expérience réelle de tes utilisateurs.

---

## Étape 6.1 — Test complet sur mobile ⏱️ 10 min

### Ce que tu vas faire (sur ton smartphone)

Prends ton téléphone et parcours ces pages. À chaque étape, note si quelque chose s'affiche mal, est illisible, ou est difficile à cliquer.

1. **Page d'accueil**
   - [ ] Tout le texte est lisible sans zoomer
   - [ ] Les images s'affichent correctement
   - [ ] Les boutons sont assez grands pour être cliqués avec le doigt

2. **Page de connexion**
   - [ ] Quand tu touches les champs "Email" et "Mot de passe", le clavier s'ouvre automatiquement
   - [ ] Le bouton "Se connecter" est facilement accessible

3. **Dashboard (tableau de bord)**
   - [ ] Les chiffres et statistiques sont lisibles
   - [ ] Les menus sont accessibles

4. **Liste des réservations**
   - [ ] Le tableau se lit facilement (tu peux faire défiler horizontalement si nécessaire)
   - [ ] Les boutons d'action sont cliquables

5. **Formulaire de création de bien**
   - [ ] Les champs sont assez grands pour taper confortablement
   - [ ] Tu peux remplir le formulaire sans problème

**Pour chaque point ❌** : note le nom de la page et ce qui ne fonctionne pas bien.

### Test du portail voyageur sur mobile

Le portail voyageur est la page que tu envoies à tes clients Airbnb pour qu'ils accèdent aux informations de leur séjour.

1. Depuis une réservation dans l'application, **génère un lien de portail voyageur**
2. **Ouvre ce lien sur ton téléphone**
3. Vérifie :
   - ✅ La page s'affiche en plein écran, bien adaptée au mobile
   - ✅ Le **code d'accès** (code de la serrure ou code WiFi) est affiché en **grand et lisible**
   - ✅ Le bouton **"Contacter l'agence"** fonctionne (ouvre un email ou un WhatsApp)
4. ❌ Si le texte est minuscule ou si des éléments sortent de l'écran : **noter et signaler au dev**

---

## Étape 6.2 — Test PWA prestataire 📲 ⏱️ 5 min

### C'est quoi une PWA ?

Une PWA (Progressive Web App = Application Web Progressive) est une **application installable depuis un site web** — sans passer par l'App Store ou Google Play. Tes prestataires (agents de ménage, etc.) peuvent installer ConciergeOS sur leur téléphone comme une vraie app.

### Test sur Android (avec Chrome)

1. Sur ton téléphone Android, ouvre **Chrome**
2. Tape `https://ton-site.fr/#/provider` (remplace par ton vrai domaine)
3. Attends quelques secondes — une bannière "Ajouter à l'écran d'accueil" devrait apparaître

   *(tu dois voir quelque chose qui ressemble à : une petite fenêtre qui pop en bas de l'écran avec le nom de l'app et un bouton "Installer")*

4. Si la bannière n'apparaît pas automatiquement : appuie sur les **3 points** en haut à droite → **"Ajouter à l'écran d'accueil"**

**Résultats :**
- ✅ L'icône apparaît sur ton bureau et l'app s'ouvre sans barre de navigateur : **la PWA fonctionne**
- ❌ L'option "Ajouter à l'écran d'accueil" n'existe pas : **signaler au dev**

### Test sur iPhone (avec Safari)

1. Ouvre **Safari** (important : ça ne fonctionne pas avec Chrome sur iPhone)
2. Tape `https://ton-site.fr/#/provider`
3. Appuie sur l'icône **"Partager"** (carré avec une flèche vers le haut, en bas de l'écran)
4. Fais défiler le menu qui s'ouvre et appuie sur **"Sur l'écran d'accueil"**
5. Confirme en appuyant sur **"Ajouter"**

**Résultats :**
- ✅ L'icône apparaît sur l'écran d'accueil et l'app s'ouvre sans barre de navigateur : **parfait**
- ❌ L'option n'est pas disponible dans le menu : **signaler au dev**

---

## Étape 6.3 — Test du parcours d'inscription complet ⏱️ 5 min

### Pourquoi ce test ?

Tu vas te mettre à la place d'un **nouveau client qui découvre ton site pour la première fois**. L'objectif : mesurer combien de temps il faut pour créer un compte et comprendre comment l'utiliser, sans aide extérieure.

### Ce que tu vas faire

1. Ouvre ton site en **navigation privée**
2. Cherche le bouton **"Essai gratuit"** ou "S'inscrire" ou "Commencer"
3. Remplis le formulaire d'inscription
4. Note tout ce qui est **confus, mal expliqué ou difficile**

**Chronomètre :**
- ✅ Tu arrives à créer ton compte en **moins de 3 minutes** : fluide
- ⚠️ Entre **3 et 5 minutes** : acceptable mais améliorable
- ❌ Plus de **5 minutes** ou tu te perds : **noter précisément l'étape où tu as buggé**

**Après l'inscription :**
- ✅ Tu arrives sur un **dashboard d'accueil** avec une aide visible (guide de démarrage, tutoriel, pop-up explicatif) : **parfait**
- ✅ Tu comprends immédiatement quoi faire ensuite : **parfait**
- ❌ Tu arrives sur une page vide ou un écran qui ne t'explique rien : **noter et signaler au dev**

---

# PARTIE 7 — Monitoring 📊
**Durée estimée : 5 minutes**

Le monitoring (surveillance en continu), c'est l'équivalent d'une alarme dans ta boutique. Sans ça, si ton site tombe en pleine nuit, tu ne le sauras que quand un client te contacte pour se plaindre — trop tard.

---

## Étape 7.1 — Vérifier que le monitoring est actif ⏱️ 5 min

### Ce que tu vas faire

1. Va sur [uptimerobot.com](https://uptimerobot.com)
2. Si tu as déjà un compte : **connecte-toi** et vérifie que ton site est dans la liste avec le statut **"Up"** (en vert)
3. ✅ Ton site est surveillé et le statut est vert : **parfait**
4. ❌ Pas de compte ou ton site n'est pas dans la liste : **créer le monitoring maintenant** (c'est gratuit et ça prend 5 minutes — voir ci-dessous)

### Configuration rapide UptimeRobot (si pas encore fait)

1. Va sur [uptimerobot.com](https://uptimerobot.com) et clique **"Register for FREE"**
2. Crée un compte gratuit avec ton email
3. Clique sur **"Add New Monitor"**
4. Remplis comme ça :
   - **Monitor Type** : `HTTP(s)`
   - **Friendly Name** : `ConciergeOS Production`
   - **URL** : l'URL complète de ton site (ex: `https://conciergeos.fr`)
   - **Monitoring Interval** : `5 minutes`
   - **Alert Contacts** : ton adresse email
5. Clique **"Create Monitor"**

✅ C'est fait ! Tu recevras un email automatiquement si ton site tombe, 24h/24.

---

# RÉCAPITULATIF FINAL 📋

Bravo, tu as terminé l'audit ! C'est maintenant qu'on fait le bilan.

---

## Tableau de bord de l'audit

Remplis ce tableau avec tout ce que tu as trouvé :

| Section | ✅ OK | ❌ Problème | Notes |
|---------|-------|------------|-------|
| 1. Sécurité de base | | | |
| 1.1 HTTPS / cadenas | | | |
| 1.2 En-têtes de sécurité | | | |
| 1.3 Pages protégées | | | |
| 1.4 Système de connexion | | | |
| 1.5 Secrets / clés API | | | |
| 2. Vitesse | | | |
| 2.1 PageSpeed Google | | | |
| 2.2 Vitesse mobile | | | |
| 3. RGPD & Légal | | | |
| 3.1 Pages légales | | | |
| 3.2 Bandeau cookies | | | |
| 3.3 Suppression de compte | | | |
| 4. Paiements Stripe | | | |
| 4.1 Page de paiement | | | |
| 4.2 Paiement test | | | |
| 4.3 Webhooks | | | |
| 5. E-mails | | | |
| 5.1 Réception des emails | | | |
| 5.2 Score délivrabilité | | | |
| 5.3 DNS email (SPF/DKIM/DMARC) | | | |
| 6. Expérience utilisateur | | | |
| 6.1 Test mobile | | | |
| 6.2 PWA prestataire | | | |
| 6.3 Parcours d'inscription | | | |
| 7. Monitoring | | | |
| 7.1 UptimeRobot actif | | | |

---

## Ce que tu envoies à ton développeur

Après l'audit, envoie un message de ce type à ton dev (adapte selon ce que tu as trouvé) :

```
Bonjour,

J'ai fait l'audit post-déploiement de ConciergeOS. Voici les points à corriger :

Points URGENTS (à corriger avant ouverture au public) :
- [numéro du point, ex: 1.3] : [description de ce que tu as vu]
- [numéro du point] : [description]

Points IMPORTANTS (à corriger cette semaine) :
- [numéro du point] : [description]
- [numéro du point] : [description]

Points MINEURS (à corriger quand tu peux) :
- [numéro du point] : [description]

Tout le reste est OK ✅

Référence : Guide d'audit post-déploiement ConciergeOS — docs/11-guide-audit-debutant.md
```

> 💡 Pour chaque point URGENT, attends la correction du dev avant d'ouvrir le site au public.

---

## Fréquence recommandée

Tu n'as pas à faire cet audit tous les jours. Voici un calendrier simple :

| Quand faire l'audit | Quoi vérifier |
|--------------------|---------------|
| Avant chaque mise en ligne | Audit complet (toutes les sections) |
| Chaque mois | Sections 1 (sécurité) + 5 (emails) + 7 (monitoring) |
| Après chaque mise à jour Stripe | Section 4 uniquement |
| Après un changement de domaine ou DNS | Sections 1 + 5 |
| Après une mise à jour majeure du site | Sections 1 + 2 + 4 |

---

## Les 5 outils gratuits à garder en favoris

Crée un dossier "Audit ConciergeOS" dans tes favoris et ajoute ces 5 liens — ils te serviront à chaque audit :

1. 🔒 [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) — test de ton certificat HTTPS
2. ⚡ [pagespeed.web.dev](https://pagespeed.web.dev/) — test de vitesse Google
3. 🛡️ [securityheaders.com](https://securityheaders.com) — test des protections invisibles
4. 📧 [mail-tester.com](https://www.mail-tester.com) — test de délivrabilité des emails
5. 📡 [uptimerobot.com](https://uptimerobot.com) — surveillance 24h/24 de ton site

---

## Et si quelque chose ne va vraiment pas ?

**Reste calme.** Trouver des problèmes pendant un audit, c'est exactement l'objectif. Mieux vaut les trouver maintenant que quand un client appelle pour se plaindre.

Classe tes problèmes en 3 catégories :
- 🔴 **URGENT** (sécurité, accès non protégé, paiements qui ne fonctionnent pas) → corriger avant d'ouvrir
- 🟡 **IMPORTANT** (vitesse, RGPD) → corriger dans la semaine
- 🟢 **MINEUR** (texte trop petit sur mobile, email légèrement dans les spams) → corriger quand possible

Et n'oublie pas : un site audité et quelques problèmes identifiés, c'est infiniment mieux qu'un site non audité avec des problèmes cachés.

---

> 💡 **Tu as des questions ?** Chaque point de ce guide correspond à un point dans la checklist d'audit technique (`docs/10-checklist-audit-post-deploiement.md`) — ton développeur peut se référer à cette checklist pour les corrections détaillées.

---

*ConciergeOS — Guide d'audit pour débutants v1.0 — Juin 2026*
