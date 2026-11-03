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
import { rentalApi, type CreateRentalPayload } from "@/app/api/features/rental";
import {
  createShortlet,
  type CreateShortletPayload,
  type ShortletPropertyType,
} from "@/app/api/features/shortlet";
import { toast } from "react-toastify";

interface FormData {
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  basicRent: number;
  legalFee: number;
  cautionFee: number;
  brokeFee: number;
  mgtServiceCharge: number;
  rentalModel: "entire_place" | "private_room" | "shared_room" | "hotel";
  shortletPropertyType: ShortletPropertyType;
  address: string;
  area: string;
  landmark: string;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  guestCapacity: number;
  furnishingStatus: "unfurnished" | "semi_furnished" | "fully_furnished";
  cleaningFee: number;
  securityDeposit: number;
  minimumStay: number;
  maximumStay: number;
  availableFrom: string;
  availableTo: string;
  checkInTime: string;
  checkOutTime: string;
  smokingAllowed: string;
  petsAllowed: string;
  partiesAllowed: string;
  houseRules: string;
}

const toMoneyNumber = (value: unknown): number => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const page = () => {
  const router = useRouter();
  const [totalPackages, setTotalPackages] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB total

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
      status: "available",
      basicRent: 0,
      legalFee: 0,
      cautionFee: 0,
      brokeFee: 0,
      mgtServiceCharge: 0,
      rentalModel: "entire_place",
      shortletPropertyType: "apartment",
      address: "",
      area: "",
      landmark: "",
      bedrooms: 1,
      bathrooms: 1,
      livingRooms: 1,
      guestCapacity: 2,
      furnishingStatus: "fully_furnished",
      cleaningFee: 0,
      securityDeposit: 0,
      minimumStay: 1,
      maximumStay: 30,
      availableFrom: "",
      availableTo: "",
      checkInTime: "",
      checkOutTime: "",
      smokingAllowed: "false",
      petsAllowed: "false",
      partiesAllowed: "false",
      houseRules: "",
    },
  });

  const fees = watch([
    "basicRent",
    "legalFee",
    "cautionFee",
    "brokeFee",
    "mgtServiceCharge",
  ]);
  const isShortlet = watch("type") === "shortlets";
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((currentAmenities) => {
      return currentAmenities.includes(amenity)
        ? currentAmenities.filter((item) => item !== amenity)
        : [...currentAmenities, amenity];
    });
  };

  useEffect(() => {
    const sum = fees.reduce((acc, curr) => acc + toMoneyNumber(curr), 0);
    setTotalPackages(sum);
  }, [fees]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadError(null);
    const newFiles = Array.from(files);
    const validFiles: File[] = [];

    if (isShortlet && images.length + newFiles.length > 6) {
      setUploadError("Shortlet listings can include up to 6 images.");
      return;
    }

    // Validate each file
    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        setUploadError(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError(`${file.name} is too large. Max 5MB per image.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setImages((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.onerror = () => {
        setUploadError(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadError(null);
    const newFiles = Array.from(files);
    const validFiles: File[] = [];

    if (isShortlet && videos.length + newFiles.length > 2) {
      setUploadError("Shortlet listings can include up to 2 videos.");
      return;
    }

    // Validate each file
    for (const file of newFiles) {
      // Check video MIME type more strictly for mobile compatibility
      const isValidVideoType =
        file.type === "video/mp4" ||
        file.type === "video/quicktime" ||
        file.type === "video/x-msvideo" ||
        file.type === "video/webm" ||
        file.type === "video/mpeg" ||
        file.type.startsWith("video/");

      if (!isValidVideoType) {
        setUploadError(
          `${file.name} is not a supported video format. Use MP4, MOV, AVI, or WebM.`,
        );
        continue;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        setUploadError(
          `${file.name} is too large. Max 50MB per video. Consider compressing.`,
        );
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setVideos((prev) => [...prev, ...validFiles]);

    // Create preview URLs only for small files to avoid memory issues
    validFiles.forEach((file) => {
      // Skip preview for very large files on mobile
      if (file.size > 10 * 1024 * 1024) {
        // > 10MB
        setVideoPreviews((prev) => [
          ...prev,
          `data:video/mp4;base64,LARGE_FILE`,
        ]);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.onerror = () => {
        setUploadError(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove an image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a video
  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    setUploadError(null);
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate required fields
    if (images.length === 0) {
      setSubmitError("Please upload at least one image.");
      setIsSubmitting(false);
      return;
    }

    // Calculate total file size
    const totalSize = [...images, ...videos].reduce(
      (sum, file) => sum + file.size,
      0,
    );

    if (totalSize > MAX_TOTAL_SIZE) {
      setSubmitError(
        `Total file size exceeds 200MB limit. Please reduce file sizes or remove some files.`,
      );
      setIsSubmitting(false);
      return;
    }

    try {
      if (data.type === "shortlets") {
        if (new Date(data.availableTo) < new Date(data.availableFrom)) {
          setSubmitError("Availability end date cannot be before its start date.");
          return;
        }
        if (
          toMoneyNumber(data.maximumStay) <
          toMoneyNumber(data.minimumStay)
        ) {
          setSubmitError("Maximum stay cannot be less than minimum stay.");
          return;
        }

        const shortletPayload: CreateShortletPayload = {
          title: data.title,
          description: data.description,
          rentalModel: data.rentalModel,
          propertyType: data.shortletPropertyType,
          bedrooms: toMoneyNumber(data.bedrooms),
          bathrooms: toMoneyNumber(data.bathrooms),
          livingRooms: toMoneyNumber(data.livingRooms),
          guestCapacity: toMoneyNumber(data.guestCapacity),
          furnishingStatus: data.furnishingStatus,
          address: data.address,
          city: data.location,
          area: data.area,
          landmark: data.landmark,
          pricePerNight: toMoneyNumber(data.basicRent),
          cleaningFee: toMoneyNumber(data.cleaningFee),
          securityDeposit: toMoneyNumber(data.securityDeposit),
          minimumStay: toMoneyNumber(data.minimumStay),
          maximumStay: toMoneyNumber(data.maximumStay),
          availableFrom: data.availableFrom,
          availableTo: data.availableTo,
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          smokingAllowed: data.smokingAllowed === "true",
          petsAllowed: data.petsAllowed === "true",
          partiesAllowed: data.partiesAllowed === "true",
          houseRules: data.houseRules
            .split(/\r?\n/)
            .map((rule) => rule.trim())
            .filter(Boolean),
          status: data.status,
          images,
          videos,
          amenities: selectedAmenities,
        };

        await createShortlet(shortletPayload);
        toast.success("Shortlet uploaded successfully!");
        router.push("/landlord/my-listings");
        return;
      }

      // Build payload matching CreateRentalPayload expected by rentalApi
      const payload: CreateRentalPayload = {
        title: data.title,
        description: data.description,
        propertyType: data.type,
        location: data.location,
        price: totalPackages,
        legalFee: toMoneyNumber(data.legalFee),
        cautionFee: toMoneyNumber(data.cautionFee),
        brokeFee: toMoneyNumber(data.brokeFee),
        mgtServiceCharge: toMoneyNumber(data.mgtServiceCharge),
        priceType: isShortlet ? "nightly" : "yearly",
        status: data.status,
        images: images,
        videos: videos,
        amenities: selectedAmenities,
      };

      await rentalApi.createRental(payload);

      toast.success("Property uploaded successfully!");
      // Success — redirect to listings
      router.push("/landlord/my-listings");
    } catch (err: any) {
      console.error("Upload failed:", err);

      // Provide mobile-friendly error messages
      let errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload listing.";

      if (
        errorMessage.toLowerCase().includes("413") ||
        errorMessage.toLowerCase().includes("payload")
      ) {
        errorMessage =
          "Files are too large. Try compressing videos or uploading fewer files.";
      } else if (errorMessage.toLowerCase().includes("timeout")) {
        errorMessage =
          "Upload timed out. Try uploading on a faster connection or with fewer/smaller files.";
      } else if (errorMessage.toLowerCase().includes("network")) {
        errorMessage = "Network error. Check your connection and try again.";
      }

      setSubmitError(errorMessage);
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

          {uploadError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm flex justify-between items-center">
              <span>{uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-amber-700 hover:text-amber-800 font-bold"
              >
                ✕
              </button>
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
                      <select
                        {...register("location", {
                          required: "Location is required",
                        })}
                        className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                      >
                        <option value="">Select a location</option>
                        <option value="lagos">Lagos</option>
                        <option value="abuja">Abuja</option>
                        <option value="port-harcourt">Jos</option>
                        <option value="imo">Imo</option>
                        <option value="enugu">Enugu</option>
                        <option value="enugu">Abia</option>
                      </select>
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
                        className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none "
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="land">Land</option>
                        <option value="lodge">Lodge</option>
                        <option value="self-contain">Self-contain</option>
                        <option value="shortlets">Shortlets</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      House Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full p-4 bg-[#F8FAFC] rounded-2xl border-none"
                    >
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="locked">Locked</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                </div>
                {isShortlet && (
                  <section className="mt-6 space-y-5 border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-800">
                      Shortlet details
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Rental model
                        <select
                          {...register("rentalModel", { required: true })}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        >
                          <option value="entire_place">Entire place</option>
                          <option value="private_room">Private room</option>
                          <option value="shared_room">Shared room</option>
                          <option value="hotel">Hotel</option>
                        </select>
                      </label>
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Accommodation type
                        <select
                          {...register("shortletPropertyType", {
                            required: true,
                          })}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        >
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                          <option value="villa">Villa</option>
                          <option value="studio">Studio</option>
                          <option value="condo">Condo</option>
                          <option value="townhouse">Townhouse</option>
                          <option value="bungalow">Bungalow</option>
                          <option value="loft">Loft</option>
                        </select>
                      </label>
                    </div>
                    <label className="block space-y-2 text-xs font-semibold text-slate-600">
                      Full address
                      <input
                        {...register("address", { required: isShortlet })}
                        className="w-full rounded-xl bg-[#F8FAFC] p-3"
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Area
                        <input
                          {...register("area")}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Nearby landmark
                        <input
                          {...register("landmark")}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {(
                        [
                          ["bedrooms", "Bedrooms"],
                          ["bathrooms", "Bathrooms"],
                          ["livingRooms", "Living rooms"],
                          ["guestCapacity", "Guest capacity"],
                        ] as const
                      ).map(([name, label]) => (
                        <label
                          key={name}
                          className="space-y-2 text-xs font-semibold text-slate-600"
                        >
                          {label}
                          <input
                            type="number"
                            min={0}
                            {...register(name, { valueAsNumber: true })}
                            className="w-full rounded-xl bg-[#F8FAFC] p-3"
                          />
                        </label>
                      ))}
                      <label className="col-span-2 space-y-2 text-xs font-semibold text-slate-600 sm:col-span-1">
                        Furnishing
                        <select
                          {...register("furnishingStatus")}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        >
                          <option value="unfurnished">Unfurnished</option>
                          <option value="semi_furnished">Semi-furnished</option>
                          <option value="fully_furnished">Fully furnished</option>
                        </select>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Available from
                        <input
                          type="date"
                          {...register("availableFrom", {
                            required: isShortlet,
                          })}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Available to
                        <input
                          type="date"
                          {...register("availableTo", {
                            required: isShortlet,
                          })}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {(
                        [
                          ["minimumStay", "Minimum nights"],
                          ["maximumStay", "Maximum nights"],
                        ] as const
                      ).map(([name, label]) => (
                        <label
                          key={name}
                          className="space-y-2 text-xs font-semibold text-slate-600"
                        >
                          {label}
                          <input
                            type="number"
                            min={1}
                            {...register(name, { valueAsNumber: true })}
                            className="w-full rounded-xl bg-[#F8FAFC] p-3"
                          />
                        </label>
                      ))}
                      {(
                        [
                          ["checkInTime", "Check-in"],
                          ["checkOutTime", "Check-out"],
                        ] as const
                      ).map(([name, label]) => (
                        <label
                          key={name}
                          className="space-y-2 text-xs font-semibold text-slate-600"
                        >
                          {label} time
                          <input
                            type="time"
                            {...register(name)}
                            className="w-full rounded-xl bg-[#F8FAFC] p-3"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {(
                        [
                          ["smokingAllowed", "Smoking allowed"],
                          ["petsAllowed", "Pets allowed"],
                          ["partiesAllowed", "Parties allowed"],
                        ] as const
                      ).map(([name, label]) => (
                        <label
                          key={name}
                          className="space-y-2 text-xs font-semibold text-slate-600"
                        >
                          {label}
                          <select
                            {...register(name)}
                            className="w-full rounded-xl bg-[#F8FAFC] p-3"
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </label>
                      ))}
                    </div>
                    <label className="block space-y-2 text-xs font-semibold text-slate-600">
                      House rules (one per line)
                      <textarea
                        rows={3}
                        {...register("houseRules")}
                        className="w-full rounded-xl bg-[#F8FAFC] p-3"
                      />
                    </label>
                  </section>
                )}
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
                    "kitchen",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(item)}
                        onChange={() => toggleAmenity(item)}
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
              {/* Financial fields keep the existing API structure; the base
                  price period follows the selected rental type. */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
                  <div className="bg-[#4CAF50]/10 p-2 rounded-full">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">
                    {isShortlet ? "Nightly Rate & Charges" : "Financial Breakdown"}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#4CAF50] uppercase ml-1">
                      {isShortlet ? "Price per night *" : "Basic Rent (Annual) *"}
                    </label>
                    <input
                      type="number"
                      {...register("basicRent", {
                        valueAsNumber: true,
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
                  {isShortlet ? (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Cleaning fee
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          {...register("cleaningFee", { valueAsNumber: true })}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        />
                      </label>
                      <label className="space-y-2 text-xs font-semibold text-slate-600">
                        Security deposit
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          {...register("securityDeposit", {
                            valueAsNumber: true,
                          })}
                          className="w-full rounded-xl bg-[#F8FAFC] p-3"
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Mgt Service Charge
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("mgtServiceCharge", {
                          valueAsNumber: true,
                        })}
                        className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Legal Fees
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("legalFee", { valueAsNumber: true })}
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
                      step="0.01"
                      {...register("cautionFee", { valueAsNumber: true })}
                      className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                      Broke Fee
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("brokeFee", { valueAsNumber: true })}
                      className="w-full p-3 bg-[#F8FAFC] rounded-xl"
                    />
                  </div>
                    </>
                  )}
                  <div className="mt-6 p-4 bg-[#4CAF50]/5 rounded-2xl border border-[#4CAF50]/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {isShortlet ? "Nightly rate" : "Total Package"}
                    </p>
                    <p className="text-2xl font-bold text-[#4CAF50]">
                      ₦
                      {(isShortlet
                        ? toMoneyNumber(fees[0])
                        : totalPackages
                      ).toLocaleString()}
                      {isShortlet && (
                        <span className="ml-1 text-sm font-medium">/ night</span>
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Property Media */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-[#43A047]">
                  <div className="bg-[#E8F5E9] p-2 rounded-full">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Property Images</h3>
                </div>

                {/* Image Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Click to upload or drag images
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {images.length} image(s) selected • Max 5MB each
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

              {/* Property Videos */}
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 text-[#43A047]">
                  <div className="bg-[#E8F5E9] p-2 rounded-full">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Property Videos</h3>
                </div>
                {/* Video Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,video/mpeg"
                    onChange={handleVideoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Click to upload or drag videos (MP4, MOV, WebM)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {videos.length} video(s) selected • Max 50MB each
                    </p>
                  </div>
                </div>
                {videoPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {videoPreviews.map((preview, index) => {
                      const isLargeFile = preview.includes("LARGE_FILE");
                      const fileName =
                        videos[index]?.name || `Video ${index + 1}`;
                      const fileSize = videos[index]
                        ? `${(videos[index].size / 1024 / 1024).toFixed(1)}MB`
                        : "";

                      return (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                        >
                          {isLargeFile ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 p-2">
                              <div className="text-center">
                                <p className="text-xs font-bold text-gray-700 truncate">
                                  {fileName}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {fileSize}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-2">
                                  Large file
                                </p>
                              </div>
                            </div>
                          ) : (
                            <video
                              src={preview}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
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

export default page;
