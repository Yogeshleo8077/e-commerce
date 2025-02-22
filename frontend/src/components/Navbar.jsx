import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCartItems({});
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between py-3 sm:py-5 px-4 sm:px-6 font-medium fixed top-0 left-0 right-0 z-50 bg-white shadow-md sm:shadow-none sm:relative sm:h-auto h-14 sm:flex-row flex-row sm:flex sm:w-full w-full">
      <Link to="/">
        <img src={assets.logo} className="w-28 sm:w-36" alt="Logo" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-grey-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 sm:gap-6 relative z-50">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt="Search"
          className="w-4 sm:w-5 cursor-pointer"
        />

        <div className="relative group">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-4 sm:w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="Profile"
          />

          {token && (
            <div className="absolute right-0 mt-2 w-32 sm:w-40 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 z-50">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-black"
              >
                Orders
              </p>
              <p
                onClick={handleLogout}
                className="cursor-pointer hover:text-black"
              >
                Logout
              </p>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            className="w-4 sm:w-5 min-w-4 sm:min-w-5"
            alt="Cart"
          />
          <p className="absolute right-[-4px] bottom-[-4px] w-3 sm:w-4 text-center bg-black text-white rounded-full leading-3 sm:leading-4 aspect-square text-[7px] sm:text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(!visible)}
          src={assets.menu_icon}
          className="w-4 sm:w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Side bar menu for smaller screen */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-3/4 bg-white transition-transform transform ${
          visible ? "translate-x-0" : "translate-x-full"
        } z-[100] overflow-hidden shadow-lg sm:hidden`}
      >
        <div className="flex flex-col text-gray-600 p-4 sm:p-5">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-2 sm:p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-3 sm:h-4 rotate-180"
              alt="Back"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-1 sm:py-2 pl-4 sm:pl-6 hover:text-black"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-1 sm:py-2 pl-4 sm:pl-6 hover:text-black"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-1 sm:py-2 pl-4 sm:pl-6 hover:text-black"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-1 sm:py-2 pl-4 sm:pl-6 hover:text-black"
            to="/contact"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
