import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Property from "@/models/Property";
import PropertyDetail from "@/models/PropertyDetail";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyImage from "@/models/PropertyImage";
import PropertyEquipment from "@/models/PropertyEquipment";
import Equipment from "@/models/Equipment";

export default async function handler(req, res) {
  try {
    await connectToDB();

    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const user = await userVerify(req, res);
    if (!user) return res.status(404).json({ message: "user not found" }); // userVerify may have handled the response

    const properties = await Property.find({ ownerId: user._id })
      .populate("details")
      .populate("location")
      .populate("images")
      .populate("owner", "name lastName email agencyName")
      .populate({
        path: "equipments",
        populate: {
          path: "equipmentId",
        },
      })
      .lean({ virtuals: true })
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: properties });
  } catch (err) {
    console.error("/api/properties/my error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server Error" });
  }
}
