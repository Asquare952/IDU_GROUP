"use client";

import { useState, type FormEvent } from "react";
import {
  getShortletApiError,
  useHostShortletInspections,
  useSubmitShortletInspection,
  type ShortletGuestBooking,
} from "@/app/api/features/shortlet";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { CalendarDays, Loader2, MapPin, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatAmount = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `₦${amount.toLocaleString("en-NG")}`
    : String(value);
};

const hasAllowedExtension = (file: File, extensions: string[]) =>
  extensions.some((extension) => file.name.toLowerCase().endsWith(extension));

const isAllowedFile = (
  file: File,
  allowedTypes: Set<string>,
  extensions: string[],
) =>
  allowedTypes.has(file.type) ||
  (!file.type && hasAllowedExtension(file, extensions));

function InspectionCard({ booking }: { booking: ShortletGuestBooking }) {
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const { mutate, isPending } = useSubmitShortletInspection();

  const shortlet = booking.shortlet;
  const address = [shortlet?.area, shortlet?.city, shortlet?.address]
    .filter(Boolean)
    .join(", ");
  const feeAmount = Number(booking.depositClaim?.cautionFee);
  const feePrompt =
    Number.isFinite(feeAmount) && feeAmount > 0
      ? `${formatAmount(feeAmount)} caution fee`
      : "the caution fee";

  const submitNoDamage = () => {
    if (
      !window.confirm(
        `Confirm the property was returned in acceptable condition? ${feePrompt} will be refunded to the guest.`,
      )
    ) {
      return;
    }

    setFormError(null);
    mutate(
      { bookingId: booking.id, outcome: "no_damage" },
      {
        onSuccess: (response) => toast.success(response.message),
        onError: (error) => setFormError(getShortletApiError(error).message),
      },
    );
  };

  const submitDamage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
      setFormError("Describe the damage in 10 to 2000 characters.");
      return;
    }
    if (photos.length > 5 || videos.length > 2) {
      setFormError("Attach up to 5 photos and up to 2 videos.");
      return;
    }
    if (photos.length === 0 && videos.length === 0) {
      setFormError("Attach at least one photo or video as evidence.");
      return;
    }
    if (
      photos.some(
        (photo) =>
          !isAllowedFile(photo, ALLOWED_PHOTO_TYPES, [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".avif",
          ]) || photo.size > MAX_PHOTO_BYTES,
      )
    ) {
      setFormError(
        "Photos must be JPEG, PNG, WEBP, or AVIF and 5 MB or smaller.",
      );
      return;
    }
    if (
      videos.some(
        (video) =>
          !isAllowedFile(video, ALLOWED_VIDEO_TYPES, [
            ".mp4",
            ".mov",
            ".webm",
          ]) || video.size > MAX_VIDEO_BYTES,
      )
    ) {
      setFormError("Videos must be MP4, MOV, or WEBM and 50 MB or smaller.");
      return;
    }

    mutate(
      {
        bookingId: booking.id,
        outcome: "damage",
        description: trimmedDescription,
        photos,
        videos,
      },
      {
        onSuccess: (response) => toast.success(response.message),
        onError: (error) => setFormError(getShortletApiError(error).message),
      },
    );
  };

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-[#162B4C]">
          {shortlet?.title || "Shortlet booking"}
        </h2>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={15} aria-hidden="true" />
          {address || "Location unavailable"}
        </p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <CalendarDays size={16} aria-hidden="true" />
          {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
        </p>
        <p>Guest: {booking.guest?.fullName || "Guest details unavailable"}</p>
        <p>
          Refundable caution fee:{" "}
          <span className="font-semibold text-gray-900">
            {formatAmount(booking.depositClaim?.cautionFee)}
          </span>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submitNoDamage}
          disabled={isPending}
          className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white hover:bg-[#388E3C] disabled:cursor-not-allowed disabled:opacity-60"
        >
          No damage incurred
        </button>
        <button
          type="button"
          onClick={() => {
            setFormError(null);
            setShowDamageForm((visible) => !visible);
          }}
          disabled={isPending}
          className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {showDamageForm ? "Cancel damage report" : "Report damage"}
        </button>
      </div>

      {showDamageForm && (
        <form onSubmit={submitDamage} className="mt-5 space-y-4 border-t pt-5">
          <label className="block text-sm font-medium text-gray-700">
            Describe the damage
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-3"
            />
            <span className="mt-1 block text-xs text-gray-500">
              10–2000 characters
            </span>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Photos (up to 5, max 5 MB each)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
              multiple
              onChange={(event) =>
                setPhotos(Array.from(event.currentTarget.files ?? []))
              }
              className="mt-1 block w-full text-sm"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Videos (up to 2, max 50 MB each)
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              multiple
              onChange={(event) =>
                setVideos(Array.from(event.currentTarget.files ?? []))
              }
              className="mt-1 block w-full text-sm"
            />
          </label>

          <p className="text-xs text-gray-500">
            Attach at least one photo or video. The admin will determine the
            verified damage cost.
          </p>

          {formError && (
            <p className="text-sm text-red-700" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#162B4C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243f67] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Submitting…" : "Submit damage report"}
          </button>
        </form>
      )}

      {formError && !showDamageForm && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {formError}
        </p>
      )}

      {isPending && (
        <span className="sr-only" role="status">
          Submitting checkout inspection
        </span>
      )}
    </article>
  );
}

export default function ShortletInspectionsPage() {
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useHostShortletInspections();
  const inspections = bookings.filter(
    (booking) => booking.depositClaim?.canInspect === true,
  );

  return (
    <DashboardLayout>
      <section className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#162B4C] md:text-3xl">
            Shortlet checkout inspections
          </h1>
          <p className="mt-1 text-gray-600">
            Review stays awaiting your answer about damage after checkout.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-16" role="status">
            <Loader2 className="animate-spin text-[#43A047]" size={32} />
            <span className="sr-only">Loading pending inspections</span>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <p>
              {error instanceof Error
                ? error.message
                : "Unable to load shortlet inspections."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-3 inline-flex items-center gap-2 font-semibold underline disabled:opacity-50"
            >
              <RotateCcw size={14} />
              {isFetching ? "Retrying…" : "Try again"}
            </button>
          </div>
        ) : inspections.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#162B4C]">
              No pending inspections
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Stays requiring a checkout inspection will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {inspections.map((booking) => (
              <InspectionCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
