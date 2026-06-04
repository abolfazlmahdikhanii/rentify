import connectToDB from "@/configs/db";
import VisitRequest from "@/models/VisitRequest";
import Property from "@/models/Property";
import { userVerify } from "@/lib/userAuth";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { propertyId } = req.query;

    const property = await Property.findById(propertyId);

    if (!property || property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const visits = await VisitRequest.find({
      propertyId,
    })
      .populate("userId", "name lastName phone email")
      .sort({
        visitDate: -1,
      });

    return res.json(visits);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update visit request",
    });
  }
}
