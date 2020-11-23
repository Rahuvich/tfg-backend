import mongoose from "mongoose";


const Schema = mongoose.Schema;

const InfoAppSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    msg: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
  }
);



export const InfoApp = mongoose.model("infoapp", InfoAppSchema);

