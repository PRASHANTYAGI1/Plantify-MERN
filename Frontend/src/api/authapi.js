import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// -----------------------------
// AUTH HEADER
// -----------------------------
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
    }
  };
};

// -----------------------------
// REGISTER USER
// -----------------------------
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

// -----------------------------
// LOGIN USER
// -----------------------------
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

// -----------------------------
// GET CURRENT USER
// -----------------------------
export const getMe = async () => {
  const res = await axios.get(`${API_URL}/me`, authHeader());
  return res.data;
};

// -----------------------------
// UPDATE USER PROFILE  (FINAL)
// ONLY this exists — no duplicates!
// Backend Route → PUT /api/users/update
// -----------------------------
export const updateUserProfile = async (formData) => {
  const res = await axios.put(`${API_URL}/update`, formData, {
    headers: {
      ...authHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// -----------------------------
// ACCOUNT DELETE REQUEST
// -----------------------------
export const requestAccountDeletion = async () => {
  const res = await axios.delete(`${API_URL}/delete-request`, authHeader());
  return res.data;
};

// -----------------------------
// ADMIN — BLOCK USER
// -----------------------------
export const blockUser = async (userId, reason) => {
  const res = await axios.put(
    `${API_URL}/block`,
    { userId, reason },
    authHeader()
  );
  return res.data;
};

// -----------------------------
// ADMIN — UNBLOCK USER
// -----------------------------
export const unblockUser = async (userId) => {
  const res = await axios.put(
    `${API_URL}/unblock`,
    { userId },
    authHeader()
  );
  return res.data;
};
