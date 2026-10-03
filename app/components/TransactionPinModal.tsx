"use client";
import React, { Suspense, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Lock as LockIcon } from "lucide-react";



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
