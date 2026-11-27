"use client";

import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import { useBookedRentals } from "@/app/api/features/progress/progress.queries";
import type { Rental } from "@/app/api/features/rental";
import {
  getShortletApiError,
  useCancelShortletBooking,
  usePendingShortletReviews,
  useShortletBookings,
  useShortletCancellationPreview,
  useSubmitShortletReview,
} from "@/app/api/features/shortlet";
import type { ShortletGuestBooking } from "@/app/api/features/shortlet";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import {
  AlertCircle,
  CalendarDays,
  Loader2,
  MapPin,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

type BookingFilter = "all" | "long-term" | "shortlet";

const isShortlet = (rental: Rental) =>
  rental.priceType.toLowerCase().includes("night") ||
  rental.propertyType.toLowerCase().includes("shortlet");

const formatPrice = (price: string | number) => {
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice)
    ? `₦${numericPrice.toLocaleString()}`
    : String(price);
};

const isLongTermRental = (rental: Rental) => !isShortlet(rental);

const formatDate = (date: string) => {
  if (!date) return "Date unavailable";
  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatBookingAmount = (amount: string | number | undefined) => {
  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount)
    ? `₦${numericAmount.toLocaleString()}`
    : "Not available";
};

const LongTermBookingCard = ({ rental }: { rental: Rental }) => {
  const propertyPath = getPropertyDetailsPath({
    id: rental.id,
    slug: rental.slug,
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <Link
        href={propertyPath}
        className="relative block h-52 bg-gray-100"
        aria-label={`View ${rental.title}`}
      >
        {rental.images[0] ? (
          <Image
            src={rental.images[0]}
            alt={rental.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-gray-400">
            No image available
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#162B4C] shadow-sm">
          Long-term
        </span>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#162B4C]">{rental.title}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={15} aria-hidden="true" />
              {rental.location || "Location unavailable"}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
            {rental.status || "Booked"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {formatPrice(rental.price)}
            <span className="font-normal text-gray-500">
              {` / ${rental.priceType || "year"}`}
            </span>
          </span>
        </div>

        <Link
          href={propertyPath}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-[#43A047] px-5 text-sm font-semibold text-[#388E3C] transition hover:bg-green-50"
        >
          View property
        </Link>
      </div>
    </article>
  );
};

const ShortletReviewDialog = ({
  booking,
  onClose,
}: {
  booking: ShortletGuestBooking;
  onClose: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const submitReview = useSubmitShortletReview();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedComment = comment.trim();
    if (rating < 1 || rating > 5) {
      setFormError("Select a rating from 1 to 5 stars.");
      return;
    }
    if (trimmedComment.length < 10 || trimmedComment.length > 2000) {
      setFormError("Your review must be 10 to 2000 characters.");
      return;
    }

    setFormError(null);
    submitReview.mutate(
      {
        bookingId: booking.booking_id ?? booking.id,
        rating,
        comment: trimmedComment,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          onClose();
        },
        onError: (error) => setFormError(getShortletApiError(error).message),
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortlet-review-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitReview.isPending
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="shortlet-review-title"
              className="text-xl font-bold text-[#162B4C]"
            >
              Review your stay
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {booking.shortlet?.title || "Shortlet booking"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitReview.isPending}
            aria-label="Close review form"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-700">
              Your rating
            </legend>
            <div className="mt-2 flex gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                    aria-pressed={rating === value}
                    className="rounded p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43A047]"
                  >
                    <Star
                      size={28}
                      className={
                        value <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block text-sm font-medium text-gray-700">
            Your review
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              minLength={10}
              maxLength={2000}
              rows={5}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-3"
            />
            <span className="mt-1 block text-xs text-gray-500">
              {comment.trim().length}/2000 characters (minimum 10)
            </span>
          </label>

          {formError && (
            <p className="text-sm text-red-700" role="alert">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitReview.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitReview.isPending}
              className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white hover:bg-[#388E3C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitReview.isPending ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ShortletBookingCard = ({
  booking,
  onCancel,
  canReview,
}: {
  booking: ShortletGuestBooking;
  onCancel: (booking: ShortletGuestBooking) => void;
  canReview: boolean;
}) => {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const shortlet = booking.shortlet;
  const propertyPath = getPropertyDetailsPath({
    id: shortlet?.id ?? booking.shortlet_id,
    slug: shortlet?.slug,
    rentalModel: "shortlet",
  });
  const title = shortlet?.title || "Shortlet booking";
  const address = [shortlet?.area, shortlet?.city, shortlet?.address]
    .filter(Boolean)
    .join(", ");
  const image = shortlet?.images?.[0];
  const canRequestCancellation = booking.status.toLowerCase() === "confirmed";

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <Link
        href={propertyPath}
        className="relative block h-52 bg-gray-100"
        aria-label={`View ${title}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-gray-400">
            No image available
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#162B4C] shadow-sm">
          Shortlet
        </span>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#162B4C]">{title}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={15} aria-hidden="true" />
              {address || "Location unavailable"}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
            {booking.status}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <CalendarDays size={16} aria-hidden="true" />
            {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
          </p>
          <p>
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
            {shortlet?.pricePerNight
              ? ` · ${formatBookingAmount(shortlet.pricePerNight)} / night`
              : ""}
          </p>
          {booking.total !== undefined && (
            <p className="font-semibold text-gray-900">
              Total paid: {formatBookingAmount(booking.total)}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={propertyPath}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#43A047] px-5 text-sm font-semibold text-[#388E3C] transition hover:bg-green-50"
          >
            View property
          </Link>
          {canRequestCancellation && booking.id && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-200 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Cancel booking
            </button>
          )}
          {canReview && booking.review?.submitted !== true && (
            <button
              type="button"
              onClick={() => setShowReviewDialog(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#43A047] px-5 text-sm font-semibold text-white transition hover:bg-[#388E3C]"
            >
              Leave a review
            </button>
          )}
        </div>
      </div>
      {showReviewDialog && (
        <ShortletReviewDialog
          booking={booking}
          onClose={() => setShowReviewDialog(false)}
        />
      )}
    </article>
  );
};

const CancellationDialog = ({
  booking,
  onClose,
}: {
  booking: ShortletGuestBooking;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const {
    data: preview,
    isLoading,
    isError,
    error,
    refetch,
  } = useShortletCancellationPreview(booking.id, checkOutDate || undefined);
  const cancelBooking = useCancelShortletBooking();

  const handleCancel = async () => {
    if (!preview?.cancellation.canCancel || !preview.expectedRefundAmount) {
      return;
    }

    setActionError(null);
    try {
      const response = await cancelBooking.mutateAsync({
        bookingId: booking.id,
        reason: reason.trim() || undefined,
        expectedRefundAmount: preview.expectedRefundAmount,
        checkOutDate: checkOutDate || undefined,
      });
      toast.success(
        `${response.message}. Refund: ${formatBookingAmount(response.refundAmount)}.`,
      );
      onClose();
    } catch (cancelError) {
      setActionError(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel this booking. Please try again.",
      );
      await refetch();
    }
  };

  const cancellation = preview?.cancellation;
  const canCancel = cancellation?.canCancel === true;
  const dateOptions =
    cancellation?.canCancel && cancellation.stage === "during_stay"
      ? cancellation.checkOutDateOptions
      : null;
  const suggestedCheckOut = cancellation?.canCancel
    ? cancellation.actualCheckOut
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-booking-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !cancelBooking.isPending) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="cancel-booking-title"
              className="text-xl font-bold text-[#162B4C]"
            >
              Cancel shortlet booking
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review the refund details before confirming.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={cancelBooking.isPending}
            aria-label="Close cancellation dialog"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-10 text-sm text-gray-600">
            <Loader2 className="animate-spin text-[#43A047]" size={20} />
            Checking the cancellation policy and refund…
          </div>
        ) : isError ? (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <p>
              {error instanceof Error
                ? error.message
                : "Unable to load cancellation details."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {preview?.policy?.summary && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">
                  {preview.policy.label || "Cancellation policy"}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {preview.policy.summary}
                </p>
              </div>
            )}

            {dateOptions && (
              <label className="mt-5 block text-sm font-semibold text-gray-700">
                Your new check-out date
                <input
                  type="date"
                  min={dateOptions.earliest}
                  max={dateOptions.latest}
                  value={
                    checkOutDate || suggestedCheckOut || dateOptions.earliest
                  }
                  onChange={(event) => setCheckOutDate(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-gray-300 px-3 font-normal"
                />
                <span className="mt-1 block font-normal text-gray-500">
                  Early check-out refund depends on the date you choose.
                </span>
              </label>
            )}

            {canCancel && cancellation && (
              <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">
                <p className="text-sm font-semibold text-gray-800">
                  Estimated refund
                </p>
                <p className="mt-1 text-2xl font-bold text-[#277B2B]">
                  {formatBookingAmount(preview.expectedRefundAmount)}
                </p>
                {cancellation.refundPercent !== undefined && (
                  <p className="mt-1 text-sm text-gray-600">
                    {cancellation.refundPercent}% refund for eligible nights
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Not refundable:{" "}
                  {formatBookingAmount(cancellation.nonRefundableAmount)}
                </p>
              </div>
            )}

            {cancellation && !cancellation.canCancel && (
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{cancellation.reason}</p>
              </div>
            )}
          </>
        )}

        <label className="mt-5 block text-sm font-semibold text-gray-700">
          Reason (optional)
          <textarea
            value={reason}
            maxLength={1000}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="mt-2 w-full resize-y rounded-xl border border-gray-300 p-3 font-normal"
            placeholder="Tell the host why you are cancelling"
          />
        </label>

        {(actionError || cancelBooking.isError) && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {actionError ||
              (cancelBooking.error instanceof Error
                ? cancelBooking.error.message
                : "Unable to cancel this booking.")}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={cancelBooking.isPending}
            className="min-h-11 rounded-full border border-gray-200 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep booking
          </button>
          <button
            type="button"
            onClick={() => void handleCancel()}
            disabled={
              !canCancel ||
              !preview?.expectedRefundAmount ||
              isLoading ||
              isError ||
              cancelBooking.isPending
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelBooking.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Confirm cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

const MyBookingsPage = () => {
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [selectedBooking, setSelectedBooking] =
    useState<ShortletGuestBooking | null>(null);
  const {
    data: bookings = [],
    isLoading: isLoadingRentals,
    isError: isRentalsError,
    error: rentalsError,
    refetch: refetchRentals,
    isFetching: isFetchingRentals,
  } = useBookedRentals();
  const {
    data: shortletBookings = [],
    isLoading: isLoadingShortlets,
    isError: isShortletsError,
    error: shortletsError,
    refetch: refetchShortlets,
    isFetching: isFetchingShortlets,
  } = useShortletBookings();
  const {
    data: pendingReviews = [],
    isError: isPendingReviewsError,
    error: pendingReviewsError,
    refetch: refetchPendingReviews,
    isFetching: isFetchingPendingReviews,
  } = usePendingShortletReviews();
  const isLoading = isLoadingRentals || isLoadingShortlets;
  const isFetching =
    isFetchingRentals || isFetchingShortlets || isFetchingPendingReviews;
  const pendingReviewIds = useMemo(
    () => new Set(pendingReviews.map((review) => review.booking_id)),
    [pendingReviews],
  );

  const longTermBookings = useMemo(
    () => bookings.filter(isLongTermRental),
    [bookings],
  );
  const filteredLongTermBookings =
    filter === "shortlet" ? [] : longTermBookings;
  const filteredShortletBookings =
    filter === "long-term" ? [] : shortletBookings;
  const totalBookings = longTermBookings.length + shortletBookings.length;
  const visibleBookingCount =
    filteredLongTermBookings.length + filteredShortletBookings.length;

  const hasBookingError =
    isRentalsError ||
    isShortletsError ||
    (filter !== "long-term" && isPendingReviewsError);
  const hasAnyBookings = totalBookings > 0;
  const retryBookings = () => {
    if (isRentalsError) void refetchRentals();
    if (isShortletsError) void refetchShortlets();
    if (filter !== "long-term" && isPendingReviewsError) {
      void refetchPendingReviews();
    }
  };

  return (
    <DashboardLayout>
      <section className="min-h-screen bg-[#F8F9FA] px-4 py-6 sm:px-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#162B4C] sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-1 text-gray-600">
            View and manage your booked long-term rentals and shortlets.
          </p>
        </header>

        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter bookings"
        >
          {(
            [
              ["all", "All bookings"],
              ["long-term", "Long-term"],
              ["shortlet", "Shortlets"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === value
                  ? "bg-[#43A047] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16" role="status">
            <Loader2 className="animate-spin text-[#43A047]" size={32} />
            <span className="sr-only">Loading your bookings</span>
          </div>
        ) : (
          <>
            {hasBookingError && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
                <p>
                  {[
                    isRentalsError
                      ? `Long-term bookings: ${
                          rentalsError instanceof Error
                            ? rentalsError.message
                            : "Unable to load."
                        }`
                      : null,
                    isShortletsError
                      ? `Shortlet bookings: ${
                          shortletsError instanceof Error
                            ? shortletsError.message
                            : "Unable to load."
                        }`
                      : null,
                    filter !== "long-term" && isPendingReviewsError
                      ? `Review eligibility: ${
                          pendingReviewsError instanceof Error
                            ? pendingReviewsError.message
                            : "Unable to load."
                        }`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                <button
                  type="button"
                  onClick={retryBookings}
                  disabled={isFetching}
                  className="mt-3 font-semibold underline disabled:opacity-50"
                >
                  {isFetching ? "Retrying…" : "Try again"}
                </button>
              </div>
            )}
            {visibleBookingCount === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-bold text-[#162B4C]">
                  {hasAnyBookings
                    ? "No bookings in this category"
                    : hasBookingError
                      ? "Bookings could not be loaded"
                      : totalBookings === 0
                        ? "No bookings yet"
                        : "No bookings in this category"}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {hasAnyBookings
                    ? "Try selecting another booking category."
                    : hasBookingError
                      ? "Use Try again above to reload your bookings."
                      : totalBookings === 0
                        ? "Properties you book will appear here."
                        : "Try selecting another booking category."}
                </p>
                {totalBookings === 0 && !hasBookingError && (
                  <Link
                    href="/properties"
                    className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#43A047] px-5 text-sm font-semibold text-white hover:bg-[#388E3C]"
                  >
                    Browse properties
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredLongTermBookings.map((rental) => (
                  <LongTermBookingCard key={rental.id} rental={rental} />
                ))}
                {filteredShortletBookings.map((booking) => (
                  <ShortletBookingCard
                    key={booking.id}
                    booking={booking}
                    canReview={
                      booking.review?.canReview === true ||
                      pendingReviewIds.has(booking.booking_id ?? booking.id)
                    }
                    onCancel={(selected) => setSelectedBooking(selected)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
      {selectedBooking && (
        <CancellationDialog
          key={selectedBooking.id}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default MyBookingsPage;
