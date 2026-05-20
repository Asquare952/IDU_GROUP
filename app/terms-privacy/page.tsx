"use client";

import React, { useState } from "react";
import { HelpCircle, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { heroData, navItems, sections, fraudData, ctaData } from "./data/terms";
import Header from "../components/Header";

const Page = () => {
  const [activeSection, setActiveSection] = useState("terms");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <section className="bg-gradient-to-b from-green-50/30 to-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-gray-400 mb-2">{heroData.lastUpdated}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-3">
            {heroData.headline}
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
            {heroData.description}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                On this page
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {/* Section 1: Terms of Service */}
            <div id="terms" className="mb-12 scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-green-600 font-semibold text-sm">
                  {sections[0].number}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {sections[0].title}
                </h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {sections[0].content}
              </p>
            </div>

            {/* Section 2: User Responsibilities */}
            <div id="responsibilities" className="mb-12 scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-green-600 font-semibold text-sm">
                  {sections[1].number}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {sections[1].title}
                </h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {sections[1].content}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sections[1].subsections?.map((sub, i) => (
                  <div
                    key={i}
                    className="bg-green-50/50 rounded-xl p-5 border border-green-100/50"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {sub.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {sub.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Property Listings */}
            <div id="listings" className="mb-12 scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-green-600 font-semibold text-sm">
                  {sections[2].number}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {sections[2].title}
                </h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {sections[2].content}
              </p>
              <ul className="space-y-2">
                {sections[2].bullets?.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-500"
                  >
                    <span className="text-green-500 mt-1.5">•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4: Fraud Prevention Banner */}
            <div id="fraud" className="mb-12 scroll-mt-8">
              <div className="bg-[#4CAF50] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white text-xs font-medium">
                        {fraudData.number}
                      </span>
                      <span className="text-white">•</span>
                      <span className="text-white text-xs font-medium">
                        {fraudData.title}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {fraudData.headline}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-md">
                      {fraudData.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fraudData.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                        >
                          {feature.icon === "shield" ? (
                            <Shield className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          {feature.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:flex w-16 h-16 bg-white/20 rounded-2xl items-center justify-center flex-shrink-0">
                    <Shield className="w-8 h-8 text-white/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Privacy Policy */}
            <div id="privacy" className="mb-12 scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-green-600 font-semibold text-sm">
                  {sections[3].number}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {sections[3].title}
                </h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {sections[3].content}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sections[3].subsections?.map((sub, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {sub.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {sub.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {ctaData.headline}
                </h3>
                <p className="text-sm text-gray-500">{ctaData.description}</p>
              </div>
              <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all active:scale-95 text-sm flex-shrink-0 cursor-pointer">
                <HelpCircle className="w-4 h-4" />
                {ctaData.buttonLabel}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
