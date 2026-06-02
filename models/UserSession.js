import mongoose from "mongoose";

const UserSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
    },

    device: String,

    ipAddress: String,

    lastActivityAt: Date,

    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

UserSessionSchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.models.UserSession ||
  mongoose.model("UserSession", UserSessionSchema);