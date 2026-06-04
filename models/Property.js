import mongoose from "mongoose";
import PropertyImage from "./PropertyImage";
import PropertyDetails from "./PropertyDetail";
import PropertyLocation from "./PropertyLocation";
import PropertyEquipment from "./PropertyEquipment";
import Comment from "./Comment";
import Favorite from "./Favorite";
import PropertyView from "./PropertyView";
import User from "./User";
import Equipment from "./Equipment";
import VisitRequest from "./VisitRequest";
const PropertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    propertyType: {
      type: String,
      enum: ["apartment", "villa", "house", "land", "office", "shop"],
    },

    listingType: {
      type: String,
      enum: ["sale", "rent", "mortgage"],
      required: true,
    },

    price: Number,

    rentPrice: Number,

    mortgagePrice: Number,
    rejectionReason: String,
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected", "deleted"],
      default: "pending",
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PropertySchema.virtual("owner", {
  ref: "User",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true,
});

PropertySchema.virtual("images", {
  ref: "PropertyImage",
  localField: "_id",
  foreignField: "propertyId",
});

PropertySchema.virtual("details", {
  ref: "PropertyDetail",
  localField: "_id",
  foreignField: "propertyId",
  justOne: true,
});

PropertySchema.virtual("visits", {
  ref: "VisitRequest",
  localField: "_id",
  foreignField: "propertyId",
});
PropertySchema.virtual("location", {
  ref: "PropertyLocation",
  localField: "_id",
  foreignField: "propertyId",
  justOne: true,
});

PropertySchema.virtual("equipments", {
  ref: "PropertyEquipment",
  localField: "_id",
  foreignField: "propertyId",
});

PropertySchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "propertyId",
  match: { status: "approved" },
});

PropertySchema.virtual("favorites", {
  ref: "Favorite",
  localField: "_id",
  foreignField: "propertyId",
});

PropertySchema.virtual("views", {
  ref: "PropertyView",
  localField: "_id",
  foreignField: "propertyId",
});

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);
