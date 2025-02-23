import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes.length ? sizes : []));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-2xl mx-auto p-5 bg-white shadow-md rounded-lg flex flex-col gap-4"
    >
      {/* Image Upload */}
      <div>
        <p className="font-medium text-gray-900 mb-2">Upload Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[image1, image2, image3, image4].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-24 h-24 object-cover rounded-md cursor-pointer border border-gray-300"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt=""
              />
              <input
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (index === 0) setImage1(file);
                  if (index === 1) setImage2(file);
                  if (index === 2) setImage3(file);
                  if (index === 3) setImage4(file);
                }}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <p className="font-medium text-gray-900">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full p-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Product Description */}
      <div>
        <p className="font-medium text-gray-900">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Write content here..."
          required
        ></textarea>
      </div>

      {/* Category, Subcategory, Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="font-medium text-gray-900">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="font-medium text-gray-900">Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="WinterWear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="font-medium text-gray-900">Price (₹)</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full p-2 border border-gray-300 rounded-md"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <p className="font-medium text-gray-900">Select Sizes</p>
        <div className="flex gap-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`px-4 py-2 cursor-pointer rounded-md text-sm font-bold ${
                sizes.includes(size)
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex items-center gap-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestseller}
          className="w-4 h-4 cursor-pointer"
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Add to Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full text-white bg-black hover:bg-gray-700 cursor-pointer font-medium rounded-lg px-5 py-2 transition-all"
      >
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;
