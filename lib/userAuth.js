import connectToDB from "@/configs/db";
import { verifyToken } from "./auth";
import User from "@/models/User";

export const userVerify = async (req, res) => {
  try {
    await connectToDB();
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const user = await User.findOne({ email: validToken.email },"-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }
    return user;
  } catch (error) {
    console.error("User verification error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during user verification",
    });
  }
};
