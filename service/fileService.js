import { ImageKit } from "@imagekit/nodejs";
import fs from "fs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const validateFile = (file) => {
  if (!file?.filepath) throw new Error("Invalid file: No file path");
  if (!fs.existsSync(file.filepath)) throw new Error("File not found in temporary location");

  const stats = fs.statSync(file.filepath);
  if (stats.size > MAX_FILE_SIZE) throw new Error("File too large (max 20MB)");
  if (!ALLOWED_TYPES.includes(file.mimetype))
    throw new Error(`Invalid file type: ${file.mimetype}`);
};

const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const cleanName = originalName
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "");
  return `${timestamp}_${random}_${cleanName}`;
};

export const uploadFile = async (file, folder = "uploads") => {
  try {
    validateFile(file);
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64 = fileBuffer.toString("base64");

    const result = await imagekit.files.upload({
      file: base64,
      fileName: generateFileName(file.originalFilename || "image"),
      folder: folder,
      useUniqueFileName: true,
    });

    try { fs.unlinkSync(file.filepath); } catch {}

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const uploadFileFromBuffer = async (buffer, originalName, folder = "uploads") => {
  try {
    const base64 = Buffer.isBuffer(buffer)
      ? buffer.toString("base64")
      : Buffer.from(buffer).toString("base64");

    const result = await imagekit.files.upload({
      file: base64,
      fileName: generateFileName(originalName),
      folder: `/${folder}`,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    };
  } catch (error) {
    console.error("ImageKit upload from buffer error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFile = async (fileId) => {
  try {
    await imagekit.files.delete(fileId);
    return true;
  } catch (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};