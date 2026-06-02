import mongoose from "mongoose";
import Property from "./Property";
import State from "./State";
const PropertyLocationSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      unique: true,
      required: true,
      index: true,
    },

    province: String,

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },

    district: String,
    mainArea: String,

    address: String,

    latitude: Number,

    longitude: Number,
    nearby: {
      type: {},
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

PropertyLocationSchema.virtual("property", {
  ref: "Property",
  localField: "propertyId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.models.PropertyLocation ||
  mongoose.model("PropertyLocation", PropertyLocationSchema);
