import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method !== "GET") {
      return res.status(405).end();
    }
    const user = await userVerify(req, res);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found!",
      });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const visits = await VisitRequest.find({})
      .populate("requesterId","-password -__v")
      .populate({
        path: "propertyId",
        populate: [
          {
            path: "owner",
            select: "name lastName agencyName avatar email",
          },
          {
            path: "images",
          },
          {
            path: "location",
          },
          {
            path: "details",
          },
          {
            path: "equipments",
            populate: {
              path: "equipmentId",
            },
          },
        ],
      })
      .sort({
        visitDate: -1,
      });

    return res.json({ visits });
  } catch (error) {
    console.error("Error fetching visits:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
