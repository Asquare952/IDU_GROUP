"use client";

import { useState, type FormEvent } from "react";
import { Gift, Loader2 } from "lucide-react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import { useCreateCoupon } from "@/app/api/features/coupons";
import type {
  CreateCouponPayload,
  CreatedCoupon,
  CouponBonusType,
} from "@/app/api/features/coupons";
import CouponManagement from "./CouponManagement";

const CODE_PATTERN = /^[A-Z0-9_-]{3,32}$/;

const initialForm = {
  code: "",
  description: "",
  bonus_type: "fixed" as CouponBonusType,
  bonus_value: "",
  base_amount: "",
  max_bonus: "",
  max_uses: "",
  unlimited_uses: false,
  max_uses_per_user: "1",
  starts_at: "",
  expires_at: "",
  is_active: true,
};

const getErrorMessage = (error: unknown) => {
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

  return "Unable to create the coupon. Please try again.";
};

const toIsoDate = (value: string) =>
  value ? new Date(value).toISOString() : undefined;

export default function CouponsPage() {
  const { isLoading, isAuthenticated, isSuperAdmin } = useProtectedRoute();
  const [form, setForm] = useState(initialForm);
  const [createdCoupon, setCreatedCoupon] = useState<CreatedCoupon | null>(
    null,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const createCoupon = useCreateCoupon();

  const updateForm = <Key extends keyof typeof initialForm>(
    key: Key,
    value: (typeof initialForm)[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setCreatedCoupon(null);
    setValidationError(null);
    if (createCoupon.isError) createCoupon.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = form.code.trim().toUpperCase();
    const bonusValue = Number(form.bonus_value);
    const baseAmount = Number(form.base_amount);
    const maxBonus = Number(form.max_bonus);
    const maxUses = Number(form.max_uses);
    const usesPerUser = Number(form.max_uses_per_user);
    const startsAt = form.starts_at ? new Date(form.starts_at).getTime() : null;
    const expiresAt = form.expires_at
      ? new Date(form.expires_at).getTime()
      : null;

    if (!CODE_PATTERN.test(code)) {
      setValidationError(
        "Use 3-32 letters, numbers, hyphens, or underscores for the code.",
      );
      return;
    }

    if (
      !Number.isFinite(bonusValue) ||
      bonusValue <= 0 ||
      (form.bonus_type === "percent" && bonusValue > 100) ||
      (form.bonus_type === "percent" && (!baseAmount || baseAmount <= 0)) ||
      (form.max_bonus && (!Number.isFinite(maxBonus) || maxBonus <= 0)) ||
      (!form.unlimited_uses &&
        Boolean(form.max_uses) &&
        (!Number.isInteger(maxUses) || maxUses < 1)) ||
      !Number.isInteger(usesPerUser) ||
      usesPerUser < 1 ||
      (startsAt !== null && Number.isNaN(startsAt)) ||
      (expiresAt !== null && Number.isNaN(expiresAt)) ||
      (startsAt !== null && expiresAt !== null && expiresAt <= startsAt)
    ) {
      setValidationError(
        startsAt !== null && expiresAt !== null && expiresAt <= startsAt
          ? "Expiry must be later than the start date."
          : "Check the bonus amount, base amount, cap, and usage limits.",
      );
      return;
    }

    setValidationError(null);

    const payload: CreateCouponPayload = {
      code,
      description: form.description.trim() || undefined,
      bonus_type: form.bonus_type,
      bonus_value: bonusValue,
      max_uses: form.unlimited_uses
        ? null
        : form.max_uses
          ? maxUses
          : undefined,
      max_uses_per_user: usesPerUser,
      starts_at: toIsoDate(form.starts_at),
      expires_at: toIsoDate(form.expires_at),
      is_active: form.is_active,
    };

    if (form.bonus_type === "percent") {
      payload.base_amount = baseAmount;
      if (form.max_bonus) payload.max_bonus = maxBonus;
    }

    createCoupon.mutate(payload, {
      onSuccess: (response) => setCreatedCoupon(response.coupon),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Checking admin access...
      </div>
    );
  }

  if (!isAuthenticated || !isSuperAdmin) return null;

  const inputClassName =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#43A047] focus:ring-2 focus:ring-[#43A047]/20";

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Coupon Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage wallet bonus promotions and create coupon codes.
          </p>
          <button type="button" onClick={() => document.getElementById("coupon-create-form")?.scrollIntoView({ behavior: "smooth" })} className="mt-4 rounded-lg bg-[#43A047] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#388e3c]">
            Create Coupon
          </button>
        </header>

        <div className="mx-auto max-w-3xl">
          <CouponManagement />
          <form
            id="coupon-create-form"
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 md:p-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-[#43A047]">
                <Gift className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">
                  Create a coupon
                </h2>
                <p className="text-sm text-slate-500">
                  Codes are stored in uppercase.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Coupon code
                <input
                  required
                  minLength={3}
                  maxLength={32}
                  pattern="[A-Za-z0-9_-]{3,32}"
                  value={form.code}
                  onChange={(event) =>
                    updateForm("code", event.target.value.toUpperCase())
                  }
                  placeholder="WELCOME100"
                  className={`${inputClassName} uppercase`}
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Description{" "}
                <span className="font-normal text-slate-400">Optional</span>
                <input
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Launch promo"
                  className={inputClassName}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Bonus type
                <select
                  value={form.bonus_type}
                  onChange={(event) =>
                    updateForm(
                      "bonus_type",
                      event.target.value as CouponBonusType,
                    )
                  }
                  className={inputClassName}
                >
                  <option value="fixed">Fixed amount</option>
                  <option value="percent">Percentage</option>
                </select>
              </label>
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                {form.bonus_type === "percent"
                  ? "Bonus percentage"
                  : "Bonus amount (NGN)"}
                <input
                  type="number"
                  required
                  min="0.01"
                  max={form.bonus_type === "percent" ? 100 : undefined}
                  step="0.01"
                  value={form.bonus_value}
                  onChange={(event) =>
                    updateForm("bonus_value", event.target.value)
                  }
                  className={inputClassName}
                />
              </label>
            </div>

            {form.bonus_type === "percent" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium text-slate-700">
                  Base amount (NGN)
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={form.base_amount}
                    onChange={(event) =>
                      updateForm("base_amount", event.target.value)
                    }
                    className={inputClassName}
                  />
                </label>
                <label className="space-y-1.5 text-sm font-medium text-slate-700">
                  Maximum bonus cap (NGN)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.max_bonus}
                    onChange={(event) =>
                      updateForm("max_bonus", event.target.value)
                    }
                    className={inputClassName}
                  />
                </label>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="space-y-1.5 text-sm font-medium text-slate-700">
                  Maximum total uses
                  <input
                    type="number"
                    min="1"
                    step="1"
                    disabled={form.unlimited_uses}
                    value={form.max_uses}
                    placeholder="Optional"
                    onChange={(event) =>
                      updateForm("max_uses", event.target.value)
                    }
                    className={inputClassName}
                  />
                </label>
                <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.unlimited_uses}
                    onChange={(event) =>
                      updateForm("unlimited_uses", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 accent-[#43A047]"
                  />
                  Unlimited uses
                </label>
              </div>
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Uses per user
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={form.max_uses_per_user}
                  onChange={(event) =>
                    updateForm("max_uses_per_user", event.target.value)
                  }
                  className={inputClassName}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Starts at{" "}
                <span className="font-normal text-slate-400">Optional</span>
                <input
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(event) =>
                    updateForm("starts_at", event.target.value)
                  }
                  className={inputClassName}
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium text-slate-700">
                Expires at{" "}
                <span className="font-normal text-slate-400">Optional</span>
                <input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(event) =>
                    updateForm("expires_at", event.target.value)
                  }
                  className={inputClassName}
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  updateForm("is_active", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 accent-[#43A047]"
              />
              Active immediately
            </label>

            {createCoupon.isError && (
              <p className="text-sm text-red-600" role="alert">
                {getErrorMessage(createCoupon.error)}
              </p>
            )}

            {validationError && (
              <p className="text-sm text-red-600" role="alert">
                {validationError}
              </p>
            )}

            {createdCoupon && (
              <div
                className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                role="status"
              >
                <p className="font-semibold">
                  Coupon created: {createdCoupon.code}
                </p>
                <p className="mt-1">
                  {createdCoupon.bonus_type === "percent"
                    ? `${createdCoupon.bonus_value}% bonus`
                    : `NGN ${createdCoupon.bonus_value} bonus`}
                  {createdCoupon.remaining_uses !== null &&
                    ` · ${createdCoupon.remaining_uses} uses remaining`}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={createCoupon.isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#43A047] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#388e3c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createCoupon.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating coupon
                </>
              ) : (
                "Create coupon"
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
