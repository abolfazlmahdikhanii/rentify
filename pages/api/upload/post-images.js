import { verifyToken } from "@/lib/auth";
import PropertyImage from "@/models/PropertyImage";
import User from "@/models/User";
import { deleteFile, uploadFile } from "@/service/fileService";
import connectToDB from "@/configs/db";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to allow formidable to handle form data
  },
};

const handler = async (req, res) => {
  await connectToDB();

  const { token } = req.cookies;
  const { imgType, id,cityName } = req.query;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  const validToken = verifyToken(token);
  if (!validToken) {
    return res.status(401).json({ message: "Invalid Token", success: false });
  }
  if (req.method === "POST") {
    try {
      // Parse the form once (promisified)
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 6 * 1024 * 1024,
      });

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      // formidable returns file object when multiples=false
      let file = files?.image || files?.file;
      if (Array.isArray(file)) file = file[0];

      if (!file) {
        return res.status(400).json({
          message: "No file uploaded!",
          success: false,
        });
      }

      const user = await User.findOne({ email: validToken.email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      const uploadResult = await uploadFile(file, `property/${cityName}`);

      if (uploadResult) {
        const newUpload = await PropertyImage.create({
          propertyId: id ,
          imageUrl: uploadResult.url,
          storjKey: uploadResult.fileId,
          isMain: imgType === "main" ? true : false,
        });
        if (!newUpload) {
          await deleteFile(uploadResult.fileId);
          return res.status(400).json({
            success: false,
            message: "File upload failed",
          });
        }

        return res.status(200).json({
          success: true,
          url: uploadResult.url,
          fid: uploadResult.fileId,
          imgId: newUpload._id,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "File upload failed",
        });
      }
    } catch (error) {
      console.error("Upload handler error:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      const { fid, url, type } = req.query;
      if (!fid && !url) {
        return res.status(400).json({
          message: "No identifier provided (fid, url, or docId required)",
          success: false,
        });
      }

      let imageToDelete = null;
      if (fid) {
        // delete by file id
        const removed = await PropertyImage.findOneAndDelete({ _id: fid });
        if (!removed) {
          return res
            .status(404)
            .json({ message: "Image not found", success: false });
        }
        imageToDelete = removed.imageId;
      } else if (url) {
        // delete by url
        const postImg = await PropertyImage.findOne({ imageUrl: url });
        if (!postImg) {
          return res
            .status(404)
            .json({ message: "No image exists", success: false });
        }
        const removed = await PropertyImage.findOneAndDelete({
          imageId: postImg.imageId,
        });
        if (!removed) {
          return res
            .status(400)
            .json({ message: "remove failed!", success: false });
        }
        imageToDelete = removed.imageId;
      }
      if (!imageToDelete) {
        return res.status(404).json({
          message: "Image not found in database",
          success: false,
        });
      }

      const uploadResult = await deleteFile(imageToDelete);

      if (uploadResult) {
        return res.status(200).json({
          success: true,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "File Delete failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
};

export default handler;
