# 📘 Guide d'Installation - RechargePro

## 🚀 Installation Rapide

### 1. Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure ([Télécharger](https://nodejs.org))
- **MongoDB** ([Télécharger](https://www.mongodb.com/try/download/community))
- **Git** ([Télécharger](https://git-scm.com/downloads))

### 2. Installation

```bash
# Étape 1: Naviguer dans le dossier du projet
cd recharge-platform

# Étape 2: Exécuter le script d'installation
chmod +x install.sh
./install.sh

# OU installer manuellement
npm install
```

### 3. Configuration de la Base de Données

#### Option A: MongoDB Local

```bash
# Démarrer MongoDB
mongod

# Le fichier .env est déjà configuré pour MongoDB local
MONGODB_URI=mongodb://localhost:27017/recharge-platform
```

#### Option B: MongoDB Atlas (Cloud - Recommandé)

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Modifier `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recharge-platform
```

### 4. Variables d'Environnement

Le fichier `.env` a été créé automatiquement. Vérifiez et modifiez si nécessaire :

```env
MONGODB_URI=mongodb://localhost:27017/recharge-platform
JWT_SECRET=changez_moi_en_production_123456789
NEXTAUTH_SECRET=changez_moi_aussi_en_production_987654321
NODE_ENV=development

# Numéros de paiement
MONCASH_NUMBER=+50943434399
NATCASH_NUMBER=+55550000
```

**⚠️ IMPORTANT**: En production, changez `JWT_SECRET` et `NEXTAUTH_SECRET` par des valeurs sécurisées!

### 5. Créer le Premier Admin

#### Méthode 1: Via MongoDB Compass (Recommandé)

1. Ouvrir MongoDB Compass
2. Connecter à `mongodb://localhost:27017`
3. Créer la base de données `recharge-platform`
4. Créer une collection `users`
5. Insérer ce document:

```json
{
  "firstName": "Admin",
  "lastName": "System",
  "email": "admin@rechargepro.com",
  "phone": "+50943434399",
  "password": "$2a$10$YourHashedPasswordHere",
  "address": "Port-au-Prince, Haiti",
  "whatsapp": "+50943434399",
  "role": "admin",
  "profileCompleted": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

#### Méthode 2: Script de Création Admin

Créer le fichier `scripts/create-admin.js`:

```javascript
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/recharge-platform');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const User = mongoose.model('User', new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    address: String,
    whatsapp: String,
    role: String,
    profileCompleted: Boolean,
  }));

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@rechargepro.com',
    phone: '+50943434399',
    password: hashedPassword,
    address: 'Port-au-Prince',
    whatsapp: '+50943434399',
    role: 'admin',
    profileCompleted: true,
  });

  console.log('✅ Admin créé:', admin.email);
  process.exit(0);
}

createAdmin();
```

Puis exécuter:

```bash
node scripts/create-admin.js
```

### 6. Démarrer le Projet

```bash
# Mode développement
npm run dev

# Le site sera accessible sur:
# http://localhost:3000
```

### 7. Connexion Admin

Ouvrir le navigateur et aller sur:

```
http://localhost:3000/login
```

Connexion:
- Email: `admin@rechargepro.com`
- Password: (celui que vous avez défini)

### 8. Créer le Dossier Uploads

```bash
mkdir -p public/uploads
mkdir -p public/images
```

## 🎨 Structure des Fichiers

```
recharge-platform/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── shop/              # Boutique
│   ├── login/             # Connexion
│   ├── register/          # Inscription
│   ├── settings/          # Paramètres
│   ├── checkout/          # Paiement
│   ├── admin/             # Panel admin
│   └── api/               # Routes API
├── components/            # Composants React
├── models/                # Modèles MongoDB
├── lib/                   # Utilitaires
├── locales/               # Traductions
└── public/                # Fichiers statiques
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## 🐛 Résolution des Problèmes

### MongoDB ne se connecte pas

```bash
# Vérifier si MongoDB est lancé
ps aux | grep mongod

# Lancer MongoDB
mongod --dbpath /path/to/data
```

### Port 3000 déjà utilisé

```bash
# Tuer le processus
kill -9 $(lsof -ti:3000)

# OU utiliser un autre port
PORT=3001 npm run dev
```

### Erreur "Cannot find module"

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

### Images ne s'affichent pas

```bash
# Vérifier que le dossier existe
mkdir -p public/uploads
chmod 755 public/uploads
```

## 📦 Build Production

```bash
# Build
npm run build

# Tester le build
npm start
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'environnement dans le dashboard Vercel
```

### Variables d'environnement Production

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret_ultra_securise_123
NEXTAUTH_SECRET=votre_autre_secret_securise_456
NODE_ENV=production
```

## ✅ Checklist Post-Installation

- [ ] MongoDB est lancé
- [ ] Variables d'environnement configurées
- [ ] Admin créé dans la base de données
- [ ] Dossiers uploads créés
- [ ] npm run dev fonctionne
- [ ] Connexion admin réussie
- [ ] Test de création d'utilisateur
- [ ] Test de commande

## 📞 Support

Pour toute question:
- Email: contact@rechargepro.com
- WhatsApp: +509 4343 4399

## 📝 Notes Importantes

1. **Sécurité**: Changez TOUS les secrets en production
2. **Uploads**: Les fichiers uploadés sont dans `public/uploads`
3. **Admin**: Le premier admin doit être créé manuellement
4. **Dark Mode**: Activé par défaut
5. **Multi-langue**: FR, EN, ES disponibles

---

✨ **Bon développement avec RechargePro!**
