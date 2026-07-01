import { Loader2, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useBookInspection } from "../api/features/inspection/inspection.query";
import { id } from "zod/v4/locales";
import { CreateInspection } from "../api/features/inspection/types";

type BookInspectinModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string
};

type BookInspectionValues = {
  date: string;
  time: string;
};

const BookInspectionModal = ({ onClose, isOpen, id }: BookInspectinModalProps) => {

  const { mutate: bookInspection, isPending } = useBookInspection()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateInspection>();

  const onSubmit = (values: CreateInspection) => {
    bookInspection({
      rental_id: id,
      date: values.date,
      time: values.time,
    });
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
            <button
              type="button"
              onClick={onClose}
              className="flex items-start absolute right-2 top-2  text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close waitlist modal"
            >
              <X size={24} className="cursor-pointer" />
            </button>
            <div className="mb-6 flex flex-col items-center gap-1 mt-2.5">
              <h3 className="text-2xl text-center text-3xl font-bold text-gray-900">Pick inspection date and time</h3>
              {/* <p className="mb-6 text-center text-gray-600">
                To ensure a smooth experience, please complete your account details.
              </p> */}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

              {/*  */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Pick date
                </label>
                <input
                  id="date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  placeholder="State of residence"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  required
                />
              </div>

              {/*  */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Set time
                </label>
                <input
                  id="time"
                  type="time"
                  {...register("time", { required: "Time is required" })}
                  placeholder="123 Main St, City, State ZIP"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
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

export default BookInspectionModal
