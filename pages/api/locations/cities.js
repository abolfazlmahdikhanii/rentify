import connectToDB from "@/configs/db";
import Province from "@/models/Province";

export default async function handler(req, res) {
  await connectToDB();

  const provinces = await Province.find().sort({
    name: 1,
  });

  return res.json({
    success: true,
    provinces,
  });
}
