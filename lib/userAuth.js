import connectToDB from "@/configs/db";
import { verifyToken } from "./auth";
import User from "@/models/User";

export const userVerify = async (req, res = null) => {
  try {
    await connectToDB();

    const { token } = req.cookies || {};

    if (!token) {
      if (res?.json) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      return null;
    }

    const validToken = verifyToken(token);

    if (!validToken) {
      if (res?.json) {
        return res.status(401).json({
          message: "Invalid Token",
        });
      }

      return null;
    }

    const user = await User.findOne(
      { email: validToken.email },
      "-password -__v"
    );

    if (!user) {
      if (res?.json) {
        return res.status(404).json({
          message: "User Not Found!",
        });
      }

      return null;
    }

    return user;
  } catch (error) {
    console.error("User verification error:", error);

    if (res?.json) {
      return res.status(500).json({
        success: false,
        message: "An error occurred during user verification",
      });
    }

    return null;
  }
};