import connectToDB from "@/configs/db";
import Favorite from "@/models/Favorite";
import Property from "@/models/Property";
import PropertyImage from "@/models/PropertyImage";
import VisitRequest from "@/models/VisitRequest";

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

    const filter = { status: "published" };

   
    if (propertyType) {
      filter.propertyType = Array.isArray(propertyType)
        ? { $in: propertyType }
        : propertyType;
    }

    if (listingType) filter.listingType = listingType;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (city) {
      const locations = await PropertyLocation.find({ city })
        .select("propertyId")
        .lean();
      const propertyIds = locations.map((l) => l.propertyId);
      filter._id = { $in: propertyIds };
    }


    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      cheap: { price: 1 },
      expensive: { price: -1 },
    };
    const sortQuery = sortMap[sort] || { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name lastName avatar agencyName role")
        .populate("details")
        .populate({
          path: "location",
          populate: { path: "city" },
        })
        .sort(sortQuery) 
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean({ virtuals: false }),

      Property.countDocuments(filter),
    ]);

    
    const propertyIds = properties.map((p) => p._id);
    const allImages = await PropertyImage.find({
      propertyId: { $in: propertyIds },
    }).lean();

    // group by propertyId
    const imageMap = allImages.reduce((acc, img) => {
      const key = img.propertyId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
      return acc;
    }, {});

    const favs = userId
      ? await Favorite.find({ userId }).select("propertyId").lean()
      : [];
    const favSet = new Set(favs.map((f) => f.propertyId.toString()));

    const result = properties.map((item) => ({
      ...item,
      images: imageMap[item._id.toString()] || [], 
      is_favorite: favSet.has(item._id.toString()),
    }));

    return {
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      properties: result,
    };
  } catch (error) {
    console.error("getProperties error:", error);
    return {
      properties: [],
      total: 0,
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
