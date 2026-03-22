# 🚀 RechargePro - Plateforme de Recharge Complète

Plateforme moderne de recharge pour Netflix, Free Fire, Wise, PayPal avec panel admin complet.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Routes](#api-routes)
- [Comptes par défaut](#comptes-par-défaut)

## ✨ Fonctionnalités

### 🌐 Frontend
- ✅ Site vitrine moderne et responsive
- ✅ Mode sombre / clair
- ✅ Multi-langues (FR, EN, ES)
- ✅ Boutique avec produits Netflix et Free Fire
- ✅ Système d'authentification (JWT)
- ✅ Profil utilisateur avec complétion
- ✅ Upload de screenshot de paiement
- ✅ Chatbot intelligent avec réponses auto
- ✅ Animations fluides (Framer Motion)

### 🛠️ Backend
- ✅ API REST complète
- ✅ MongoDB avec Mongoose
- ✅ Authentification JWT
- ✅ Gestion des commandes
- ✅ Messages de contact
- ✅ Système de notifications
- ✅ Chatbot avec base de données

### 👨‍💼 Panel Admin
- ✅ Dashboard avec statistiques
- ✅ Gestion des utilisateurs
- ✅ Gestion des commandes
- ✅ Messagerie
- ✅ Notifications en temps réel
- ✅ Graphiques de ventes (Recharts)

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Base de données**: MongoDB, Mongoose
- **Authentification**: JWT, bcryptjs
- **UI/UX**: Framer Motion, React Icons
- **Graphiques**: Recharts
- **Internationalisation**: i18next

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- MongoDB (local ou Atlas)
- Git

### Étapes

1. **Cloner ou extraire le projet**
```bash
cd recharge-platform
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Créer le fichier .env**
```bash
cp .env.example .env
```

4. **Modifier le fichier .env**
```env
MONGODB_URI=mongodb://localhost:27017/recharge-platform
JWT_SECRET=votre_secret_jwt_super_securise_123456
NEXTAUTH_SECRET=votre_secret_nextauth_super_securise_123456
NODE_ENV=development
```

5. **Créer le dossier uploads**
```bash
mkdir -p public/uploads
```

6. **Lancer MongoDB** (si local)
```bash
mongod
```

7. **Lancer le serveur de développement**
```bash
npm run dev
```

8. **Ouvrir le navigateur**
```
http://localhost:3000
```

## ⚙️ Configuration

### MongoDB

**Option 1: MongoDB Local**
```bash
# Installer MongoDB
# MacOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Lancer MongoDB
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Modifier MONGODB_URI dans .env

### Créer un utilisateur admin

1. **Via MongoDB directement**
```javascript
// Dans MongoDB Shell ou Compass
use recharge-platform

db.users.insertOne({
  firstName: "Admin",
  lastName: "System",
  email: "admin@rechargepro.com",
  phone: "+50943434399",
  password: "$2a$10$YourHashedPasswordHere", // Utilisez bcrypt pour hasher
  role: "admin",
  profileCompleted: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

2. **Via l'inscription puis modification**
```javascript
// Après inscription, dans MongoDB
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

## 🎯 Utilisation

### Flux utilisateur

1. **Inscription** → `/register`
   - Remplir: Prénom, Nom, Email, Téléphone, Mot de passe
   - Redirection automatique vers `/settings`

2. **Compléter le profil** → `/settings`
   - Ajouter: Adresse, WhatsApp
   - Redirection automatique vers `/shop`

3. **Acheter un produit** → `/shop`
   - Choisir Netflix ou Free Fire
   - Sélectionner quantité
   - Choisir méthode de paiement
   - Upload screenshot

4. **Suivre les commandes** → `/settings`
   - Voir l'historique
   - Statut en temps réel

### Flux admin

1. **Connexion admin** → `/login`
   - Email: admin@rechargepro.com
   - Voir le dashboard

2. **Dashboard** → `/admin`
   - Statistiques globales
   - Graphiques de ventes
   - Notifications

3. **Gérer utilisateurs** → `/admin/users`
   - Liste complète
   - Recherche
   - Détails

4. **Gérer commandes** → `/admin/orders`
   - Historique
   - Changer statut
   - Voir screenshots

## 📁 Structure du projet

```
recharge-platform/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── user/
│   │   │   └── profile/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── upload/route.ts
│   │   ├── contact/route.ts
│   │   ├── chatbot/route.ts
│   │   └── admin/
│   │       ├── users/route.ts
│   │       ├── orders/route.ts
│   │       ├── stats/route.ts
│   │       └── notifications/route.ts
│   ├── page.tsx (Accueil)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Chatbot.tsx
├── models/
│   ├── User.ts
│   ├── Order.ts
│   ├── Contact.ts
│   ├── Notification.ts
│   └── ChatMessage.ts
├── lib/
│   ├── mongodb.ts
│   └── auth.ts
├── locales/
│   ├── fr/common.json
│   ├── en/common.json
│   └── es/common.json
├── public/
│   └── uploads/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env.example
```

## 🔌 API Routes

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Utilisateur
- `GET /api/user/profile` - Obtenir profil (Auth requis)
- `PUT /api/user/profile` - Mettre à jour profil (Auth requis)

### Commandes
- `GET /api/orders` - Liste commandes utilisateur (Auth requis)
- `POST /api/orders` - Créer commande (Auth requis)
- `POST /api/orders/upload` - Upload screenshot (Auth requis)

### Contact
- `POST /api/contact` - Envoyer message
- `GET /api/contact` - Liste messages (Admin)

### Chatbot
- `POST /api/chatbot` - Envoyer message chatbot
- `GET /api/chatbot` - Historique (Admin)

### Admin
- `GET /api/admin/users` - Liste utilisateurs (Admin)
- `GET /api/admin/orders` - Liste commandes (Admin)
- `PUT /api/admin/orders` - Mettre à jour statut (Admin)
- `GET /api/admin/stats` - Statistiques (Admin)
- `GET /api/admin/notifications` - Notifications (Admin)
- `PUT /api/admin/notifications` - Marquer lu (Admin)

## 🔐 Comptes par défaut

Après avoir créé la base de données et un admin:

**Admin**
- Email: admin@rechargepro.com
- Password: (à définir lors de la création)

**Utilisateur test** (à créer via /register)
- Prénom: Test
- Nom: User
- Email: test@example.com
- Téléphone: +50912345678
- Password: password123

## 💳 Méthodes de paiement

- **MONCASH**: +509 43434399
- **NATCASH**: +55550000

## 📊 Produits disponibles

### Netflix
- 1 mois: 500 GDS
- 3 mois: 1250 GDS

### Free Fire Diamants
- 100+10 💎: 180 GDS
- 200+20 💎: 360 GDS
- 310+31 💎: 500 GDS
- 410+41 💎: 710 GDS
- 520+52 💎: 810 GDS
- 620+62 💎: 1100 GDS
- 913+91 💎: 1575 GDS
- Et plus...

### Free Fire Abonnements
- Semaine: 450 GDS
- Mois: 1800 GDS
- Level Up Pass: 900 GDS
- Booyah Pass: 450 GDS

## 🐛 Résolution des problèmes

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

# Ou changer le port
PORT=3001 npm run dev
```

### Erreur JWT_SECRET
```bash
# Vérifier que .env existe et contient JWT_SECRET
cat .env | grep JWT_SECRET
```

## 📝 Notes importantes

1. **Uploads**: Créer le dossier `public/uploads` avant de lancer
2. **Admin**: Créer manuellement le premier admin dans MongoDB
3. **Production**: Changer tous les secrets dans .env
4. **HTTPS**: Utiliser HTTPS en production pour les uploads
5. **Images**: Les images de services sont à ajouter dans `/public/images/`

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Variables d'environnement Vercel
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
NODE_ENV=production
```

## 📧 Support

Pour toute question: contact@rechargepro.com

## 📄 Licence

Tous droits réservés © 2024 RechargePro
