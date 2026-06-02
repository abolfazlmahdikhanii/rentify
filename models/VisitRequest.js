import mongoose from "mongoose";

const VisitRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visitDate: Date,

    visitTime: String,

    message: String,

    phone: String,

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "done",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
VisitRequestSchema.virtual("property", {
  ref: "Property",
  localField: "propertyId",
  foreignField: "_id",
  justOne: true,
});

VisitRequestSchema.virtual("requester", {
  ref: "User",
  localField: "requesterId",
  foreignField: "_id",
  justOne: true,
});

VisitRequestSchema.virtual("owner", {
  ref: "User",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true,
});
export default mongoose.models.VisitRequest ||
  mongoose.model("VisitRequest", VisitRequestSchema);