"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail as MailIcon, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  heroData,
  contactCards,
  formData,
  socialData,
  footerData,
} from "./data/contact";
import Header from "../components/Header";
import Image from "next/image";

const FORMSPREE_URL = "https://formspree.io/f/xlgybaja";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "RentULO will receive your message shortly.",
          confirmButtonColor: "#4CAF50",
          timer: 5000,
          timerProgressBar: true,
        });
        form.reset();
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#4CAF50",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      <div className="bg-gradient-to-b from-[#4CAF50]/12 to-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B5E20] mb-4">
            {heroData.headline}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {heroData.description}
          </p>
          <div className="mt-6 w-16 h-0.5 bg-[#4CAF50] mx-auto rounded-full" />
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-[#4CAF50]/5 rounded-2xl p-6 text-center group hover:shadow-lg transition-all duration-300 border border-[#4CAF50]/15"
                >
                  <div className="w-12 h-12 bg-[#4CAF50]/12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(card.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#4CAF50] hover:text-[#43A047] transition-colors"
                  >
                    {card.actionLabel}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
                <img
                  src="/contact-office.png"
                  alt="RentULO Office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {formData.headline}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {formData.description}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-[#4CAF50]" />
                    <span>Lagos, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4 text-[#4CAF50]" />
                    <span>+234 905 816 1216, +234 903 792 3637</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MailIcon className="w-4 h-4 text-[#4CAF50]" />
                    <span>rentulonigeria@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-first-name"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      {formData.fields.firstName.label}
                    </label>
                    <input
                      id="contact-first-name"
                      name="firstName"
                      type="text"
                      required
                      placeholder={formData.fields.firstName.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-last-name"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      {formData.fields.lastName.label}
                    </label>
                    <input
                      id="contact-last-name"
                      name="lastName"
                      type="text"
                      required
                      placeholder={formData.fields.lastName.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      {formData.fields.email.label}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder={formData.fields.email.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      {formData.fields.subject.label}
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-gray-600 bg-white"
                    >
                      {formData.fields.subject.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {formData.fields.message.label}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder={formData.fields.message.placeholder}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent placeholder:text-gray-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4CAF50] hover:bg-[#43A047] disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : formData.submitLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-gray-400 text-center">
                  {formData.privacyNote}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {socialData.headline}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {socialData.platforms.map((platform, index) => (
              <a
                key={index}
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#4CAF50]/40 hover:text-[#4CAF50] transition-all"
              >
                <span className="w-2 h-2 bg-[#4CAF50] rounded-full" />
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
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
              <p className="text-sm text-gray-500">{footerData.tagline}</p>
              <p className="text-sm text-gray-400">{footerData.subTagline}</p>
            </div>
            <p className="text-sm text-gray-400">{footerData.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
