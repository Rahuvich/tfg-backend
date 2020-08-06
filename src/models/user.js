import mongoose from "mongoose";
const extendSchema = require("mongoose-extend-schema");

const Schema = mongoose.Schema;

const SavedAdsSchema = new Schema({
  ad: {
    type: Schema.Types.ObjectId,
    refPath: "adFromModel",
    required: true,
  },
  adFromModel: {
    type: String,
    required: true,
    enum: ["animalAd", "productAd", "serviceAd"],
  },
  user: {
    type: Schema.Types.ObjectId,
    refPath: "userFromModel",
    required: true,
  },
  userFromModel: {
    type: String,
    required: true,
    enum: ["profesional", "particular", "protectora"],
  },
});

SavedAdsSchema.index({ user: 1, ad: 1 }, { unique: true });
export const SavedAds = mongoose.model("savedAds", SavedAdsSchema);

const ValuationsSchema = new Schema(
  {
    value: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true, trim: true },
    author: {
      type: Schema.Types.ObjectId,
      refPath: "valuations.fromModel",
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
    thumbnail: { type: String, trim: true },
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
