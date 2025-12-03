import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp/");
  },
  filename: (req, file, cb) => {
    cb(null, "potato-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
