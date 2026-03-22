import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  type: 'user' | 'order' | 'message' | 'chatbot';
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  type: {
    type: String,
    enum: ['user', 'order', 'message', 'chatbot'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification: Model<INotification> = 
  (mongoose.models.Notification as Model<INotification>) || 
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
