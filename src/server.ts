import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routers/users.router";
import itemsRoutes from "./routers/items.router";
import orderRoutes from "./routers/orders.router";
import mpesaRoutes from "./routers/mpesa.routes";
import cors from "cors";



const app = express();

app.use(cors({
    origin: [
  "http://localhost:4200",
  "https://ruirumarket.vercel.app"
],
    credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/users", userRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mpesa", mpesaRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API is running 🚀"
    });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});