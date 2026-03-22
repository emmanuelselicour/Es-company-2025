import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import Notification from '../../../models/Notification';
import { verifyToken, extractToken } from '../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur est connecté
    const token = extractToken(req.headers.get('authorization'));
    let userId = null;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    // Créer le message de contact
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      userId,
      status: 'new',
    });

    // Créer une notification pour l'admin
    await Notification.create({
      type: 'message',
      message: `Nouveau message de contact: ${subject}`,
      relatedId: contact._id,
      isRead: false,
    });

    return NextResponse.json(
      {
        message: 'Message envoyé avec succès',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur envoi contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Vérifier l'authentification admin
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

    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur récupération messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}
