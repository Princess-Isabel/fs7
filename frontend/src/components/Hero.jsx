import React from "react";
import Hero_img from "../assets/hero_image.png";

const hero = () => {
  return (
    <section className="flex flex-wrap items-center justify-evenly">
      <div className="max-w-lg text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Sit and Shop, We got you!
        </h1>
        <p classname="text-gray-600 mb-66 text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded text-sm">
          SHOP NOW
        </button>
      </div>

      <div className="mt-8 flex justify-center">
        <img
          className="w-full max-w-md object-cover"
          src={Hero_img}
          alt="Shopping Woman"
        />
      </div>
    </section>
  );
};

export default hero; // for accessibility
