import connectToDB from "@/configs/db";
import VisitRequest from "@/models/VisitRequest";
import Property from "@/models/Property";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const { propertyId } = req.query;

  const property =
    await Property.findById(propertyId);

  if (
    !property ||
    property.ownerId.toString() !==
      req.user.id
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  const visits =
    await VisitRequest.find({
      propertyId,
    })
      .populate(
        "userId",
        "name lastName phone email"
      )
      .sort({
        visitDate: -1,
      });

  return res.json(visits);
}