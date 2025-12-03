// src/api/subscriptionApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/subscription";

export const upgradeSubscription = async (planType, amount) => {
  const token = localStorage.getItem("token");

  return await axios.post(
    `${API_URL}/upgrade`,
    { planType, amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};