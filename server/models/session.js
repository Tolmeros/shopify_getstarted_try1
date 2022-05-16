import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  id: String,
  shop: String,
  state: String,
  isOnline: Boolean,
});

export default mongoose.model('Session', sessionSchema);
