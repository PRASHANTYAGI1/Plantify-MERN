import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/authRoutes.js"; 
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import router from "./routes/dashboardRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import cron from "node-cron";
import { deleteExpiredUsers } from "./cron/deleteExpiredUsers.js";
import mlRoutes from "./routes/Mlrouts.js";
// import potatoRoutes from "./routes/potatoRoutes.js";
// import cropRoutes from "./routes/cropRoutes.js";

cron.schedule("0 0 * * *", deleteExpiredUsers);



dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend
app.use(
  cors({
    origin: "https://plantify-web-ml1.netlify.app/" || "http://localhost:5173",
    credentials: true,
  })
);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", router);
app.use("/api/subscription", subscriptionRoutes);
// app.use("/api/potato", potatoRoutes);
// app.use("/api/crop", cropRoutes);

app.use("/api/ml", mlRoutes);

// Connect to MongoDB and start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
