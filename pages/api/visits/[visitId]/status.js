import connectToDB from "@/configs/db";

import VisitRequest from "@/models/VisitRequest";
import Property from "@/models/Property";
import { userVerify } from "@/lib/userAuth";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "PATCH") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { visitId } = req.query;
    const { status } = req.body;
    const user = await userVerify(req, res);
    if (user) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const visit = await VisitRequest.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit request not found",
      });
    }
    const isAdmin = user.role === "admin";
    // If not admin, check property ownership

    if (!isAdmin) {
      const property = await Property.findById(visit.propertyId);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      if (property.ownerId.toString() !== user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }
    visit.status = status;
    await visit.save();

    return res.status(200).json({
      success: true,
      message: "Visit request status updated",
      visit,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update visit request",
    });
  }
}
