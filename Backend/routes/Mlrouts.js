import express from "express";
import axios from "axios";
import { protect } from "../middlewares/authMiddleware.js";
import { mlQuotaCheck } from "../middlewares/mlQuota.js";
import multer from "multer";
import FormData from "form-data";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// ======================
// Crop Prediction
// ======================
router.post("/crop", protect, mlQuotaCheck, async (req, res) => {
  try {
    const fastApiResponse = await axios.post(
      "https://plantify-ml.up.railway.app/predict_crop",
      { values: req.body.values }
    );

    return res.json(fastApiResponse.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: "ML service error" });
  }
});

// ======================
// Potato Prediction
// ======================
router.post(
  "/potato",
  protect,
  mlQuotaCheck,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const formData = new FormData();
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const fastApiResponse = await axios.post(
        "https://plantify-ml.up.railway.app/predict_potato",
        formData,
        { headers: formData.getHeaders() }
      );

      return res.json(fastApiResponse.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      return res.status(500).json({ error: "ML service error" });
    }
  }
);

export default router;
