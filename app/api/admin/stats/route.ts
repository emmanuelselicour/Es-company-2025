import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import User from '../../../../models/User';
import { verifyToken, extractToken } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = extractToken(req.headers.get('authorization'));
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Statistiques générales
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const totalUsers = await User.countDocuments();

    // Ventes par jour (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ['completed', 'processing'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$price' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Produits les plus vendus
    const topProducts = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'processing'] } } },
      {
        $group: {
          _id: '$productName',
          count: { $sum: 1 },
          revenue: { $sum: '$price' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Commandes par statut
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json(
      {
        stats: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalUsers,
        },
        salesByDay,
        topProducts,
        ordersByStatus,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur récupération statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
