"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Sparkles, Star, X } from "lucide-react";
import type { ShortletPublicReview } from "@/app/api/features/shortlet";

interface ShortletReviewsProps {
  reviews?: ShortletPublicReview[];
  averageRating?: number;
  totalReviews?: number;
  isLoading?: boolean;
  error?: string;
}

const formatReviewDate = (review: ShortletPublicReview) => {
  if (review.stay?.month) return review.stay.month;
  const date = new Date(review.createdAt);
  return Number.isNaN(date.getTime())
    ? review.createdAt
    : date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

function ReviewCard({
  review,
  showFullComment = false,
  expanded = false,
  onToggle,
}: {
  review: ShortletPublicReview;
  showFullComment?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const guestName = review.guest?.displayName || "Guest";
  const isLong = review.comment.length > 150;
  const showFull = showFullComment || expanded || !isLong;

  return (
    <article className="min-w-0 border-b border-gray-200 py-6 last:border-b-0">
      <div className="mb-4 flex items-center gap-3">
        {review.guest?.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.guest.profileImage}
            alt={guestName}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] font-semibold text-[#2E7D32]">
            {guestName.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-900">{guestName}</h3>
          <p className="text-sm text-gray-500">{formatReviewDate(review)}</p>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2 text-sm">
        <span
          className="flex items-center gap-1"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={13}
              className={
                index < review.rating
                  ? "fill-gray-900 text-gray-900"
                  : "text-gray-300"
              }
            />
          ))}
        </span>
        {review.verifiedBooking && (
          <span className="inline-flex items-center gap-1 text-gray-500">
            <BadgeCheck size={14} className="text-[#43A047]" />
            Verified stay
          </span>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
        {showFull
          ? review.comment
          : `${review.comment.slice(0, 150).trimEnd()}...`}
      </p>

      {!showFull && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 font-semibold text-gray-900 underline underline-offset-4 hover:text-[#43A047]"
        >
          Show more
        </button>
      )}

      {review.hostResponse?.text && (
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Host response
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {review.hostResponse.text}
          </p>
        </div>
      )}
    </article>
  );
}

export default function ShortletReviews({
  reviews = [],
  averageRating,
  totalReviews,
  isLoading = false,
  error,
}: ShortletReviewsProps) {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const rating =
    averageRating ??
    (reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0);
  const count = totalReviews ?? reviews.length;

  useEffect(() => {
    if (!showAllReviews) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAllReviews(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [showAllReviews]);

  const toggleExpanded = (id: string) => {
    setExpandedReviews((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <section className="w-full border-t border-gray-200 py-10 sm:py-12">
      {reviews.length > 0 && (
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <Star size={24} className="fill-gray-900 text-gray-900" />
          <h2 className="text-2xl font-semibold text-gray-900">
            {rating.toFixed(1)} · {count} {count === 1 ? "review" : "reviews"}
          </h2>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500" role="status">
          Loading guest reviews…
        </p>
      ) : error ? (
        <p
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 text-center">
          <Sparkles className="mx-auto mb-3 text-[#43A047]" size={28} />
          <h2 className="font-semibold text-gray-900">Guest reviews</h2>
          <p className="mt-2 text-sm text-gray-500">
            {count > 0
              ? "Reviews could not be loaded."
              : "Guest feedback will appear here after completed stays."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                expanded={expandedReviews.includes(review.id)}
                onToggle={() => toggleExpanded(review.id)}
              />
            ))}
          </div>

          {count > 6 && (
            <button
              type="button"
              onClick={() => setShowAllReviews(true)}
              className="mt-8 rounded-xl border border-gray-900 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Show all {count} reviews
            </button>
          )}
        </>
      )}

      {showAllReviews && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="all-shortlet-reviews-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAllReviews(false);
            }
          }}
        >
          <div className="flex max-h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl">
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-7">
              <div>
                <h2
                  id="all-shortlet-reviews-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  Reviews
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <Star size={14} className="fill-gray-900 text-gray-900" />
                  {rating.toFixed(1)} · {count}{" "}
                  {count === 1 ? "review" : "reviews"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllReviews(false)}
                aria-label="Close reviews"
                className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </header>

            <div className="overflow-y-auto px-5 sm:px-7">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showFullComment />
              ))}
              {count > reviews.length && (
                <p className="border-t border-gray-200 py-4 text-sm text-gray-500">
                  Showing the {reviews.length} most recent reviews.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
