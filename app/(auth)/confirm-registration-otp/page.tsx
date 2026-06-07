"use client";
import React, { Suspense, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { useSearchParams } from "next/navigation";
import { useConfirmVerifyOtp } from "../../api/features/auth/auth.queries";
import { toast } from "react-toastify";

const ConfirmOtpContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const displayEmail = email || "your email";
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const { mutate: verifyOtp, isPending } = useConfirmVerifyOtp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please register again so we can confirm your email.");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      verifyOtp({ email, otpCode });
    } else {
      toast.error("Please enter the complete 6-digit OTP");
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
              {otp.map((digit, index) => (
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
              disabled={isPending || otp.some((d) => d === "")}
              className="w-full py-5 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] cursor-pointer transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {isPending ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Confirm OTP"
              )}
            </button>
            <button
              type="button"
              disabled={!canResend}
              onClick={() => {
                setTimer(120);
                setCanResend(false);
              }}
              className={`mt-8 text-sm font-semibold transition-all ${
                canResend
                  ? "text-[#4CAF50] hover:underline cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {canResend ? (
                "Resend OTP"
              ) : (
                <>
                  Resend OTP in{" "}
                  <span className="text-[#4CAF50]">{formatTimer(timer)}</span>
                </>
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
      <ConfirmOtpContent />
    </Suspense>
  );
}
