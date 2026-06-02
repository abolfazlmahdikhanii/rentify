import connectToDB from "@/configs/db";
import Property from "@/models/Property";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const { id } = req.query;
  const { reason } = req.body;

  const property =
    await Property.findById(id);

  if (!property) {
    return res.status(404).json({
      message: "Property not found",
    });
  }

  property.status = "rejected";
  property.rejectionReason = reason;

  await property.save();

  res.json({
    message:
      "Property rejected successfully",
    propertyId: id,
  });
}