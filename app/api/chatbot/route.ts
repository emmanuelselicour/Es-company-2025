import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import ChatMessage from '../../../models/ChatMessage';
import Notification from '../../../models/Notification';
import { verifyToken, extractToken } from '../../../lib/auth';

// Réponses prédéfinies du chatbot
const chatbotResponses: { [key: string]: string } = {
  paiement: "Vous pouvez payer via MONCASH (+509 43434399) ou NATCASH (+55550000). Après le paiement, n'oubliez pas de télécharger une capture d'écran pour confirmer votre transaction.",
  
  payment: "You can pay via MONCASH (+509 43434399) or NATCASH (+55550000). After payment, don't forget to upload a screenshot to confirm your transaction.",
  
  netflix: "Netflix est disponible à 500 GDS pour 1 mois ou 1250 GDS pour 3 mois. Choisissez votre formule dans la boutique!",
  
  "free fire": "Pour acheter des diamants Free Fire, sélectionnez la quantité souhaitée dans la boutique, entrez votre ID de jeu, puis procédez au paiement.",
  
  diamants: "Nos packs de diamants Free Fire commencent à 180 GDS pour 100+10 diamants. Consultez la boutique pour voir tous les packs disponibles!",
  
  diamonds: "Our Free Fire diamond packs start at 180 GDS for 100+10 diamonds. Check the shop to see all available packs!",
  
  contact: "Vous pouvez nous contacter via le formulaire de contact sur notre site ou directement par WhatsApp. Notre équipe vous répondra dans les plus brefs délais.",
  
  support: "Notre équipe de support est là pour vous aider! Utilisez le formulaire de contact ou envoyez-nous un message WhatsApp.",
  
  prix: "Nos prix sont compétitifs! Netflix: 500-1250 GDS, Free Fire: à partir de 180 GDS. Consultez la boutique pour tous les détails.",
  
  price: "Our prices are competitive! Netflix: 500-1250 GDS, Free Fire: from 180 GDS. Check the shop for all details.",
  
  commande: "Pour passer commande, parcourez notre boutique, sélectionnez vos produits, puis procédez au paiement. Vous recevrez une confirmation par email.",
  
  order: "To place an order, browse our shop, select your products, then proceed to payment. You'll receive a confirmation by email.",
};

function findResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, response] of Object.entries(chatbotResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  return null;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message et sessionId requis' },
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

    // Chercher une réponse automatique
    const autoResponse = findResponse(message);

    if (autoResponse) {
      // Sauvegarder le message avec réponse auto
      const chatMessage = await ChatMessage.create({
        userId,
        sessionId,
        message,
        response: autoResponse,
        isAutoResponse: true,
      });

      return NextResponse.json(
        {
          response: autoResponse,
          isAutoResponse: true,
        },
        { status: 200 }
      );
    } else {
      // Aucune réponse automatique trouvée
      const chatMessage = await ChatMessage.create({
        userId,
        sessionId,
        message,
        response: "Merci pour votre message. Un agent va vous répondre bientôt. Nous traitons généralement les demandes dans les 24 heures.",
        isAutoResponse: false,
      });

      // Créer une notification pour l'admin
      await Notification.create({
        type: 'chatbot',
        message: `Nouveau message chatbot sans réponse auto: ${message.substring(0, 50)}...`,
        relatedId: chatMessage._id,
        isRead: false,
      });

      return NextResponse.json(
        {
          response: "Merci pour votre message. Un agent va vous répondre bientôt. Nous traitons généralement les demandes dans les 24 heures.",
          isAutoResponse: false,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Erreur chatbot:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    );
  }
}

// Récupérer l'historique du chat (pour l'admin)
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

    const messages = await ChatMessage.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur récupération chat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}
