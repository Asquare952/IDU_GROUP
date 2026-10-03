"use client";

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { Lock, ChevronRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import padLockImg from "@/public/assets/padlock-img.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <DashboardLayout>
      <section className=" flex flex-col justify-center items-center gap-3">
        <div className=" mt-10 mx-3">
          {/*  */}
          <div className="flex flex-col justify-center items-center gap-2.5">
            <div className="p-3.5 bg-green-50 rounded-full">
              <Image src={padLockImg} width={70} height={70} alt="padlock" />
            </div>
            <div className=" flex flex-col justify-center items-center gap-2">
              <h2 className=" text-xl md:text-2xl font-bold text-gray-900">
                Transaction PIN
              </h2>
              <p className=" w-[240px] text-center">
                Protect your wallet transactions with a 4-digit PIN
              </p>
            </div>
          </div>

          {/*  */}
          <div className=" flex flex-col justify-center items-center gap-2 mt-5">
            <button
              onClick={() =>
                router.push("/tenant/settings/transaction-pin/create-pin")
              }
              className="flex justify-center items-center gap-3 p-2 w-full py-5 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] cursor-pointer transition-all "
            >
              Create PIN
              <ChevronRight />
            </button>
            <button
              onClick={() =>
                router.push("/tenant/settings/transaction-pin/change-pin")
              }
              className=" flex justify-center items-center gap-3 p-2 w-full py-5 bg-[#4CAF50] text-white font-bold rounded-2xl shadow-xl hover:bg-green-600 active:scale-[0.98] cursor-pointer transition-all  "
            >
              Change PIN
              <ChevronRight />
            </button>
          </div>

          {/*  */}
          <div className=" flex gap-1 mt-3.5 bg-[#F0F2F5] p-2.5 rounded-lg">
            <Lightbulb className=" text-[#4CAF50]" />
            <div className=" flex flex-col gap-1.5">
              <h2 className=" font-bold">Why it's important</h2>
              <p className=" text-sm text-gray-600">
                A transaction PIN adds an extra layer of security to your
                wallet, ensuring that only you can authorize transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default page;
