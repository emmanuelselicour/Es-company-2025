import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: mongoose.Types.ObjectId;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: [true, 'Le nom est requis'], trim: true },
  email: { type: String, required: [true, "L'email est requis"], trim: true },
  subject: { type: String, required: [true, 'Le sujet est requis'], trim: true },
  message: { type: String, required: [true, 'Le message est requis'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

const Contact: Model<IContact> = (mongoose.models.Contact as Model<IContact>) || mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;
