"use client";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b-2 shadow-md">
      {/* Desktop nav */}
      <div className="flex justify-between items-center px-10 h-20">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">FXMA</div>

        {/* Menu */}
        <div>
          <ul className="flex gap-5">
            <li className="text-blue-500">Home</li>
            <li className="hover:text-blue-500 cursor-pointer">About</li>
            <li className="hover:text-blue-500 cursor-pointer">Plans</li>
            <li className="hover:text-blue-500 cursor-pointer">Blog</li>
            <li className="hover:text-blue-500 cursor-pointer">FAQs</li>
            <li className="hover:text-blue-500 cursor-pointer">
              Lotsize Calculator
            </li>
          </ul>
        </div>

        {/* Button */}
        <button className="inline-flex items-center w-60 justify-center bg-blue-500 text-white font-bold h-16 rounded-tr-full rounded-tl-full rounded-bl-full hover:bg-blue-600 transition ease-in-out duration-300">
          <a href="#">
            Access Learning Dashboard
            <span>➜</span>
          </a>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
