"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useJoinWaitlist } from "@/app/api/features/waitlist";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";

const CallToAction = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { mutate: joinWaitlist, isPending } = useJoinWaitlist();

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    joinWaitlist(email, {
      onSuccess: (data) => {
        toast.success(data.message || "Successfully joined the waitlist!");
        setEmail("");
        setIsWaitlistOpen(false);
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to join waitlist. Please try again.",
        );
      },
    });
  };

  return (
    <>
      <div className="w-full bg-[#43A047] relative overflow-hidden py-16 md:py-20 mb-7">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-6">
            Ready to start Listing your properties or <br />
            seeking houses for rent?
          </h2>

          <p className="text-base md:text-xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users, house seekers, and landlords who have{" "}
            <br />
            started listing their properties and renting houses/properties with
            ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-white text-[#43A047] font-bold text-base py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all active:scale-95 cursor-pointer"
            >
              Get started now
            </Link>
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold text-base py-3 px-8 rounded-full hover:bg-white hover:text-[#43A047] transition-all active:scale-95 cursor-pointer"
            >
              Join our waitlist
            </button>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      {isWaitlistOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Join our waitlist
              </h3>
              <button
                onClick={() => setIsWaitlistOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Be the first to know when we launch! Enter your email to join our
              exclusive waitlist.
            </p>

            <form onSubmit={handleJoinWaitlist} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43A047] focus:border-transparent outline-none"
                  disabled={isPending}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#43A047] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#3a8a3d] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {isPending ? "Joining..." : "Join Waitlist"}
              </button>

              <button
                type="button"
                onClick={() => setIsWaitlistOpen(false)}
                className="w-full border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CallToAction;
