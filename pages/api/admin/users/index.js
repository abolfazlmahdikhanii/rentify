import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import User from "@/models/User";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const user=await userVerify(req,res)
    if (!user ||user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
