import cloudinary from "../config/cloudinary.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryUpload.js";
import fs from "fs";

export const uploadFileToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });

    // Always delete temp file after upload
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return result.secure_url;

  } catch (err) {
    // Delete temp file even on failure
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    throw err;
  }
};
