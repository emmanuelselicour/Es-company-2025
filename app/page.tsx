'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiShoppingBag, FiCreditCard, FiZap } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

export default function HomePage() {
  const services = [
    {
      title: 'Netflix',
      description: 'Abonnements mensuels et trimestriels',
      price: '500 GDS',
      icon: '🎬',
      gradient: 'from-red-500 to-red-700',
    },
    {
      title: 'Free Fire',
      description: 'Diamants et abonnements premium',
      price: '180 GDS',
      icon: '💎',
      gradient: 'from-orange-500 to-orange-700',
    },
    {
      title: 'Wise',
      description: 'Recharge rapide et sécurisée',
      price: 'Variable',
      icon: '💳',
      gradient: 'from-green-500 to-green-700',
    },
    {
      title: 'PayPal',
      description: 'Rechargez votre compte facilement',
      price: 'Variable',
      icon: '💰',
      gradient: 'from-blue-500 to-blue-700',
    },
  ];

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: 'Rapide',
      description: 'Livraison instantanée de vos services',
    },
    {
      icon: <FiCreditCard className="w-6 h-6" />,
      title: 'Sécurisé',
      description: 'Paiements 100% sécurisés',
    },
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: 'Simple',
      description: 'Processus d\'achat simplifié',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Rechargez facilement
              <br />
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                vos services préférés
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Netflix, Free Fire, Wise, PayPal et plus encore. Tout ce dont vous avez besoin en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-lg shadow-primary-500/30"
              >
                <span>Découvrir la boutique</span>
                <FiArrowRight />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-gray-100 dark:bg-dark-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
              >
                Nos services
              </Link>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-500 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nos services populaires
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choisissez parmi nos services les plus demandés
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-500 font-bold text-lg">
                      Dès {service.price}
                    </span>
                    <FiArrowRight className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/30"
            >
              <span>Voir tous les services</span>
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Créez votre compte gratuitement et accédez à tous nos services
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-primary-500 font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
            >
              Créer un compte
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
