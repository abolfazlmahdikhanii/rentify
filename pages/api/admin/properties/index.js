import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Property from "@/models/Property";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    await connectToDB();
const user=await userVerify(req,res)
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name lastName email phone")
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),

      Property.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      count:total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (error) {
    console.error("Admin properties fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
