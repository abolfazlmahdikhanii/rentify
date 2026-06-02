import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import User from "@/models/users";

import {
  uploadFile,
  deleteFile,
} from "@/service/fileService";

import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req,
  res
) {
  await connectToDB();

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  const user = await User.findOne({
    email: decoded.email,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // =====================
  // Upload Avatar
  // =====================

  if (req.method === "POST") {
    try {
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 2 * 1024 * 1024,
      });

      const [fields, files] =
        await form.parse(req);

      const file = files.image?.[0];

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const uploadResult =
        await uploadFile(
          file,
          `avatars/${user._id}`
        );

      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: "Upload failed",
        });
      }

      // حذف آواتار قبلی
      if (user.avatarId) {
        try {
          await deleteFile(user.avatarId);
        } catch {}
      }

      user.avatar = uploadResult.url;
      user.avatarId =
        uploadResult.fileId;

      await user.save();

      return res.status(200).json({
        success: true,
        avatar: user.avatar,
        avatarId: user.avatarId,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================
  // Delete Avatar
  // =====================

  if (req.method === "DELETE") {
    try {
      if (!user.avatarId) {
        return res.status(404).json({
          success: false,
          message:
            "Avatar not found",
        });
      }

      await deleteFile(
        user.avatarId
      );

      user.avatar = "";
      user.avatarId = "";

      await user.save();

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}