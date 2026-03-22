import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { verifyToken, extractToken } from '../../../../lib/auth';

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Vérifier l'authentification
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

    const { address, whatsapp } = await req.json();

    // Validation
    if (!address || !whatsapp) {
      return NextResponse.json(
        { error: 'Adresse et WhatsApp sont requis' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        address,
        whatsapp,
        profileCompleted: true,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      whatsapp: user.whatsapp,
      profileCompleted: user.profileCompleted,
      role: user.role,
    };

    return NextResponse.json(
      {
        message: 'Profil mis à jour avec succès',
        user: userData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur mise à jour profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
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

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur récupération profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}
