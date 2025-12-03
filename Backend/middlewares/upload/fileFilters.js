export const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const imageFilter = (req, file, cb) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP allowed"), false);
  }
  cb(null, true);
};
