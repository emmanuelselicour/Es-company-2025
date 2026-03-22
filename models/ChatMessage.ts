import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  message: string;
  response: string;
  isAutoResponse: boolean;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, default: '' },
  isAutoResponse: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatMessage: Model<IChatMessage> = (mongoose.models.ChatMessage as Model<IChatMessage>) || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
export default ChatMessage;
