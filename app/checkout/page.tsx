'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCreditCard, FiCheck, FiHash } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('moncash');
  const [gameId, setGameId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const selectedProduct = localStorage.getItem('selectedProduct');
    const userData = localStorage.getItem('user');
    if (!selectedProduct || !userData) {
      router.push('/shop');
      return;
    }
    setProduct(JSON.parse(selectedProduct));
  }, [router]);

  const createOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté');
        router.push('/login');
        return;
      }

      const response = await axios.post(
        '/api/orders',
        {
          productType: product.category,
          productName: product.name,
          price: product.price,
          paymentMethod,
          gameId: gameId || '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStep(3);
      toast.success('Commande créée! Veuillez entrer votre ID de transaction.');
      return response.data.order.id;
    } catch (error: any) {
      console.error('Erreur création commande:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création de la commande');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitTransactionId = async () => {
    // Validation: 14 chiffres exactement
    if (!transactionId || transactionId.length !== 14 || !/^\d{14}$/.test(transactionId)) {
      toast.error('L\'ID de transaction doit contenir exactement 14 chiffres');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Créer la commande avec l'ID de transaction
      const response = await axios.post(
        '/api/orders',
        {
          productType: product.category,
          productName: product.name,
          price: product.price,
          paymentMethod,
          gameId: gameId || '',
          additionalInfo: { transactionId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStep(4);
      toast.success('Commande soumise avec succès!');
    } catch (error: any) {
      console.error('Erreur soumission:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      <Navbar />
      <Toaster position="top-center" />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-dark-700 text-gray-500'
                  }`}>
                    {step > s ? <FiCheck /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`w-16 h-1 ${step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-700'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-400 px-8">
              <span>Infos</span>
              <span>Paiement</span>
              <span>Transaction</span>
              <span>Terminé</span>
            </div>
          </div>

          {/* Step 1 & 2 */}
          {step <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Finaliser votre achat
              </h1>

              {/* Récapitulatif */}
              <div className="mb-8 p-6 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Récapitulatif</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    {product.diamonds && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">💎 {product.diamonds}</p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-primary-500">{product.price} GDS</p>
                </div>
              </div>

              {/* Game ID pour Free Fire */}
              {product.category && product.category.includes('freefire') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ID de jeu Free Fire
                  </label>
                  <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                    placeholder="Entrez votre ID Free Fire"
                  />
                </div>
              )}

              {/* Méthode de paiement */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('moncash')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'moncash'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-dark-600'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">MONCASH</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+509 4343 4399</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('natcash')}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'natcash'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-dark-600'
                    }`}
                  >
                    <p className="font-bold text-gray-900 dark:text-white">NATCASH</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+555 5000 0000</p>
                  </button>
                </div>
              </div>

              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Continuer
                </button>
              )}

              {step === 2 && (
                <>
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      ℹ️ Envoyez <strong>{product.price} GDS</strong> au numéro{' '}
                      <strong>{paymentMethod === 'moncash' ? '+509 4343 4399' : '+555 5000 0000'}</strong>,
                      puis notez votre <strong>ID de transaction (14 chiffres)</strong> pour l'étape suivante.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    disabled={loading}
                    className="w-full py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <FiCreditCard />
                    <span>J'ai effectué le paiement</span>
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Step 3: ID Transaction */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Entrez votre ID de transaction
              </h2>

              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  ⚠️ Entrez l'ID de transaction à <strong>14 chiffres</strong> reçu après votre paiement {paymentMethod === 'moncash' ? 'MonCash' : 'NatCash'}.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID de Transaction
                </label>
                <div className="relative">
                  <FiHash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 14);
                      setTransactionId(val);
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white text-lg font-mono tracking-widest"
                    placeholder="12345678901234"
                    maxLength={14}
                  />
                </div>
                <p className={`text-sm mt-2 ${transactionId.length === 14 ? 'text-green-500' : 'text-gray-500'}`}>
                  {transactionId.length}/14 chiffres
                </p>
              </div>

              <button
                onClick={submitTransactionId}
                disabled={loading || transactionId.length !== 14}
                className="w-full py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FiCheck />
                <span>{loading ? 'Envoi en cours...' : 'Confirmer la commande'}</span>
              </button>
            </motion.div>
          )}

          {/* Step 4: Succès */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700 text-center"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Commande soumise avec succès!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Votre commande est en cours de traitement. Nous vérifierons votre transaction et vous contacterons bientôt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/settings')}
                  className="px-6 py-3 bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  Voir mes commandes
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('selectedProduct');
                    router.push('/shop');
                  }}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Continuer mes achats
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
      }
