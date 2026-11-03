import { useState } from "react";
import { Star, Sparkles } from "lucide-react";

export interface ShortletReview {
  id: string;
  guestName: string;
  guestImage?: string;
  guestInitials?: string;
  membership?: string;
  date: string;
  rating: number;
  comment: string;
  category?: string;
}

interface ShortletReviewsProps {
  reviews?: ShortletReview[];
  averageRating?: number;
  totalReviews?: number;
}

const reviewCategories = [
  { label: "Cleanliness", icon: "🧹" },
  { label: "Hospitality", icon: "🎁" },
  { label: "Amenities", icon: "🛋️" },
  { label: "Bathroom", icon: "🚿" },
  { label: "Comfort", icon: "🛏️" },
];

export default function ShortletReviews({
  reviews = [],
  averageRating,
  totalReviews,
}: ShortletReviewsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const rating =
    averageRating ??
    (reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0);

  const count = totalReviews ?? reviews.length;

  const categoryCounts = reviewCategories.map((category) => ({
    ...category,
    count: reviews.filter((review) => review.category === category.label)
      .length,
  }));

  const filteredReviews =
    selectedCategory === "All"
      ? reviews
      : reviews.filter((review) => review.category === selectedCategory);

  const visibleReviews = showAll
    ? filteredReviews
    : filteredReviews.slice(0, 6);

  const toggleExpanded = (id: string) => {
    setExpandedReviews((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  if (reviews.length === 0) {
    return (
      <section className="w-full border-t border-gray-200 py-10 sm:py-12">
        <h2 className="mb-5 text-2xl font-semibold text-gray-900">
          Guest reviews
        </h2>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 text-center">
          <Sparkles className="mx-auto mb-3 text-[#43A047]" size={28} />
          <h3 className="font-semibold text-gray-900">No reviews yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Guest feedback will appear here after completed stays.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border-t border-gray-200 py-10 sm:py-12">
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <Star size={24} className="fill-gray-900 text-gray-900" />

        <h2 className="text-2xl font-semibold text-gray-900">
          {rating.toFixed(1)} · {count} {count === 1 ? "review" : "reviews"}
        </h2>
      </div>

      <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={`shrink-0 rounded-full border px-4 py-3 text-sm font-medium transition ${
            selectedCategory === "All"
              ? "border-[#43A047] bg-[#E8F5E9] text-[#2E7D32]"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          All reviews
        </button>

        {categoryCounts.map((category) => (
          <button
            type="button"
            key={category.label}
            onClick={() =>
              setSelectedCategory((current) =>
                current === category.label ? "All" : category.label,
              )
            }
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition ${
              selectedCategory === category.label
                ? "border-[#43A047] bg-[#E8F5E9] text-[#2E7D32]"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
            <span className="text-gray-400">{category.count}</span>
          </button>
        ))}
      </div>

      {visibleReviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {visibleReviews.map((review) => {
              const isExpanded = expandedReviews.includes(review.id);
              const isLong = review.comment.length > 150;

              return (
                <article key={review.id} className="min-w-0">
                  <div className="mb-4 flex items-center gap-3">
                    {review.guestImage ? (
                      <img
                        src={review.guestImage}
                        alt={review.guestName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] font-semibold text-[#2E7D32]">
                        {review.guestInitials ||
                          review.guestName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.guestName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.membership || "RentULO guest"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
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
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600">{review.date}</span>
                  </div>

                  <p className="text-sm leading-6 text-gray-700">
                    {isLong && !isExpanded
                      ? `${review.comment.slice(0, 150).trimEnd()}...`
                      : review.comment}
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(review.id)}
                      className="mt-2 font-semibold text-gray-900 underline underline-offset-4 hover:text-[#43A047]"
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          {filteredReviews.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="mt-8 rounded-xl border border-gray-900 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              {showAll ? "Show fewer reviews" : "Show all reviews"}
            </button>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-10 text-center">
          <Sparkles className="mx-auto mb-3 text-[#43A047]" size={28} />
          <h3 className="font-semibold text-gray-900">
            {reviews.length === 0
              ? "No reviews yet"
              : "No reviews in this category yet"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {reviews.length === 0
              ? "Guest feedback will appear here after completed stays."
              : "Guest feedback for this category will appear here."}
          </p>
          {reviews.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-4 font-semibold text-[#43A047] hover:underline"
            >
              View all reviews
            </button>
          )}
        </div>
      )}
    </section>
  );
}
