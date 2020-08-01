import mongoose from "mongoose";
const extendSchema = require("mongoose-extend-schema");

const Schema = mongoose.Schema;

const ValuationsSchema = new Schema(
  {
    value: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true, trim: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "fromModel",
      required: true,
    },
    fromModel: {
      type: String,
      required: true,
      enum: ["profesional", "particular", "protectora"],
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: Number, required: true },
    thumbnail: String,
    password: { type: String, required: true },
    valuations: [ValuationsSchema],
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
