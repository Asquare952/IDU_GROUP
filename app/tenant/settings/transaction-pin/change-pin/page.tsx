"use client";

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { Lock, ChevronRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useUpdateTransactionPin } from "@/app/api/features/wallet/wallet.queries";
import padLockImg from "@/public/assets/padlock-img.png";
import Image from "next/image";

const page = () => {
  const router = useRouter();
  const [oldPin, setOldPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const clearInputs = () => {
    setOldPin(["", "", "", ""]);
    setNewPin(["", "", "", ""]);
    oldPinRefs.current.forEach((input) => (input.value = ""));
    newPinRefs.current.forEach((input) => (input.value = ""));
  }
  const oldPinRefs = useRef<HTMLInputElement[]>([]);
  const newPinRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    index: number,
    value: string,
    pin: string[],
    setPin: (pin: string[]) => void,
    inputRefs: React.MutableRefObject<HTMLInputElement[]>,
  ) => {
    if (!/^\d*$/.test(value)) return;
    const nextPin = [...pin];
    nextPin[index] = value.slice(-1);
    setPin(nextPin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    pin: string[],
    inputRefs: React.MutableRefObject<HTMLInputElement[]>,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const { mutate: updatePin, isPending } = useUpdateTransactionPin();

  const handleSubmit = () => {
    const currentPin = oldPin.join("");
    const replacementPin = newPin.join("");

    if (currentPin.length !== 4 || replacementPin.length !== 4) {
      toast.error("Please enter both 4-digit PINs.");
      return;
    }

    if (currentPin === replacementPin) {
      toast.error("Your new PIN must be different from your current PIN.");
      return;
    }

    updatePin(
      { oldPin: currentPin, newPin: replacementPin },
      {
        onSuccess: () => {
          toast.success("Transaction PIN updated successfully!");
          clearInputs();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Unable to change your PIN.",
          );
          clearInputs();
        },
      },
    );
  };

  return (
    <DashboardLayout>
      <section className=" flex flex-col justify-center items-center gap-3 px-2">
        <div className=" mt-10">
          {/*  */}
          <div className="flex flex-col justify-center items-center gap-2.5">
            <div className="p-3.5 bg-green-50 rounded-full">
              <Image src={padLockImg} width={70} height={70} alt="padlock" />
            </div>
            <div className=" flex flex-col justify-center items-center gap-2">
              <h2 className=" text-xl md:text-2xl font-bold text-gray-900">
                Change Transaction PIN
              </h2>
              <p className=" w-[240px] text-center">
                Enter your current PIN, then choose a new 4-digit PIN.
              </p>
            </div>
          </div>

          {/* OTP Input UI */}
          {/* <div className="w-full max-w-md flex flex-col gap-1.5 mt-5"> */}
            <div className="w-full max-w-md  flex flex-col gap-1.5">
              <label htmlFor="pin">Current PIN</label>
              <div className="flex gap-2 md:gap-3 mb-8">
                {oldPin.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      if (el) oldPinRefs.current[index] = el;
                    }}
                    onChange={(e) =>
                      handleChange(
                        index,
                        e.target.value,
                        oldPin,
                        setOldPin,
                        oldPinRefs,
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e, oldPin, oldPinRefs)
                    }
                    className="h-12 min-w-0 flex-1 text-center text-lg font-bold text-slate-900 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/10 outline-none transition-all md:h-16 md:w-14 md:text-xl"
                  />
                ))}
              </div>
            </div>

            {/*  */}
            <div className="w-full max-w-md flex flex-col gap-1.5">
              <label htmlFor="pin">New PIN</label>
              <div className="flex gap-2 md:gap-3 mb-8">
                {newPin.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      if (el) newPinRefs.current[index] = el;
                    }}
                    onChange={(e) =>
                      handleChange(
                        index,
                        e.target.value,
                        newPin,
                        setNewPin,
                        newPinRefs,
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(index, e, newPin, newPinRefs)
                    }
                    className="h-12 min-w-0 flex-1 text-center text-lg font-bold text-slate-900 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/10 outline-none transition-all md:h-16 md:w-14 md:text-xl"
                  />
                ))}
              </div>
            </div>
          {/* </div> */}

          {/*  */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isPending ||
              oldPin.some((digit) => digit === "") ||
              newPin.some((digit) => digit === "")
            }
            className="flex justify-center items-center gap-3 p-2 w-full py-5 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] cursor-pointer transition-all disabled:opacity-50 "
          >
            Change PIN
            <ChevronRight />
          </button>

          {/*  */}
          <div className=" flex gap-1 mt-3.5 bg-[#F0F2F5] p-2.5 rounded-lg">
            <Info className=" text-[#4CAF50]" />
            <p>
              Keep your PIN private. You will need it to authorize wallet
              transactions.
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default page;
