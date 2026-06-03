import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Favorite from "@/models/Favorite";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    const user = await userVerify(req, res);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const visits = await VisitRequest.find({
      requesterId: user._id,
    })
      .populate({
        path: "propertyId",
        populate: [
          {
            path: "owner",
            select: "name lastName agencyName avatar",
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
      .sort({ visitDate: -1 })
      .lean({ virtuals: true });
    const favs = user._id
      ? await Favorite.find({ userId: user._id }).select("propertyId").lean()
      : [];

    const favSet = new Set(favs.map((f) => f.propertyId.toString()));
    const data = visits.map((visit) => ({
      ...visit,
      propertyId: {
        ...visit.propertyId,
        is_favorite: favSet.has(visit.propertyId?._id?.toString()),
      },
    }));
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET_VISITS_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
