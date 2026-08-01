"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import {
  fetchProperties,
  searchProperties,
  type Property,
} from "@/app/api/features/property";
import { getPropertyDetailsPath } from "@/app/lib/property-routes";
import { hasAccessToken } from "@/app/lib/auth";
import { useLikeRental, useUnlikeRental } from "@/app/api";
import { House, MapPin } from "lucide-react";

// FIX: matches the real backend propertyType enum exactly (see docs section 16 —
// ENUM Definitions). "Bungalow" and "Duplex" were never valid values here or in
// HeroSection's dropdown — those need fixing on that end too, since selecting them
// can never match a real property no matter what this page does.
const CATEGORIES = [
  "All",
  "Apartment",
  "House",
  "Office",
  "Commercial",
  "Land",
  "Lodge",
  "Shortlet",
];

function AllPropertiesPageContent() {
  const router = useRouter();

  // FIX: this is the actual bug — read what HeroSection.tsx put in the URL
  // (?search=...&category=...) instead of always starting from a blank state.
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = searchParams.get("category") ?? "";

  // Normalize the URL's category value (e.g. "lodge") against our CATEGORIES
  // list case-insensitively, so "?category=lodge" correctly selects "Lodge".
  // Falls back to "All" if it doesn't match anything we recognize.
  const matchedCategory =
    CATEGORIES.find((c) => c.toLowerCase() === urlCategory.toLowerCase()) ??
    "All";

  const [tempSearch, setTempSearch] = useState(urlSearch);
  const [finalSearch, setFinalSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(matchedCategory);

  // FIX: useState's initial value only applies on first mount. If this page
  // stays mounted across a second navigation (e.g. searching again from the
  // homepage), the URL changes but this state doesn't — so a stale category
  // from the PREVIOUS search can silently filter out results from the NEW
  // one. Re-sync whenever the actual URL params change.
  useEffect(() => {
    setTempSearch(urlSearch);
    setFinalSearch(urlSearch);
    setSelectedCategory(matchedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch, urlCategory]);

  const [likedPropertyIds, setLikedPropertyIds] = useState<Set<string>>(
    () => new Set(),
  );
  const hasInitializedRef = useRef(false);
  const isLoggedIn = hasAccessToken();
  const recentOnly = !isLoggedIn;
  const { mutate: likeRental } = useLikeRental();
  const { mutate: unlikeRental } = useUnlikeRental();

  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useQuery<Property[], Error>({
    queryKey: ["properties-list", finalSearch, recentOnly ? "recent" : "all"],
    queryFn: async () => {
      const trimmedSearch = finalSearch.trim();

      return trimmedSearch
        ? searchProperties({ location: trimmedSearch }, { recentOnly })
        : fetchProperties({ recentOnly });
    },
  });

  // Category filtering happens client-side on whatever the query above returned —
  // the backend's /rental/search only supports filtering by location, not property
  // type, so this is intentional, not a workaround.
  const visibleProperties = properties.filter((item) => {
    if (selectedCategory === "All") {
      return true;
    }

    return item.propertyType.toLowerCase() === selectedCategory.toLowerCase();
  });

  useEffect(() => {
    if (properties.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setLikedPropertyIds(
        new Set(
          properties
            .filter((property) => property.liked)
            .map((property) => String(property.id)),
        ),
      );
    }
  }, []);

  const handleLikeToggle = (propertyId: string) => {
    if (!hasAccessToken()) {
      router.push("/login");
      return;
    }

    const wasLiked = likedPropertyIds.has(propertyId);

    setLikedPropertyIds((previousIds) => {
      const nextIds = new Set(previousIds);

      if (wasLiked) {
        nextIds.delete(propertyId);
      } else {
        nextIds.add(propertyId);
      }

      return nextIds;
    });

    const mutation = wasLiked ? unlikeRental : likeRental;

    mutation(propertyId, {
      onError: () => {
        setLikedPropertyIds((previousIds) => {
          const nextIds = new Set(previousIds);

          if (wasLiked) {
            nextIds.add(propertyId);
          } else {
            nextIds.delete(propertyId);
          }

          return nextIds;
        });
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 lg:p-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-[32px] shadow-sm mb-6 items-center">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by location (e.g. Lagos, Lekki)..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-[24px] outline-none text-gray-700"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setFinalSearch(tempSearch)}
              className="w-full md:w-auto px-10 py-4 bg-[#4CAF50] text-white rounded-[24px] font-bold hover:bg-[#43A047] transition-all active:scale-95"
            >
              Search
            </button>
          </div>

          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#4CAF50] text-white shadow-lg shadow-green-100"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-[#4CAF50]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-[35px] overflow-hidden shadow-sm border border-gray-100 p-2"
                >
                  <div className="relative h-56 md:h-64 w-full bg-gray-100 animate-pulse rounded-[28px]" />
                  <div className="p-5 pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-3 w-2/3">
                        <div className="h-6 w-24 bg-gray-100 animate-pulse rounded-md" />
                        <div className="h-5 w-full bg-gray-50 animate-pulse rounded-md" />
                      </div>
                      <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-3 w-3 bg-gray-100 animate-pulse rounded-full" />
                      <div className="h-3 w-32 bg-gray-50 animate-pulse rounded-md" />
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-3 w-full bg-gray-50/50 animate-pulse rounded-md" />
                      <div className="h-3 w-4/5 bg-gray-50/50 animate-pulse rounded-md" />
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                      <div className="h-4 w-16 bg-gray-50 animate-pulse rounded-md" />
                      <div className="h-4 w-16 bg-gray-50 animate-pulse rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-red-500 text-lg font-medium">
                {error.message || "Failed to load properties."}
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {visibleProperties.length > 0 ? (
                  visibleProperties.map((item) => {
                    return (
                      <motion.div
                        key={item.id}
                        onClick={() =>
                          router.push(getPropertyDetailsPath(item))
                        }
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group overflow-hidden rounded-[35px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-slate-100 md:h-64 group">
                          {item.images[0] ? (
                            <div className="block h-full w-full">
                              <Image
                                src={item.images[0]}
                                alt={item.title}
                                fill
                                className="object-cover rounded-3xl p-2 transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          ) : (
                            <div className="block h-full w-full">
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                No image
                              </div>
                            </div>
                          )}
                          <button
                            type="button"
                            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#162B4C] shadow-sm transition hover:text-red-500"
                            aria-label={`Save ${item.title}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeToggle(String(item.id));
                            }}
                          >
                            {likedPropertyIds.has(String(item.id)) ? (
                              <HiHeart
                                size={22}
                                className="text-red-500 transition-all duration-200"
                              />
                            ) : (
                              <HiOutlineHeart
                                size={22}
                                className="transition-all duration-200"
                              />
                            )}
                          </button>
                        </div>

                        <div className="p-5">
                          <div className="mb-2 flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                ₦{Number(item.price).toLocaleString()}
                                <span className="text-sm font-normal text-gray-400 capitalize">
                                  / {item.priceType}
                                </span>
                              </p>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {item.title}
                              </h3>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              whileHover={{ scale: 1.05 }}
                              className="cursor-pointer rounded-full bg-[#E8F5E9] px-4 py-1.5 text-xs font-bold text-[#43A047]"
                            >
                              View
                            </motion.button>
                          </div>

                          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
                            {item.description || "No description provided yet."}
                          </p>

                          <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4">
                            <div className="flex items-center gap-2">
                              <House size={16} className="text-gray-400" />
                              <span className="text-xs font-medium text-gray-500 capitalize">
                                {item.propertyType}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-xs font-medium text-gray-500">
                                {item.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 text-lg font-medium">
                      No results found.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFinalSearch("");
                        setTempSearch("");
                        setSelectedCategory("All");
                      }}
                      className="mt-4 text-[#4CAF50] font-bold hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// FIX: useSearchParams() requires a Suspense boundary in the App Router,
// or Next.js will error/opt the whole page out of static rendering.
export default function AllPropertiesPage() {
  return (
    <Suspense fallback={null}>
      <AllPropertiesPageContent />
    </Suspense>
  );
}
