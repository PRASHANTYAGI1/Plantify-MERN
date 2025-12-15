import multer from "multer";

// Use memory storage (Railway-safe, no disk writes)
const storage = multer.memoryStorage();

// Multer instance
const uploadDisk = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit (adjust if needed)
  },
});

export default uploadDisk;
