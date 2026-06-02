import connectToDB from "@/configs/db";

import State from "@/models/State";

export default async function handler(req, res) {
  await connectToDB();

  const states = await State.find()
  .sort({ title: 1 })
  .lean();

  return res.json({
    success: true,
    states,
  });
}
