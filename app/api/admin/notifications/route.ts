import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Notification from '../../../../models/Notification';
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

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ isRead: false });

    return NextResponse.json(
      {
        notifications,
        unreadCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur récupération notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const { notificationId } = await req.json();

    if (notificationId) {
      // Marquer une notification spécifique comme lue
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    } else {
      // Marquer toutes les notifications comme lues
      await Notification.updateMany({ isRead: false }, { isRead: true });
    }

    return NextResponse.json(
      { message: 'Notification(s) marquée(s) comme lue(s)' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur mise à jour notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des notifications' },
      { status: 500 }
    );
  }
}
