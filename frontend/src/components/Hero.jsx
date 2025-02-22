import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const images = [assets.hero_img, assets.img4, assets.heroImg2, assets.heroImg3];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup function
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className="w-full h-56 md:h-96 flex-shrink-0"
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
