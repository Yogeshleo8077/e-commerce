import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import nodemailer from "nodemailer";

//App Config
const app = express();
const port = process.env.port || 4000;
connectDB();
connectCloudinary();


// Middleware to parse JSON
app.use(express.json());

app.use(cors({ origin: "*" }));


// Api End Points
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);


app.get("/", (req, res) => {
    res.send("Api is Working!");
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
