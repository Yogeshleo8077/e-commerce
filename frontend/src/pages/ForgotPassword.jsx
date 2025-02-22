import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { email }
      );
      if (data.success) {
        toast.success("Password reset link sent! Check your email.");
        setEmail(""); // Clear input after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
