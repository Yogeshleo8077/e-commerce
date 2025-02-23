import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    if (products.length > 0) {
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-20 px-4 md:px-12 lg:px-20  min-h-screen">
      <div className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800 mt-6">
        <Title text1={"Your"} text2={"Cart"} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8">
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between border-b py-4 sm:py-5 gap-3 sm:gap-4 last:border-none"
              >
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <img
                    className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg shadow-md"
                    src={productData.image[0]}
                    alt={productData.name}
                  />
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-700">
                      {productData.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {currency}
                        {productData.price}
                      </p>
                      <p className="px-2 sm:px-3 py-1 border rounded bg-gray-200 font-semibold text-sm sm:text-base">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 justify-between w-full sm:w-auto">
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="border rounded w-12 sm:w-14 text-center py-1 text-sm sm:text-lg font-medium"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />

                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="text-red-500 hover:text-red-700 transition transform hover:scale-110 flex items-center justify-center w-10 h-10"
                  >
                    <img
                      className="w-4 sm:w-5"
                      src={assets.bin_icon}
                      alt="Delete"
                    />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-8 sm:py-10 text-base sm:text-lg font-medium">
            Your cart is empty. Start shopping now!
          </p>
        )}
      </div>

      <div className="flex justify-center mt-8 sm:mt-10">
        <div className="w-full sm:w-[300px] bg-white shadow-lg p-4 sm:p-6 rounded-lg">
          <CartTotal />
          <button
            onClick={() => navigate("place-order")}
            className="w-full bg-black text-white text-sm mt-5 sm:text-base font-bold py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
