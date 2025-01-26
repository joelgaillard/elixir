# Elixir - Cocktails

## Présentation du projet

Pour une présentation détaillée du projet, y compris ses fonctionnalités et son contexte, consultez le fichier dédié :
👉 [Présentation du Projet](./PRESENTATION.md)


## Installation du projet en local
Pour exécuter ce projet localement, assurez-vous que votre environnement de développement inclue les éléments suivants :
- Node.js (v23 ou supérieur)
- npm

### Étape 1: Clonage du dépôt
Clonez ce dépôt sur votre machine locale en utilisant :

```bash
git clone https://github.com/joelgaillard/elixir.git
cd elixir
```

### Étape 2: Configuration de l'environnement
Dupliquez le fichier `.env.example` pour créer un fichier `.env` que vous devrez configurer selon votre environnement de développement.

```bash
cp .env.example .env
```

### Étape 3: Configuration initiale
Rendez le script de configuration exécutable et exécutez-le.

```bash
chmod +x setup.sh
./setup.sh
```

### Étape 4: Lancement du serveur de développement
Démarrer le serveur de développement: 

```bash
npm run dev
```

### (Optionnel) - Utiliser l'API en local

Si vous souhaitez exécuter l'API en local, suivez ces étapes :

1. **Cloner le dépôt de l'API**  
   Récupérez le projet `elixir-api` depuis son dépôt GitHub :  
   [https://github.com/joelgaillard/elixir-api.git](https://github.com/joelgaillard/elixir-api.git)

2. **Suivre les instructions d'installation**  
   Consultez le fichier **README** du dépôt pour effectuer correctement l'installation et la configuration de l'API.

3. **Configurer le proxy dans votre projet Vue.js**  
   Modifiez le fichier **vite.config.js** pour ajuster la configuration du proxy afin qu'il pointe vers l'URL locale de votre API. Cela garantit que les requêtes API seront redirigées correctement.

Ainsi, votre application Vue.js pourra interagir avec l'API exécutée localement.
