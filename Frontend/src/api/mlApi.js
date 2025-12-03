import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/ml",  // your Node backend
});

// Attach token automatically (if stored in localStorage)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --------------------
// Crop Prediction
// --------------------
export const predictCrop = async (values) => {
  const res = await API.post("/crop", { values });
  return res.data;
};

// --------------------
// Potato Disease Prediction
// --------------------
export const predictPotato = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/potato", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
