import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).end();
  }
  const user = await userVerify(req, res);
  if (!user) return res.status(404).json({ message: "user not found" });
  const visits = await VisitRequest.find({
    userId: user._id,
  })
    .populate({
      path: "propertyId",
      populate: [
        {
          path: "owner",
        },
        {
          path: "images",
        },
        {
          path: "location",
        },
      ],
    })
    .sort({
      visitDate: -1,
    });

  return res.json(visits);
}
