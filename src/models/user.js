import mongoose from "mongoose";
const extendSchema = require("mongoose-extend-schema");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  thumbnail: String,
  password: { type: String, required: true },
});

const ProtectoraSchema = extendSchema(UserSchema, {
  web: String,
});

const ProfesionalSchema = extendSchema(UserSchema, {
  web: String,
});

const ParticularSchema = extendSchema(UserSchema, {});

export const Protectora = mongoose.model("protectoras", ProtectoraSchema);

export const Profesional = mongoose.model("profesionales", ProfesionalSchema);

export const Particular = mongoose.model("particulares", ParticularSchema);
