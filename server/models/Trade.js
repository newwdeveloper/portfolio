import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ticker: { type: String, required: true },
  shares: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;
