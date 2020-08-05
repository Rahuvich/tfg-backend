import mongoose from "mongoose";
const extendSchema = require("mongoose-extend-schema");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    ad: {
      type: Schema.Types.ObjectId,
      refPath: "messages.adFromModel",
    },
    adFromModel: {
      type: String,
      enum: ["animalAd", "productAd", "serviceAd"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      refPath: "messages.fromModel",
      required: true,
    },
    fromModel: {
      type: String,
      required: true,
      enum: ["protectora", "particular", "profesional"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      refPath: "user1FromModel",
      required: true,
    },
    user1FromModel: {
      type: String,
      required: true,
      enum: ["protectora", "particular", "profesional"],
      trim: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      refPath: "user2FromModel",
      required: true,
    },
    user2FromModel: {
      type: String,
      required: true,
      enum: ["protectora", "particular", "profesional"],
      trim: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

RoomSchema.index({ user1: 1, user2: -1 }, { unique: true });
export const Message = mongoose.model("message", MessageSchema);
export const Room = mongoose.model("room", RoomSchema);
