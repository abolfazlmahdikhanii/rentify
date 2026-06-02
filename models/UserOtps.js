import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    blockedUntil: {
      type: Date,
      default: null,
    },

    expireTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OtpSchema.index(
  {
    expireTime: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);
export default mongoose.models.Otp ||
  mongoose.model("Otp", OtpSchema);