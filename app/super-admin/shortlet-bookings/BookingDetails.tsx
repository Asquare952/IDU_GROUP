"use client";

import { useState } from "react";
import {
  useAdminShortletBooking,
  useResolveAdminDepositClaim,
} from "@/app/api/features/admin";
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

const serialize = (value: unknown) => {
  if (value == null) return "Not provided";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "Unable to display this value.";
  }
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

export default function BookingDetails({
  bookingId,
  allowResolution = false,
  claimRecord,
}: {
  bookingId: string;
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

  return (
    <div className="space-y-5 bg-gray-50 p-4 md:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <JsonDetail label="Shortlet" value={booking.shortlet} />
        <JsonDetail label="Guest" value={booking.guest} />
        <JsonDetail label="Host" value={booking.host} />
        <TextDetail label="Booking status" value={booking.status} />
        <TextDetail label="Deposit status" value={booking.deposit_status} />
        <TextDetail
          label="Platform fee"
          value={formatMoney(booking.platform_fee)}
        />
      </div>

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
        <TextDetail
          label="Decision"
          value={data.deposit_claim_decision || "Not resolved"}
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
        <pre className="mt-2 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
          {serialize(photoValues)}
        </pre>
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

function JsonDetail({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs text-gray-700">
        {serialize(value)}
      </pre>
    </div>
  );
}

function TextDetail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-gray-900">{value || "—"}</dd>
    </div>
  );
}
