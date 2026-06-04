import connectToDB from "@/configs/db";
import Favorite from "@/models/Favorite";
import Property from "@/models/Property";
import VisitRequest from "@/models/VisitRequest";
import { isValidObjectId } from "mongoose";

export async function getProperties(filters = {}, userId = null) {
  await connectToDB();
  try {
    const {
      page = 1,
      limit = 12,
      propertyType,
      listingType,
      city,
      minPrice,
      maxPrice,
      search,
      sort = "newest",
    } = filters;

    const filter = {};

    if (propertyType) filter.propertyType = propertyType;

    if (listingType) filter.listingType = listingType;

    // if (status) filter.status = status;

    // if (userId) filter.ownerId = userId;

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);

      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    let query = Property.find({ ...filter, status: "published" })
      .populate("owner", "-password")
      .populate("details")
      .populate({
        path: "location",
        populate: {
          path: "city",
        },
      })
      .populate("images");

    const properties = await query
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({
        createdAt: -1,
      })
      .lean({ virtuals: true });

    const total = await Property.countDocuments({
      ...filter,
      status: "published",
    });

    let result = properties;

    if (city) {
      result = properties.filter((item) => item.location?.city === city);
    }
    const favs = userId
      ? await Favorite.find({ userId }).select("propertyId").lean()
      : [];

    const favSet = new Set(favs.map((f) => f.propertyId.toString()));

    result = result.map((item) => ({
      ...item,
      is_favorite: favSet.has(item._id.toString()),
    }));
    return {
      success: true,

      total,

      page: Number(page),

      totalPages: Math.ceil(total / Number(limit)),

      properties: result,
    };
  } catch (error) {
    console.error(error);

    return {
      properties: [],
      success: false,
      message: error.message,
    };
  }
}
export async function getPropertyByID(pId, userId = null) {
  await connectToDB();

  try {
    const property = await Property.findOne({ _id: pId })
      .populate("owner", "-password")
      .populate("details")
      .populate({
        path: "comments",
        match: { parentId: null },
        populate: [
          {
            path: "userId",
            select: "name lastName avatar role agencyName",
          },
          {
            path: "replies",
            populate: {
              path: "userId",
              select: "name lastName avatar role agencyName",
            },
          },
        ],
      })
      .populate({
        path: "location",
        populate: {
          path: "city",
        },
      })
      .populate({
        path: "equipments",
        populate: {
          path: "equipment",
        },
      })
      .populate("images")
      .lean({ virtuals: true });
    
    if (!property) {
      throw new Error("Property not found");
    }
    // console.log(property.location.nearby.nearby)

    const isVisit = await VisitRequest.exists({
      requesterId: userId,
      propertyId: pId,
    });

    const favs = userId
      ? await Favorite.find({ userId }).select("propertyId").lean()
      : [];

    const favSet = new Set(favs.map((f) => f.propertyId.toString()));

    return {
      success: true,
      property: {
        ...property,
        is_favorite: favSet.has(property._id.toString()),
        isVisit: Boolean(isVisit) ?? false,
        isAuthor: userId
          ? property.owner._id.toString() === userId.toString()
          : false,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      property: null,
      message: error.message,
    };
  }
}
