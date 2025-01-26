# Elixir, frontend - Gestion de cocktails et bars

## Description Générale
Cette application est une Progressive Web App (PWA) permettant aux utilisateurs d’explorer une base de cocktails, de découvrir des bars à proximité et d’interagir via des salons de discussion en temps réel. Elle propose des fonctionnalités adaptées aux **utilisateurs non connectés**, **connectés**, ainsi qu’aux **managers** et **administrateurs**.  
Actuellement, ce projet **frontend** se concentre uniquement sur les fonctionnalités destinées aux **utilisateurs**. Les fonctionnalités liées aux **managers** et **administrateurs** sont implémentées dans le **backend** mais non disponibles dans l’interface utilisateur.

---

## Catégories d’Utilisateurs

### **1. Utilisateurs**
- **Non Connectés** : Accès limité à la navigation et à la recherche.
- **Connectés** : Accès complet, incluant la gestion des favoris, l’évaluation des cocktails et l’interaction via des salons de discussion.

### **2. Managers** *(Non implémenté dans le frontend)*  
- Gestion des bars et des cocktails associés.
- Création et gestion des salons de discussion associés à leurs bars.

### **3. Administrateurs** *(Non implémenté dans le frontend)*  
- Gestion complète des utilisateurs et des managers :
  - Création et modification des comptes managers.
  - Suppression de comptes utilisateurs.

---

## Routes et Fonctionnalités

### 1. Utilisateurs Non Connectés

#### **`/` ou `/cocktails`**
- Permet de consulter une liste de cocktails avec les informations suivantes :
  - Image, nom, note sur 5, nombre de notes.
- Fonctionnalités disponibles :
  - **Recherche** : Recherche par nom.
  - **Filtrage** : Filtrage par ingrédients.
  - **Tri** : Tri par popularité, nom, ou date de création.
- **Boutons Accessibles** :
  - **S’inscrire** (redirection vers `/register`).
  - **Se connecter** (redirection vers `/login`).
- En cliquant sur une carte de cocktail, redirige vers la route `/cocktails/:id` pour voir les détails du cocktail.

#### **`/cocktails/:id`**
- Affiche les détails d’un cocktail spécifique :
  - Image, nom, description, instructions, ingrédients.
  - Carte affichant les bars à proximité proposant ce cocktail.

#### **`/favorites`**
- Affiche une **landing page** dédiée indiquant que l’utilisateur doit se connecter pour accéder à ses favoris.  
- Bouton **Se connecter** redirigeant vers `/login`.

#### **`/chat`**
- Affiche une **landing page** dédiée indiquant que l’utilisateur doit se connecter pour accéder aux salons de discussion.  
- Bouton **Se connecter** redirigeant vers `/login`.

#### **`/chat/:barid`**
- Accessible uniquement pour les utilisateurs connectés. Les utilisateurs non connectés ne peuvent pas accéder à un salon de discussion.

#### **`/account`**
- Affiche une **landing page** dédiée indiquant que l’utilisateur doit se connecter pour gérer son compte.  
- Bouton **Se connecter** redirigeant vers `/login`.

#### **`/register`**
- Permet de s’inscrire en fournissant un nom d’utilisateur, un e-mail et un mot de passe.
- Inclut une redirection vers la page de connexion `/login` si l’utilisateur possède déjà un compte.

#### **`/login`**
- Permet de se connecter en utilisant un e-mail et un mot de passe.
- Inclut une redirection vers la page d’inscription `/register` si l’utilisateur n’a pas encore de compte.

---

### 2. Utilisateurs Connectés  
*(Inclut toutes les fonctionnalités des utilisateurs non connectés, avec des options supplémentaires)*

#### **`/` ou `/cocktails`**
- Fonctionnalités supplémentaires :
  - **Ajout et suppression des favoris** directement depuis la liste des cocktails.

#### **`/cocktails/:id`**
- Fonctionnalités supplémentaires :
  - Ajout et suppression des favoris depuis la page détaillée du cocktail.
  - Possibilité de noter le cocktail.

#### **`/favorites`**
- Permet de consulter les cocktails favoris avec les informations suivantes :
  - Image, nom, note sur 5, nombre de notes.
- Fonctionnalités :
  - Cliquer sur une carte pour rediriger vers `/cocktails/:id`.
  - Retirer un cocktail des favoris directement depuis cette page.

#### **`/chat`**
- Affiche les salons de discussion associés aux bars situés dans un périmètre de 100 mètres.
- Fonctionnalités :
  - Cliquer sur un salon redirige vers `/chat/:barid`.

#### **`/chat/:barid`**
- Affiche un salon de discussion spécifique :
  - Historique des messages.
  - Fonctionnalité de messagerie en temps réel via WebSocket (envoi et réception de messages).

#### **`/account`**
- Permet de gérer son compte utilisateur :
  - Se déconnecter.
  - Modifier le nom d’utilisateur, l’adresse e-mail et le mot de passe.
  - Supprimer son compte.

---

### 3. Managers *(Backend uniquement, non implémenté dans le frontend)*  
- **Gestion des Bars** : Création et mise à jour des informations sur les bars.
- **Gestion des Cocktails** : Ajout de nouveaux cocktails à la base de données et association de cocktails spécifiques aux bars.
- **Gestion des Salons** : Création et gestion des salons de discussion des bars.

---

### 4. Administrateurs *(Backend uniquement, non implémenté dans le frontend)*  
- **Gestion des Managers** :
  - Création et modification des comptes managers.
  - Suppression des comptes managers.

---

## Technologies Utilisées
- **Framework Frontend** : Développement réalisé avec **Vue.js** pour une interface dynamique et réactive.
- **Cartes et Géolocalisation** : Intégration de **Leaflet** pour afficher les bars à proximité.
- **Communication en Temps Réel** : Utilisation de **WebSocket** pour les salons de discussion.
- **Progressive Web App (PWA)** : Optimisation pour une utilisation fluide sur mobile et desktop.

---

Ce frontend couvre les fonctionnalités essentielles accessibles aux utilisateurs non connectés et connectés. Les fonctionnalités des managers et administrateurs sont disponibles dans le backend mais non implémentées dans l’interface utilisateur.
