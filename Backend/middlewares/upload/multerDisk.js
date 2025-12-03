import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp folder exists
const tempDir = "temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

export const uploadDisk = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 5MB
});
