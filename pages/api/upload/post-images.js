import { verifyToken } from "@/lib/auth";
import PropertyImage from "@/models/PropertyImage";
import User from "@/models/User";
import { deleteFile, uploadFile } from "@/service/fileService";
import connectToDB from "@/configs/db";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  await connectToDB();

  const { token } = req.cookies;
  const { imgType, id, cityName } = req.query;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  const validToken = verifyToken(token);
  if (!validToken) {
    return res.status(401).json({ message: "Invalid Token", success: false });
  }

  if (req.method === "POST") {
    try {
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 6 * 1024 * 1024,
      });

      const { files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      let file = files?.image || files?.file;
      if (Array.isArray(file)) file = file[0];

      if (!file) {
        return res.status(400).json({ message: "No file uploaded!", success: false });
      }

      const user = await User.findOne({ email: validToken.email });
      if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
      }

      const uploadResult = await uploadFile(file, `property/${cityName}`);

      if (!uploadResult) {
        return res.status(400).json({ success: false, message: "File upload failed" });
      }

      const newUpload = await PropertyImage.create({
        propertyId: id,
        imageUrl: uploadResult.url,
        storjKey: uploadResult.fileId,  // ✅ fileId ذخیره میشه
        isMain: imgType === "main",
      });

      if (!newUpload) {
        await deleteFile(uploadResult.fileId);
        return res.status(400).json({ success: false, message: "DB save failed" });
      }

      return res.status(200).json({
        success: true,
        url: uploadResult.url,
        fid: uploadResult.fileId,
        imgId: newUpload._id,
      });

    } catch (error) {
      console.error("Upload handler error:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { fid, url } = req.query;

      if (!fid && !url) {
        return res.status(400).json({ message: "No identifier provided", success: false });
      }

      let imageToDelete = null;

      if (fid) {
        // fid اینجا _id مونگوئه
        const removed = await PropertyImage.findOneAndDelete({ _id: fid });
        if (!removed) {
          return res.status(404).json({ message: "Image not found", success: false });
        }
        imageToDelete = removed.storjKey; // ✅ درست
      } else if (url) {
        const postImg = await PropertyImage.findOneAndDelete({ imageUrl: url });
        if (!postImg) {
          return res.status(404).json({ message: "Image not found", success: false });
        }
        imageToDelete = postImg.storjKey; // ✅ درست
      }

      if (!imageToDelete) {
        return res.status(404).json({ message: "No storjKey found", success: false });
      }

      await deleteFile(imageToDelete);

      return res.status(200).json({ success: true });

    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
};

export default handler;