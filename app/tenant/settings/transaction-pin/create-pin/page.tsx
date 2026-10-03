"use client";

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { Lock, ChevronRight, Lightbulb, Info } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useCreateTransactionPin } from "@/app/api/features/wallet/wallet.queries";
import padLockImg from "@/public/assets/padlock-img.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
  const [tranPin, setTransPin] = useState(["", "", "", ""]);
  const clearInputs = () => {
    setTransPin(["", "", "", ""]);
    inputRefs.current.forEach((input) => (input.value = ""));
  };
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newPin = [...tranPin];
    newPin[index] = value.substring(value.length - 1);
    setTransPin(newPin);

    if (value && index < tranPin.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !tranPin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const { mutate: createPin, isPending } = useCreateTransactionPin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pin = tranPin.join("");
    if (pin.length === 4) {
      createPin(
        { pin },
        {
          onSuccess: () => {
            toast.success("Transaction PIN created successfully!");
            clearInputs();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to create Transaction PIN.",
            );
            clearInputs();
            router.push("/tenant/wallet");
          },
        },
      );
    } else {
      toast.error("Please enter the complete 4-digit PIN.");
    }
  };

  return (
    <DashboardLayout>
      <section className=" flex flex-col justify-center items-center gap-3">
        <div className=" mt-10 mx-2.5">
          {/*  */}
          <div className="flex flex-col justify-center items-center gap-2.5">
            <div className="p-3.5 bg-green-50 rounded-full">
              <Image src={padLockImg} width={70} height={70} alt="padlock" />
            </div>
            <div className=" flex flex-col justify-center items-center gap-2">
              <h2 className=" text-xl md:text-2xl font-bold text-gray-900">
                Create a Transaction PIN
              </h2>
              <p className=" w-[240px] text-center">
                Enter a 4-digit PIN to secure your wallet transactions
              </p>
            </div>
          </div>

          {/* OTP Input UI */}
          <div className="w-full max-w-md flex flex-col gap-1.5 mt-5">
            <label htmlFor="pin">Enter 4-digit PIN</label>
            <div className="w-full flex gap-2 md:gap-3 mb-8">
              {tranPin.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-20 h-12 md:w-24 md:h-16 text-center text-lg md:text-xl font-bold bg-gray-50 border border-gray-100 rounded-xl focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/10 outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {/*  */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || tranPin.some((d) => d === "")}
            className="flex justify-center items-center gap-3 p-2 w-full py-5 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] cursor-pointer transition-all disabled:opacity-50"
          >
            Create PIN
            <ChevronRight />
          </button>

          {/*  */}
          <div className=" flex items-center gap-1 mt-3.5 bg-[#F0F2F5] p-2.5 rounded-lg">
            <Info className=" text-[#4CAF50]" />
            <p className=" text-sm text-gray-600">
              This PIN will be used to authorize all wallet transactions.
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default page;
