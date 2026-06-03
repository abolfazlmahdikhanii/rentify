import connectToDB from "@/configs/db";

import Property from "@/models/Property";
import { userVerify } from "@/lib/userAuth";
import { isValidObjectId } from "mongoose";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { propertyId, visitDate, visitTime, message } = req.body;
    const user = await userVerify(req, res);
    if (!user) return res.status(404).json({ message: "User not found!" });
    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }
    const property = await Property.findById(propertyId).populate("owner","_id");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    const visit = await VisitRequest.create({
      requesterId: user._id,
      propertyId,
      ownerId: property.owner._id,
      visitDate,
      visitTime,
      message,
    });

    return res.status(201).json({
      visitId: visit._id,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Failed to create visit request",
    });
  }
}
