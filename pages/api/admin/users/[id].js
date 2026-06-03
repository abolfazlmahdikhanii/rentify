import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import User from "@/models/User";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  await connectToDB();
  try {
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.query;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid property ID",
      });
    }
    if (req.method === "PATCH") {
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(id, { role }, { new: true });

      return res.json({
        success: true,
        user,
      });
    }

    if (req.method === "DELETE") {
      await User.findByIdAndDelete(id);

      return res.json({
        success: true,
      });
    }

    return res.status(405).end();
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
