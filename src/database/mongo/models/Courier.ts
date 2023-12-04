import mongoose, { Schema } from 'mongoose';

export const CourierSchema = new Schema({
  _id: String,
  user_id: String,
  firstName: String,
  lastName: String,
  latitude: Number,
  longitude: Number,
  status: String,
  deliveries: Array,
});

const Courier = mongoose.model('Courier', CourierSchema);
export default Courier;
