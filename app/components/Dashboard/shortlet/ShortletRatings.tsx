import { Star } from "lucide-react";

interface ShortletRatingsProps {
  rating?: number;
  reviewCount?: number;
}

export default function ShortletRatings({
  rating,
  reviewCount,
}: ShortletRatingsProps) {
  if (rating === undefined && reviewCount === undefined) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      {rating !== undefined && (
        <span className="inline-flex items-center gap-1 font-semibold">
          <Star size={16} className="fill-current" />
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-gray-500">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      )}
    </div>
  );
}
