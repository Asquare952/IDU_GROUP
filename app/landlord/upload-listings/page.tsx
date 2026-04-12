"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { useForm } from "react-hook-form";
import {
  Upload,
  Info,
  DollarSign,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

const UploadListingPage = () => {
  const [totalPackages, setTotalPackages] = useState(0);
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "Apartment",
      basicRent: 0,
      serviceCharge: 0,
      legalFee: 0,
      cautionFee: 0,
    },
  });

  const fees = watch(["basicRent", "serviceCharge", "legalFee", "cautionFee"]);
  useEffect(() => {
    const sum = fees.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    setTotalPackages(sum);
  }, [fees]);

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Upload New Listing
            </h1>
            <p className="text-slate-500 text-sm">
              Fill in the details below to publish your property to the
              marketplace.
            </p>
          </header>

          <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: General Info & Amenities (8 Columns) */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. General Information */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
                  <div className="bg-[#4CAF50]/10 p-2 rounded-full">
                    <Info size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">
                    General Information
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Property Title
                    </label>
                    <input
                      {...register("title")}
                      placeholder="e.g. Luxury 3-Bedroom apartment with Ocean View"
                      className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={5}
                      placeholder="Describe the key features, neighborhood, and unique selling points..."
                      className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Location / City
                      </label>
                      <input
                        {...register("location")}
                        placeholder="e.g. Lagos, Nigeria"
                        className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Property Type
                      </label>
                      <select
                        {...register("type")}
                        className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none appearance-none"
                      >
                        <option>Apartment</option>
                        <option>Self-Contain</option>
                        <option>Duplex</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Amenities & Features */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
                  <div className="bg-[#4CAF50]/10 p-2 rounded-full">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">
                    Amenities & Features
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "24/7 Power",
                    "Swimming Pool",
                    "Security",
                    "Gym",
                    "Parking",
                    "WiFi",
                    "Elevator",
                    "Garden",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="mb-2 accent-[#4CAF50]"
                      />
                      <span className="text-[10px] font-bold text-slate-500 text-center uppercase">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Financial & Media (4 Columns) */}
            <div className="lg:col-span-4 space-y-8">
              {/* 3. Financial Breakdown */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
                  <div className="bg-[#4CAF50]/10 p-2 rounded-full">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">
                    Financial Breakdown
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#4CAF50] uppercase ml-1">
                      Basic Rent (Annual)
                    </label>
                    <input
                      type="number"
                      {...register("basicRent")}
                      className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Service Charge
                      </label>
                      <input
                        type="number"
                        {...register("serviceCharge")}
                        className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Legal Fees
                      </label>
                      <input
                        type="number"
                        {...register("legalFee")}
                        className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Caution Fee
                    </label>
                    <input
                      type="number"
                      {...register("cautionFee")}
                      className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                    />
                  </div>
                  <div className="mt-6 p-4 bg-[#4CAF50]/5 rounded-2xl border border-[#4CAF50]/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Total Package
                    </p>
                    <p className="text-2xl font-bold text-[#4CAF50]">
                      ₦{totalPackages.toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Property Media */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-pink-500">
                  <div className="bg-pink-50 p-2 rounded-full">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Property Media</h3>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Click to upload or drag images
                  </p>
                </div>
              </section>

              <button
                type="submit"
                className="w-full py-5 bg-[#00C853] text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-100 hover:bg-[#00B44A] transition-all"
              >
                Publish Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadListingPage;
