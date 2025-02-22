import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          token,
          newPassword,
        }
      );

      if (data.success) {
        toast.success("Password reset successful! You can log in now.");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
