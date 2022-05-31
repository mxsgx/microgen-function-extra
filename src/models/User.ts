import mongoose, { Document } from 'mongoose';

const { Schema } = mongoose;

export type UserDocument = User & Document;

export const UserSchema = new Schema<UserDocument>({
  firstName: String,
  lastName: {
    type: String,
    default: '',
  },
  email: String,
  emailVerifiedAt: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    select: false,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
