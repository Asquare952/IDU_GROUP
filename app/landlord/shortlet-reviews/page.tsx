"use client";

import { useState, type FormEvent } from "react";
import {
  getShortletApiError,
  useHostShortletReviews,
  useRespondToShortletReview,
  type ShortletHostReview,
} from "@/app/api/features/shortlet";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { BadgeCheck, Loader2, RotateCcw, Star } from "lucide-react";
import { toast } from "react-hot-toast";

type ReviewFilter = "all" | "unanswered";

const formatReviewDate = (review: ShortletHostReview) => {
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

function HostReviewCard({ review }: { review: ShortletHostReview }) {
  const [response, setResponse] = useState(review.hostResponse?.text ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const respond = useRespondToShortletReview();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedResponse = response.trim();
    if (trimmedResponse.length < 1 || trimmedResponse.length > 1000) {
      setFormError("Your response must be between 1 and 1000 characters.");
      return;
    }

    setFormError(null);
    respond.mutate(
      { reviewId: review.id, response: trimmedResponse },
      {
        onSuccess: (result) => toast.success(result.message),
        onError: (error) => setFormError(getShortletApiError(error).message),
      },
    );
  };

  const guestName = review.guest?.displayName || "Guest";
  const hasResponse = Boolean(review.hostResponse?.text);

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[#162B4C]">
            {review.shortlet.title || "Shortlet"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Review from {guestName}</p>
        </div>
        <div
          className="flex items-center gap-1"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={15}
              className={
                index < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
        <span>{formatReviewDate(review)}</span>
        {review.verifiedBooking && (
          <span className="inline-flex items-center gap-1">
            <BadgeCheck size={14} className="text-[#43A047]" />
            Verified stay
          </span>
        )}
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-700">
        {review.comment}
      </p>

      {review.canRespond ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 border-t border-gray-100 pt-4"
        >
          <label className="block text-sm font-medium text-gray-700">
            {hasResponse ? "Your response" : "Respond to this review"}
            <textarea
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              maxLength={1000}
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-3"
            />
            <span className="mt-1 block text-xs text-gray-500">
              {response.trim().length}/1000 characters
            </span>
          </label>

          {formError && (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={respond.isPending}
            className="mt-3 rounded-lg bg-[#162B4C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243f67] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {respond.isPending
              ? "Saving…"
              : hasResponse
                ? "Update response"
                : "Publish response"}
          </button>
        </form>
      ) : hasResponse ? (
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Your response
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {review.hostResponse?.text}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          A response is not available for this review.
        </p>
      )}
    </article>
  );
}

export default function ShortletReviewsPage() {
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useHostShortletReviews({
    responded: filter === "unanswered" ? false : undefined,
    limit: 50,
    offset: 0,
  });

  return (
    <DashboardLayout>
      <section className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#162B4C] md:text-3xl">
            Shortlet reviews
          </h1>
          <p className="mt-1 text-gray-600">
            Read guest feedback and respond to reviews for your shortlets.
          </p>
        </header>

        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter shortlet reviews"
        >
          {(
            [
              ["all", "All reviews"],
              ["unanswered", "Unanswered"],
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
            <span className="sr-only">Loading shortlet reviews</span>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <p>{getShortletApiError(error).message}</p>
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
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#162B4C]">
              {filter === "all" ? "No reviews yet" : "No unanswered reviews"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Guest reviews for your shortlets will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {reviews.map((review) => (
              <HostReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
