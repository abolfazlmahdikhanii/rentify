import connectToDB from "@/configs/db";
import State from "@/models/State";


export default async function handler(req, res) {
  await connectToDB();

  const provinces = await State.find().sort({
    name: 1,
  });

  return res.json({
    success: true,
    provinces,
  });
}
