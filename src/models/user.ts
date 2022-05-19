import mongoose from 'mongoose';

const { Schema } = mongoose;

export const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

export default User;
