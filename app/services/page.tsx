'use client';

import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Chatbot from '../../components/Chatbot';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function ServicesPage() {
  const services = [
    {
      name: 'Netflix',
      description: 'Profitez de milliers de films et séries en streaming. Abonnements mensuels et trimestriels disponibles.',
      icon: '🎬',
      color: 'from-red-500 to-red-700',
      features: ['1 mois - 500 GDS', '3 mois - 1250 GDS', 'Activation immédiate', 'Support 24/7'],
      image: '/images/netflix-logo.svg',
    },
    {
      name: 'Free Fire',
      description: 'Achetez des diamants et des passes pour améliorer votre expérience de jeu sur Free Fire.',
      icon: '💎',
      color: 'from-orange-500 to-orange-700',
      features: ['Diamants à partir de 180 GDS', 'Passes mensuels', 'Livraison instantanée', 'Tous les packs disponibles'],
      image: '/images/freefire-logo.svg',
    },
    {
      name: 'Wise',
      description: 'Rechargez votre compte Wise pour effectuer des transferts internationaux à moindre coût.',
      icon: '💳',
      color: 'from-green-500 to-green-700',
      features: ['Recharge rapide', 'Taux compétitifs', 'Sécurisé', 'Support client'],
      image: '/images/wise-logo.svg',
    },
    {
      name: 'PayPal',
      description: 'Ajoutez des fonds à votre compte PayPal pour vos achats en ligne en toute sécurité.',
      icon: '💰',
      color: 'from-blue-500 to-blue-700',
      features: ['Montants flexibles', 'Transfert rapide', '100% sécurisé', 'Confirmation immédiate'],
      image: '/images/paypal-logo.svg',
    },
    {
      name: 'Meru',
      description: 'Rechargez votre compte Meru pour profiter de tous leurs services financiers.',
      icon: '📱',
      color: 'from-purple-500 to-purple-700',
      features: ['Recharge instantanée', 'Montants variés', 'Service fiable', 'Support dédié'],
      image: '/images/meru-logo.svg',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Choisissez votre service',
      description: 'Parcourez notre boutique et sélectionnez le service que vous souhaitez recharger.',
      icon: '🛒',
    },
    {
      step: '2',
      title: 'Passez commande',
      description: 'Remplissez les informations nécessaires et choisissez votre méthode de paiement.',
      icon: '📝',
    },
    {
      step: '3',
      title: 'Effectuez le paiement',
      description: 'Envoyez le paiement via MONCASH ou NATCASH et uploadez la capture d\'écran.',
      icon: '💳',
    },
    {
      step: '4',
      title: 'Recevez votre service',
      description: 'Nous traitons votre commande rapidement et vous livrons votre service.',
      icon: '✅',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-white dark:from-dark-800 dark:to-dark-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Nos Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Rechargez tous vos services préférés en quelques clics. Simple, rapide et sécurisé.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/shop"
                  className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
                >
                  En savoir plus <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Un processus simple en 4 étapes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-4xl mx-auto">
                    {item.icon}
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-white dark:bg-dark-800 rounded-full flex items-center justify-center border-2 border-primary-500 font-bold text-primary-500">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des milliers d'utilisateurs satisfaits
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-white text-primary-500 font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
            >
              Accéder à la boutique
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
