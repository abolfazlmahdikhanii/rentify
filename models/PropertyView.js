import mongoose from "mongoose";

const PropertyViewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    ipAddress: String,

    userAgent: String,
  },
  {
    timestamps: true,
  }
);

PropertyViewSchema.index({
  propertyId: 1,
  createdAt: -1,
});

export default mongoose.models.PropertyView ||
  mongoose.model("PropertyView", PropertyViewSchema);