import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  whatsapp: string;
  profileCompleted: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: [true, 'Le prénom est requis'], trim: true },
  lastName: { type: String, required: [true, 'Le nom est requis'], trim: true },
  email: { type: String, required: [true, "L'email est requis"], unique: true, lowercase: true, trim: true },
  phone: { type: String, required: [true, 'Le numéro de téléphone est requis'] },
  password: { type: String, required: [true, 'Le mot de passe est requis'], minlength: 6 },
  address: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  profileCompleted: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default User;
