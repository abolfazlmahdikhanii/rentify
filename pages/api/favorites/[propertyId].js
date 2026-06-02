import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Favorite from "@/models/Favorite";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    const { propertyId } = req.query;
    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }
    if(!isValidObjectId(propertyId)){
      return res.status(400).json({ message: "Invalid Property ID" });
    }
    const user=userVerify(req,res);
    if(!user) return res.status(404).json({ message: "user not found" }); 

    await Favorite.findOneAndDelete({
      userId: user._id,
      propertyId,
    });

    return res.json({
      message: "Removed from favorites",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove from favorites",
    });
  }
}