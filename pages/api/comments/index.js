import connectToDB from "@/configs/db";
import Property from "@/models/Property";
import Comment from "@/models/Comment";
import { userVerify } from "@/lib/userAuth";
import { isValidObjectId } from "mongoose";

export const createComment = async (req, res) => {
  await connectToDB();

  try {
    const { propertyId, content } = req.body;
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ message: "invalid property id!" });
    }
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }
    if (!content.trim()) {
      return res.status(402).json({ message: "please fill the field!" });
    }
    const comment = await Comment.create({
      propertyId,
      userId: user._id,
      content,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      commentId: comment._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getPropertyComments = async (req, res) => {
  await connectToDB();

  try {
    const user = await userVerify(req, res);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied!" });
    }

    const comments = await Comment.find({})
      .populate("userId", "name lastName avatar role agencyName")
      .populate({
        path: "propertyId",
        select: " title",
      })
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "name lastName avatar role agencyName",
        },
      })
      .sort({ createdAt: 1 });

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    return createComment(req, res);
  }

  if (req.method === "GET") {
    return getPropertyComments(req, res);
  }

  return res.status(405).end();
}
