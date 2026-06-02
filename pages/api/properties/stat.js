import connectToDB from "@/configs/db";

import Property from "@/models/Property";
import PropertyView from "@/models/PropertyView";
import Favorite from "@/models/Favorite";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const userId = req.user.id;

    const userProperties = await Property.find({
      ownerId: userId,
    }).select("_id status");

    const propertyIds = userProperties.map((item) => item._id);

    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,

      totalViews,

      totalFavorites,

      totalVisitRequests,

      pendingVisits,

      approvedVisits,

      rejectedVisits,
    ] = await Promise.all([
      Property.countDocuments({
        ownerId: userId,
      }),

      Property.countDocuments({
        ownerId: userId,
        status: "approved",
      }),

      Property.countDocuments({
        ownerId: userId,
        status: "pending",
      }),

      Property.countDocuments({
        ownerId: userId,
        status: "rejected",
      }),

      PropertyView.countDocuments({
        propertyId: {
          $in: propertyIds,
        },
      }),

      Favorite.countDocuments({
        propertyId: {
          $in: propertyIds,
        },
      }),

      VisitRequest.countDocuments({
        propertyId: {
          $in: propertyIds,
        },
      }),

      VisitRequest.countDocuments({
        propertyId: {
          $in: propertyIds,
        },
        status: "pending",
      }),

      VisitRequest.countDocuments({
        propertyId: {
          $in: propertyIds,
        },
        status: "approved",
      }),

      VisitRequest.countDocuments({
        propertyId: {
          $in: propertyIds,
        },
        status: "rejected",
      }),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        properties: {
          total: totalProperties,
          approved: approvedProperties,
          pending: pendingProperties,
          rejected: rejectedProperties,
        },

        visits: {
          total: totalVisitRequests,
          pending: pendingVisits,
          approved: approvedVisits,
          rejected: rejectedVisits,
        },

        favorites: totalFavorites,

        views: totalViews,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
