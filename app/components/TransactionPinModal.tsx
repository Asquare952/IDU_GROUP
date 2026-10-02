"use client";
import React, { Suspense, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { useWithdrawFromWallet } from "../api/features/wallet/wallet.queries";
import { toast } from "react-toastify";
import { Lock as LockIcon } from "lucide-react";

const TransactionPinModal = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "";
  const displayEmail = amount || "amount";
  const [pin, setPin] = useState(["", "", "", ""]);
  const clearPin = () => {
    setPin(["", "", "", ""]);
  };
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const { mutate: withdrawFromWallet, isPending } = useWithdrawFromWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = pin.join("");
    if (otpCode.length === 4) {
      withdrawFromWallet(
        { amount: Number(amount), pin: otpCode },
        {
          onSuccess: () => {
            toast.success("Withdrawal successful!");
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Failed to withdraw funds.",
            );
            clearPin();
          },
        },
      );
    } else {
      toast.error("Please enter the complete 4-digit OTP");
    }
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="min-h-screen flex flex-col items-center justify-start md:justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/IDU GROUP HOME.webp"
            alt="Background"
            fill
            priority
            className="object-cover blur-xl brightness-[0.5] scale-105"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center mt-6 md:mt-0">
          <Link
            href="/signup"
            className="self-start mb-6 flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors md:fixed md:top-8 md:left-8"
          >
            <HiArrowLeft /> Go Back
          </Link>
          <div className="w-full max-w-[460px] bg-white rounded-[32px] shadow-2xl p-6 md:p-14 border border-white/10 flex flex-col items-center mt-20 md:mt-0">
            <div className="flex items-center text-2xl font-bold text-gray-900 tracking-tight mb-6">
              <Image
                src="/IDU GROUP LOGO.png"
                alt="Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              Rent<span className="text-[#4CAF50]">ULO</span>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Verify your account
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed px-2">
                We've sent an OTP to{" "}
                <span className="text-[#4CAF50] font-semibold break-all">
                  {displayEmail}
                </span>{" "}
                to verify your email.
              </p>
            </div>

            {/* OTP Input UI */}
            <div className="flex gap-2 md:gap-3 mb-8">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 md:w-14 md:h-16 text-center text-lg md:text-xl font-bold bg-gray-50 border border-gray-100 rounded-xl focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/10 outline-none transition-all"
                />
              ))}
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isPending || pin.some((d) => d === "")}
              className="w-full py-5 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] cursor-pointer transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {isPending ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Confirm PIN"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionPinModal />
    </Suspense>
  );
}

type TransactionPinSheetProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
};

export const TransactionPinSheet = ({
  isOpen,
  title,
  description,
  confirmLabel,
  isPending = false,
  onClose,
  onConfirm,
}: TransactionPinSheetProps) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextPin = [...pin];
    nextPin[index] = value.slice(-1);
    setPin(nextPin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const submitPin = () => {
    const value = pin.join("");

    if (value.length !== 4) {
      toast.error("Enter your complete 4-digit transaction PIN.");
      return;
    }

    onConfirm(value);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-black/50 p-0 backdrop-blur-sm md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-pin-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onClose();
      }}
    >
      <div className="w-full rounded-t-[2rem] bg-white px-6 pb-8 pt-4 shadow-2xl md:max-w-md md:rounded-[2rem] md:p-8">
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200 md:hidden" />
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-50 p-3">
            <LockIcon
              className="text-[#4CAF50]"
              fill="currentColor"
              size={28}
            />
          </div>
          <h2
            id="transaction-pin-title"
            className="text-xl font-bold text-slate-900"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <div className="mt-7 flex justify-center gap-3">
          {pin.map((digit, index) => (
            <input
              key={index}
              aria-label={`PIN digit ${index + 1}`}
              inputMode="numeric"
              type="password"
              maxLength={1}
              value={digit}
              ref={(element) => {
                if (element) inputRefs.current[index] = element;
              }}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !pin[index] && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className="h-14 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-xl font-bold outline-none focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/10"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={submitPin}
          disabled={isPending || pin.some((digit) => !digit)}
          className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#4CAF50] py-4 font-bold text-white transition hover:bg-[#3d8f40] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Processing..." : confirmLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="mt-3 w-full py-2 text-sm font-semibold text-slate-500 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
