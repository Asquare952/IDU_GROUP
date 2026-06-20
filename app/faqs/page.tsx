"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import {
  heroData,
  categories,
  faqItems,
  trustData,
  ctaData,
} from "./questions/faqs";
import Header from "../components/Header";

const Page = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <div className="bg-gradient-to-b from-[#4CAF50]/12 to-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4CAF50] mb-4">
            {heroData.headline}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            {heroData.description}
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={heroData.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent shadow-sm placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-[#4CAF50]/20 transition-all duration-300 cursor-pointer group"
                >
                  <div
                    className={`${category.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#4CAF50] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-[#1B5E20] mb-6 text-center">
            Detailed Answers
          </h2>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#4CAF50]/25 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#4CAF50]/5 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#4CAF50] flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#4CAF50] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white text-sm font-semibold uppercase tracking-wider">
                    Trust & Safety
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {trustData.headline}
                </h2>
                <p className="text-base text-white mb-8 leading-relaxed">
                  {trustData.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trustData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3  text-white"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="">
                  <img
                    src="/trust-gurantee.jpg"
                    alt="Trust Guarantee"
                    className="w-full rounded-xl object-cover aspect-video"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {ctaData.headline}
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto">
            {ctaData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() =>
                window.open("https://wa.me/2349058161216", "_blank")
              }
              className="inline-flex items-center gap-2 bg-[#4CAF50] hover:bg-[#43A047] text-white font-semibold py-3 px-8 rounded-full transition-all active:scale-95 shadow-lg shadow-[#4CAF50]/20 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              {ctaData.primaryLabel}
            </button>
            <Link
              href={ctaData.secondaryHref}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-full transition-all border border-gray-200 active:scale-95 cursor-pointer"
            >
              {ctaData.secondaryLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
