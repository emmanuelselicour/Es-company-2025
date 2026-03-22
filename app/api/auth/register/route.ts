import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Notification from '../../../../models/Notification';
import { hashPassword, generateToken } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { firstName, lastName, email, phone, password } = await req.json();

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      profileCompleted: false,
      role: 'user',
    });

    // Créer une notification pour l'admin
    await Notification.create({
      type: 'user',
      message: `Nouvel utilisateur inscrit: ${firstName} ${lastName}`,
      relatedId: user._id,
      isRead: false,
    });

    // Générer le token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Retourner les données utilisateur
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
        message: 'Inscription réussie',
        token,
        user: userData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
