import connectToDB from "@/configs/db";
import User from "@/models/users";

export default async function handler(req, res) {
  await connectToDB();

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  const { id } = req.query;

  if (req.method === "PATCH") {
    const { role } = req.body;

    const user =
      await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );

    return res.json({
      success: true,
      user,
    });
  }

  if (req.method === "DELETE") {
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
    });
  }

  return res.status(405).end();
}