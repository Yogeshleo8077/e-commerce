import express from "express"
import { loginUser, registerUser, adminLogin, forgotPassword, resetPassword } from "../controllers/userController.js"

const userRouter = express.Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/forget-password",);
userRouter.post("/forgot-password", forgotPassword); // Link to the forgotPassword controller
userRouter.post("/reset-password", resetPassword);
export default userRouter;