import connectToDB from "@/configs/db";
import VisitRequest from "@/models/VisitRequest";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const { id } = req.query;

  const visit =
    await VisitRequest.findById(id);

  if (!visit) {
    return res.status(404).json({
      message: "Visit request not found",
    });
  }

  if (
    visit.userId.toString() !==
    req.user.id
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  if (visit.status !== "pending") {
    return res.status(400).json({
      message:
        "Cannot cancel this request",
    });
  }

  await VisitRequest.findByIdAndDelete(
    id
  );

  return res.json({
    success: true,
  });
}