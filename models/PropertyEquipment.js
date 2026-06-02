import mongoose from "mongoose";

const PropertyEquipmentSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      index: true,
    },

    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

PropertyEquipmentSchema.index(
  {
    propertyId: 1,
    equipmentId: 1,
  },
  {
    unique: true,
  }
);
PropertyEquipmentSchema.virtual("equipment", {
  ref: "Equipment",
  localField: "equipmentId",
  foreignField: "_id",
  justOne: true,
});

PropertyEquipmentSchema.virtual("property", {
  ref: "Property",
  localField: "propertyId",
  foreignField: "_id",
  justOne: true,
});
export default mongoose.models.PropertyEquipment ||
  mongoose.model("PropertyEquipment", PropertyEquipmentSchema);