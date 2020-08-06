import mongoose from "mongoose";
const extendSchema = require("mongoose-extend-schema");

const Schema = mongoose.Schema;

const AdSchema = new Schema(
  {
    tags: { type: [String], required: true, index: true },
    photos: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const AnimalAdSchema = extendSchema(
  AdSchema,
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    activityLevel: {
      type: String,
      required: true,
      enum: ["HIGH", "MEDIUM", "LOW"],
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    male: {
      type: Boolean,
      required: true,
    },
    adoptionTax: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    personality: {
      type: [String],
      required: true,
      trim: true,
    },
    mustKnow: {
      type: String,
      trim: true,
    },
    deliveryInfo: {
      type: [String],
      required: true,
      enum: [
        "VACCINATED",
        "DEWORMED",
        "HEALTHY",
        "STERILIZED",
        "IDENTIFIED",
        "MICROCHIP",
      ],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      refPath: "fromModel",
      required: true,
      index: true,
    },
    fromModel: {
      type: String,
      required: true,
      enum: ["protectora", "particular"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "DOG",
        "CAT",
        "BIRD",
        "FISH",
        "REPTILE",
        "BUNNY",
        "RODENT",
        "OTHER",
      ],
      trim: true,
      index: true,
    },
    size: {
      type: String,
      enum: ["BIG", "MEDIUM", "SMALL"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductAdSchema = extendSchema(
  AdSchema,
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "profesional",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceAdSchema = extendSchema(
  AdSchema,
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priceHour: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      refPath: "fromModel",
      required: true,
      index: true,
    },
    fromModel: {
      type: String,
      required: true,
      enum: ["profesional", "particular"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AnimalAd = mongoose.model("animalAd", AnimalAdSchema);

export const ProductAd = mongoose.model("productAd", ProductAdSchema);

export const ServiceAd = mongoose.model("serviceAd", ServiceAdSchema);
