"use client"

import { useEffect, useState } from "react"
import z from "zod";
import { finishAccDetailsSchema } from "../lib/accInfoDetails.schema";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useUpdateUserProfile,
  useUserProfile
} from "@/app/api/features/auth/auth.queries";
import { AuthResponse, updateUserPayload } from "@/app/api/features/auth/types";
import { readCachedProfile } from "@/app/api/features/auth/profile-cache";
import { CreateInspection } from "../api/features/inspection/types";
import { useGetInspection, useUpdateInspection } from "../api/features/inspection/inspection.query";
import { UpdateInspection } from "../api/features/inspection/types";


type EditInspectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string
};

type EditInspectionValues = {
  date: string;
  time: string;
};

const defaultValues: EditInspectionValues = {
  date: "",
  time: "",
};


const EditBookInspectionModal = ({ isOpen, onClose, id }: EditInspectionModalProps) => {


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { isSubmitting },
  } = useForm<EditInspectionValues>({ defaultValues });

  const { data: inspectionData, isLoading: isProfileLoading } = useGetInspection(id);
  const { mutateAsync: updateInspection, isPending } =
    useUpdateInspection(id);

  useEffect(() => {
    if (!inspectionData) {

      return;
    }

    reset({
      ...defaultValues,
      date: inspectionData.date,
      time: inspectionData.time,
    });
  }, [inspectionData, reset]);


  const onSubmit = (data: EditInspectionValues) => {
    const payload: UpdateInspection = {
      date: data.date,
      time: data.time
    };

    updateInspection(payload, {
      onSuccess: () => {
        onClose
      },
      onError: () => {
        toast.error("Failed to update inspection. Please try again.")
      }
    })
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex flex-col items-center gap-1">
              <h3 className="text-2xl text-center text-3xl font-bold text-gray-900">Please Complete Your Account Details</h3>
              <p className="mb-6 text-center text-gray-600">
                To ensure a smooth experience, please complete your account details.
              </p>
            </div>

            {/* <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close waitlist modal"
            >
              <X size={24} className="cursor-pointer" />
            </button> */}


            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

              {/*  */}
              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pick date
                </label>
                <input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  required
                />
              </div>

              {/*  */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pick time
                </label>
                <input
                  id="time"
                  type="time"
                  {...register("time", { required: "Time is required" })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  autoComplete="email"
                  required
                />
              </div>


              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#43A047] px-4 py-2 font-bold text-white transition-all hover:bg-[#3a8a3d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {isPending ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default EditBookInspectionModal;
