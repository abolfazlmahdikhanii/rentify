import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Comment from "@/models/Comment";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }
  await connectToDB();
  try {
    const { commentId } = req.query;
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    if (!isValidObjectId(commentId)) {
      return res.status(400).json({ message: "invalid comment id!" });
    }
    await Comment.findByIdAndUpdate(commentId, {
      status: "approved",
    });

    return res.json({
      success: true,
      message: "Comment approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
