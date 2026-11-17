"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import StepIndicator from "./StepIndicator";
import PropertyInformationStep from "./steps/PropertyInformationStep";
import AmenitiesStep from "./steps/AmenitiesStep";
import FinancialBreakdownStep from "./steps/FinancialBreakdownStep";
import MediaStep from "./steps/MediaStep";
import ReviewPublishPreview from "./ReviewPublishPreview";
import { useRentalFormDraft } from "../hooks/useRentalFormDraft";

import { longTermSteps } from "../config/rental-steps";
import {
  type CreateRentalPayload,
  useCreateRental,
} from "@/app/api/features/rental";
import { toast } from "react-toastify";

interface FormData {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  status: string;
  basicRent: number;
  legalFee: number;
  cautionFee: number;
  brokeFee: number;
  mgtServiceCharge: number;
  inspectionFee: number;
}

const defaultValues: FormData = {
  title: "",
  description: "",
  location: "",
  propertyType: "apartment",
  status: "available",
  basicRent: 0,
  legalFee: 0,
  cautionFee: 0,
  brokeFee: 0,
  mgtServiceCharge: 0,
  inspectionFee: 0,
};

const toMoneyNumber = (value: unknown): number => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

export default function CreateRentalForm() {
  const router = useRouter();
  const { mutate: createRental, isPending: isCreating } = useCreateRental();
  const [currentStep, setCurrentStep] = useState(0);

  const [totalPackages, setTotalPackages] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  const getMediaCountError = (imageCount: number, videoCount: number) => {
    if (imageCount > 0 && videoCount > 0) {
      if (imageCount > 4 || videoCount > 2) {
        return "When uploading both, use no more than 4 images and 2 videos.";
      }
      return null;
    }

    if (imageCount > 10) return "You can upload up to 10 images.";
    if (videoCount > 4) return "You can upload up to 4 videos.";
    return null;
  };

  const methods = useForm<FormData>({
    mode: "onTouched",
    defaultValues,
  });

  const {
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const { draftError, clearDraft } = useRentalFormDraft(
    "rentulo-long-term-rental-draft",
    methods,
    defaultValues,
    selectedAmenities,
    setSelectedAmenities,
    currentStep,
    setCurrentStep,
    longTermSteps.length,
  );

  const fees = watch([
    "basicRent",
    "legalFee",
    "cautionFee",
    "brokeFee",
    "mgtServiceCharge",
  ]);

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
    const countError = getMediaCountError(
      images.length + validFiles.length,
      videos.length,
    );
    if (countError) {
      setUploadError(countError);
      return;
    }

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
    const countError = getMediaCountError(
      images.length,
      videos.length + validFiles.length,
    );
    if (countError) {
      setUploadError(countError);
      return;
    }

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
        "location",
        "status",
        "propertyType",
      ]);

      if (!isValid) {
        return;
      }
    }

    if (currentStep < longTermSteps.length - 1) {
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
    if (currentStep !== longTermSteps.length - 1) return;
    setSubmitError(null);
    if (images.length === 0 && videos.length === 0) {
      setSubmitError("Please upload at least one image or video.");
      return;
    }
    const mediaCountError = getMediaCountError(images.length, videos.length);
    if (mediaCountError) {
      setSubmitError(mediaCountError);
      return;
    }
    const payload: CreateRentalPayload = {
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      location: data.location,
      price: toMoneyNumber(data.basicRent),
      legalFee: toMoneyNumber(data.legalFee),
      cautionFee: toMoneyNumber(data.cautionFee),
      brokeFee: toMoneyNumber(data.brokeFee),
      mgtServiceCharge: toMoneyNumber(data.mgtServiceCharge),
      inspectionFee: toMoneyNumber(data.inspectionFee),
      priceType: "yearly",
      status: data.status,
      images,
      videos,
      amenities: selectedAmenities,
    };
    createRental(payload, {
      onSuccess: () => {
        clearDraft();
        toast.success("Property published successfully!");
        router.push("/landlord/my-listings");
      },
      onError: (error) =>
        setSubmitError(error.message || "Unable to publish this property."),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(event) => event.preventDefault()} className="w-full">
        <div className=" w-full space-y-8 container-2">
          {/* Step indicator */}
          <StepIndicator steps={longTermSteps} currentStep={currentStep} />

          {/* Page heading */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Property
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add your property details to create a new listing.
            </p>
          </div>

          <div
            className={`rounded-xl p-3 text-sm ${
              draftError
                ? "bg-amber-50 text-amber-800"
                : "bg-green-50 text-green-800"
            }`}
            role={draftError ? "alert" : "status"}
          >
            {draftError ||
              "Your form details are saved as a draft in this browser. Re-select photos and videos after refreshing."}
          </div>

          {/* Form content */}
          <div className="">
            {currentStep === 0 && (
              <PropertyInformationStep methods={methods} errors={errors} />
            )}

            {currentStep === 1 && (
              <AmenitiesStep
                toggle={toggleAmenity}
                selected={(item) => selectedAmenities.includes(item)}
                methods={methods}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <MediaStep
                images={images}
                imagePreviews={imagePreviews}
                videos={videos}
                videoPreviews={videoPreviews}
                uploadError={uploadError}
                handleImageChange={handleImageChange}
                handleVideoChange={handleVideoChange}
                removeImage={removeImage}
                removeVideo={removeVideo}
              />
            )}

            {currentStep === 3 && (
              <FinancialBreakdownStep
                methods={methods}
                errors={errors}
                totalPackages={totalPackages}
              />
            )}

            {currentStep === 4 && (
              <ReviewPublishPreview
                values={watch()}
                amenities={selectedAmenities}
                imagePreviews={imagePreviews}
                videoPreviews={videoPreviews}
                isShortlet={false}
              />
            )}
          </div>

          {(submitError || uploadError) && (
            <p
              className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {submitError || uploadError}
            </p>
          )}

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

            {currentStep < longTermSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
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
