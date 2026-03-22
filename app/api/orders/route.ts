import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Notification from '../../../models/Notification';
import { verifyToken, extractToken } from '../../../lib/auth';

export async function POST(req: NextRequest) {
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
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const {
      productType,
      productName,
      quantity,
      price,
      paymentMethod,
      gameId,
      additionalInfo,
    } = await req.json();

    // Validation
    if (!productType || !productName || !price || !paymentMethod) {
      return NextResponse.json(
        { error: 'Informations de commande incomplètes' },
        { status: 400 }
      );
    }

    // Créer la commande
    const order = await Order.create({
      userId: payload.userId,
      productType,
      productName,
      quantity: quantity || 1,
      price,
      paymentMethod,
      gameId: gameId || '',
      additionalInfo: additionalInfo || {},
      status: 'pending',
    });

    // Créer une notification pour l'admin
    await Notification.create({
      type: 'order',
      message: `Nouvelle commande: ${productName} (${price} GDS)`,
      relatedId: order._id,
      isRead: false,
    });

    return NextResponse.json(
      {
        message: 'Commande créée avec succès',
        order: {
          id: order._id,
          productName: order.productName,
          price: order.price,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur création commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}

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
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer les commandes de l'utilisateur
    const orders = await Order.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur récupération commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
