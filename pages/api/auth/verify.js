import connectToDB from "@/configs/db";
const crypto = require("crypto");
import { generateRefreshToken, generateToken, splitMail } from "@/lib/auth";
import UserOtps from "@/models/UserOtps";
import { authSchema } from "@/validations/auth";
import { serialize } from "cookie";
import { z } from "zod";
import User from "@/models/User";
import refreshTokenModel from "@/models/RefreshToken";

const saveNewUser = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (user) {
      return {
        success: true,
        isNew: false,
        user,
      };
    }

    const usersCount = await User.countDocuments();

    const newUser = await User.create({
      email,

      name: email.split("@")[0],

      role: usersCount === 0 ? "admin" : "user",

      verified: true,
    });

    return {
      success: true,
      isNew: true,
      user: newUser,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      isNew: false,
    };
  }
};
const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  await connectToDB();
  try {
    const { email, otp } = req.body;
    const validEmail = authSchema.parse({ email: email });
    // check otp filed has fill
    if (!otp) return res.status(400).json({ message: "invalid otp!" });
    // check otp is verify
    const userOtp = await UserOtps.findOne({ email: `${validEmail.email}` });

    if (!userOtp) {
      return res.status(404).json({ message: "not found otp for this email!" });
    }
    // Check if OTP is expired
    if (UserOtps.expireTime && new Date() > new Date(UserOtps.expireTime)) {
      await UserOtps.findOneAndDelete({ email: validEmail.email });
      return res.status(410).json({ message: "OTP has expired" });
    }

    if (UserOtps.blockedUntil !== null) {
      if (new Date(UserOtps.blockedUntil) > new Date()) {
        return res.status(429).json({
          message: "max used otp disable for min",
        });
      } else if (new Date(UserOtps.blockedUntil) <= new Date()) {
        await UserOtps.findOneAndDelete({ email: validEmail.email });
        return res.status(410).json({ message: "OTP has expired" });
      }
    }
    if (UserOtps.attempts >= 3) {
      await UserOtps.findOneAndUpdate(
        { email: validEmail.email },
        {
          blockedUntil: new Date(Date.now() + 1 * 60 * 1000),
        },
      );

      return res.status(429).json({ message: "max used otp disable for min!" });
    }
    const otpVerify = await UserOtps.findOne({
      email: validEmail.email,
      otp: Number(otp),
    });
    if (!otpVerify) {
      await UserOtps.findOneAndUpdate(
        { email: validEmail.email },
        {
          $inc: { attempts: 1 },
        },
      );
      return res.status(401).json({ message: "invalid otp!" });
    }

    const userResult = await saveNewUser(validEmail.email);

    if (!userResult.success) {
      return res.status(405).json({
        message: "Failed to create user account",
      });
    }

    await UserOtps.findOneAndDelete({ email: validEmail.email });
    const token = generateToken({ email: validEmail.email });
    const refreshToken = generateRefreshToken({ email: validEmail.email });
    const users = await User.countDocuments({});
    // Delete old refresh tokens for this user
    await refreshTokenModel.deleteMany({ email: validEmail.email });

    // Save new refresh token to database
    await refreshTokenModel.create({
      email: validEmail.email,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res
      .setHeader("Set-Cookie", [
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24,
        }),
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }),
      ])
      .status(200)
      .json({
        success: true,
        message: "ورود موفقیت‌آمیز بود",
        needsProfileSetup:
          userResult.isNew && (!userResult.user?.name || !userResult.user?.last_name),
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
