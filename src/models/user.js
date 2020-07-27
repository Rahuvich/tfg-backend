import mongoose from "mongoose";
const extendSchema = require("mongoose-extend-schema");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    thumbnail: String,
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ProtectoraSchema = extendSchema(
  UserSchema,
  {
    web: String,
  },
  {
    timestamps: true,
  }
);

const ProfesionalSchema = extendSchema(
  UserSchema,
  {
    web: String,
  },
  {
    timestamps: true,
  }
);

const ParticularSchema = extendSchema(
  UserSchema,
  {},
  {
    timestamps: true,
  }
);

export const Protectora = mongoose.model("protectora", ProtectoraSchema);

export const Profesional = mongoose.model("profesional", ProfesionalSchema);

export const Particular = mongoose.model("particular", ParticularSchema);
