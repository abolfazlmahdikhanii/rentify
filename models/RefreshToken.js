const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Auto-delete expired tokens
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const refreshTokenModel =
  mongoose.models.RefreshToken || mongoose.model("RefreshToken", schema);

export default refreshTokenModel;
