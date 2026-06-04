import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Comment from "@/models/Comment";
import { isValidObjectId } from "mongoose";

export const createReply = async (req, res) => {
  await connectToDB();

  try {
    const { commentId } = req.query;
    const { content } = req.body;
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    if (!isValidObjectId(commentId)) {
      return res.status(400).json({ message: "invalid comment id!" });
    }
    if (!content.trim()) {
      return res.status(402).json({ message: "please fill the field!" });
    }
    const parentComment = await Comment.findById(commentId);

    if (!parentComment) {
      return res.status(404).json({
        message: "Parent comment not found",
      });
    }

    const status = user.role === "admin" ? "approved" : "pending";
    await Comment.findOneAndUpdate({ _id: commentId }, { status });
    const reply = await Comment.create({
      propertyId: parentComment.propertyId,
      parentId: commentId,
      userId: user._id,
      content,
      status,
    });

    return res.status(201).json({
      success: true,
      replyId: reply._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
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
    if (!isValidObjectId(commentId)) {
      return res.status(400).json({ message: "invalid comment id!" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.userId.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Comment.deleteMany({
      $or: [{ _id: commentId }, { parentId: commentId }],
    });

    return res.json({
      success: true,
      message: "Comment and replies deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    return createReply(req, res);
  }

  if (req.method === "DELETE") {
    return deleteComment(req, res);
  }

  return res.status(405).end();
}
