import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectToDB();

  try {
    const user = await userVerify(req, res);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // GET PROFILE
    if (req.method === "GET") {
      const isProfileComplete = !!user.name && !!user.lastName && !!user.phone;

      return res.status(200).json({
        success: true,
        isProfileComplete,
        user,
      });
    }

    // UPDATE PROFILE
    if (req.method === "PUT") {
      const { name, lastName, phone, agencyName, job, avatar } = req.body;

      user.name = name ?? user.name;
      user.lastName = lastName ?? user.lastName;
      user.phone = phone ?? user.phone;
      user.agencyName = agencyName ?? user.agencyName;
      user.job = job ?? user.job;
      user.avatar = avatar ?? user.avatar;

      await user.save();

      const isProfileComplete = !!user.name && !!user.lastName && !!user.phone;

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        isProfileComplete,
        user,
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
