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
  const { data: inspection } = useGetInspection(id!);
  const { mutate: editInspection, isPending } = useUpdateInspection(id!)


  return (
    <DashboardLayout>
      <section className="p-6 md:p-10 bg-[#FBFBFC] min-h-screen">
        <div className=" flex flex-col gap-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#162B4C] mb-1">
              Inspection Detials
            </h2>
            <p className="text-slate-400 text-sm">View all information related to your property inspection.</p>
          </div>

          <div className=" grid grid-cols-2 gap-1.5">
            <div className=" flex gap-1.5 bg-white shadow">
              {inspection?.rental.images[0] && (<Image src={inspection?.rental.images[0]} alt="" width={100} height={100} />)}
              <div>
                <h2>{inspection?.rental.title}</h2>
                <p>{inspection?.rental.location}</p>
                <p>{inspection?.rental.price}/year</p>
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
            <div className=" bg-white shadow flex flex-col gap-2">
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
              <h2>Landloard</h2>
              <div>
                {inspection?.rental.User.Profile.image[0] && (
                  <Image src={inspection.rental.User.Profile.image} alt="" width={100} height={100} />
                )}
                <div>
                  <h3>{inspection?.rental.User.full_name}</h3>
                  {inspection?.rental.User.Profile.verified === true ? <p>Verified</p> : ""}
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => editInspection(id)}>
            <button className=" outline-none border border-[#4CAF50] py-1.5 px-3.5">Reschedule Inspection</button>
          </div>
        </div>
        {isEditInspectionOpen && <EditBookInspectionModal isOpen={isEditInspectionOpen} onClose={() => setisEditInspectionOpen(true)} id={id} />}
      </section>
    </DashboardLayout>

  )
}

export default page
