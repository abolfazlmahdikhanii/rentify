import connectToDB from "@/configs/db";
import VisitRequest from "@/models/VisitRequest";
import Property from "@/models/Property";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const {
      propertyId,
      visitDate,
      visitTime,
      message,
    } = req.body;

    const property =
      await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const visit =
      await VisitRequest.create({
        userId: req.user.id,
        propertyId,
        visitDate,
        visitTime,
        message,
      });

    return res.status(201).json({
      visitId: visit._id,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to create visit request",
    });
  }
}