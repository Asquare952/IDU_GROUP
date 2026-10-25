"use client";

import { FormEvent, useState } from "react";
import {
  useCouponDetails,
  useCoupons,
  useDeleteCoupon,
  useUpdateCoupon,
} from "@/app/api/features/coupons";
import type {
  CouponFilters,
  UpdateCouponPayload,
} from "@/app/api/features/coupons";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }
  return fallback;
};

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 16);
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "—";

const isCouponExpired = (value?: string | null) => {
  if (!value) return false;
  const expiryTime = new Date(value).getTime();
  if (Number.isNaN(expiryTime)) return false;
  return Date.now() > expiryTime;
};

const getCouponStatus = (coupon: {
  is_active: boolean;
  expires_at?: string | null;
}) => {
  if (!coupon.is_active) return "Inactive";
  if (isCouponExpired(coupon.expires_at)) return "Expired";
  return "Active";
};

const getCouponStatusClasses = (coupon: {
  is_active: boolean;
  expires_at?: string | null;
}) => {
  const status = getCouponStatus(coupon);

  if (status === "Expired") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "Inactive") {
    return "bg-slate-100 text-slate-600";
  }

  return "bg-green-50 text-green-700";
};

export default function CouponManagement() {
  const [codeInput, setCodeInput] = useState("");
  const [activeInput, setActiveInput] = useState("all");
  const [filters, setFilters] = useState<CouponFilters>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeValue, setActiveValue] = useState(true);
  const [expiryValue, setExpiryValue] = useState("");

  const couponList = useCoupons(filters);
  const couponDetails = useCouponDetails(selectedId);
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFilters: CouponFilters = {};
    if (activeInput !== "all") nextFilters.active = activeInput === "true";
    if (codeInput.trim()) nextFilters.code = codeInput.trim().toUpperCase();
    setFilters(nextFilters);
  };

  const startEditing = () => {
    const coupon = couponDetails.data?.data;
    if (!coupon) return;
    setActiveValue(coupon.is_active && !isCouponExpired(coupon.expires_at));
    setExpiryValue(toDateTimeLocal(coupon.expires_at));
    setEditing(true);
    updateCoupon.reset();
    deleteCoupon.reset();
  };

  const saveChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId) return;
    const payload: UpdateCouponPayload = { is_active: activeValue };
    if (expiryValue) payload.expires_at = new Date(expiryValue).toISOString();
    updateCoupon.mutate(
      { id: selectedId, payload },
      { onSuccess: () => setEditing(false) },
    );
  };

  const confirmDelete = () => {
    const coupon = couponDetails.data?.data;
    if (!selectedId || !coupon) return;
    const confirmed = window.confirm(
      `Delete ${coupon.code}? Coupons with redemption history must be deactivated instead.`,
    );
    if (confirmed) {
      deleteCoupon.mutate(selectedId, {
        onSuccess: () => setSelectedId(null),
      });
    }
  };

  const fieldClass =
    "rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#43A047]";

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Existing coupons
        </h2>
        <p className="text-sm text-slate-500">
          Search promotions, review redemptions, and manage coupon status.
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="mb-5 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={codeInput}
          onChange={(event) => setCodeInput(event.target.value)}
          placeholder="Exact coupon code"
          aria-label="Exact coupon code"
          className={`${fieldClass} min-w-0 flex-1`}
        />
        <select
          value={activeInput}
          onChange={(event) => setActiveInput(event.target.value)}
          aria-label="Filter coupons by status"
          className={fieldClass}
        >
          <option value="all">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Apply filters
        </button>
      </form>

      {couponList.isLoading ? (
        <p className="py-8 text-center text-sm text-slate-500">
          Loading coupons…
        </p>
      ) : couponList.isError ? (
        <p role="alert" className="py-8 text-center text-sm text-red-600">
          {getErrorMessage(couponList.error, "Unable to load coupons.")}
        </p>
      ) : !couponList.data?.data.length ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No coupons found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-slate-500">
                <th className="py-3 pr-3">Coupon</th>
                <th className="py-3 pr-3">Bonus</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Uses</th>
                <th className="py-3 pr-3">Redemptions</th>
                <th className="py-3">Dates</th>
              </tr>
            </thead>
            <tbody>
              {couponList.data.data.map((coupon) => {
                const status = getCouponStatus(coupon);

                return (
                  <tr key={coupon.id} className="border-b last:border-0">
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(coupon.id);
                          setEditing(false);
                          updateCoupon.reset();
                          deleteCoupon.reset();
                        }}
                        className="font-semibold text-[#388e3c] hover:underline"
                      >
                        {coupon.code}
                      </button>
                      <div className="text-xs text-slate-500">
                        {coupon.description || "No description"}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      {coupon.bonus_type === "percent"
                        ? `${coupon.bonus_value}% of ${coupon.base_amount ?? "—"}`
                        : `₦${coupon.bonus_value}`}
                      {coupon.max_bonus ? (
                        <div className="text-xs text-slate-500">
                          Maximum ₦{coupon.max_bonus}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${getCouponStatusClasses(coupon)}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      {coupon.used_count} / {coupon.max_uses ?? "Unlimited"}
                      <div className="text-xs text-slate-500">
                        {coupon.remaining_uses === null
                          ? "Unlimited remaining"
                          : `${coupon.remaining_uses} remaining`}
                      </div>
                    </td>
                    <td className="py-3 pr-3">{coupon.redemption_count}</td>
                    <td className="py-3 text-xs">
                      Starts: {formatDate(coupon.starts_at)}
                      <br />
                      Expires: {formatDate(coupon.expires_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="coupon-details-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl md:p-6">
            {couponDetails.isLoading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading coupon details…
              </p>
            ) : couponDetails.isError ? (
              <p role="alert" className="text-sm text-red-600">
                {getErrorMessage(
                  couponDetails.error,
                  "Unable to load coupon details.",
                )}
              </p>
            ) : couponDetails.data?.data ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      id="coupon-details-title"
                      className="text-xl font-semibold"
                    >
                      {couponDetails.data.data.code}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {couponDetails.data.data.description || "No description"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setEditing(false);
                      updateCoupon.reset();
                      deleteCoupon.reset();
                    }}
                    className="rounded-lg px-3 py-1 text-sm hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Bonus</dt>
                    <dd>
                      {couponDetails.data.data.bonus_type} ·{" "}
                      {couponDetails.data.data.bonus_value}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">
                      Base amount / maximum bonus
                    </dt>
                    <dd>
                      {couponDetails.data.data.base_amount ?? "—"} /{" "}
                      {couponDetails.data.data.max_bonus ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Status</dt>
                    <dd>{getCouponStatus(couponDetails.data.data)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Uses</dt>
                    <dd>
                      {couponDetails.data.data.used_count} /{" "}
                      {couponDetails.data.data.max_uses ?? "Unlimited"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Starts</dt>
                    <dd>{formatDate(couponDetails.data.data.starts_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Expires</dt>
                    <dd>{formatDate(couponDetails.data.data.expires_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Uses per user</dt>
                    <dd>{couponDetails.data.data.max_uses_per_user}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Redemption count</dt>
                    <dd>{couponDetails.data.data.redemption_count}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Update coupon
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={deleteCoupon.isPending}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                  >
                    {deleteCoupon.isPending ? "Deleting…" : "Delete coupon"}
                  </button>
                </div>

                {updateCoupon.isError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {getErrorMessage(
                      updateCoupon.error,
                      "Unable to update coupon.",
                    )}
                  </p>
                )}
                {deleteCoupon.isError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {getErrorMessage(
                      deleteCoupon.error,
                      "Unable to delete coupon. If redemption history exists, deactivate it instead.",
                    )}
                  </p>
                )}

                {editing && (
                  <form
                    onSubmit={saveChanges}
                    className="mt-5 space-y-3 rounded-lg bg-slate-50 p-4"
                  >
                    <h3 className="font-semibold">Update coupon</h3>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={activeValue}
                        onChange={(event) =>
                          setActiveValue(event.target.checked)
                        }
                      />{" "}
                      Active
                    </label>
                    <label className="block text-sm">
                      Expires at
                      <input
                        type="datetime-local"
                        value={expiryValue}
                        onChange={(event) => setExpiryValue(event.target.value)}
                        className={`${fieldClass} mt-1 block w-full`}
                      />
                      <span className="mt-1 block text-xs text-slate-500">
                        Leave blank to omit an expiry change.
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        disabled={updateCoupon.isPending}
                        className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white"
                      >
                        {updateCoupon.isPending ? "Saving…" : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="rounded-lg border px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-6">
                  <h3 className="font-semibold">Redemption history</h3>
                  {couponDetails.data.data.redemptions?.length ? (
                    <div className="mt-2 space-y-2">
                      {couponDetails.data.data.redemptions.map((redemption) => (
                        <div
                          key={redemption.id}
                          className="rounded-lg border p-3 text-sm"
                        >
                          <p className="font-medium">
                            {redemption.User.full_name} ·{" "}
                            {redemption.User.email}
                          </p>
                          <p className="text-slate-500">
                            ₦{redemption.amount} · {redemption.tx_ref}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(redemption.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No redemptions.
                    </p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
