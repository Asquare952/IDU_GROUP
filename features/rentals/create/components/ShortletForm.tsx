"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import StepIndicator from "./StepIndicator";
import PropertyInfoStep from "./steps/shortlet/PropertyInfoStep";
import LocationStep from "./steps/shortlet/LocationStep";
import AmenitiesStep from "./steps/shortlet/AmenitieStep";
import PricingAvailaibiliy from "./steps/shortlet/PricingAvailaibiliy";
import MediaStep from "./steps/shortlet/MediaStep";
import HouseRuleStep from "./steps/shortlet/HouseRuleStep";
import ReviewPublishPreview from "./ReviewPublishPreview";

import { shortTermSteps } from "../config/rental-steps";
import {
  useCreateShortlet,
  type CreateShortletPayload,
} from "@/app/api/features/shortlet";
import { toast } from "react-toastify";

interface FormData {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  furnishedStatus: string;
  status: string;
  rentalModel: string;
  bedrooms: Number;
  bathrooms: Number;
  livivngRooms: Number;
  guestCapacity: Number;
  address: string;
  city: string;
  area: string;
  landmark: string;
  pricePerNight: number;
  cleaningFee: number;
  securityDeposit: number;
  minimumStay: string;
  maximumStay: string;
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

export default function ShortletForm() {
  const router = useRouter();
  const { mutate: createShortlet, isPending: isCreating } = useCreateShortlet();
  const [currentStep, setCurrentStep] = useState(0);

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

  const methods = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      location: "",
      furnishedStatus: "",
      propertyType: "",
      status: "",
      rentalModel: "",
      bedrooms: 0,
      bathrooms: 0,
      livivngRooms: 0,
      guestCapacity: 0,
      address: "",
      city: "",
      area: "",
      landmark: "",
      pricePerNight: 0,
      cleaningFee: 0,
      securityDeposit: 0,
      minimumStay: "",
      maximumStay: "",
      smokingAllowed: "",
      petsAllowed: "",
      partiesAllowed: "",
      houseRules: "",
    },
  });

  const {
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((currentAmenities) => {
      return currentAmenities.includes(amenity)
        ? currentAmenities.filter((item) => item !== amenity)
        : [...currentAmenities, amenity];
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadError(null);
    const newFiles = Array.from(files);
    const validFiles: File[] = [];

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

  const handleNext = async () => {
    /*
     * Validate only the fields belonging to the current step
     * before allowing the user to continue.
     */
    if (currentStep === 0) {
      const isValid = await trigger([
        "title",
        "description",
        "furnishedStatus",
        "rentalModel",
        "propertyType",
        "bedrooms",
        "bathrooms",
        "livivngRooms",
        "guestCapacity",
      ]);

      if (!isValid) {
        return;
      }
    }

    if (currentStep < shortTermSteps.length - 1) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    if (images.length === 0) {
      setSubmitError("Please upload at least one image before publishing.");
      return;
    }
    const payload = {
      title: data.title,
      description: data.description,
      rentalModel: data.rentalModel,
      propertyType: data.propertyType,
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      livingRooms: Number(data.livivngRooms),
      guestCapacity: Number(data.guestCapacity),
      furnishingStatus: data.furnishedStatus,
      address: data.address,
      city: data.city,
      area: data.area,
      landmark: data.landmark,
      pricePerNight: Number(data.pricePerNight),
      cleaningFee: Number(data.cleaningFee),
      securityDeposit: Number(data.securityDeposit),
      minimumStay: Number(data.minimumStay),
      maximumStay: Number(data.maximumStay),
      availableFrom: data.availableFrom,
      availableTo: data.availableTo,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      smokingAllowed: data.smokingAllowed === "true",
      petsAllowed: data.petsAllowed === "true",
      partiesAllowed: data.partiesAllowed === "true",
      houseRules: data.houseRules ? [data.houseRules] : [],
      status: data.status || "available",
      amenities: selectedAmenities,
      images,
      videos,
    } as CreateShortletPayload;
    createShortlet(payload, {
      onSuccess: () => {
        toast.success("Shortlet published successfully!");
        router.push("/landlord/my-listings");
      },
      onError: (error) =>
        setSubmitError(error.message || "Unable to publish this shortlet."),
    });
    // setUploadError(null);
    // setIsSubmitting(true);
    // setSubmitError(null);
    // // Validate required fields
    // if (images.length === 0) {
    //   setSubmitError("Please upload at least one image.");
    //   setIsSubmitting(false);
    //   return;
    // }
    // // Calculate total file size
    // const totalSize = [...images, ...videos].reduce(
    //   (sum, file) => sum + file.size,
    //   0,
    // );
    // if (totalSize > MAX_TOTAL_SIZE) {
    //   setSubmitError(
    //     `Total file size exceeds 200MB limit. Please reduce file sizes or remove some files.`,
    //   );
    //   setIsSubmitting(false);
    //   return;
    // }
    // try {
    //   // Build payload matching CreateRentalPayload expected by rentalApi
    //   const payload: CreateRentalPayload = {
    //     title: data.title,
    //     description: data.description,
    //     propertyType: data.propertyType,
    //     location: data.location,
    //     price: totalPackages,
    //     legalFee: toMoneyNumber(data.legalFee),
    //     cautionFee: toMoneyNumber(data.cautionFee),
    //     brokeFee: toMoneyNumber(data.brokeFee),
    //     mgtServiceCharge: toMoneyNumber(data.mgtServiceCharge),
    //     priceType: "yearly",
    //     status: data.status,
    //     images: images,
    //     videos: videos,
    //     amenities: selectedAmenities,
    //   };
    //   await rentalApi.createRental(payload);
    //   toast.success("Property uploaded successfully!");
    //   // Success — redirect to listings
    //   router.push("/landlord/my-listings");
    // } catch (err: any) {
    //   console.error("Upload failed:", err);
    //   // Provide mobile-friendly error messages
    //   let errorMessage =
    //     err.response?.data?.message ||
    //     err.message ||
    //     "Failed to upload listing.";
    //   if (
    //     errorMessage.toLowerCase().includes("413") ||
    //     errorMessage.toLowerCase().includes("payload")
    //   ) {
    //     errorMessage =
    //       "Files are too large. Try compressing videos or uploading fewer files.";
    //   } else if (errorMessage.toLowerCase().includes("timeout")) {
    //     errorMessage =
    //       "Upload timed out. Try uploading on a faster connection or with fewer/smaller files.";
    //   } else if (errorMessage.toLowerCase().includes("network")) {
    //     errorMessage = "Network error. Check your connection and try again.";
    //   }
    //   setSubmitError(errorMessage);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className=" w-full space-y-8 container-2">
          {/* Step indicator */}
          <StepIndicator steps={shortTermSteps} currentStep={currentStep} />

          {/* Page heading */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Property
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add your property details to create a new listing.
            </p>
          </div>

          {/* Form content */}
          <div className="">
            {currentStep === 0 && (
              <PropertyInfoStep methods={methods} errors={errors} />
            )}

            {currentStep === 1 && (
              <LocationStep methods={methods} errors={errors} />
            )}

            {currentStep === 2 && (
              <AmenitiesStep
                toggle={toggleAmenity}
                selected={(item) => selectedAmenities.includes(item)}
                methods={methods}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <MediaStep
                images={images}
                imagePreviews={imagePreviews}
                videos={videos}
                videoPreviews={videoPreviews}
                handleImageChange={handleImageChange}
                handleVideoChange={handleVideoChange}
                removeImage={removeImage}
                removeVideo={removeVideo}
              />
            )}

            {currentStep === 4 && (
              <PricingAvailaibiliy methods={methods} errors={errors} />
            )}

            {currentStep === 5 && (
              <HouseRuleStep methods={methods} errors={errors} />
            )}

            {currentStep === 6 && (
              <ReviewPublishPreview
                values={watch()}
                amenities={selectedAmenities}
                imagePreviews={imagePreviews}
                videoPreviews={videoPreviews}
                isShortlet={true}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {currentStep < shortTermSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                onClick={() => onSubmit}
                disabled={isCreating}
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                {isCreating ? "Publishing..." : "Publish Property"}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
