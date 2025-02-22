import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";


//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();


// Middleware to parse JSON
app.use(express.json());


// CORS Configuration
app.use(cors({
    origin: [
        "https://e-commerce-admin-ruby-omega.vercel.app", // New Admin Panel
        "https://e-commerce-admin-panel-tawny.vercel.app", // OldAdmin Panel
        "https://e-commerce-frontend-three-nu.vercel.app" // Frontend Website
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true
}));

// Handle Preflight Requests
app.options("*", cors());


// Api End Points
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);


app.get("/", (req, res) => {
    res.send("Api is Working!");
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
