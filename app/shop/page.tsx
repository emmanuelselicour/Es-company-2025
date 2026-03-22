'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Chatbot from '../../components/Chatbot';
import ProductCard from '../../components/ProductCard';
import toast, { Toaster } from 'react-hot-toast';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const netflixProducts = [
    { id: 'netflix-1m', name: 'Netflix 1 Mois', price: 500, duration: '1 mois', category: 'netflix' },
    { id: 'netflix-3m', name: 'Netflix 3 Mois', price: 1250, duration: '3 mois', category: 'netflix' },
  ];

  const freefireDiamonds = [
    { id: 'ff-100', name: '100+10 Diamants', price: 180, diamonds: '100+10', category: 'freefire' },
    { id: 'ff-200', name: '200+20 Diamants', price: 360, diamonds: '200+20', category: 'freefire' },
    { id: 'ff-310', name: '310+31 Diamants', price: 500, diamonds: '310+31', category: 'freefire' },
    { id: 'ff-410', name: '410+41 Diamants', price: 710, diamonds: '410+41', category: 'freefire' },
    { id: 'ff-520', name: '520+52 Diamants', price: 810, diamonds: '520+52', category: 'freefire' },
    { id: 'ff-620', name: '620+62 Diamants', price: 1100, diamonds: '620+62', category: 'freefire' },
    { id: 'ff-913', name: '913+91 Diamants', price: 1575, diamonds: '913+91', category: 'freefire' },
    { id: 'ff-1060', name: '1060+106 Diamants', price: 1650, diamonds: '1060+106', category: 'freefire' },
    { id: 'ff-1260', name: '1260+126 Diamants', price: 2100, diamonds: '1260+126', category: 'freefire' },
    { id: 'ff-2180', name: '2180+218 Diamants', price: 3300, diamonds: '2180+218', category: 'freefire' },
    { id: 'ff-5600', name: '5600+560 Diamants', price: 7500, diamonds: '5600+560', category: 'freefire' },
    { id: 'ff-11200', name: '11200+1120 Diamants', price: 14500, diamonds: '11200+1120', category: 'freefire' },
  ];

  const freefireSubscriptions = [
    { id: 'ff-week', name: 'Abonnement Semaine', price: 450, duration: '7 jours', category: 'freefire-sub' },
    { id: 'ff-month', name: 'Abonnement Mois', price: 1800, duration: '30 jours', category: 'freefire-sub' },
    { id: 'ff-levelup', name: 'Level Up Pass', price: 900, duration: '1 saison', category: 'freefire-sub' },
    { id: 'ff-booyah', name: 'Booyah Pass', price: 450, duration: '1 saison', category: 'freefire-sub' },
  ];

  const allProducts = [...netflixProducts, ...freefireDiamonds, ...freefireSubscriptions];

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category.includes(selectedCategory));

  const categories = [
    { id: 'all', name: 'Tous', icon: '🛒' },
    { id: 'netflix', name: 'Netflix', icon: '🎬' },
    { id: 'freefire', name: 'Diamants FF', icon: '💎' },
    { id: 'freefire-sub', name: 'Abonnements FF', icon: '⭐' },
  ];

  const handlePurchase = (product: any) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour acheter');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (!user.profileCompleted) {
      toast.error('Veuillez compléter votre profil d\'abord');
      setTimeout(() => router.push('/settings'), 1500);
      return;
    }

    // Sauvegarder le produit sélectionné et rediriger vers la page de paiement
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Navbar />
      <Toaster position="top-center" />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Notre Boutique
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choisissez parmi nos produits et services
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} onPurchase={handlePurchase} />
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucun produit dans cette catégorie
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
}
