import connectToDB from "@/configs/db";
import { userVerify } from "@/lib/userAuth";
import User from "@/models/User";
import refreshTokenModel from "@/models/RefreshToken";
import { serialize } from "cookie";
import z from "zod";

const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    lastName: z.string().trim().min(1, "Last name is required").optional(),
    agencyName: z.string().trim().min(1, "Agency name is required").optional(),
    phone: z.string().trim().min(1, "Phone is required").optional(),
    email: z.string().trim().email("Email is invalid").optional(),
    job: z.string().trim().optional(),
    avatar: z.string().trim().optional(),
  })
  .partial();

const updateHandler = async (req, res) => {
  try {
   

    const currentUser = await userVerify(req, res);
    if (!currentUser || !currentUser._id) {
      return;
    }


    const validatedData = updateUserSchema.parse(req.body);
    if (Object.keys(validatedData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update handler error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "PUT") {
    await updateHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
