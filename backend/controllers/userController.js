import userModel from "../models/userModel.js";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from "../config/nodeMailer.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Route for forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate Reset Token
        const token = createToken(user._id);
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>Click <a href='${resetLink}'>here</a> to reset your password. This link is valid for 1 hour.</p>`
        }

        // Send Email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Password reset email sent successfully!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to send reset email" });
    }
}

// Route for reset password
const resetPassword = async (req, res) => {
    try {


        const { token, newPassword } = req.body;

        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await userModel.findById(decoded.id);

        if (!user) {
            console.error("User not found"); // Debugging
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ success: false, message: "Failed to reset password" });
    }
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checking user alreadt exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exists with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Cekck User is already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            res.json({ success: false, message: "User already exists" });
        }

        //Validating email format and strong password

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        //Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({ success: true, token });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: message.error });
    }
}

export { loginUser, registerUser, adminLogin, forgotPassword, resetPassword }