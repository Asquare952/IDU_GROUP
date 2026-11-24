





"use client";

import { useState, type ReactNode } from "react";

import {
  useAdminShortletBooking,
  useDeleteAdminShortletBooking,
  useResolveAdminDepositClaim,
} from "@/app/api/features/admin";

import {
  Building2,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import type {

  AdminDepositClaim,

  AdminShortletBooking,

  AdminShortletDepositClaim,

  ResolveAdminDepositClaimResponse,

} from "@/app/api/features/admin";

const formatMoney = (value: string | number | null | undefined) => {

  if (value == null || (typeof value === "string" && !value.trim())) return "—";

  const amount = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(amount)) return String(value);

  return `₦${amount.toLocaleString("en-NG", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  })}`;

};

const formatDate = (value: string | null | undefined) => {

  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())

    ? value

    : date.toLocaleString("en-NG", {

        dateStyle: "medium",

        timeStyle: "short",

      });

};

const parseCents = (value: string | number | null | undefined) => {

  if (value == null || (typeof value === "string" && !value.trim())) {

    return null;

  }

  if (typeof value === "string" && !/^\d+(?:\.\d{1,2})?$/.test(value.trim())) {

    return null;

  }

  const amount = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(amount) || amount < 0) return null;

  const cents = Math.round((amount + Number.EPSILON) * 100);

  return Number.isSafeInteger(cents) ? cents : null;

};

const getResolutionAmounts = (response: ResolveAdminDepositClaimResponse) => ({

  paidToHost:

    response.data?.paidToHost ??

    response.paidToHost ??

    response.data?.depositClaim?.deposit_paid_to_host,

  refundedToGuest: response.data?.refundedToGuest ?? response.refundedToGuest,

});

type DisplayRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is DisplayRecord =>

  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toRecord = (value: unknown): DisplayRecord => {

  if (isRecord(value)) return value;

  if (typeof value !== "string" || !value.trim().startsWith("{")) return {};

  try {

    const parsed: unknown = JSON.parse(value);

    return isRecord(parsed) ? parsed : {};

  } catch {

    return {};

  }

};

const readValue = (record: DisplayRecord, keys: readonly string[]) => {

  for (const key of keys) {

    const value = record[key];

    if (

      value != null &&

      !(typeof value === "string" && !value.trim())

    ) {

      return value;

    }

  }

  return undefined;

};

const displayValue = (value: unknown): string | undefined => {

  if (typeof value === "string" && value.trim()) return value.trim();

  if (typeof value === "number" && Number.isFinite(value)) return String(value);

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {

    const values = value

      .map((item) =>

        typeof item === "string" ||

        typeof item === "number" ||

        typeof item === "boolean"

          ? String(item)

          : "",

      )

      .filter(Boolean);

    return values.length ? values.join(", ") : undefined;

  }

  return undefined;

};

const readText = (record: DisplayRecord, keys: readonly string[]) =>

  displayValue(readValue(record, keys));

const readNestedText = (record: DisplayRecord, keys: readonly string[]) => {

  const directValue = readText(record, keys);

  if (directValue) return directValue;

  for (const value of Object.values(record)) {

    if (isRecord(value)) {

      const nestedValue = readText(value, keys);

      if (nestedValue) return nestedValue;

    }

  }

  return undefined;

};

const getFullName = (record: DisplayRecord) => {

  const fullName = readNestedText(record, [

    "full_name",

    "fullName",

    "name",

    "displayName",

    "display_name",

  ]);

  if (fullName) return fullName;

  const firstName = readNestedText(record, ["first_name", "firstName"]);

  const lastName = readNestedText(record, ["last_name", "lastName", "surname"]);

  return [firstName, lastName].filter(Boolean).join(" ") || undefined;

};

const getImageUrl = (record: DisplayRecord): string | undefined => {

  let value: unknown = readValue(record, [

    "coverImage",

    "cover_image",

    "coverImageUrl",

    "cover_image_url",

    "coverPhoto",

    "cover_photo",

    "thumbnail",

    "image",

    "imageUrl",

    "image_url",

    "images",

    "photos",

  ]);

  if (

    typeof value === "string" &&

    (value.trim().startsWith("[") || value.trim().startsWith("{"))

  ) {

    try {

      value = JSON.parse(value) as unknown;

    } catch {

      value = undefined;

    }

  }

  const firstImage = Array.isArray(value) ? value[0] : value;

  const candidate = isRecord(firstImage)

    ? readText(firstImage, ["url", "imageUrl", "image_url", "src"])

    : displayValue(firstImage);

  return candidate && /^(https?:\/\/|\/(?!\/))/i.test(candidate)

    ? candidate

    : undefined;

};

const propertyFields: {

  label: string;

  keys: readonly string[];

  format?: "money";

}[] = [

  { label: "Property type", keys: ["propertyType", "property_type", "type"] },

  { label: "Bedrooms", keys: ["bedrooms", "bedroom_count"] },

  { label: "Bathrooms", keys: ["bathrooms", "bathroom_count"] },

  { label: "Living rooms", keys: ["livingRooms", "living_rooms"] },

  { label: "Guest capacity", keys: ["guestCapacity", "guest_capacity"] },

  {

    label: "Price per night",

    keys: ["pricePerNight", "price_per_night"],

    format: "money",

  },

  {

    label: "Cleaning fee",

    keys: ["cleaningFee", "cleaning_fee"],

    format: "money",

  },

  {

    label: "Security deposit",

    keys: ["securityDeposit", "security_deposit"],

    format: "money",

  },

  { label: "Minimum stay", keys: ["minimumStay", "minimum_stay"] },

  { label: "Maximum stay", keys: ["maximumStay", "maximum_stay"] },

  { label: "Check-in time", keys: ["checkInTime", "check_in_time"] },

  { label: "Check-out time", keys: ["checkOutTime", "check_out_time"] },

  { label: "Furnishing", keys: ["furnishingStatus", "furnishing_status"] },

  { label: "Amenities", keys: ["amenities"] },

];

const bookingFields: {

  label: string;

  keys: readonly string[];

  format?: "money" | "date";

}[] = [

  {

    label: "Check-in",

    keys: ["checkIn", "check_in", "check_in_date"],

    format: "date",

  },

  {

    label: "Check-out",

    keys: ["checkOut", "check_out", "check_out_date"],

    format: "date",

  },

  { label: "Guests", keys: ["guests", "guest_count"] },

  { label: "Nights", keys: ["nights", "number_of_nights"] },

  { label: "Subtotal", keys: ["subtotal"], format: "money" },

  {

    label: "Cleaning fee",

    keys: ["cleaningFee", "cleaning_fee"],

    format: "money",

  },

  {

    label: "Security deposit",

    keys: ["securityDeposit", "security_deposit"],

    format: "money",

  },

  {

    label: "Total",

    keys: ["total", "totalAmount", "total_amount"],

    format: "money",

  },

  {

    label: "Amount paid",

    keys: ["amountPaid", "amount_paid", "paidAmount", "paid_amount"],

    format: "money",

  },

  {

    label: "Payment status",

    keys: ["paymentStatus", "payment_status"],

  },

  {

    label: "Payment method",

    keys: ["paymentMethod", "payment_method"],

  },

  { label: "Paid at", keys: ["paidAt", "paid_at"], format: "date" },

  {

    label: "Refunded amount",

    keys: ["refundedAmount", "refunded_amount"],

    format: "money",

  },

  {

    label: "Cancellation reason",

    keys: ["cancellationReason", "cancellation_reason"],

  },

];

export default function BookingDetails({

  bookingId,

  onDeleted,

  allowResolution = false,

  claimRecord,

}: {

  bookingId: string;

  onDeleted?: () => void;

  allowResolution?: boolean;

  claimRecord?: AdminDepositClaim;

}) {

  const {

    data: booking,

    isLoading,

    isError,

    error,

  } = useAdminShortletBooking(bookingId);

  const [resolutionResponse, setResolutionResponse] =

    useState<ResolveAdminDepositClaimResponse | null>(null);

  const { mutate: deleteBooking, isPending: isDeleting } =

    useDeleteAdminShortletBooking();

  const handleDelete = async () => {

    const result = await Swal.fire({

      title: "Permanently delete booking?",

      text: "This cannot be undone. Deleting the booking will not reverse any payments, refunds, or wallet transactions.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#dc2626",

      cancelButtonColor: "#6b7280",

      confirmButtonText: "Yes, delete booking",

      cancelButtonText: "Keep booking",

      reverseButtons: true,

    });

    if (!result.isConfirmed) return;

    deleteBooking(bookingId, {

      onSuccess: () => {

        toast.success("Shortlet booking deleted.");

        onDeleted?.();

      },

      onError: (mutationError) => {

        toast.error(

          mutationError.message || "Unable to delete this shortlet booking.",

        );

      },

    });

  };

  if (isLoading) {

    return (

      <div className="p-5 text-sm text-gray-500" role="status">

        Loading booking details...

      </div>

    );

  }

  if (isError || !booking) {

    return (

      <div className="p-5 text-sm text-red-700" role="alert">

        {error?.message || "Unable to load booking details."}

      </div>

    );

  }

  const depositClaim = booking.depositClaim;

  const bookingRecord = toRecord(booking);

  return (

    <div className="space-y-4 bg-gray-50/80 p-4 md:space-y-5 md:p-6">

      <header className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

            Booking details

          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">

            <h3 className="text-base font-semibold text-gray-900">

              Shortlet reservation

            </h3>

            <CopyableId value={booking.id || booking.booking_id} />

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          <StatusBadge value={booking.status} kind="booking" />

          <StatusBadge value={booking.deposit_status} kind="deposit" />

          {onDeleted ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={14} />
              {isDeleting ? "Deleting..." : "Delete booking"}
            </button>
          ) : null}

        </div>

      </header>

      <div className="grid gap-4 lg:grid-cols-2">

        <PropertyDetails value={booking.shortlet} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">

          <PersonDetails title="Guest" value={booking.guest} />

          <PersonDetails title="Host" value={booking.host} />

        </div>

      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">

        <div className="flex flex-wrap items-start justify-between gap-2">

          <div>

            <h3 className="font-semibold text-gray-900">

              Booking & payment

            </h3>

            <p className="mt-1 text-xs text-gray-500">

              Reservation status, schedule and payment summary

            </p>

          </div>

        </div>

        <dl className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">

          <StatusDetail

            label="Booking status"

            value={booking.status}

            kind="booking"

          />

          <StatusDetail

            label="Deposit status"

            value={booking.deposit_status}

            kind="deposit"

          />

          <TextDetail

            label="Platform fee"

            value={formatMoney(booking.platform_fee)}

            emphasis

          />

          {bookingFields.map((field) => {

            const value = displayValue(readValue(bookingRecord, field.keys));

            if (!value) return null;

            const formattedValue =

              field.format === "money"

                ? formatMoney(value)

                : field.format === "date"

                  ? formatDate(value)

                  : value;

            return (

              <TextDetail

                key={field.label}

                label={field.label}

                value={formattedValue}

              />

            );

          })}

        </dl>

      </section>

      {depositClaim || claimRecord ? (

        <DepositClaimDetails claim={depositClaim} claimRecord={claimRecord} />

      ) : (

        <p className="text-sm text-gray-500">

          No deposit claim details were returned for this booking.

        </p>

      )}

      {resolutionResponse ? (

        <ResolutionBreakdown response={resolutionResponse} />

      ) : null}

      {allowResolution && !resolutionResponse ? (

        <ClaimResolution

          bookingId={bookingId}

          claim={depositClaim}

          claimRecord={claimRecord}

          depositStatus={booking.deposit_status}

          onResolved={setResolutionResponse}

        />

      ) : null}

    </div>

  );

}

function PropertyDetails({ value }: { value: unknown }) {

  const property = toRecord(value);

  const title =

    readText(property, ["title", "name", "propertyName", "property_name"]) ??

    "Property details unavailable";

  const image = getImageUrl(property);

  const propertyId = readText(property, ["id", "_id", "shortlet_id"]);

  const address = readText(property, ["address", "location"]);

  const city = readText(property, ["city", "town"]);

  const area = readText(property, ["area", "neighborhood", "neighbourhood"]);

  const state = readText(property, ["state", "region"]);

  const description = readText(property, ["description"]);

  const knownKeys = new Set([

    "id",

    "_id",

    "shortlet_id",

    "title",

    "name",

    "propertyname",

    "property_name",

    "address",

    "location",

    "city",

    "town",

    "area",

    "neighborhood",

    "neighbourhood",

    "state",

    "region",

    "description",

    "coverimage",

    "cover_image",

    "coverimageurl",

    "cover_image_url",

    "coverphoto",

    "cover_photo",

    "thumbnail",

    "image",

    "imageurl",

    "image_url",

    "images",

    "photos",

    ...propertyFields.flatMap((field) =>

      field.keys.map((key) => key.toLowerCase()),

    ),

  ]);

  const additionalDetails = Object.entries(property)

    .filter(([key, detail]) => {

      const normalizedKey = key.replace(/[-\s]/g, "_").toLowerCase();

      return (

        !knownKeys.has(normalizedKey) &&

        !/(password|token|secret)/i.test(key) &&

        displayValue(detail) !== undefined

      );

    })

    .flatMap(([key, detail]) => {

      const formattedValue = displayValue(detail);

      if (!formattedValue) return [];

      return [

        {

          label: key

            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")

            .replace(/[_-]+/g, " ")

            .replace(/\b\w/g, (letter) => letter.toUpperCase()),

          value: formattedValue,

        },

      ];

    });

  return (

    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">

      <div className="grid sm:grid-cols-[minmax(160px,0.8fr)\_1.2fr]">

        <div className="relative min-h-44 bg-gray-100 sm:min-h-56">

          {image ? (

            // eslint-disable-next-line @next/next/no-img-element

            <img

              src={image}

              alt={title}

              className="absolute inset-0 h-full w-full object-cover"

            />

          ) : (

            <div className="absolute inset-0 flex items-center justify-center text-gray-400">

              <Building2 size={38} strokeWidth={1.5} />

            </div>

          )}

        </div>

        <div className="min-w-0 p-4 md:p-5">

          <div className="flex flex-wrap items-start justify-between gap-2">

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

                Shortlet property

              </p>

              <h3 className="mt-1 break-words text-lg font-semibold text-gray-900">

                {title}

              </h3>

            </div>

            <CopyableId value={propertyId} />

          </div>

          <div className="mt-3 text-sm text-gray-600">

            <p className="flex items-start gap-2">

              <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />

              <span>

                <span className="block text-xs font-medium text-gray-500">

                  Address

                </span>

                {address || "—"}

              </span>

            </p>

            {description ? (

              <p className="line-clamp-3 text-sm leading-6 text-gray-600">

                {description}

              </p>

            ) : null}

          </div>

        </div>

      </div>

      <dl className="grid gap-x-5 gap-y-4 border-t border-gray-100 p-4 sm:grid-cols-2 md:p-5 xl:grid-cols-3">

        <TextDetail label="City" value={city} />

        <TextDetail label="Area" value={area} />

        <TextDetail label="State" value={state} />

        {propertyFields.map((field) => {

          const value = displayValue(readValue(property, field.keys));

          if (!value) return null;

          return (

            <TextDetail

              key={field.label}

              label={field.label}

              value={field.format === "money" ? formatMoney(value) : value}

            />

          );

        })}

        {additionalDetails.map((detail) => (

          <TextDetail

            key={detail.label}

            label={detail.label}

            value={detail.value}

          />

        ))}

      </dl>

    </section>

  );

}

function PersonDetails({

  title,

  value,

}: {

  title: string;

  value: unknown;

}) {

  const person = toRecord(value);

  const name = getFullName(person);

  const email = readNestedText(person, [

    "email",

    "emailAddress",

    "email_address",

  ]);

  const phone = readNestedText(person, [

    "phone_no",

    "phone",

    "phoneNumber",

    "phone_number",

    "mobile",

  ]);

  const id = readNestedText(person, ["id", "_id", "user_id"]);

  return (

    <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-base font-semibold text-[#2E7D32]">

            {name?.trim().charAt(0).toUpperCase() || title.charAt(0)}

          </div>

          <div className="min-w-0">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

              {title}

            </p>

            <h3 className="mt-1 break-words font-semibold text-gray-900">

              {name || "—"}

            </h3>

          </div>

        </div>

        <CopyableId value={id} />

      </div>

      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm">

        <ContactDetail icon={<Mail size={16} />} value={email} kind="email" />

        <ContactDetail icon={<Phone size={16} />} value={phone} kind="phone" />

      </div>

    </section>

  );

}

function ContactDetail({

  icon,

  value,

  kind,

}: {

  icon: ReactNode;

  value?: string;

  kind: "email" | "phone";

}) {

  const href = value

    ? `${kind === "email" ? "mailto" : "tel"}:${encodeURIComponent(value)}`

    : undefined;

  return (

    <p className="flex min-w-0 items-center gap-2 text-gray-600">

      <span className="shrink-0 text-gray-400">{icon}</span>

      {href ? (

        <a href={href} className="break-all hover:text-[#2E7D32]">

          {value}

        </a>

      ) : (

        <span className="text-gray-400">—</span>

      )}

    </p>

  );

}

function DepositClaimDetails({

  claim,

  claimRecord,

}: {

  claim?: AdminShortletDepositClaim | null;

  claimRecord?: AdminDepositClaim;

}) {

  const resolvedClaim = claim ?? {};

  const data = {

    ...claimRecord,

    ...resolvedClaim,

    deposit_claim_amount:

      resolvedClaim.deposit_claim_amount ?? claimRecord?.deposit_claim_amount,

    security_deposit:

      resolvedClaim.security_deposit ?? claimRecord?.security_deposit,

    deposit_claimed_at:

      resolvedClaim.deposit_claimed_at ?? claimRecord?.deposit_claimed_at,

    deposit_claim_decision:

      resolvedClaim.deposit_claim_decision ??

      claimRecord?.deposit_claim_decision,

    deposit_claim_note:

      resolvedClaim.deposit_claim_note ?? claimRecord?.deposit_claim_note,

    deposit_paid_to_host:

      resolvedClaim.deposit_paid_to_host ?? claimRecord?.deposit_paid_to_host,

    deposit_claim_reason:

      resolvedClaim.deposit_claim_reason ?? claimRecord?.deposit_claim_reason,

    deposit_claim_photos:

      resolvedClaim.deposit_claim_photos ?? claimRecord?.deposit_claim_photos,

  };

  return (

    <section className="rounded-xl border border-gray-200 bg-white p-4">

      <h3 className="font-semibold text-gray-900">Deposit claim</h3>

      <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">

        <TextDetail

          label="Claim amount"

          value={formatMoney(data.deposit_claim_amount)}

        />

        <TextDetail

          label="Security deposit"

          value={formatMoney(data.security_deposit)}

        />

        <TextDetail

          label="Claimed at"

          value={formatDate(data.deposit_claimed_at)}

        />

        <StatusDetail

          label="Decision"

          value={data.deposit_claim_decision || "Not resolved"}

          kind="claim"

        />

        <TextDetail

          label="Decision note"

          value={data.deposit_claim_note || "—"}

        />

        <TextDetail

          label="Paid to host"

          value={formatMoney(data.deposit_paid_to_host ?? data.paidToHost)}

        />

        {data.refundedToGuest != null ? (

          <TextDetail

            label="Refunded to guest"

            value={formatMoney(data.refundedToGuest)}

          />

        ) : null}

        <TextDetail label="Reason" value={data.deposit_claim_reason || "—"} />

      </dl>

      <ClaimPhotos photos={data.deposit_claim_photos} />

    </section>

  );

}

function ClaimPhotos({ photos }: { photos: unknown }) {

  let photoValues = photos;

  if (typeof photos === "string" && photos.trim().startsWith("[")) {

    try {

      photoValues = JSON.parse(photos) as unknown;

    } catch {

      photoValues = photos;

    }

  }

  const urls =

    typeof photoValues === "string"

      ? /^(https?:\/\/|\/(?!\/))/i.test(photoValues.trim())

        ? [photoValues]

        : []

      : Array.isArray(photoValues)

        ? photoValues.filter(

            (photo): photo is string =>

              typeof photo === "string" &&

              /^(https?:\/\/|\/(?!\/))/i.test(photo.trim()),

          )

        : [];

  if (urls.length === 0) {

    return photos == null ? null : (

      <div className="mt-4">

        <h4 className="text-xs font-semibold text-gray-500">Evidence photos</h4>

        <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">

          Evidence details are available, but no viewable photo was returned.

        </p>

      </div>

    );

  }

  return (

    <div className="mt-4">

      <h4 className="text-xs font-semibold text-gray-500">Evidence photos</h4>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">

        {urls.map((url, index) => (

          <a

            key={`${url}-${index}`}

            href={url}

            target="_blank"

            rel="noreferrer"

            className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100"

          >

            {/* eslint-disable-next-line @next/next/no-img-element */}

            <img

              src={url}

              alt={`Deposit claim evidence ${index + 1}`}

              className="h-32 w-full object-cover"

            />

          </a>

        ))}

      </div>

    </div>

  );

}

function ClaimResolution({

  bookingId,

  claim,

  claimRecord,

  depositStatus,

  onResolved,

}: {

  bookingId: string;

  claim?: AdminShortletDepositClaim | null;

  claimRecord?: AdminDepositClaim;

  depositStatus?: string | null;

  onResolved: (response: ResolveAdminDepositClaimResponse) => void;

}) {

  const [decision, setDecision] = useState<"approve" | "reject">("approve");

  const [amount, setAmount] = useState("");

  const [note, setNote] = useState("");

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { mutate, isPending } = useResolveAdminDepositClaim();

  const canResolve = claim?.canResolve === true;

  const isResolved =

    Boolean(

      claim?.deposit_claim_decision || claimRecord?.deposit_claim_decision,

    ) || ["settled", "refunded"].includes(depositStatus?.toLowerCase() ?? "");

  const claimedCents = parseCents(

    claim?.deposit_claim_amount ?? claimRecord?.deposit_claim_amount,

  );

  const enteredCents = amount.trim() ? parseCents(amount) : null;

  const amountInvalid = Boolean(

    decision === "approve" &&

    ((amount.trim() && enteredCents === null) ||

      (amount.trim() &&

        claimedCents !== null &&

        enteredCents !== null &&

        enteredCents > claimedCents) ||

      (amount.trim() && claimedCents === null)),

  );

  const submitDecision = () => {

    if (!canResolve || isResolved || isPending || amountInvalid) return;

    const confirmation =

      decision === "approve"

        ? "Approve this deposit claim? The backend will immediately process the host payment and guest refund."

        : "Reject this deposit claim? The backend will immediately refund the security deposit to the guest.";

    if (!window.confirm(confirmation)) return;

    setSubmissionError(null);

    const payload = {

      bookingId,

      decision,

      ...(decision === "approve" && amount.trim()

        ? { amount: Number(amount) }

        : {}),

      ...(note.trim() ? { note: note.trim() } : {}),

    } as const;

    mutate(payload, {

      onSuccess: (response) => {

        onResolved(response);

        setAmount("");

        setNote("");

      },

      onError: (error) => {

        setSubmissionError(error.message || "Unable to resolve this claim.");

      },

    });

  };

  if (!canResolve || isResolved) {

    return (

      <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-600">

        {isResolved

          ? "This claim has already been resolved."

          : "This claim cannot currently be resolved."}

      </p>

    );

  }

  return (

    <section className="rounded-xl border border-amber-200 bg-white p-4">

      <h3 className="font-semibold text-gray-900">Resolve deposit claim</h3>

      <p className="mt-1 text-xs text-gray-600">

        The backend handles all payments and refunds. This page does not

        directly transfer or refund money.

      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        <label className="text-sm font-medium text-gray-700">

          Decision

          <select

            value={decision}

            onChange={(event) =>

              setDecision(event.target.value as "approve" | "reject")

            }

            disabled={isPending}

            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"

          >

            <option value="approve">Approve</option>

            <option value="reject">Reject</option>

          </select>

        </label>

        {decision === "approve" ? (

          <label className="text-sm font-medium text-gray-700">

            Approval amount (optional, ₦)

            <input

              type="number"

              min="0"

              max={

                claimedCents === null

                  ? undefined

                  : (claimedCents / 100).toFixed(2)

              }

              step="0.01"

              value={amount}

              onChange={(event) => setAmount(event.target.value)}

              disabled={isPending}

              aria-invalid={amountInvalid}

              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"

              placeholder={

                claimedCents === null

                  ? "Enter amount"

                  : `Up to ${(claimedCents / 100).toFixed(2)}`

              }

            />

          </label>

        ) : null}

      </div>

      {amountInvalid ? (

        <p className="mt-2 text-sm text-red-700" role="alert">

          Enter a valid amount that does not exceed the claimed amount.

        </p>

      ) : null}

      {submissionError ? (

        <p className="mt-2 text-sm text-red-700" role="alert">

          {submissionError}

        </p>

      ) : null}

      <label className="mt-3 block text-sm font-medium text-gray-700">

        Admin decision note (optional)

        <textarea

          value={note}

          onChange={(event) => setNote(event.target.value)}

          disabled={isPending}

          rows={3}

          maxLength={2000}

          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"

          placeholder="Add a note for the decision"

        />

      </label>

      <button

        type="button"

        onClick={submitDecision}

        disabled={isPending || amountInvalid}

        className="mt-4 rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white hover:bg-[#388E3C] disabled:cursor-not-allowed disabled:opacity-50"

      >

        {isPending

          ? "Submitting..."

          : decision === "approve"

            ? "Confirm approval"

            : "Confirm rejection"}

      </button>

    </section>

  );

}

function ResolutionBreakdown({

  response,

}: {

  response: ResolveAdminDepositClaimResponse;

}) {

  const amounts = getResolutionAmounts(response);

  return (

    <section

      className="rounded-xl border border-green-200 bg-green-50 p-4"

      role="status"

    >

      <h3 className="font-semibold text-green-900">

        Resolution submitted successfully

      </h3>

      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">

        <TextDetail

          label="Paid to host (backend response)"

          value={formatMoney(amounts.paidToHost)}

        />

        <TextDetail

          label="Refunded to guest (backend response)"

          value={formatMoney(amounts.refundedToGuest)}

        />

      </dl>

    </section>

  );

}

function StatusDetail({

  label,

  value,

  kind,

}: {

  label: string;

  value: string | null | undefined;

  kind: "booking" | "deposit" | "claim";

}) {

  return (

    <div>

      <dt className="text-xs font-medium text-gray-500">{label}</dt>

      <dd className="mt-1">

        <StatusBadge value={value} kind={kind} />

      </dd>

    </div>

  );

}

function StatusBadge({

  value,

  kind,

}: {

  value: string | null | undefined;

  kind: "booking" | "deposit" | "claim";

}) {

  const status = value?.trim() || "—";

  const normalizedStatus = status.toLowerCase();

  const color =

    kind === "booking"

      ? ["confirmed", "completed", "booked", "rented"].includes(

          normalizedStatus,

        )

        ? "bg-green-50 text-green-700 ring-green-600/20"

        : ["cancelled", "canceled", "failed"].includes(normalizedStatus)

          ? "bg-red-50 text-red-700 ring-red-600/20"

          : "bg-amber-50 text-amber-700 ring-amber-600/20"

      : kind === "deposit"

        ? ["held"].includes(normalizedStatus)

          ? "bg-blue-50 text-blue-700 ring-blue-600/20"

          : ["claimed"].includes(normalizedStatus)

            ? "bg-amber-50 text-amber-700 ring-amber-600/20"

            : ["refunded", "settled"].includes(normalizedStatus)

              ? "bg-green-50 text-green-700 ring-green-600/20"

              : "bg-gray-100 text-gray-700 ring-gray-500/20"

        : ["approved", "paid", "settled"].includes(normalizedStatus)

          ? "bg-green-50 text-green-700 ring-green-600/20"

          : ["rejected", "declined"].includes(normalizedStatus)

            ? "bg-red-50 text-red-700 ring-red-600/20"

            : "bg-amber-50 text-amber-700 ring-amber-600/20";

  return (

    <span

      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${color}`}

    >

      {status.replace(/[_-]+/g, " ")}

    </span>

  );

}

function CopyableId({ value }: { value?: string | null }) {

  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(

    "idle",

  );

  if (!value) return null;

  const copyId = async () => {

    if (!navigator.clipboard) {

      setCopyState("error");

      return;

    }

    try {

      await navigator.clipboard.writeText(value);

      setCopyState("copied");

    } catch {

      setCopyState("error");

    }

  };

  return (

    <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">

      <span className="max-w-36 truncate" title={value}>

        ID {value}

      </span>

      <button

        type="button"

        onClick={copyId}

        aria-label={`Copy ID ${value}`}

        title={

          copyState === "copied"

            ? "Copied"

            : copyState === "error"

              ? "Unable to copy"

              : "Copy ID"

        }

        className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"

      >

        {copyState === "copied" ? <Check size={13} /> : <Copy size={13} />}

      </button>

      {copyState === "error" ? (

        <span className="sr-only" role="status">

          Unable to copy ID.

        </span>

      ) : copyState === "copied" ? (

        <span className="sr-only" role="status">

          ID copied.

        </span>

      ) : null}

    </span>

  );

}

function TextDetail({

  label,

  value,

  emphasis = false,

}: {

  label: string;

  value: string | null | undefined;

  emphasis?: boolean;

}) {

  return (

    <div className="min-w-0">

      <dt className="text-xs font-medium text-gray-500">{label}</dt>

      <dd

        className={`mt-1 break-words text-sm ${

          emphasis ? "font-semibold text-gray-900" : "text-gray-800"

        }`}

      >

        {value || "—"}

      </dd>

    </div>

  );

}