import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      default: null,
    },

    lastName: {
      type: String,
      trim: true,
      default: null,
    },

    agencyName: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },

    password: {
      type: String,
      default: null,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "agency", "admin"],
      default: "user",
      index: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    job: {
      type: String,
      trim: true,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },

    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
        delete ret.password;

        return ret;
      },
    },
  },
);
UserSchema.virtual("fullName").get(function () {
  return [this.name, this.lastName].filter(Boolean).join(" ");
});
UserSchema.virtual("properties", {
  ref: "Property",
  localField: "_id",
  foreignField: "ownerId",
});

UserSchema.virtual("favorites", {
  ref: "Favorite",
  localField: "_id",
  foreignField: "userId",
});

UserSchema.virtual("visitRequests", {
  ref: "VisitRequest",
  localField: "_id",
  foreignField: "userId",
});
export default mongoose.models.User || mongoose.model("User", UserSchema);
