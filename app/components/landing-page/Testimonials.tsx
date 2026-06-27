"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { hasAccessToken } from "@/app/lib/auth";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  PenLine,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetTestimonials,
  useGetMyTestimonial,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  Testimonial,
} from "@/app/api/features/testimonials";

/* ---------- Star Rating (display) ---------- */
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={
          star <= rating
            ? "fill-[#F59E0B] text-[#F59E0B]"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
  </div>
);

/* ---------- Star Rating (interactive) ---------- */
const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={
              star <= (hovered || value)
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "text-gray-200 fill-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
};

/* ---------- Format Date ---------- */
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* ---------- Testimonial Card ---------- */
const TestimonialCard = ({
  testimonial,
  isOwner,
  onEdit,
  onDelete,
}: {
  testimonial: Testimonial;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  if (!testimonial) return null;

  // Get display name from API response (user_name) or fallback to user object
  const displayName =
    testimonial.user_name ||
    `${testimonial.user?.first_name ?? ""} ${testimonial.user?.last_name ?? ""}`.trim() ||
    "Unknown User";

  // Get display image from API response (user_image) or fallback to user object
  const displayImage = testimonial.user_image || testimonial.user?.profileImage;

  // Get initials for avatar fallback
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  // Avatar colors
  const colors = [
    "from-[#22C55E] to-[#16A34A]",
    "from-[#3B82F6] to-[#2563EB]",
    "from-[#8B5CF6] to-[#7C3AED]",
    "from-[#F59E0B] to-[#D97706]",
    "from-[#EF4444] to-[#DC2626]",
    "from-[#06B6D4] to-[#0891B2]",
    "from-[#EC4899] to-[#DB2777]",
  ];
  const colorIndex = (displayName.charCodeAt(0) || 0) % colors.length;
  const gradient = colors[colorIndex];

  return (
    <div className="relative bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col gap-3 min-w-[300px] max-w-[340px]">
      {/* Top row: Quote icon left, Stars right */}
      <div className="flex items-start justify-between">
        <Quote size={20} className="text-[#8B5CF6] fill-[#8B5CF6]" />
        <StarRating rating={testimonial.rating} />
      </div>

      {/* User info row: Avatar + Name/Role */}
      <div className="flex items-center gap-3">
        {/* Avatar - image or initials */}
        {displayImage ? (
          <Image
            src={displayImage}
            alt={displayName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm`}
          >
            {initials}
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-900">
              {displayName}
            </span>
            {/* Verified badge */}
            <svg
              className="w-3.5 h-3.5 text-blue-500 fill-blue-500"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <span className="text-xs text-[#8B5CF6] capitalize">
            {testimonial.user?.role ?? "User"}
          </span>
        </div>
      </div>

      {/* Testimonial text */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {testimonial.message}
      </p>

      {/* Date */}
      <p className="text-xs text-gray-400 mt-auto">
        {formatDate(testimonial.createdAt)}
      </p>

      {/* Owner Actions */}
      {isOwner && (
        <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs text-[#22C55E] hover:text-[#16A34A] font-medium transition-colors"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------- Skeleton Card ---------- */
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3 min-w-[300px] max-w-[340px] animate-pulse">
    <div className="flex items-start justify-between">
      <div className="w-5 h-5 bg-gray-100 rounded" />
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-gray-100" />
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100" />
      <div className="space-y-1">
        <div className="h-3 bg-gray-100 rounded w-24" />
        <div className="h-2.5 bg-gray-100 rounded w-16" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-4/6" />
    </div>
    <div className="h-2.5 bg-gray-100 rounded w-20 mt-auto" />
  </div>
);

/* ---------- Review Modal ---------- */
const ReviewModal = ({
  onClose,
  existingTestimonial,
}: {
  onClose: () => void;
  existingTestimonial?: Testimonial | null;
}) => {
  const isEditing = !!existingTestimonial;
  const [rating, setRating] = useState(existingTestimonial?.rating || 0);
  const [message, setMessage] = useState(existingTestimonial?.message || "");

  const { mutate: createTestimonial, isPending: creating } =
    useCreateTestimonial();
  const { mutate: updateTestimonial, isPending: updating } =
    useUpdateTestimonial();

  const submitting = creating || updating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    if (isEditing) {
      updateTestimonial(
        { rating, message },
        {
          onSuccess: () => {
            toast.success("Review updated successfully!");
            onClose();
          },
          onError: (err: any) => {
            toast.error(
              err.response?.data?.message || "Failed to update review",
            );
          },
        },
      );
    } else {
      createTestimonial(
        { rating, message },
        {
          onSuccess: () => {
            toast.success("Review submitted! Thank you.");
            onClose();
          },
          onError: (err: any) => {
            toast.error(
              err.response?.data?.message || "Failed to submit review",
            );
          },
        },
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
          {isEditing ? "Update your experience" : "Share your experience"}
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          How was your experience with RentULO?
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
              Your Rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
              Your Review
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience finding or listing a property..."
              rows={4}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/10 transition-all resize-none"
            />
            <p
              className={`text-xs mt-1 text-right ${message.length < 10 ? "text-gray-300" : "text-[#22C55E]"}`}
            >
              {message.length} / min 10
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
                ? "Update Review"
                : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------- Delete Confirmation Modal ---------- */
const DeleteConfirmModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate: deleteTestimonial, isPending: deleting } =
    useDeleteTestimonial();

  const handleDelete = () => {
    deleteTestimonial(undefined, {
      onSuccess: () => {
        toast.success("Review deleted successfully");
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to delete review");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
        <p className="text-sm text-gray-500 mb-6">
          This will permanently remove your testimonial. This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const Testimonials = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: testimonials = [],
    isLoading: loading,
    isError: error,
  } = useGetTestimonials();

  const { data: myTestimonial, isLoading: loadingMine } = useGetMyTestimonial();

  const isLoggedIn = typeof window !== "undefined" ? hasAccessToken() : false;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : null;

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else if (myTestimonial) {
      setModalMode("edit");
      setShowModal(true);
      document.body.style.overflow = "hidden";
    } else {
      setModalMode("create");
      setShowModal(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = "";
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    document.body.style.overflow = "";
  };

  return (
    <section className="w-full bg-white py-20 px-4">
      {showModal && (
        <ReviewModal
          onClose={handleCloseModal}
          existingTestimonial={modalMode === "edit" ? myTestimonial : null}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal onClose={handleCloseDeleteModal} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-400 mb-4">
            What Our Users Say About Us
          </h2>
        </div>

        {/* Testimonials Carousel */}
        {loading ? (
          <div className="flex gap-5 overflow-x-auto pb-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Could not load testimonials. Please try again later.
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No testimonials yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="relative group">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity -ml-5"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity -mr-5"
            >
              <ChevronRight size={20} />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {testimonials.map((t) => (
                <TestimonialCard
                  key={t.id}
                  testimonial={t}
                  isOwner={myTestimonial?.id === t.id}
                  onEdit={() => {
                    setModalMode("edit");
                    setShowModal(true);
                    document.body.style.overflow = "hidden";
                  }}
                  onDelete={() => {
                    setShowDeleteModal(true);
                    document.body.style.overflow = "hidden";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Write / Edit Review Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleWriteReview}
            disabled={loadingMine}
            className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-8 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-green-200 cursor-pointer disabled:opacity-60"
          >
            {loadingMine ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <PenLine size={16} />
            )}
            {loadingMine
              ? "Loading..."
              : myTestimonial
                ? "Edit Your Review"
                : "Write a Review"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
