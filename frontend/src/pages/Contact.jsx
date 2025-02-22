import React, { useContext, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-hot-toast";

const Contact = () => {
  const { backendUrl } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + "/api/contact/send-email",
        formData
      );
      if (response.data.success) {
        toast.success("Email sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send email. Try again.");
      }
    } catch (error) {
      toast.error("Error sending email. Try again later.");
    }
  };

  return (
    <section className="py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h4 className="text-blue-500 text-lg font-medium text-center mb-2">
          Get In Touch
        </h4>
        <h2 className="text-gray-900 text-3xl font-bold text-center mb-6">
          We'd Love to Hear from You
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 border border-gray-300 rounded-md px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full h-32 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Your Message"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full h-12 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md font-semibold transition-all duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
