import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
import CardNav from "../components/CardNav";
import logo from "../assets/react.svg";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { Routes, Route, Link } from "react-router-dom";
import { Links } from "react-router-dom";

const scrollMenuItems = [
  "Ana Sayfa",
  "Hakkımızda",
  "Blog",
  "İletişim",
  "Ana Sayfa",
  "Hakkımızda",
  "Blog",
  "İletişim",
  "Ana Sayfa",
  "Hakkımızda",
  "Blog",
  "İletişim",
  "Ana Sayfa",
  "Hakkımızda",
  "Blog",
  "İletişim",
];

const items = [
  {
    label: "Profiller",
    bgColor: "#0D0716",
    textColor: "#fff",
    icon: "/icons8-test-account-48.png",
  },
  {
    label: "İlaçlar",
    bgColor: "#170D27",
    textColor: "#fff",
  },
  {
    label: "Takvim",
    bgColor: "#271E37",
    textColor: "#fff",
  },
];

export function Homepage() {
  return (
    <div className="grid">
      {/* main-container */}
      <CardNav
        logo={logo}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
      <div className="mt-4 px-4">
        {" "}
        {/* bottom-container */}
        <p className="text-[30px] text-gray-100 mb-[10px]">
          {" "}
          {/* scroll-menu-title */} Bu gün ilaç alacak kişiler
        </p>
        <div className="bg-gray-500 w-full max-w-4xl">
          {" "}
          {/* scroll-menu-top-container */}
          <ScrollMenu className="flex flex-row overflow-x-auto whitespace-nowrap">
            {" "}
            {/* scroll-menu-container */}
            {scrollMenuItems.map((scrollMenuItem, i) => (
              <div
                key={i}
                className="px-4 py-2 m-2 bg-gray-200 rounded-lg whitespace-nowrap h-64 w-44 inline-block"
              >
                {" "}
                {/* scroll-menu-item */}
                {scrollMenuItem}
              </div>
            ))}
          </ScrollMenu>
        </div>
      </div>
    </div>
  );
}
