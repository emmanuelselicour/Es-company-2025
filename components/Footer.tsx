'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recharge<span className="text-primary-500">Pro</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Votre plateforme de confiance pour recharger tous vos services préférés.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Liens rapides
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400">Netflix</li>
              <li className="text-sm text-gray-600 dark:text-gray-400">Free Fire</li>
              <li className="text-sm text-gray-600 dark:text-gray-400">Wise</li>
              <li className="text-sm text-gray-600 dark:text-gray-400">PayPal</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiPhone size={16} />
                <span>+509 4343 4399</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiMail size={16} />
                <span>contact@rechargepro.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiMapPin size={16} />
                <span>Port-au-Prince, Haïti</span>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-gray-200 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-200 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-200 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <FiInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} RechargePro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
