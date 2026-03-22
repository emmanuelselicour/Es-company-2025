'use client';

import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  onPurchase: (product: any) => void;
}

export default function ProductCard({ product, onPurchase }: ProductCardProps) {
  const getIcon = () => {
    if (product.category === 'netflix') return '🎬';
    if (product.category.includes('freefire')) return '💎';
    return '🛍️';
  };

  const getGradient = () => {
    if (product.category === 'netflix') return 'from-red-500 to-red-700';
    if (product.category.includes('freefire')) return 'from-orange-500 to-orange-700';
    return 'from-primary-500 to-primary-700';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Icon */}
      <div className={`w-16 h-16 bg-gradient-to-br ${getGradient()} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
        {getIcon()}
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h3>

      {product.duration && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Durée: {product.duration}
        </p>
      )}

      {product.diamonds && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          💎 {product.diamonds} diamants
        </p>
      )}

      {/* Price */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <div>
          <p className="text-2xl font-bold text-primary-500">
            {product.price} <span className="text-sm">GDS</span>
          </p>
        </div>
        <button
          onClick={() => onPurchase(product)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <FiShoppingCart size={18} />
          <span className="text-sm font-medium">Acheter</span>
        </button>
      </div>
    </motion.div>
  );
}
