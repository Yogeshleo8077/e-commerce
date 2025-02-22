import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = token_decode.id;

        next();
    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token." });

    }
}

export default authUser;