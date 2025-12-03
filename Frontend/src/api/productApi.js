// src/api/productApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// AUTH HEADER
const token = localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


/* ---------------------------------------------
   ADD PRODUCT (multipart/form-data)
----------------------------------------------*/
export const addProduct = async (formData) => {
  return await axios.post(`${API_URL}/add`, formData, {
    ...authHeader(),
    headers: {
      ...authHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });
};


// ---------------------------------------------
//  UPDATE PRODUCT (multipart/form-data)
// ---------------------------------------------

export const updateProduct = async (id, formData) => {
  return await axios.put(
    `${API_URL}/update/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


/* ---------------------------------------------
   DELETE PRODUCT
----------------------------------------------*/
export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  });
};


/* ---------------------------------------------
   GET ALL PRODUCTS (PUBLIC)
----------------------------------------------*/
export const getAllProducts = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

/* ---------------------------------------------
   GET SINGLE PRODUCT
----------------------------------------------*/
export const getSingleProduct = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
