import connectToDB from "@/configs/db";
import Property from "@/models/Property";
import Comment from "@/models/Comment";
import { userVerify } from "@/lib/userAuth";

export const createComment = async (req, res) => {
  await connectToDB();

  try {
    const { propertyId, content } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const comment = await Comment.create({
      propertyId,
      userId: req.user.id,
      content,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      commentId: comment._id,
    });
  } catch (error) {
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
      return res.status(404).json({ message: "User Not Found!" });
    }
    if(!user.role==="admin"){
      return res.status(403).json({ message: "Access Denied!" });
    }
    const comments = await Comment.find({})
      .populate("user", "name lastName avatar role")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name lastName avatar role",
        },
      })
      .sort({
        createdAt: 1,
      });

    return res.json({comments});
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
