import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    }
}, { minimize: false }); // This prevents Mongoose from removing empty objects

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;