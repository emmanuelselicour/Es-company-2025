'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCreditCard, FiUpload, FiCheck } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('moncash');
  const [gameId, setGameId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Upload, 4: Success

  useEffect(() => {
    const selectedProduct = localStorage.getItem('selectedProduct');
    const userData = localStorage.getItem('user');

    if (!selectedProduct || !userData) {
      router.push('/shop');
      return;
    }

    setProduct(JSON.parse(selectedProduct));
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const createOrder = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
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

      setOrderId(response.data.order.id);
      setStep(3); // Passer à l'upload du screenshot
      toast.success('Commande créée! Veuillez uploader votre screenshot.');
    } catch (error: any) {
      console.error('Erreur création commande:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const uploadScreenshot = async () => {
    if (!screenshot || !orderId) {
      toast.error('Veuillez sélectionner une capture d\'écran');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('screenshot', screenshot);

      await axios.post('/api/orders/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setStep(4); // Succès
      toast.success('Screenshot uploadé avec succès!');
    } catch (error: any) {
      console.error('Erreur upload:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'upload');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center">
      <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>;
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
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-dark-700 text-gray-500'
                    }`}
                  >
                    {step > s ? <FiCheck /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-16 h-1 ${
                        step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-400 px-8">
              <span>Infos</span>
              <span>Paiement</span>
              <span>Upload</span>
              <span>Terminé</span>
            </div>
          </div>

          {/* Step 1 & 2: Product Info and Payment Method */}
          {step <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Finaliser votre achat
              </h1>

              {/* Product Summary */}
              <div className="mb-8 p-6 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Récapitulatif
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    {product.diamonds && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        💎 {product.diamonds}
                      </p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-primary-500">
                    {product.price} GDS
                  </p>
                </div>
              </div>

              {/* Game ID (for Free Fire) */}
              {product.category.includes('freefire') && (
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

              {/* Payment Method */}
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
                      ℹ️ Envoyez le paiement de <strong>{product.price} GDS</strong> au numéro{' '}
                      {paymentMethod === 'moncash' ? '+509 4343 4399' : '+555 5000 0000'} puis cliquez sur "Confirmer le paiement".
                    </p>
                  </div>
                  <button
                    onClick={createOrder}
                    disabled={loading}
                    className="w-full py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <FiCreditCard />
                    <span>{loading ? 'Création...' : 'Confirmer le paiement'}</span>
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Step 3: Upload Screenshot */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Uploader la capture d'écran
              </h2>

              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  ⚠️ Veuillez uploader une capture d'écran claire de votre paiement pour que nous puissions traiter votre commande rapidement.
                </p>
              </div>

              <div className="mb-6">
                <label className="block w-full">
                  <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <FiUpload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Cliquez pour sélectionner une image
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      PNG, JPG jusqu'à 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              {previewUrl && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aperçu:
                  </p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-md mx-auto rounded-xl border border-gray-200 dark:border-dark-700"
                  />
                </div>
              )}

              <button
                onClick={uploadScreenshot}
                disabled={loading || !screenshot}
                className="w-full py-4 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Upload en cours...' : 'Envoyer la capture d\'écran'}
              </button>
            </motion.div>
          )}

          {/* Step 4: Success */}
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
                Commande créée avec succès!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Votre commande est en cours de traitement. Nous vous contacterons bientôt.
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
