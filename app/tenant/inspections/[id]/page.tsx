"use client"

import { useState } from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout"
import { useParams, useRouter } from "next/navigation";
import { useGetInspection } from "@/app/api/features/inspection/inspection.query";
import Image from "next/image";
import { CalendarCheck, BadgeCheck, CalendarDays, Clock, User } from 'lucide-react';
import EditBookInspectionModal from "@/app/components/EditBookInspectionModal";
import { formatDate, formatNaira } from "@/app/landlord/wallet/data/walletData";
import  formatTime  from "@/app/lib/formartTimes";

const page = () => {
  const router = useRouter()
  const params = useParams<{ id: string }>();
  const [isEditInspectionOpen, setisEditInspectionOpen] = useState(false)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: inspection, isPending, isError } = useGetInspection(id ?? "");
  const rental = inspection?.rental;
  const rentalImage = rental?.images?.[0];
  const landlordImage = rental?.User?.Profile?.image;

  if (isPending) {
    return (
      <DashboardLayout>
        <section className="p-6 md:p-10 bg-[#FBFBFC] min-h-screen">
          <div className="text-center text-[#162B4C] font-semibold">Loading inspection details...</div>
        </section>
      </DashboardLayout>
    );
  }

  if (isError || !inspection || !rental) {
    return (
      <DashboardLayout>
        <section className="p-6 md:p-10 bg-[#FBFBFC] min-h-screen">
          <div className="text-center text-red-500 font-semibold">Unable to load inspection details right now.</div>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="p-6 md:p-10 bg-[#FBFBFC] min-h-screen">
        <div className=" flex flex-col gap-3">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#162B4C] mb-1">
              Inspection Details
            </h2>
            <p className="text-slate-400 text-sm">View all information related to your property inspection.</p>
          </div>

          <div className=" grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <div className=" flex flex-col md:flex-row gap-5 bg-white shadow p-3 rounded-2xl">
              {rentalImage ? (<Image src={rentalImage} alt="" width={300} height={900} className=" rounded-2xl" />) : null}
              <div className=" flex flex-col gap-2">
                <h2 className=" font-semibold text-xl">{rental.title}</h2>
                <p className=" text-gray-300">{rental.location}</p>
                <p className=" text-[#4CAF50]">{formatNaira(rental.price)}/year</p>
              </div>
            </div>
            <div className=" bg-white shadow p-3 rounded-2xl">
              <h1 className=" font-bold text-black">Inspection Status</h1>
              <div className=" flex flex-col gap-5 justify-center items-center p-5">
                <div className=" text-center bg-gray-200 p-5 rounded-full">
                  <CalendarCheck className="text-[#4CAF50]" size={30} />
                </div>
                <h3 className=" font-bold text-[#4CAF50]">Inspection Scheduled</h3>
                <p className=" w-[230px] text-md text-center">Your inspection is confirmed. Our agent will meet you at the property</p>
              </div>
            </div>

            <div className=" bg-white shadow flex flex-col gap-2 rounded-2xl p-3">
              <h1 className="font-bold text-black">Inspection Infomation</h1>

              <div className=" flex flex-col gap-3 p-2">

                {/*  */}
                <div className=" flex justify-between items-center">
                  <div className=" flex items-center gap-2">
                    <div className=" bg-gray-200 p-3 rounded-full">
                      <CalendarDays className=" text-[#4CAF50]" size={20} />
                    </div>
                    <p className=" font-medium text-gray-500 text-[14px]">Inspection Date</p>
                  </div>
                  <p className=" text-gray-400 text-[14px]">{formatDate(inspection.date).dateOnly}</p>
                </div>
                <hr className=" border-gray-300" />

                {/*  */}
                <div className=" flex justify-between items-center">
                  <div className=" flex items-center gap-2">
                    <div className=" bg-gray-200 p-3 rounded-full">
                      <Clock className=" text-[#4CAF50]" size={20} />
                    </div>
                    <p className=" font-medium text-gray-500 text-[14px]">Inspection Time</p>
                  </div>
                  <p className=" text-gray-400 text-[14px]">{formatTime(inspection.time)}</p>
                </div>
                <hr className=" border-gray-300" />


                {/*  */}
                <div className=" flex justify-between items-center">
                  <div className=" flex items-center gap-2">
                    <div className=" bg-gray-200 p-3 rounded-full">
                      <CalendarDays className=" text-[#4CAF50]" size={20} />
                    </div>
                    <p className=" font-medium text-gray-500 text-[14px]">Booked On</p>
                  </div>
                  <p className=" text-gray-400 text-[14px]">{formatDate(inspection.createdAt).dateOnly}</p>
                </div>
              </div>

            </div>
            <div className=" bg-white shadow rounded-2xl p-3">
              <h2>Landlord</h2>
              <div className=" flex items-center gap-3 mt-3">
                {landlordImage ? (
                  <Image src={landlordImage} alt="" width={100} height={100} className=" w-[100px] h-[100px] rounded-full" />
                ) : null}
                <div>
                  <h3>{rental.User?.full_name}</h3>
                  {rental.User?.Profile?.verified === true ? <p className=" text-[#4CAF50]">Verified</p> : ""}
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => { setisEditInspectionOpen(true) }} className=" flex justify-end mt-4">
            <button className=" outline-none border-none bg-[#4CAF50] text-[#ffff] py-1.5 px-3.5 rounded-xl">Reschedule Inspection</button>
          </div>
        </div>
        {isEditInspectionOpen && <EditBookInspectionModal isOpen={isEditInspectionOpen} onClose={() => setisEditInspectionOpen(false)} id={id} />}
      </section>
    </DashboardLayout>

  )
}

export default page
