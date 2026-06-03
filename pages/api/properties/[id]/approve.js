import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Property from "@/models/Property";
import { isValidObjectId } from "mongoose";
export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  await connectToDB();
  try {
    const user = await userVerify(req, res);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid property ID",
      });
    }
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    property.status = "published";

    await property.save();

    return res.status(200).json({
      message: "Property approved successfully",
      propertyId: id,
    });
  } catch (error) {
    console.error("APPROVE_PROPERTY_ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
