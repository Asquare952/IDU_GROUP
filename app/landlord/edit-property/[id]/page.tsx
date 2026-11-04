"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import {
  useGetRentalById,
  useUpdateRental,
  type UpdateRentalPayload,
} from "@/app/api/features/rental";
import {
  useFetchShortletById,
  useUpdateShortlet,
  type UpdateShortletPayload,
} from "@/app/api/features/shortlet";
import type { Property as ShortletProperty } from "@/app/api/features/property/types";
import StepIndicator from "@/features/rentals/create/components/StepIndicator";
import PropertyInformationStep from "@/features/rentals/create/components/steps/PropertyInformationStep";
import AmenitiesStep from "@/features/rentals/create/components/steps/AmenitiesStep";
import MediaStep from "@/features/rentals/create/components/steps/MediaStep";
import FinancialBreakdownStep from "@/features/rentals/create/components/steps/FinancialBreakdownStep";
import ShortletPropertyInfoStep from "@/features/rentals/create/components/steps/shortlet/PropertyInfoStep";
import ShortletLocationStep from "@/features/rentals/create/components/steps/shortlet/LocationStep";
import ShortletAmenitiesStep from "@/features/rentals/create/components/steps/shortlet/AmenitieStep";
import ShortletMediaStep from "@/features/rentals/create/components/steps/shortlet/MediaStep";
import PricingAvailabilityStep from "@/features/rentals/create/components/steps/shortlet/PricingAvailaibiliy";
import HouseRuleStep from "@/features/rentals/create/components/steps/shortlet/HouseRuleStep";
import {
  longTermSteps,
  shortTermSteps,
} from "@/features/rentals/create/config/rental-steps";

type EditForm = Record<string, string | number> & {
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
  pricePerNight: number;
  cleaningFee: number;
  securityDeposit: number;
};
const defaults: EditForm = {
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
  furnishedStatus: "",
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
  availableFrom: "",
  availableTo: "",
  checkInTime: "",
  checkOutTime: "",
  smokingAllowed: "",
  petsAllowed: "",
  partiesAllowed: "",
  houseRules: "",
};
const number = (value: unknown) =>
  Number.isFinite(Number(value)) ? Number(value) : 0;
const dateInputValue = (value?: string) => value?.slice(0, 10) ?? "";
const timeInputValue = (value?: string) => value?.slice(0, 5) ?? "";
const booleanInputValue = (value?: boolean) =>
  value === undefined ? "" : String(value);

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isShortletRequest = searchParams.get("model") === "shortlet";
  const rentalQuery = useGetRentalById(id, {
    enabled: Boolean(id) && !isShortletRequest,
  });
  const shortletQuery = useFetchShortletById(id, isShortletRequest);
  const rental = isShortletRequest ? shortletQuery.data : rentalQuery.data;
  const isLoading = isShortletRequest
    ? shortletQuery.isLoading
    : rentalQuery.isLoading;
  const isError = isShortletRequest ? shortletQuery.isError : rentalQuery.isError;
  const error = isShortletRequest ? shortletQuery.error : rentalQuery.error;
  const { mutate: updateRental, isPending: isUpdatingRental } = useUpdateRental(
    id ?? "",
  );
  const { mutate: updateShortlet, isPending: isUpdatingShortlet } =
    useUpdateShortlet(id ?? "");
  const isPending = isShortletRequest ? isUpdatingShortlet : isUpdatingRental;
  const methods = useForm<EditForm>({
    mode: "onTouched",
    defaultValues: defaults,
  });
  const {
    reset,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const [step, setStep] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [removedVideos, setRemovedVideos] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const shortlet =
    isShortletRequest ||
    Boolean(rental &&
    (rental.propertyType.toLowerCase() === "shortlets" ||
      ["nightly", "daily", "shortlet"].includes(
        rental.priceType.toLowerCase(),
      )));
  const steps = shortlet ? shortTermSteps : longTermSteps;
  const fees = watch([
    "basicRent",
    "legalFee",
    "cautionFee",
    "brokeFee",
    "mgtServiceCharge",
  ]);
  const total = useMemo(
    () => fees.reduce((sum, fee) => sum + number(fee), 0),
    [fees],
  );
  const existingImages =
    rental?.images.filter((item) => !removedImages.includes(item)) ?? [];
  const existingVideos =
    rental?.videos.filter((item) => !removedVideos.includes(item)) ?? [];

  useEffect(() => {
    if (!rental) return;
    const shortletDetails = isShortletRequest
      ? (rental as ShortletProperty)
      : undefined;
    const legalFee = number(rental.legalFee),
      cautionFee = number(rental.cautionFee),
      brokeFee = number(rental.brokeFee),
      mgtServiceCharge = number(rental.mgtServiceCharge);
    reset({
      ...defaults,
      title: rental.title,
      description: rental.description,
      location: rental.location,
      propertyType: rental.propertyType || "apartment",
      status: rental.status || "available",
      basicRent: Math.max(
        number(rental.price) -
          legalFee -
          cautionFee -
          brokeFee -
          mgtServiceCharge,
        0,
      ),
      legalFee,
      cautionFee,
      brokeFee,
      mgtServiceCharge,
      furnishedStatus: shortletDetails?.furnishingStatus ?? "",
      rentalModel: shortletDetails?.rentalModel ?? "",
      bedrooms: number(shortletDetails?.bedrooms),
      bathrooms: number(shortletDetails?.bathrooms),
      livivngRooms: number(shortletDetails?.livingRooms),
      guestCapacity: number(shortletDetails?.guestCapacity),
      address: shortletDetails?.address ?? "",
      city: shortletDetails?.city ?? "",
      area: shortletDetails?.area ?? "",
      landmark: shortletDetails?.landmark ?? "",
      pricePerNight: number(shortletDetails?.price ?? rental.price),
      cleaningFee: number(shortletDetails?.cleaningFee),
      securityDeposit: number(shortletDetails?.securityDeposit),
      minimumStay: shortletDetails?.minimumStay ?? "",
      maximumStay: shortletDetails?.maximumStay ?? "",
      availableFrom: dateInputValue(shortletDetails?.availableFrom),
      availableTo: dateInputValue(shortletDetails?.availableTo),
      checkInTime: timeInputValue(shortletDetails?.checkInTime),
      checkOutTime: timeInputValue(shortletDetails?.checkOutTime),
      smokingAllowed: booleanInputValue(shortletDetails?.smokingAllowed),
      petsAllowed: booleanInputValue(shortletDetails?.petsAllowed),
      partiesAllowed: booleanInputValue(shortletDetails?.partiesAllowed),
      houseRules: shortletDetails?.houseRules?.join("\n") ?? "",
    });
    setAmenities(rental.amenities ?? []);
    setStep(0);
  }, [rental, reset]);
  useEffect(
    () => () => {
      imagePreviews.forEach(URL.revokeObjectURL);
      videoPreviews.forEach(URL.revokeObjectURL);
    },
    [imagePreviews, videoPreviews],
  );

  const toggleAmenity = (item: string) =>
    setAmenities((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  const addMedia = (
    event: React.ChangeEvent<HTMLInputElement>,
    kind: "image" | "video",
  ) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith(`${kind}/`),
    );
    if (kind === "image") {
      setImages((current) => [...current, ...files]);
      setImagePreviews((current) => [
        ...current,
        ...files.map(URL.createObjectURL),
      ]);
    } else {
      setVideos((current) => [...current, ...files]);
      setVideoPreviews((current) => [
        ...current,
        ...files.map(URL.createObjectURL),
      ]);
    }
    event.target.value = "";
  };
  const removeNew = (kind: "image" | "video", index: number) => {
    const previews = kind === "image" ? imagePreviews : videoPreviews;
    URL.revokeObjectURL(previews[index]);
    if (kind === "image") {
      setImages((current) => current.filter((_, i) => i !== index));
      setImagePreviews((current) => current.filter((_, i) => i !== index));
    } else {
      setVideos((current) => current.filter((_, i) => i !== index));
      setVideoPreviews((current) => current.filter((_, i) => i !== index));
    }
  };
  const next = async () => {
    const required = shortlet
      ? step === 0
        ? ["title", "description", "propertyType", "rentalModel"]
        : []
      : step === 0
        ? ["title", "description", "location", "propertyType", "status"]
        : step === 3
          ? ["basicRent"]
          : [];
    if (required.length && !(await trigger(required as (keyof EditForm)[])))
      return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const submit = (data: EditForm) => {
    if (!id || !rental) return;
    setSubmitError(null);
    const callbacks = {
      onSuccess: () => router.push("/landlord/my-listings"),
      onError: (err: unknown) =>
        setSubmitError(
          err instanceof Error ? err.message : "Unable to save changes.",
        ),
    };

    if (isShortletRequest) {
      const shortletPayload = {
        title: data.title,
        description: data.description,
        rentalModel: data.rentalModel,
        propertyType: data.propertyType,
        bedrooms: number(data.bedrooms),
        bathrooms: number(data.bathrooms),
        livingRooms: number(data.livivngRooms),
        guestCapacity: number(data.guestCapacity),
        address: data.address,
        city: data.city,
        area: data.area,
        landmark: data.landmark,
        pricePerNight: number(data.pricePerNight),
        cleaningFee: number(data.cleaningFee),
        securityDeposit: number(data.securityDeposit),
        minimumStay: number(data.minimumStay),
        maximumStay: number(data.maximumStay),
        availableFrom: data.availableFrom,
        availableTo: data.availableTo,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        smokingAllowed: data.smokingAllowed === "true",
        petsAllowed: data.petsAllowed === "true",
        partiesAllowed: data.partiesAllowed === "true",
        houseRules: String(data.houseRules ?? "")
          .split(/\n/)
          .map((rule) => rule.trim())
          .filter(Boolean),
        status: data.status,
        furnishingStatus: data.furnishedStatus,
        amenities,
        ...(images.length ? { images } : {}),
        ...(videos.length ? { videos } : {}),
        ...(removedImages.length ? { removedImages } : {}),
        ...(removedVideos.length ? { removedVideos } : {}),
      } as UpdateShortletPayload;
      updateShortlet(shortletPayload, callbacks);
      return;
    }

    const payload = {
      ...data,
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      location: data.location,
      status: data.status,
      price: shortlet ? number(data.pricePerNight) : total,
      priceType: shortlet ? "nightly" : rental.priceType || "yearly",
      legalFee: shortlet ? 0 : number(data.legalFee),
      cautionFee: shortlet
        ? number(data.securityDeposit)
        : number(data.cautionFee),
      brokeFee: shortlet ? 0 : number(data.brokeFee),
      mgtServiceCharge: shortlet
        ? number(data.cleaningFee)
        : number(data.mgtServiceCharge),
      amenities,
      ...(images.length ? { images } : {}),
      ...(videos.length ? { videos } : {}),
      ...(removedImages.length ? { removedImages } : {}),
      ...(removedVideos.length ? { removedVideos } : {}),
    } as UpdateRentalPayload;
    updateRental(payload, callbacks);
  };
  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin text-green-600" />
        </div>
      </DashboardLayout>
    );
  if (!rental || isError)
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-xl font-bold">Property not found</h1>
          <p>
            {error instanceof Error
              ? error.message
              : "Unable to load this listing."}
          </p>
        </div>
      </DashboardLayout>
    );
  const existingMedia = (
    <section className="space-y-3 rounded-[2rem] border border-slate-100 bg-white p-6">
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={src}
                alt="Property"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setRemovedImages((current) => [...current, src])}
                className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      {existingVideos.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {existingVideos.map((src) => (
            <div
              key={src}
              className="relative aspect-video overflow-hidden rounded-xl"
            >
              <video
                src={src}
                controls
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setRemovedVideos((current) => [...current, src])}
                className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
  const review = (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-8">
      <h2 className="text-lg font-bold">Review changes</h2>
      <p className="mt-2 text-sm text-slate-500">
        Save to update this {shortlet ? "shortlet" : "long-term"} listing.
      </p>
      <h4>uidhkd</h4>
    </section>
  );
  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <div className="container-2 mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Edit Property</h1>
              <p className="text-sm text-gray-500">
                Update your {shortlet ? "shortlet" : "long-term"} listing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/landlord/my-listings")}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </header>
          {submitError && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {submitError}
            </p>
          )}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)} className="space-y-8">
              <StepIndicator steps={steps} currentStep={step} />
              {shortlet ? (
                <>
                  {step === 0 && (
                    <ShortletPropertyInfoStep
                      methods={methods as never}
                      errors={errors as never}
                    />
                  )}
                  {step === 1 && (
                    <ShortletLocationStep
                      methods={methods as never}
                      errors={errors as never}
                    />
                  )}
                  {step === 2 && (
                    <ShortletAmenitiesStep
                      methods={methods as never}
                      errors={errors as never}
                      toggle={toggleAmenity}
                      selected={(item) => amenities.includes(item)}
                    />
                  )}
                  {step === 3 && (
                    <>
                      {existingMedia}
                      <ShortletMediaStep
                        images={images}
                        videos={videos}
                        imagePreviews={imagePreviews}
                        videoPreviews={videoPreviews}
                        handleImageChange={(e) => addMedia(e, "image")}
                        handleVideoChange={(e) => addMedia(e, "video")}
                        removeImage={(i) => removeNew("image", i)}
                        removeVideo={(i) => removeNew("video", i)}
                      />
                    </>
                  )}
                  {step === 4 && (
                    <PricingAvailabilityStep
                      methods={methods as never}
                      errors={errors as never}
                    />
                  )}
                  {step === 5 && (
                    <HouseRuleStep
                      methods={methods as never}
                      errors={errors as never}
                    />
                  )}
                  {step === 6 && review}
                </>
              ) : (
                <>
                  {step === 0 && (
                    <PropertyInformationStep
                      methods={methods as never}
                      errors={errors as never}
                    />
                  )}
                  {step === 1 && (
                    <AmenitiesStep
                      methods={methods as never}
                      errors={errors as never}
                      toggle={toggleAmenity}
                      selected={(item) => amenities.includes(item)}
                    />
                  )}
                  {step === 2 && (
                    <>
                      {existingMedia}
                      <MediaStep
                        images={images}
                        videos={videos}
                        imagePreviews={imagePreviews}
                        videoPreviews={videoPreviews}
                        handleImageChange={(e) => addMedia(e, "image")}
                        handleVideoChange={(e) => addMedia(e, "video")}
                        removeImage={(i) => removeNew("image", i)}
                        removeVideo={(i) => removeNew("video", i)}
                      />
                    </>
                  )}
                  {step === 3 && (
                    <FinancialBreakdownStep
                      methods={methods as never}
                      errors={errors as never}
                      totalPackages={total}
                    />
                  )}
                  {step === 4 && review}
                </>
              )}
              <div className="flex justify-between border-t pt-6">
                <button
                  type="button"
                  disabled={!step}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  className="rounded-lg border px-5 py-2.5 disabled:opacity-40"
                >
                  Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-lg bg-green-600 px-6 py-2.5 text-white"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-white disabled:opacity-50"
                  >
                    {isPending && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    Save changes
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
    </DashboardLayout>
  );
}
