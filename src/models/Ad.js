import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdSchema = new Schema({
  name: String,
});

const Ad = mongoose.model("ads", AdSchema);
export default Ad;
