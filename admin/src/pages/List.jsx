import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-md rounded-lg">
      <p className="text-lg font-semibold mb-4 text-gray-800">
        All Products List
      </p>

      <div className="flex flex-col gap-2">
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 bg-gray-200 text-gray-700 font-medium rounded-md">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p className="text-center">Action</p>
        </div>

        {/* Product List */}
        {list.map((item) => (
          <React.Fragment key={item._id}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 p-3 border-b border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition">
              {/* Image */}
              <img
                className="w-14 h-14 object-cover rounded-md border border-gray-300"
                src={item.image[0]}
                alt=""
              />

              {/* Product Name */}
              <p className="font-medium text-gray-800">{item.name}</p>

              {/* Category (Hidden on Mobile) */}
              <p className="text-gray-600 hidden md:block">{item.category}</p>

              {/* Price */}
              <p className="font-semibold text-gray-800">
                {currency}
                {item.price}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => removeProduct(item._id)}
                className="bg-black text-white px-3 py-1 cursor-pointer rounded-md text-sm hover:bg-gray-700 transition"
              >
                Delete
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default List;
