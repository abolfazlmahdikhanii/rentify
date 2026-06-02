import connectToDB from "@/configs/db";
import {
  verifyRefreshToken,
  generateToken,
  generateRefreshToken,
} from "@/lib/auth";
import User from "@/models/User";
import { serialize } from "cookie";
import refreshTokenModel from "@/models/RefreshToken";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  await connectToDB();

  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await refreshTokenModel.findOne({
      email: decoded.email,
      token: refreshToken,
    });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Check if token is expired
    if (new Date() > new Date(storedToken.expiresAt)) {
      await refreshTokenModel.deleteOne({ token: refreshToken });
      return res.status(403).json({ message: "Refresh token expired" });
    }

    // Verify user still exists
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      await refreshTokenModel.deleteOne({ token: refreshToken });
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new tokens
    const newAccessToken = generateToken({ email: user.email });
    const newRefreshToken = generateRefreshToken({ email: user.email });

    // Delete old refresh token and save new one
    await refreshTokenModel.deleteOne({ token: refreshToken });
    await refreshTokenModel.create({
      email: user.email,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set new cookies
    res
      .setHeader("Set-Cookie", [
        serialize("token", newAccessToken, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60, // 1 hour
        
        }),
        serialize("refreshToken", newRefreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
         
        }),
      ])
      .status(200)
      .json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export default handler;
