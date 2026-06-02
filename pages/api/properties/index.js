import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import Property from "@/models/Property";
import { getProperties } from "@/service/propertyService";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
  try {
    const user=userVerify(req,res);
    const result = await getProperties(req.query,user._id);

    return res.status(200).json(result);
  } catch (error) {
 
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
