import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import VisitRequest from "@/models/VisitRequest";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const { id } = req.query;

    const user = await userVerify(req, res);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid visit ID",
      });
    }
    const visit = await VisitRequest.findById(id);

    if (!visit) {
      return res.status(404).json({
        message: "Visit request not found",
      });
    }

    if (visit.requesterId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (visit.status !== "pending") {
      return res.status(400).json({
        message: "Cannot cancel this request",
      });
    }

    await VisitRequest.findByIdAndDelete(id);

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create visit request",
    });
  }
}
