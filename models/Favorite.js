import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

FavoriteSchema.index(
  {
    userId: 1,
    propertyId: 1,
  },
  {
    unique: true,
  }
);
FavoriteSchema.virtual("property", {
  ref: "Property",
  localField: "propertyId",
  foreignField: "_id",
  justOne: true,
});

FavoriteSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});
export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);