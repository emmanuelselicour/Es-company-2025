'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiBell, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      toast.error('Accès non autorisé');
      router.push('/');
      return;
    }

    loadDashboardData(token);
    loadNotifications(token);

    // Rafraîchir les notifications toutes les 10 secondes
    const interval = setInterval(() => {
      loadNotifications(token);
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const loadDashboardData = async (token: string) => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data.stats);
      setSalesData(response.data.salesByDay);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
      setLoading(false);
    }
  };

  const loadNotifications = async (token: string) => {
    try {
      const response = await axios.get('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const markAsRead = async (notificationId?: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/admin/notifications',
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadNotifications(token!);
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const COLORS = ['#d946ef', '#f97316', '#3b82f6', '#10b981', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Chargement du dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 p-6">
        <div className="mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h2>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-xl"
          >
            <FiTrendingUp />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl"
          >
            <FiUsers />
            <span>Utilisateurs</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl"
          >
            <FiShoppingBag />
            <span>Commandes</span>
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl"
          >
            <FiMessageSquare />
            <span>Messages</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <FiLogOut />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Vue d'ensemble de votre plateforme
            </p>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => markAsRead()}
              className="relative p-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <FiBell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-500">+12%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.totalUsers || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Utilisateurs total
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 text-orange-500 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-500">+23%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.totalOrders || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Commandes total
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-500 rounded-xl flex items-center justify-center">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-500">+18%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats?.totalRevenue || 0} GDS
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Revenus total
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-green-500">+8%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {salesData.length > 0 ? salesData[salesData.length - 1]?.revenue || 0 : 0} GDS
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ventes aujourd'hui
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Ventes (30 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d946ef"
                  strokeWidth={2}
                  name="Revenus (GDS)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Notifications récentes
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif._id}
                  className={`p-3 rounded-xl ${
                    notif.isRead
                      ? 'bg-gray-50 dark:bg-dark-700'
                      : 'bg-primary-50 dark:bg-primary-900/20'
                  }`}
                >
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
