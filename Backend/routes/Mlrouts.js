import express from "express";
import axios from "axios";
import { protect } from "../middlewares/authMiddleware.js";
import { mlQuotaCheck } from "../middlewares/mlQuota.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }); // NOT saving to disk
const router = express.Router();

// Crop Prediction
router.post("/crop", protect, mlQuotaCheck, async (req, res) => {
  try {
    const fastApiResponse = await axios.post("http://127.0.0.1:8000/predict_crop", {
      values: req.body.values
    });

    return res.json(fastApiResponse.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Potato Prediction (image)
import FormData from "form-data";

router.post("/potato", protect, mlQuotaCheck, upload.single("image"), async (req, res) => {
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
      "http://127.0.0.1:8000/predict_potato",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return res.json(fastApiResponse.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: error.message });
  }
});


export default router;
