import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  productType: 'netflix' | 'freefire_diamonds' | 'freefire_subscription' | 'recharge';
  productName: string;
  quantity: number;
  price: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  paymentMethod: 'moncash' | 'natcash';
  paymentScreenshot: string;
  gameId: string;
  additionalInfo: any;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productType: { type: String, enum: ['netflix', 'freefire_diamonds', 'freefire_subscription', 'recharge'], required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  currency: { type: String, default: 'GDS' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['moncash', 'natcash'], required: true },
  paymentScreenshot: { type: String, default: '' },
  gameId: { type: String, default: '' },
  additionalInfo: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order: Model<IOrder> = (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
