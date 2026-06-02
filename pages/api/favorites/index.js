import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Favorite from "@/models/Favorite";
import Property from "@/models/Property";

export default async function handler(req, res) {
  try {
    await connectToDB();

    const user = await userVerify(req, res);
    if (!user) return res.status(404).json({ message: "User not found!" }); // userVerify already sent response

    if (req.method === "POST") {
      const { propertyId } = req.body;

      const property = await Property.findById(propertyId);

      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "Property not found" });
      }

      const existing = await Favorite.findOne({ userId: user._id, propertyId });

      if (existing) {
        await Favorite.findOneAndDelete({
          userId: user._id,
          propertyId,
        });
        return res
          .status(200)
          .json({ success: false, message: "remove from favorites" });
      }

      await Favorite.create({ userId: user._id, propertyId });

      return res
        .status(201)
        .json({ success: true, message: "Added to favorites" });
    }

    if (req.method === "GET") {
      const favorites = await Favorite.find({ userId: user._id })
        .populate({
          path: "propertyId",
          populate: [{ path: "owner" }, { path: "images" },{path:"location",select:"address"}],
        })
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: favorites.map((f) => f.propertyId),
      });
    }

    return res.status(405).end();
  } catch (err) {
    console.error("/api/favorites error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server Error" });
  }
}
