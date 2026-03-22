#!/bin/bash

echo "🚀 Installation de RechargePro..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js détecté: $(node --version)${NC}"

# Installer les dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install

# Créer le fichier .env si nécessaire
if [ ! -f .env ]; then
    echo -e "${BLUE}⚙️  Création du fichier .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Fichier .env créé! N'oubliez pas de le configurer.${NC}"
fi

# Créer le dossier uploads
echo -e "${BLUE}📁 Création du dossier uploads...${NC}"
mkdir -p public/uploads
mkdir -p public/images

# Instructions finales
echo -e "${GREEN}"
echo "========================================="
echo "✨ Installation terminée!"
echo "========================================="
echo ""
echo "📝 Prochaines étapes:"
echo ""
echo "1. Configurez votre base de données MongoDB dans .env"
echo "   MONGODB_URI=mongodb://localhost:27017/recharge-platform"
echo ""
echo "2. Lancez MongoDB:"
echo "   mongod"
echo ""
echo "3. Lancez le serveur de développement:"
echo "   npm run dev"
echo ""
echo "4. Ouvrez votre navigateur:"
echo "   http://localhost:3000"
echo ""
echo "5. Créez un admin dans MongoDB (voir README.md)"
echo ""
echo "========================================="
echo -e "${NC}"
