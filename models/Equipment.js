// models/Equipment.js

import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Equipment ||
  mongoose.model("Equipment", equipmentSchema);