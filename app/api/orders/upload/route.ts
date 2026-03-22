import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { verifyToken, extractToken } from '../../../../lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

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

    const formData = await req.formData();
    const orderId = formData.get('orderId') as string;
    const file = formData.get('screenshot') as File;

    if (!orderId || !file) {
      return NextResponse.json(
        { error: 'ID de commande et fichier requis' },
        { status: 400 }
      );
    }

    // Vérifier que la commande appartient à l'utilisateur
    const order = await Order.findOne({
      _id: orderId,
      userId: payload.userId,
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique
    const fileName = `payment-${orderId}-${Date.now()}.${file.name.split('.').pop()}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // Sauvegarder le fichier
    await writeFile(uploadPath, buffer);

    // Mettre à jour la commande avec le chemin du screenshot
    order.paymentScreenshot = `/uploads/${fileName}`;
    order.status = 'processing';
    await order.save();

    return NextResponse.json(
      {
        message: 'Screenshot uploadé avec succès',
        screenshotPath: `/uploads/${fileName}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur upload screenshot:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du screenshot' },
      { status: 500 }
    );
  }
}
