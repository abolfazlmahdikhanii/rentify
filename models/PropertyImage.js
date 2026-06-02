import mongoose from "mongoose";
import Property from "./Property";
const PropertyImageSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    imageUrl: String,

    storjKey: String,

    isMain: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
PropertyImageSchema.index({
  propertyId: 1,
  type: 1,
});
PropertyImageSchema.virtual("property", {
  ref: "Property",
  localField: "propertyId",
  foreignField: "_id",
  justOne: true,
});
export default mongoose.models.PropertyImage ||
  mongoose.model("PropertyImage", PropertyImageSchema);
