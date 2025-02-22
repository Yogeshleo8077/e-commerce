import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password
    }
});

export default transporter;