import axios from "axios";
import React, { useState, useEffect } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data && Array.isArray(response.data.orders)) {
        setOrders([...response.data.orders].reverse()); // Reverse for latest orders first
      } else {
        setOrders([]);
        toast.error(response.data?.message || "No orders found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || error.message);
      setOrders([]);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Orders</h3>

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <div
            className=" border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            key={index}
          >
            {/* Order Header */}
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10"
                  src={assets.parcel_icon}
                  alt="Parcel Icon"
                />
                <p className="text-gray-800 font-medium">Order #{index + 1}</p>
              </div>
              <p className="text-gray-600 text-sm">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-4 text-sm text-gray-700">
              {/* Items List */}
              <div>
                <p className="font-semibold text-gray-900 mb-2">Items</p>
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-gray-700">
                    {item.name} x {item.quantity} ({item.size})
                  </p>
                ))}
              </div>

              {/* Address */}
              <div>
                <p className="font-semibold text-gray-900 mb-2">Address</p>
                <p>{order.address.firstName + " " + order.address.lastName}</p>
                <p>
                  {order.address.street}, {order.address.city}
                </p>
                <p>
                  {order.address.state}, {order.address.country}
                </p>
                <p className="font-medium text-gray-800">
                  📞 {order.address.phone}
                </p>
              </div>

              {/* Order Summary */}
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  Order Summary
                </p>
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p
                  className={`font-semibold ${
                    order.payment ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Payment: {order.payment ? "Done" : "Pending"}
                </p>
                <p className="text-gray-800 font-semibold">
                  Total: {currency}
                  {order.amount}
                </p>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="mt-4 flex justify-end">
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 border rounded-md bg-white text-gray-800 font-medium shadow-sm cursor-pointer"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
