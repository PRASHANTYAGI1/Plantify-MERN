import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

/* ----------------------------------------------------------
   PLACE ORDER
---------------------------------------------------------- */
export const placeOrder = async (data) => {
  const res = await axios.post(`${API_URL}/place`, data, authHeader());
  return res.data;
};

/* ----------------------------------------------------------
   CANCEL ORDER (buyer)
---------------------------------------------------------- */
export const cancelOrder = async (orderId) => {
  const res = await axios.post(
    `${API_URL}/cancel`,
    { orderId },
    authHeader()
  );
  return res.data;
};

/* ----------------------------------------------------------
   CONFIRM SHIPMENT (seller)
---------------------------------------------------------- */
export const sellerConfirmShipment = async (orderId) => {
  const res = await axios.post(
    `${API_URL}/confirm-shipment`,
    { orderId },
    authHeader()
  );
  return res.data;
};

/* ----------------------------------------------------------
   CONFIRM DELIVERY (buyer)
---------------------------------------------------------- */
export const confirmDelivery = async (payload) => {
  const res = await axios.post(
    `${API_URL}/confirm-delivery`,
    payload,
    authHeader()
  );
  return res.data;
};

/* ----------------------------------------------------------
   REQUEST RETURN (buyer)
---------------------------------------------------------- */
export const requestReturn = async (orderId, reason) => {
  const res = await axios.post(
    `${API_URL}/request-return`,
    { orderId, reason },
    authHeader()
  );
  return res.data;
};

/* ----------------------------------------------------------
   SELLER CONFIRM RETURN
---------------------------------------------------------- */
export const confirmReturn = async (orderId) => {
  const res = await axios.post(
    `${API_URL}/confirm-return`,
    { orderId },
    authHeader()
  );
  return res.data;
};

/* ----------------------------------------------------------
   EXTEND RENTAL
---------------------------------------------------------- */
export const extendRental = async (orderId, extraDays) => {
  const res = await axios.post(
    `${API_URL}/extend-rental`,
    { orderId, extraDays },
    authHeader()
  );
  return res.data;
};

/* ----------------------------------------------------------
   GET BUYER ORDERS
---------------------------------------------------------- */
export const getMyOrders = async () => {
  const res = await axios.get(`${API_URL}/my-orders`, authHeader());
  return res.data;
};

/* ----------------------------------------------------------
   GET SELLER ORDERS
---------------------------------------------------------- */
export const getSellerOrders = async () => {
  const res = await axios.get(`${API_URL}/seller-orders`, authHeader());
  return res.data;
};

/* ----------------------------------------------------------
   MARK SELLER VIEWED POPUP
---------------------------------------------------------- */
export const markSellerViewed = async (orderId) => {
  const res = await axios.post(
    `${API_URL}/seller-viewed`,
    { orderId },
    authHeader()
  );
  return res.data;
};
