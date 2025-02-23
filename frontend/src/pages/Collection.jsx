import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets.js";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [showScroll, setShowScroll] = useState(false); // State for Back to Top button

  // Handle scrolling to track user position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll back to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fbCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fbCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fbCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t bg-white px-4 sm:px-8">
      {/* Filter Options */}
      <div className="w-full sm:w-1/4">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-lg flex items-center cursor-pointer gap-2 font-semibold text-gray-800"
        >
          Filters
          <img
            className={`h-4 sm:hidden transform transition-all ${
              showFilter ? "rotate-90" : ""
            }`}
            src={assets.dropdown_icon}
            alt="Dropdown Icon"
          />
        </p>

        <div
          className={`border border-gray-300 p-4 mt-3 rounded-md ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-semibold text-gray-900">Categories</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {["Men", "Women", "Kids"].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  className="w-4 h-4 accent-gray-800"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div
          className={`border border-gray-300 p-4 mt-4 rounded-md ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-semibold text-gray-900">Type</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((sub) => (
              <label
                key={sub}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  className="w-4 h-4 accent-gray-800"
                  type="checkbox"
                  value={sub}
                  onChange={toggleSubCategory}
                />
                {sub}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Title text1={"ALL"} text2={"COLLECTION"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-3 py-2 rounded-md bg-white shadow-sm cursor-pointer"
          >
            <option value="relavent">Sort by: Relevance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-4">
              No products found.
            </p>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed w-10 h-10 flex items-center justify-center text-lg sm:top-4 sm:left-1/2 sm:-translate-x-1/2 bottom-6 left-6 bg-black text-white rounded-full shadow-md transition-all"
        >
          ▲
        </button>
      )}
    </div>
  );
};

export default Collection;
