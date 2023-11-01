import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  deliveries: Array,
});

const User = mongoose.model('User', UserSchema);
export default User;
