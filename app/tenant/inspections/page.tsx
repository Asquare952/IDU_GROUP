"use client";

import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import { Calendar, MapPin, Clock, Plus } from "lucide-react";
import { useGetInspections } from "@/app/api/features/inspection/inspection.query";
import { getInspectionDetailsPath } from "@/app/lib/inspection-routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import formartTime from "@/app/lib/formartTimes";

const Page = () => {
  const router = useRouter()
  const { data: inspections = [], isPending, isError } = useGetInspections();

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 bg-[#FBFBFC] min-h-screen">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#162B4C] mb-1">
            Inspections
          </h2>
          <p className="text-slate-400 text-sm">
            Schedule and manage property inspections
          </p>
        </div>
        <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 md:p-10 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-bold text-[#162B4C]">
              Upcoming Inspections
            </h3>
            <button className="bg-[#43A047] text-white px-6 py-2.5 rounded-xl font-bold text-[12px] flex items-center gap-2 hover:bg-green-700 transition-all shadow-md active:scale-95 cursor-pointer">
              <Plus size={16} /> Schedule New
            </button>
          </div>
          {isPending ? (
            <div className="text-center py-10 text-[#43A047] font-bold text-lg">
              Loading inspections...
            </div>
          ) : (
            <div className="space-y-6">
              {inspections.length === 0 && (
                <div className="text-center py-10 text-[#43A047] font-bold text-lg">
                  No inspections found.
                </div>
              )}
              {inspections?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[1.5rem] border border-gray-50 bg-[#FBFBFC]/40 hover:bg-white hover:shadow-xl hover:shadow-gray-100/50 hover:border-green-100 transition-all duration-300 group"
                >
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-[#162B4C] text-[16px] group-hover:text-[#43A047] transition-colors">
                      {item.rental.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[12px] mb-1">
                      <MapPin size={13} className="text-[#43A047]/60" />{" "}
                      {item.rental.location}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-green-50/50 text-[#43A047] px-3 py-1 rounded-lg text-[11px] font-bold">
                        <Calendar size={13} /> {item.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium border-l border-gray-200 pl-4">
                        <Clock size={13} /> {formartTime(item.time)}
                      </div>
                      <span className="bg-gray-100 text-gray-400 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                        {/* {item.data.rental.} */}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0" onClick={() => router.push(getInspectionDetailsPath(item))}>
                    <button className="w-full md:w-auto px-8 py-3 border rounded-2xl text-white text-[12px] font-bold hover:text-white bg-[#43A047] transition-all duration-300 cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
