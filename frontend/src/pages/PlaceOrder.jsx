import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyrazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        //Api calls for COD
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            {
              headers: { token },
            }
          );

          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );

          console.log("Stripe API Response:", responseStripe.data); // Debugging
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case "razorpay":
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="pt-16 px-6 md:px-16 lg:px-24  min-h-screen">
      <div className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
        <Title text1={"Place"} text2={"Order"} />
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-lg rounded-lg p-6 sm:p-8 flex flex-col md:flex-row gap-6"
      >
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <Title text1={"Delivery"} text2={"Information"} />
          <input
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="Last Name"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="street"
            value={formData.street}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="Street"
            required
          />
          <input
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="State"
            required
          />
          <input
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="Zip Code"
            required
          />
          <input
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="text"
            placeholder="Country"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            className="border rounded p-2"
            type="tel"
            placeholder="Phone"
            required
          />
        </div>

        <div className="flex flex-col gap-6 w-full md:w-1/2">
          <CartTotal />
          <Title text1={"Payment"} text2={"Method"} />
          <div className="flex gap-3 flex-wrap">
            <div
              onClick={() => setMethod("stripe")}
              className={`border p-2 rounded cursor-pointer ${
                method === "stripe" ? "bg-green-100" : ""
              }`}
            >
              Stripe
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className={`border p-2 rounded cursor-pointer ${
                method === "razorpay" ? "bg-green-100" : ""
              }`}
            >
              Razorpay
            </div>
            <div
              onClick={() => setMethod("cod")}
              className={`border p-2 rounded cursor-pointer ${
                method === "cod" ? "bg-green-100" : ""
              }`}
            >
              Cash on Delivery
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-700 transition"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
