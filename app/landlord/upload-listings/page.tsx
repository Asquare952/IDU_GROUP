"use client"

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import HouseIn from "@/public/house-in.jpg";
import Image from "next/image";
import {
  House,
  BedDouble,
  Calendar,
  ShieldCheck,
  LucideNotebookText,
  Wallet,
  Info,
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

type ListingTypes = "long-term" | "shortlet";

const page = () => {
  const router = useRouter();

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
      <div className="container-2 flex flex-col gap-6">
        {/*  */}
        <div className=" flex flex-col gap-1 py-3">
          <h1 className=" text-[24px] font-semibold">What are you listing?</h1>
          <p className="w-[300px] md:w-[630px] text-[14px] md:text-[15px] text-[#6b7280]">
            Choose the type of rental you want to create. This will determine
            the next steps and infomation you will provide
          </p>
        </div>

        {/*  */}
        <div className=" grid md:grid-cols-2 gap-3">
          {/*  */}
          <div
            onClick={() => selectListingType("long-term")}
            className=" flex flex-col gap-2.5 rounded-[10px] bg-white shadow p-4 hover:border-2 hover:border-[#43a047] cursor-pointer"
          >
            <div className="">
              <House size={50} />
            </div>

            <div className=" flex flex-col gap-1">
              <h2 className=" font-semibold text-[20px]">Long-term Renal</h2>
              <p className="w-[250px] text-[15px] text-[#6b7280]">
                Rent for months or years (e.g apartments, houses, duplexes).
              </p>
            </div>

            <Image
              src={HouseIn}
              width={200}
              height={50}
              alt=""
              className=" w-full h-64 rounded-[20px]"
            />

            {/*  */}
            <div className=" grid grid-cols-3 gap-4 text-[#43a047]">
              <div>
                <Calendar />
                <p>Monthly / Yearly payment</p>
              </div>
              <div>
                <ShieldCheck />
                <p>Inspection required</p>
              </div>
              <div>
                <LucideNotebookText />
                <p>Lease agreement</p>
              </div>
            </div>
          </div>

          {/*  */}
          <div
            onClick={() => selectListingType("shortlet")}
            className=" flex flex-col gap-2.5 rounded-[10px] bg-white shadow p-4 hover:border-2 hover:border-[#43a047] cursor-pointer"
          >
            <div className="">
              <BedDouble size={50} />
            </div>

            <div className=" flex flex-col gap-1">
              <h2 className=" font-semibold text-[20px]">Shortlet</h2>
              <p className="w-[250px] text-[15px] text-[#6b7280]">
                Furnished stays for short periods (e.g vacaion, business,
                holidays).
              </p>
            </div>

            <Image
              src={HouseIn}
              width={200}
              height={50}
              alt=""
              className=" w-full h-64 rounded-[20px]"
            />

            {/*  */}
            <div className=" grid grid-cols-3 gap-4 text-[#43a047]">
              <div>
                <Calendar />
                <p>Daily / Weekly payments</p>
              </div>
              <div>
                <ShieldCheck />
                <p>Instant booking (when available)</p>
              </div>
              <div>
                <Wallet />
                <p>Online payment</p>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div className=" flex gap-2.5 mb-3.5 p-2.5 bg-[#e0e8ff69] rounded-xl">
          <Info size={20}/>

          <div className=" flex flex-col gap-1.5">
            <h2 className=" font-semibold text-[15px]">
              What's the difference?
            </h2>
            <p className=":w-[510px] md:w-[610px] text-[15px]">
              Long-term renals are for exended stays (monthly/yearly), while
              shortlets are for short stays (days, weeks). You can always edit
              the details later
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
