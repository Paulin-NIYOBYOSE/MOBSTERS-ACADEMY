"use client";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="">
      {/* Desktop nav */}
      <nav className="flex justify-between items-center px-10  border-b-2 shadow-md h-24">
        <div>FXMA</div>
        <div>
          <ul className="flex gap-5">
            <li className="text-green-500">Home</li>
            <li className="hover:text-green-500 cursor-pointer">About</li>
            <li className="hover:text-green-500 cursor-pointer">Plans</li>
            <li className="hover:text-green-500 cursor-pointer">Blog</li>
            <li className="hover:text-green-500 cursor-pointer">FAQs</li>
            <li className="hover:text-green-500 cursor-pointer">
              Lotsize Calculator
            </li>
          </ul>
        </div>
        <button className="inline-flex items-center w-60 justify-center bg-green-500 text-white font-bold h-16 rounded-full hover:bg-red-600 transition ease-in-out duration-300">
          <a href="#">
            Access Learning Dashboard
            <span>➜</span>
          </a>
        </button>
      </nav>
    </nav>
  );
};

export default Navbar;
