"use client";

import { Home, MapPin, Shield } from "lucide-react";
import { useState } from "react";
import ShortletInfo from "@/app/components/Dashboard/shortlet/ShortletInfo";

type ReviewValues = {
  title?: unknown;
  description?: unknown;
  location?: unknown;
  propertyType?: unknown;
  status?: unknown;
  priceType?: unknown;
  rentalModel?: unknown;
  furnishedStatus?: unknown;
  area?: unknown;
  city?: unknown;
  address?: unknown;
  landmark?: unknown;
  bedrooms?: unknown;
  bathrooms?: unknown;
  livivngRooms?: unknown;
  guestCapacity?: unknown;
  pricePerNight?: unknown;
  cleaningFee?: unknown;
  securityDeposit?: unknown;
  basicRent?: unknown;
  legalFee?: unknown;
  cautionFee?: unknown;
  brokeFee?: unknown;
  mgtServiceCharge?: unknown;
  minimumStay?: unknown;
  maximumStay?: unknown;
  availableFrom?: unknown;
  availableTo?: unknown;
  checkInTime?: unknown;
  checkOutTime?: unknown;
  smokingAllowed?: unknown;
  petsAllowed?: unknown;
  partiesAllowed?: unknown;
  houseRules?: unknown;
};

type ReviewPublishPreviewProps = {
  values: ReviewValues;
  amenities: string[];
  imagePreviews: string[];
  videoPreviews: string[];
  isShortlet: boolean;
  totalPackage?: number;
};

const asText = (value: unknown) => String(value ?? "").trim();
const asNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatLabel = (value: unknown) =>
  asText(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value: unknown) => {
  const date = asText(value);
  if (!date) return "";
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

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
    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
      <span className="text-[#4CAF50]">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="mt-1 break-words font-semibold capitalize text-gray-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function FeeRow({ label, value }: { label: string; value: unknown }) {
  const amount = asNumber(value);
  if (amount <= 0) return null;

  return (
    <div className="flex justify-between gap-3 text-sm text-gray-600">
      <span>{label}</span>
      <span>₦{amount.toLocaleString()}</span>
    </div>
  );
}

export default function ReviewPublishPreview({
  values,
  amenities,
  imagePreviews,
  videoPreviews,
  isShortlet,
  totalPackage = 0,
}: ReviewPublishPreviewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const title = asText(values.title) || "Untitled property";
  const location = isShortlet
    ? [values.area, values.city].map(asText).filter(Boolean).join(", ") ||
      asText(values.address)
    : asText(values.location);
  const images = imagePreviews.slice(0, 5);
  const selectedImageIndex = Math.min(
    activeImageIndex,
    Math.max(images.length - 1, 0),
  );
  const activeImage = images[selectedImageIndex];
  const videos = videoPreviews.filter((video) => !video.includes("LARGE_FILE"));
  const houseRules = asText(values.houseRules)
    .split(/\n|,/)
    .map((rule) => rule.trim())
    .filter(Boolean);
  const smokingAllowed = asText(values.smokingAllowed);
  const petsAllowed = asText(values.petsAllowed);
  const partiesAllowed = asText(values.partiesAllowed);
  const shortletRules = [
    ...houseRules,
    ...(smokingAllowed
      ? [smokingAllowed === "true" ? "Smoking allowed" : "No smoking"]
      : []),
    ...(petsAllowed
      ? [petsAllowed === "true" ? "Pets allowed" : "No pets"]
      : []),
    ...(partiesAllowed
      ? [partiesAllowed === "true" ? "Parties allowed" : "No parties"]
      : []),
  ];
  const availability = [
    formatDate(values.availableFrom),
    formatDate(values.availableTo),
  ]
    .filter(Boolean)
    .join(" – ");
  const rent = isShortlet ? asNumber(values.pricePerNight) : totalPackage;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
      <header className="border-b border-gray-100 p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#4CAF50]">
          Review &amp; publish
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Preview your {isShortlet ? "shortlet" : "rental"} listing
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Check how your listing details will appear before publishing.
        </p>
      </header>

      <div className="mx-auto max-w-[1280px] space-y-8 p-5 md:p-8">
        <p className="text-sm font-medium text-gray-500">
          Properties / <span className="text-gray-900">{title}</span>
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              {activeImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-gray-100">
                  <img
                    src={activeImage}
                    alt={`${title} photo ${selectedImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
                    {selectedImageIndex + 1}/{images.length}
                  </span>
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-3xl bg-gray-100 text-sm text-gray-400">
                  No photos selected yet
                </div>
              )}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Preview photo ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                      className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${
                        selectedImageIndex === index
                          ? "border-[#4CAF50]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <video
                    key={`${video}-${index}`}
                    src={video}
                    controls
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

            <div>
              <p className="text-sm font-semibold text-[#4CAF50]">
                {isShortlet ? "Shortlet" : "Long-term rental"}
              </p>
              <h1 className="mt-1 text-3xl font-black text-gray-900">
                {title}
              </h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={15} />
                {location || "Location not provided"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-[32px] bg-gray-50 p-6 sm:grid-cols-3">
              <Spec
                icon={<MapPin size={20} />}
                label="Location"
                value={location}
              />
              <Spec
                icon={<Home size={20} />}
                label="Type"
                value={formatLabel(values.propertyType)}
              />
              <Spec
                icon={<Shield size={20} />}
                label="Status"
                value={formatLabel(values.status) || "Available"}
              />
            </div>

            {isShortlet && (
              <DetailSection title="Location">
                <div className="space-y-2 text-gray-600">
                  {[values.address, values.area, values.city]
                    .map(asText)
                    .filter(Boolean)
                    .map((part, index) => (
                      <p key={`${part}-${index}`}>{part}</p>
                    ))}
                  {asText(values.landmark) && (
                    <p>
                      <span className="font-semibold">Nearby landmark:</span>{" "}
                      {asText(values.landmark)}
                    </p>
                  )}
                  {!asText(values.address) &&
                    !asText(values.area) &&
                    !asText(values.city) &&
                    !asText(values.landmark) && (
                      <p>Location details are not available.</p>
                    )}
                </div>
              </DetailSection>
            )}

            <DetailSection title="Description">
              <p className="text-lg leading-relaxed text-gray-600">
                {asText(values.description) || "No description provided yet."}
              </p>
            </DetailSection>

            <DetailSection title="Amenities">
              {amenities.length > 0 ? (
                <ul className="list-inside list-disc space-y-2">
                  {amenities.map((amenity, index) => (
                    <li
                      key={`${amenity}-${index}`}
                      className="text-lg leading-relaxed text-gray-600"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No amenities have been listed.</p>
              )}
            </DetailSection>

            {isShortlet && (
              <>
                {(asNumber(values.bedrooms) > 0 ||
                  asNumber(values.bathrooms) > 0 ||
                  asNumber(values.livivngRooms) > 0 ||
                  asNumber(values.guestCapacity) > 0 ||
                  asText(values.furnishedStatus)) && (
                  <DetailSection title="Accommodation">
                    <div className="flex flex-wrap gap-3">
                      {asNumber(values.bedrooms) > 0 && (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          {asNumber(values.bedrooms)}{" "}
                          {asNumber(values.bedrooms) === 1
                            ? "bedroom"
                            : "bedrooms"}
                        </span>
                      )}
                      {asNumber(values.bathrooms) > 0 && (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          {asNumber(values.bathrooms)}{" "}
                          {asNumber(values.bathrooms) === 1
                            ? "bathroom"
                            : "bathrooms"}
                        </span>
                      )}
                      {asNumber(values.livivngRooms) > 0 && (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          {asNumber(values.livivngRooms)}{" "}
                          {asNumber(values.livivngRooms) === 1
                            ? "living room"
                            : "living rooms"}
                        </span>
                      )}
                      {asNumber(values.guestCapacity) > 0 && (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                          Up to {asNumber(values.guestCapacity)} guests
                        </span>
                      )}
                      {asText(values.furnishedStatus) && (
                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm capitalize text-gray-700">
                          {formatLabel(values.furnishedStatus)}
                        </span>
                      )}
                    </div>
                  </DetailSection>
                )}

                {(availability ||
                  asText(values.minimumStay) ||
                  asText(values.maximumStay)) && (
                  <DetailSection title="Availability">
                    <div className="space-y-2 text-gray-600">
                      {availability && <p>Available: {availability}</p>}
                      {asText(values.minimumStay) && (
                        <p>Minimum stay: {asText(values.minimumStay)} nights</p>
                      )}
                      {asText(values.maximumStay) && (
                        <p>Maximum stay: {asText(values.maximumStay)} nights</p>
                      )}
                    </div>
                  </DetailSection>
                )}

                <ShortletInfo
                  checkInTime={asText(values.checkInTime) || undefined}
                  checkOutTime={asText(values.checkOutTime) || undefined}
                  houseRules={shortletRules}
                />
              </>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="space-y-6 rounded-[40px] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 md:p-8">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-bold uppercase text-gray-700">
                  {formatLabel(values.status) || "Available"} listing
                </span>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-gray-400">
                  {isShortlet ? "Price per night" : "Rent"}
                </p>
                <h3 className="text-3xl font-black text-gray-900">
                  ₦{rent.toLocaleString()}
                  <span className="ml-1 text-lg font-normal capitalize text-gray-500">
                    /
                    {isShortlet
                      ? "night"
                      : asText(values.priceType) || "yearly"}
                  </span>
                </h3>
                <div className="mt-4 space-y-2">
                  {isShortlet ? (
                    <>
                      <FeeRow label="Cleaning fee" value={values.cleaningFee} />
                      <FeeRow
                        label="Security deposit"
                        value={values.securityDeposit}
                      />
                    </>
                  ) : (
                    <>
                      <FeeRow
                        label="Service charge"
                        value={values.mgtServiceCharge}
                      />
                      <FeeRow label="Caution fee" value={values.cautionFee} />
                      <FeeRow label="Legal fee" value={values.legalFee} />
                      <FeeRow label="Agency fee" value={values.brokeFee} />
                    </>
                  )}
                </div>
              </div>

              {isShortlet && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-700">
                    RENTAL TYPE
                  </p>
                  <p className="mt-1 capitalize text-gray-600">
                    {formatLabel(values.rentalModel) || "Not provided"}
                  </p>
                  <button
                    type="button"
                    disabled
                    className="mt-5 min-h-12 w-full rounded-full bg-[#43A047] py-3 font-semibold text-white opacity-50"
                  >
                    Book now
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    Booking details are selected by renters on the listing.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
