import mongoose from "mongoose";
import Property from "./Property";
const PropertyDetailsSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      unique: true,
      required: true,
      index: true,
    },

    buildingArea: Number,

    landArea: Number,

    bedrooms: Number,

    bathrooms: Number,

    parking: Boolean,

    storage: Boolean,

    elevator: Boolean,

    floor: Number,

    totalFloors: Number,

    houseYear: Number,

    description: String,
    unitType: String,
    position: String,
    unitPerFloor: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.PropertyDetail ||
  mongoose.model("PropertyDetail", PropertyDetailsSchema);
