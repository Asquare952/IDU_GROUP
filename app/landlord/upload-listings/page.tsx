"use client"

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import HouseIn from "@/public/house-in.jpg";
import Image from "next/image";
import {
  House,
  BedDouble,
  Calendar,
  ShieldCheck,
  LucideNotebookText,
  Wallet,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ListingTypes = "long-term" | "shortlet";

const page = () => {
  const router = useRouter();

  const selectListingType = (isRental: ListingTypes) => {
    if (isRental === "long-term") {
      router.push("/landlord/upload-listings/long-term");
    } else {
      router.push("/landlord/upload-listings/shortlet");
    }
  };

  return (
    <DashboardLayout>
      <div className="container-2 flex flex-col gap-6">
        {/*  */}
        <div className=" flex flex-col gap-1 py-3">
          <h1 className=" text-[24px] font-semibold">What are you listing?</h1>
          <p className="w-[300px] md:w-[630px] text-[14px] md:text-[15px] text-[#6b7280]">
            Choose the type of rental you want to create. This will determine
            the next steps and infomation you will provide
          </p>
        </div>

        {/*  */}
        <div className=" grid md:grid-cols-2 gap-3">
          {/*  */}
          <div
            onClick={() => selectListingType("long-term")}
            className=" flex flex-col gap-2.5 rounded-[10px] bg-white shadow p-4 hover:border-2 hover:border-[#43a047] cursor-pointer"
          >
            <div className="">
              <House size={50} />
            </div>

            <div className=" flex flex-col gap-1">
              <h2 className=" font-semibold text-[20px]">Long-term Renal</h2>
              <p className="w-[250px] text-[15px] text-[#6b7280]">
                Rent for months or years (e.g apartments, houses, duplexes).
              </p>
            </div>

            <Image
              src={HouseIn}
              width={200}
              height={50}
              alt=""
              className=" w-full h-64 rounded-[20px]"
            />

            {/*  */}
            <div className=" grid grid-cols-3 gap-4 text-[#43a047]">
              <div>
                <Calendar />
                <p>Monthly / Yearly payment</p>
              </div>
              <div>
                <ShieldCheck />
                <p>Inspection required</p>
              </div>
              <div>
                <LucideNotebookText />
                <p>Lease agreement</p>
              </div>
            </div>
          </div>

          {/*  */}
          <div
            onClick={() => selectListingType("shortlet")}
            className=" flex flex-col gap-2.5 rounded-[10px] bg-white shadow p-4 hover:border-2 hover:border-[#43a047] cursor-pointer"
          >
            <div className="">
              <BedDouble size={50} />
            </div>

            <div className=" flex flex-col gap-1">
              <h2 className=" font-semibold text-[20px]">Shortlet</h2>
              <p className="w-[250px] text-[15px] text-[#6b7280]">
                Furnished stays for short periods (e.g vacaion, business,
                holidays).
              </p>
            </div>

            <Image
              src={HouseIn}
              width={200}
              height={50}
              alt=""
              className=" w-full h-64 rounded-[20px]"
            />

            {/*  */}
            <div className=" grid grid-cols-3 gap-4 text-[#43a047]">
              <div>
                <Calendar />
                <p>Daily / Weekly payments</p>
              </div>
              <div>
                <ShieldCheck />
                <p>Instant booking (when available)</p>
              </div>
              <div>
                <Wallet />
                <p>Online payment</p>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div className=" flex gap-2.5 mb-3.5 p-2.5 bg-[#e0e8ff69] rounded-xl">
          <Info size={20} />

          <div className=" flex flex-col gap-1.5"> 
            <h2 className=" font-semibold text-[15px]">
              What's the difference?
            </h2>
            <p className=":w-[510px] md:w-[610px] text-[15px]">
              Long-term renals are for exended stays (monthly/yearly), while
              shortlets are for short stays (days, weeks). You can always edit
              the details later
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
