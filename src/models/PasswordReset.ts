import crypto from 'crypto';
import mongoose, { Document } from 'mongoose';

const { Schema } = mongoose;

export type PasswordResetDocument = PasswordReset & Document;

export const PasswordResetSchema = new Schema<PasswordResetDocument>({
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
  hash: {
    type: String,
  },
});

const PasswordReset = mongoose.model('PasswordReset', PasswordResetSchema);

export default PasswordReset;
