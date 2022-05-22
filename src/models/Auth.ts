import crypto from 'crypto';
import mongoose, { Document } from 'mongoose';

const { Schema } = mongoose;

export type AuthDocument = Auth & Document;

export const AuthSchema = new Schema<AuthDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: {
    type: String,
    default: function () {
      return crypto.randomBytes(16).toString('hex');
    },
  },
  expiresIn: {
    type: Date,
    required: false,
  },
});

const Auth = mongoose.model('Auth', AuthSchema);

export default Auth;
