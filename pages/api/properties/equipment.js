import connectToDB from "@/configs/db";
import Equipment from "@/models/Equipment";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const equipment =
    await Equipment.find().select(
      "title icon"
    );

  res.json({
    success: true,
    data: equipment,
    count: equipment.length,
  });
}