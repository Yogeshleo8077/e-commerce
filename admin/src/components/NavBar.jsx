import React from "react";
import { assets } from "../assets/assets";

const NavBar = ({ setToken }) => {
  return (
    <>
      {/* Navbar */}
      <div
        className="bg-white shadow-md w-full px-5 sm:px-[4%] py-3 flex justify-between items-center 
                  fixed top-0 left-0 z-50 sm:relative"
      >
        {/* Logo */}
        <img className="w-[80px] sm:w-[120px]" src={assets.logo} alt="Logo" />

        {/* Logout Button */}
        <button
          onClick={() => setToken("")}
          className="bg-black hover:bg-gray-700 cursor-pointer transition-all duration-300 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Add top padding to prevent content from being hidden */}
      <div className="pt-[60px] sm:pt-0"></div>
    </>
  );
};

export default NavBar;
