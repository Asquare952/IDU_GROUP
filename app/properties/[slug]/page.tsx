"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  MapPin,
  Home,
  Loader2,
  Shield,
  Zap,
  Droplets,
  Leaf,
  Lock,
  MessageSquare,
  User,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useFetchPropertyBySlug } from "@/app/api/features/property";
import {
  getShortletApiError,
  useBookShortlet,
  useFetchShortletById,
  useShortletAvailability,
  useShortletQuote,
} from "@/app/api/features/shortlet";
import {
  useRentRental,
  useLockRental,
  useBookRental,
} from "@/app/api/features/progress/progress.queries";
import { useCreateConversation } from "@/app/api/features/chat/chat.queries";
import { sanitizeConversationId } from "@/app/api/features/chat/chat.api";
import { hasAccessToken } from "@/app/lib/auth";
import { formatRelativeTime } from "@/app/lib/formatRelativeTime";
import { toast } from "react-toastify";
import { useAuth } from "@/app/components/context/AuthContext";
import BookInspectionModal from "@/app/components/BookInspectionModal";
import { TransactionPinSheet } from "@/app/components/TransactionPinModal";
import ShortletBookings from "@/app/components/Dashboard/shortlet/ShortletBookings";
import ShortletHostDetails from "@/app/components/Dashboard/shortlet/ShortletHostDetails";
import ShortletInfo from "@/app/components/Dashboard/shortlet/ShortletInfo";
import ShortletRatings from "@/app/components/Dashboard/shortlet/ShortletRatings";
import ShortletReviews from "@/app/components/Dashboard/shortlet/ShortletReviews";
import ShortletReserve from "@/app/components/Dashboard/shortlet/ShortletReserve";
import { getTransactionPinErrorMessage } from "@/app/api/features/wallet/wallet.api";

const shortletDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const shortletDateFromKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const expandBookedRanges = (
  ranges: Array<{ checkIn: string; checkOut: string }> = [],
) => {
  const blocked = new Set<string>();

  ranges.forEach(({ checkIn, checkOut }) => {
    const date = shortletDateFromKey(checkIn);
    const checkout = shortletDateFromKey(checkOut);
    while (date < checkout) {
      blocked.add(shortletDateKey(date));
      date.setDate(date.getDate() + 1);
    }
  });

  return [...blocked];
};

function PropertyDesktopViewContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const isShortletRoute = searchParams.get("model") === "shortlet";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllTips, setShowAllTips] = useState(false);
  const [isBookInspectionsOpen, setisBookInspectionOpen] = useState(false);
  const [pinAction, setPinAction] = useState<
    "rent" | "lock" | "shortlet-book" | null
  >(null);
  const { mutate: handleLock, isPending: isLocking } = useLockRental();
  const { mutate: handleRent, isPending: isRenting } = useRentRental();
  const { mutate: handleBook, isPending: isBooking } = useBookRental();
  const {
    mutate: handleShortletBook,
    isPending: isShortletBooking,
    error: shortletBookingError,
    reset: resetShortletBooking,
  } = useBookShortlet();
  const { mutate: createConversation } = useCreateConversation();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  // Keep the selected shortlet stay in this page so the calendar and reserve
  // card always display the same dates and guest count.
  const [shortletCheckIn, setShortletCheckIn] = useState<Date | null>(null);
  const [shortletCheckOut, setShortletCheckOut] = useState<Date | null>(null);
  const [shortletGuests, setShortletGuests] = useState(1);

  // const {
  //   data: property,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["property", slug],
  //   queryFn: () => fetchPropertyBySlug(slug!),
  //   enabled: Boolean(slug),
  // });

  const rentalQuery = useFetchPropertyBySlug(
    isShortletRoute ? null : slug,
  );
  const shortletQuery = useFetchShortletById(slug, isShortletRoute);
  const availabilityQuery = useShortletAvailability(
    isShortletRoute ? slug : undefined,
    isShortletRoute && isLoggedIn,
  );
  const quoteParams =
    shortletCheckIn && shortletCheckOut
      ? {
          checkIn: shortletDateKey(shortletCheckIn),
          checkOut: shortletDateKey(shortletCheckOut),
          guests: shortletGuests,
        }
      : null;
  const quoteQuery = useShortletQuote(
    isShortletRoute ? slug : undefined,
    quoteParams,
    isShortletRoute && isLoggedIn,
  );
  const property = isShortletRoute ? shortletQuery.data : rentalQuery.data;
  const isLoading = isShortletRoute
    ? shortletQuery.isLoading
    : rentalQuery.isLoading;
  const isError = isShortletRoute ? shortletQuery.isError : rentalQuery.isError;
  const error = isShortletRoute ? shortletQuery.error : rentalQuery.error;

  useEffect(() => {
    setCurrentImageIndex(0);
    setShortletCheckIn(null);
    setShortletCheckOut(null);
    setShortletGuests(1);
  }, [slug]);

  const showFooter = !isLoggedIn;

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-[#4CAF50]" />
        </div>
        {showFooter ? <Footer /> : null}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <p className="text-red-500 text-lg">
            {(error as Error).message || "Failed to load this property."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className="mt-4 text-[#4CAF50] font-semibold hover:underline"
          >
            Back to listings
          </button>
        </div>
        {showFooter ? <Footer /> : null}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
          <p className="text-gray-600 text-lg">
            Property not found.
          </p>
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className="mt-4 text-[#4CAF50] font-semibold hover:underline"
          >
            Back to listings
          </button>
        </div>
        {showFooter ? <Footer /> : null}
      </div>
    );
  }

  const activeImage = property.images[currentImageIndex] ?? property.images[0];
  const galleryImages = activeImage
    ? [
        activeImage,
        ...property.images.filter((_, index) => index !== currentImageIndex),
      ].slice(0, 5)
    : [];
  const landlordName = property.User
    ? `${property.User.full_name}`.trim()
    : "Verified Landlord";

  const access = hasAccessToken() as any;
  // The backend currently identifies shortlets through the listing type or a
  // nightly price period; either value is enough to select the shortlet UI.
  const isShortlet =
    Boolean(property.rentalModel) ||
    property.propertyType.toLowerCase().includes("shortlet") ||
    property.priceType.toLowerCase().includes("night");
  // Do not offer renter actions on listings that are not available.
  const listingCanBook = property.status.toLowerCase() === "available";
  const availability = availabilityQuery.data;
  const canBook =
    listingCanBook &&
    (!isShortletRoute ||
      !isLoggedIn ||
      (availability?.bookable === true &&
        availability.status.toLowerCase() === "available"));
  const shortletBookedDates = expandBookedRanges(
    availability?.bookedRanges ?? [],
  );
  const bookingError = shortletBookingError
    ? getShortletApiError(shortletBookingError)
    : undefined;
  const bookingErrorMessage =
    shortletBookingError &&
    (bookingError?.code === "PIN_NOT_SET" ||
      bookingError?.code === "PIN_REQUIRED" ||
      bookingError?.code === "PIN_INCORRECT")
      ? getTransactionPinErrorMessage(
          shortletBookingError,
          bookingError.message,
        )
      : bookingError?.message;
  const insufficientBalance =
    bookingError?.code === "INSUFFICIENT_BALANCE";

  // Use RentULO chat for host contact instead of exposing private contact info.
  const handleMessageHost = () => {
    if (!hasAccessToken()) {
      router.push("/login");
      return;
    }

    if (access?.verified === false) {
      return;
    }

    if (!property.userId) {
      toast.error("Landlord contact is not available for this listing.");
      return;
    }

    createConversation(
      { other_user_id: String(property.userId) },
      {
        onSuccess: (data) => {
          const conversationId = sanitizeConversationId(
            data.conversation_id ?? data._id ?? data.id,
          );

          if (!conversationId) {
            toast.error("Unable to open this conversation.");
            return;
          }

          router.push(`/tenant/messages/${conversationId}`);
        },
        onError: (conversationError) => {
          toast.error(
            conversationError.message || "Unable to start chat. Please try again.",
          );
        },
      },
    );
  };
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-6 text-sm text-gray-500 font-medium">
          Properties / <span className="text-gray-900">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Swiper
              modules={[Navigation, Thumbs]}
              spaceBetween={10}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="rounded-3xl"
            >
              {property.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative aspect-video w-full overflow-hidden rounded-3xl"
                    onClick={() => {
                      setActiveIndex(index);
                      setOpen(true);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`image ${index + 1}`}
                      width={500}
                      height={700}
                      className=" w-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
              <div className="absolute bottom-5 right-5 z-20 rounded-full bg-black/70 px-4 py-2 text-white">
                {activeIndex + 1}/{property.images.length}
              </div>
            </Swiper>

            <Swiper
              onSwiper={setThumbsSwiper}
              modules={[Thumbs, FreeMode]}
              watchSlidesProgress
              freeMode
              spaceBetween={10}
              slidesPerView={5}
              allowTouchMove
              touchRatio={1}
              scrollbar={{
                draggable: true,
                hide: false,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 3,
                },
                640: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 5,
                },
              }}
              className="mt-4 overflow-visible"
            >
              {property.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-24 w-full cursor-pointer rounded-xl object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="grid grid-cols-1 gap-1.5">
              {property.videos.map((video, index) => (
                <div key={index} className="rounded-xl">
                  <video
                    src={video}
                    controls
                    className="aspect-video w-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-[32px] grid grid-cols-2 md:grid-cols-3 gap-4">
              <Spec
                icon={<MapPin className="text-[#4CAF50]" />}
                label="Location"
                value={
                  isShortlet
                    ? [property.area, property.city].filter(Boolean).join(", ") ||
                      property.location
                    : property.location
                }
              />
              <Spec
                icon={<Home className="text-[#4CAF50]" />}
                label="Type"
                value={property.propertyType}
              />
              <Spec
                icon={<Shield className="text-[#4CAF50]" />}
                label="Status"
                value={property.status}
              />
            </div>

            {isShortlet && (
              <section className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                <div className="space-y-2 text-gray-600">
                  {[property.address, property.area, property.city]
                    .filter(Boolean)
                    .map((part, index) => (
                      <p key={`${part}-${index}`}>{part}</p>
                    ))}
                  {property.landmark && (
                    <p>
                      <span className="font-semibold">Nearby landmark:</span>{" "}
                      {property.landmark}
                    </p>
                  )}
                  {!property.address &&
                    !property.area &&
                    !property.city &&
                    !property.landmark && (
                      <p>Location details are not available.</p>
                    )}
                </div>
              </section>
            )}

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Description</h2>
              <p className="text-sm font-medium text-gray-400">
                Posted {formatRelativeTime(property.createdAt)}
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                {property.description || "No description provided yet."}
              </p>
            </div>

            {property.amenities.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900">Amenities</h2>
              <ul className="grid grid-cols-2 gap-2 list-disc list-inside">
                {property.amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="text-gray-600 leading-relaxed text-lg"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
                <p className="text-gray-500">No amenities have been listed.</p>
              </div>
            )}

            {/* Render shortlet-only sections from the shared property record. */}
            {isShortlet && (
              <>
                {(property.bedrooms ||
                  property.bathrooms ||
                  property.livingRooms ||
                  property.guestCapacity ||
                  property.furnishingStatus) && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Accommodation
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {property.bedrooms ? (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          {property.bedrooms}{" "}
                          {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
                        </span>
                      ) : null}
                      {property.bathrooms ? (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          {property.bathrooms}{" "}
                          {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
                        </span>
                      ) : null}
                      {property.livingRooms ? (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          {property.livingRooms}{" "}
                          {property.livingRooms === 1 ? "living room" : "living rooms"}
                        </span>
                      ) : null}
                      {property.guestCapacity ? (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          Up to {property.guestCapacity} guests
                        </span>
                      ) : null}
                      {property.furnishingStatus && (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm capitalize text-gray-700">
                          {property.furnishingStatus.replaceAll("_", " ")}
                        </span>
                      )}
                    </div>
                  </section>
                )}

                <ShortletBookings
                  checkIn={shortletCheckIn}
                  checkOut={shortletCheckOut}
                  guests={shortletGuests}
                  maxGuests={property.guestCapacity}
                  blockedDates={shortletBookedDates}
                  availableFrom={
                    availability?.availableFrom ?? property.availableFrom
                  }
                  availableTo={
                    availability?.availableTo ?? property.availableTo
                  }
                  minimumStay={
                    availability?.minimumStay ?? property.minimumStay
                  }
                  maximumStay={
                    availability?.maximumStay ?? property.maximumStay
                  }
                  availabilityLoading={
                    isLoggedIn && availabilityQuery.isLoading
                  }
                  availabilityError={
                    !isLoggedIn
                      ? "Sign in to check booked dates and availability."
                      : availabilityQuery.isError
                        ? "Availability couldn't be checked. Please refresh and try again."
                        : availability && !availability.bookable
                          ? "The host has paused bookings for this listing."
                          : undefined
                  }
                  onStayChange={({ checkIn, checkOut, guests }) => {
                    if (
                      shortletCheckIn?.getTime() !== checkIn?.getTime() ||
                      shortletCheckOut?.getTime() !== checkOut?.getTime() ||
                      shortletGuests !== guests
                    ) {
                      resetShortletBooking();
                    }
                    setShortletCheckIn(checkIn);
                    setShortletCheckOut(checkOut);
                    setShortletGuests(guests);
                  }}
                />
                {/* Reviews, rules, and host data remain empty unless backed by
                    real listing/review data; the components handle empty states. */}
                <ShortletRatings />
                <ShortletReviews reviews={[]} />
                <ShortletInfo
                  checkInTime={property.checkInTime}
                  checkOutTime={property.checkOutTime}
                  houseRules={[
                    ...(property.houseRules ?? []),
                    ...(property.smokingAllowed === undefined
                      ? []
                      : [property.smokingAllowed ? "Smoking allowed" : "No smoking"]),
                    ...(property.petsAllowed === undefined
                      ? []
                      : [property.petsAllowed ? "Pets allowed" : "No pets"]),
                    ...(property.partiesAllowed === undefined
                      ? []
                      : [property.partiesAllowed ? "Parties allowed" : "No parties"]),
                  ]}
                />
                <ShortletHostDetails
                  hostName={property.User?.full_name}
                  hostImage={property.User?.Profile?.image}
                  verified={property.User?.Profile?.verified}
                  onMessageHost={handleMessageHost}
                />
              </>
            )}

            {/* Shortlets show nightly stay pricing; long-term retains its
                existing rental fees and payment/inspection actions. */}
            {!isShortlet && (
              <div className="space-y-4 rounded-[32px] border border-blue-100 bg-blue-50 p-6">
                <h2 className="text-2xl font-black text-gray-900">
                  Safety Tips
                </h2>
                {(showAllTips
                  ? [
                      "Ensure you meet the landlord or agent in an open location.",
                      "Always verify ownership before making any payment.",
                      "Be cautious of deals that seem too good to be true.",
                      "Use RentULO wallet for secure payment methods and keep your receipts.",
                    ]
                  : [
                      "Ensure you meet the landlord or agent in an open location.",
                    ]
                ).map((tip, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-gray-600"
                  >
                    {index + 1}. {tip}
                  </p>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAllTips(!showAllTips)}
                  className="font-semibold text-[#4CAF50] hover:underline"
                >
                  {showAllTips ? "Show Less Tips" : "See Full Tips"}
                </button>
              </div>
            )}

            {!isShortlet && (
              <div className="border-t border-gray-100 pt-8">
                <h3 className="mb-6 text-xl font-bold">Listing Highlights</h3>
                <div className="flex flex-wrap gap-8">
                  <Amenity
                    icon={<Zap />}
                    label={`${property.priceType} pricing`}
                  />
                  <Amenity
                    icon={<Shield />}
                    label={`${property.status} listing`}
                  />
                  <Amenity icon={<Droplets />} label="Image gallery included" />
                  <Amenity icon={<Leaf />} label="Direct rental posting" />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6 lg:top-24 h-fit">
              <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      canBook ? "animate-pulse bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-sm font-bold uppercase text-gray-700">
                    {property.status} listing
                  </span>
                </div>

                {!isShortlet && (
                  <div className="mb-8">
                    <p className="mb-1 text-sm font-medium text-gray-400">
                      Rent
                    </p>
                    <h1 className="text-4xl font-black text-gray-900">
                      ₦{Number(property.price).toLocaleString()}
                      <span className="text-lg font-normal capitalize text-gray-500">
                        /{property.priceType}
                      </span>
                    </h1>
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      {[
                        ["Service charge", property.mgtServiceCharge],
                        ["Caution fee", property.cautionFee],
                        ["Legal fee", property.legalFee],
                        ["Agency fee", property.brokeFee],
                      ]
                        .filter(([, amount]) => Number(amount) > 0)
                        .map(([label, amount]) => (
                          <div
                            key={String(label)}
                            className="flex justify-between gap-3"
                          >
                            <span>{label}</span>
                            <span>₦{Number(amount).toLocaleString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {isShortlet ? (
                  <ShortletReserve
                    pricePerNight={Number(property.price)}
                    checkIn={shortletCheckIn}
                    checkOut={shortletCheckOut}
                    guests={shortletGuests}
                    canBook={canBook}
                    quote={quoteQuery.data}
                    quoteLoading={isLoggedIn && quoteQuery.isLoading}
                    quoteError={
                      quoteQuery.isError
                        ? getShortletApiError(quoteQuery.error).message
                        : undefined
                    }
                    requireQuote={isLoggedIn}
                    bookingError={bookingErrorMessage}
                    insufficientBalance={insufficientBalance}
                    onReserve={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      if (
                        !quoteQuery.data ||
                        !shortletCheckIn ||
                        !shortletCheckOut ||
                        !availability?.bookable
                      ) {
                        toast.error(
                          "Check availability and select valid dates before booking.",
                        );
                        return;
                      }
                      setPinAction("shortlet-book");
                    }}
                  />
                ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:flex md:flex-col md:gap-0 md:space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      setPinAction("rent");
                    }}
                    disabled={isRenting || !canBook}
                    className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-[24px] border-2 border-none bg-green-600 px-2 py-3 text-center text-[11px] font-black uppercase leading-tight text-white shadow-lg shadow-orange-100 transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:mt-4 md:min-h-0 md:flex-row md:gap-3 md:px-4 md:py-5 md:text-base md:leading-normal"
                  >
                    <Lock className="size-4 shrink-0 md:size-5" />
                    <span>
                      {isRenting ? "Processing..." : "Rent This House"}
                    </span>
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={handleMessageHost}
                    className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-[24px] border-2 border-none bg-green-600 px-2 py-3 text-center text-[11px] font-black uppercase leading-tight text-white shadow-lg shadow-orange-100 transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:mt-4 md:min-h-0 md:flex-row md:gap-3 md:px-4 md:py-5 md:text-base md:leading-normal"
                  >
                    <MessageSquare className="size-4 shrink-0 md:size-5" />
                    <span>Chat Landlord</span>
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }
                      setisBookInspectionOpen(true);
                    }}
                    disabled={!canBook}
                    className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-[24px] border-2 border-none bg-green-600 px-2 py-3 text-center text-[11px] font-black uppercase leading-tight text-white shadow-lg shadow-orange-100 transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:mt-4 md:min-h-0 md:flex-row md:gap-3 md:px-4 md:py-5 md:text-base md:leading-normal"
                  >
                    <CalendarDays className="size-4 shrink-0 md:size-5" />
                    Book Inspection
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasAccessToken()) {
                        router.push("/login");
                        return;
                      }

                      setPinAction("lock");
                    }}
                    disabled={isLocking || !canBook}
                    className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-[24px] border-2 border-none bg-green-600 px-2 py-3 text-center text-[11px] font-black uppercase leading-tight text-white shadow-lg shadow-orange-100 transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:mt-4 md:min-h-0 md:flex-row md:gap-3 md:px-4 md:py-5 md:text-base md:leading-normal"
                  >
                    <Lock className="size-4 shrink-0 md:size-5" />
                    <span>
                      {isLocking ? "Processing..." : "Lock This House"}
                    </span>
                  </button>

                  {/*  */}
                  <button
                    type="button"
                    onClick={() => router.push("/properties")}
                    className="col-span-2 w-full rounded-[24px] bg-[#FF9800] px-3 py-4 text-center text-xs font-black uppercase text-white shadow-lg shadow-orange-100 transition-all hover:bg-[#F57C00] active:scale-95 md:col-span-1 md:mt-2 md:py-5 md:text-base"
                  >
                    Back to Listings
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => setisCompleteAccDetailsOpen(true)}
                    className="w-full bg-[#FF9800] text-white font-black py-5 rounded-[24px] hover:bg-[#F57C00] transition-all active:scale-95 shadow-lg shadow-orange-100 uppercase mt-2 cursor-pointer"
                  >
                    Back to Listings
                  </button> */}
                </div>
                )}

                {!isShortlet && (
                  <p className="mt-6 text-center text-xs text-gray-400">
                    * Booking requires a completed account profile and a valid
                    logged-in session.
                  </p>
                )}
              </div>

              {!isShortlet && (
                <div className="flex flex-col gap-2 rounded-[32px] bg-gray-50 p-6">
                  <h2>Landlord</h2>
                  <div>
                    <p className="font-bold text-gray-900">{landlordName}</p>
                    {property.User?.Profile?.verified === true && (
                      <p className="text-xs text-gray-500">
                        Verified landlord
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <BookInspectionModal
          isOpen={isBookInspectionsOpen}
          onClose={() => setisBookInspectionOpen(false)}
          id={property.id}
        />
        <TransactionPinSheet
          isOpen={pinAction !== null}
          title={
            pinAction === "rent"
              ? "Confirm rental"
              : pinAction === "lock"
                ? "Confirm house lock"
                : "Confirm shortlet booking"
          }
          description={
            pinAction === "shortlet-book"
              ? "Enter your transaction PIN to confirm this booking."
              : "Enter your transaction PIN to continue with this payment."
          }
          confirmLabel={
            pinAction === "rent"
              ? "Confirm rental"
              : pinAction === "lock"
                ? "Confirm lock"
                : "Confirm booking"
          }
          isPending={
            isRenting || isLocking || isBooking || isShortletBooking
          }
          errorMessage={
            pinAction === "shortlet-book"
              ? bookingErrorMessage
              : undefined
          }
          createPinHref={
            pinAction === "shortlet-book" &&
            bookingError?.code === "PIN_NOT_SET"
              ? "/tenant/settings/transaction-pin/create-pin"
              : undefined
          }
          actionHref={
            pinAction === "shortlet-book" && insufficientBalance
              ? "/tenant/wallet/top-up"
              : undefined
          }
          actionLabel={
            pinAction === "shortlet-book" && insufficientBalance
              ? "Top up your wallet"
              : undefined
          }
          onClose={() => setPinAction(null)}
          onConfirm={(pin) => {
            const rentalId = String(property.id);

            if (pinAction === "shortlet-book") {
              if (!shortletCheckIn || !shortletCheckOut) return;
              handleShortletBook(
                {
                  shortlet_id: rentalId,
                  checkIn: shortletDateKey(shortletCheckIn),
                  checkOut: shortletDateKey(shortletCheckOut),
                  guests: shortletGuests,
                  pin,
                },
                {
                  onSuccess: (response) => {
                    toast.success(
                      `${response.message}. New wallet balance: ₦${Number(
                        response.walletBalance,
                      ).toLocaleString("en-NG")}`,
                    );
                    setPinAction(null);
                  },
                  onError: (error) => {
                    if (
                      getShortletApiError(error).code === "DATES_UNAVAILABLE"
                    ) {
                      setPinAction(null);
                    }
                  },
                },
              );
              return;
            }

            if (pinAction === "rent") {
              handleRent(
                { rentalId, pin },
                { onSuccess: () => setPinAction(null) },
              );
              return;
            }

            if (pinAction === "lock") {
              handleLock(
                { rentalId, pin },
                { onSuccess: () => setPinAction(null) },
              );
            }
          }}
        />
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={activeIndex}
          plugins={[Zoom]}
          slides={property.images.map((img) => ({
            src: img,
          }))}
        />
      </main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}

export default function PropertyDesktopView() {
  return (
    <Suspense fallback={null}>
      <PropertyDesktopViewContent />
    </Suspense>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-wider">
        {icon} {label}
      </div>
      <p className="font-bold text-gray-900 capitalize">{value}</p>
    </div>
  );
}

function Amenity({
  icon,
  label,
}: {
  icon: React.ReactElement<{ size?: number }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#E8F5E9] text-[#4CAF50] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="font-bold text-gray-700 text-sm">{label}</span>
    </div>
  );
}
