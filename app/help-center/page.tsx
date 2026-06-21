"use client";

import React from "react";
import {
  heroData,
  helpCategories,
  safetyData,
  contactData,
  footerData,
} from "./center/center";
import { Shield, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Image from "next/image";
import Link from "next/link"; 

const Page = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <div className="bg-gradient-to-b from-[#4CAF50]/12 to-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5E20] mb-4">
            {heroData.headline}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            {heroData.description}
          </p>

          <div className="relative max-w-xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={heroData.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent shadow-sm placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className={`${category.cardBg} rounded-2xl p-6 cursor-pointer group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100`}
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
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#4CAF50]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-6">
                <safetyData.badge.icon className="w-3.5 h-3.5" />
                {safetyData.badge.label}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {safetyData.headline}
              </h2>
              <p className="text-white text-base mb-8 leading-relaxed">
                {safetyData.description}
              </p>

              <div className="space-y-6">
                {safetyData.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-white text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-white/12 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-[-2deg]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      RentULO Secure
                    </p>
                    <p className="text-white/80 text-xs">Verified Property</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-white/25 rounded-full w-3/4" />
                  <div className="h-2 bg-white/25 rounded-full w-1/2" />
                </div>
              </div>

              <div className="absolute top-12 right-0 z-20 bg-white rounded-xl p-4 shadow-xl transform rotate-[3deg] w-48">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#4CAF50]/12 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    100% Secure
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">
                  This property has been verified by our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {contactData.headline}
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-xl mx-auto">
            {contactData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {contactData.options.map((option, index) => {
              const Icon = option.icon;
              const isPrimary = option.variant === "primary";
              return (
                <Link
                  key={index}
                  href={option.href}
                  target={
                    option.href.startsWith("mailto:") ? "_self" : "_blank"
                  }
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-full transition-all active:scale-95 ${
                    isPrimary
                      ? "bg-[#4CAF50] hover:bg-[#43A047] text-white shadow-lg shadow-[#4CAF50]/20 cursor-pointer"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 cursor-pointer"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {option.label}
                </Link>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-gray-400">
            {contactData.responseTime}
          </p>
        </div>
      </div>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/IDU GROUP LOGO.png"
                alt="RentULO"
                width={28}
                height={28}
              />
              <span className="text-2xl font-bold text-gray-900">
                Rent<span className="text-[#4CAF50]">ULO</span>
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">{footerData.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;