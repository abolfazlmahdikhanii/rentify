import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method !== "GET") {
      return res.status(405).end();
    }
    const user=await userVerify(req,res)
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const visits = await VisitRequest.find({})
      .populate("userId")
      .populate({
        path: "propertyId",
        populate: "owner",
      })
      .sort({
        visitDate: -1,
      });

    return res.json({visits});
  } catch (error) {
    console.error("Error fetching visits:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
