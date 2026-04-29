"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { useForm } from "react-hook-form";
import {
  Upload,
  Info,
  DollarSign,
  Sparkles,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { rentalApi } from "@/app/api/features/rental";

interface FormData {
  title: string;
  description: string;
  location: string;
  type: string;
  basicRent: number;
  serviceCharge: number;
  legalFee: number;
  cautionFee: number;
}

const page = () => {
  const router = useRouter();
  const [totalPackages, setTotalPackages] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "apartment",
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

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove an image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await rentalApi.createRental({
        title: data.title,
        description: data.description,
        propertyType: data.type,
        location: data.location,
        price: data.basicRent,
        priceType: "yearly",
        status: "available",
        images: images,
      });

      // Success — redirect to listings
      router.push("/landlord/my-listings");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Failed to upload listing. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
              {submitError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8 space-y-8">
              {/* General Information */}
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
                      Property Title *
                    </label>
                    <input
                      {...register("title", { required: "Title is required" })}
                      placeholder="e.g. Luxury 3-Bedroom apartment with Ocean View"
                      className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs ml-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Description *
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      rows={5}
                      placeholder="Describe the key features, neighborhood, and unique selling points..."
                      className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none focus:ring-2 focus:ring-[#4CAF50]"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs ml-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Location / City *
                      </label>
                      <input
                        {...register("location", {
                          required: "Location is required",
                        })}
                        placeholder="e.g. Lagos, Nigeria"
                        className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-xs ml-1">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Property Type
                      </label>
                      <select
                        {...register("type")}
                        className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none appearance-none"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="office">Office</option>
                        <option value="commercial">Commercial</option>
                        <option value="land">Land</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Amenities & Features */}
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

            <div className="lg:col-span-4 space-y-8">
              {/* Financial Breakdown */}
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
                      Basic Rent (Annual) *
                    </label>
                    <input
                      type="number"
                      {...register("basicRent", {
                        required: "Rent is required",
                        min: { value: 1, message: "Must be greater than 0" },
                      })}
                      className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                    />
                    {errors.basicRent && (
                      <p className="text-red-500 text-xs ml-1">
                        {errors.basicRent.message}
                      </p>
                    )}
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

              {/* Property Media */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-pink-500">
                  <div className="bg-pink-50 p-2 rounded-full">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Property Media</h3>
                </div>

                {/* Image Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Click to upload or drag images
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {images.length} image(s) selected
                    </p>
                  </div>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <button
                type="submit"
                disabled={isSubmitting || images.length === 0}
                className="w-full py-5 bg-[#00C853] text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-100 hover:bg-[#00B44A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Property"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page 
