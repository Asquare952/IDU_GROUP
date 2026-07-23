"use client"

import { useState } from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout"
import { useParams, useRouter } from "next/navigation";
import { useGetInspection, useUpdateInspection } from "@/app/api/features/inspection/inspection.query";
import Image from "next/image";
import { CalendarCheck, BadgeCheck } from 'lucide-react';
import EditBookInspectionModal from "@/app/components/EditBookInspectionModal";

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
        <div className=" flex flex-col gap-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#162B4C] mb-1">
              Inspection Details
            </h2>
            <p className="text-slate-400 text-sm">View all information related to your property inspection.</p>
          </div>

          <div className=" grid grid-cols-2 gap-1.5">
            <div className=" flex gap-5 bg-white shadow p-3">
              {rentalImage ? (<Image src={rentalImage} alt="" width={200} height={900} className=" h-" />) : null}
              <div className=" flex flex-col gap-2">
                <h2>{rental.title}</h2>
                <p>{rental.location}</p>
                <p>{rental.price}/year</p>
              </div>
            </div>
            <div className=" bg-white shadow">
              <h1>Inspection Status</h1>
              <div className=" flex justify-center items-center">
                <CalendarCheck className="" />
                <h3>Inspection Scheduled</h3>
                <p>Your inspection is confirmed. Our agent will meet you at the property</p>
              </div>
            </div>
            <div className=" bg-white shadow flex flex-col gap-2 rounded-md">
              <div className=" flex justify-between items-center">
                <p className=" text-gray-200 text-[18px]"></p>
                <p className=" text-gray-200 text-[18px]"></p>
              </div>
              <div className=" flex justify-between items-center">
                <p className=" text-gray-200 text-[18px]"></p>
                <p className=" text-gray-200 text-[18px]"></p>
              </div>
              <div className=" flex justify-between items-center">
                <p className=" text-gray-200 text-[18px]"></p>
                <p className=" text-gray-200 text-[18px]"></p>
              </div>
            </div>
            <div className=" bg-white shadow">
              <h2>Landlord</h2>
              <div>
                {landlordImage ? (
                  <Image src={landlordImage} alt="" width={100} height={100} />
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
