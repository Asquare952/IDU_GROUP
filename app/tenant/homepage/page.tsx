"use client";
import React from "react";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
const page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="py-10 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome to the Tenant Homepage
        </h1>
      </div>
      <Footer />
    </div>
  );
};

export default page;
