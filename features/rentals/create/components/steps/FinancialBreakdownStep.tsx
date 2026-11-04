import type {
  UseFormReturn,
  FieldErrors,
} from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  status: string;
  basicRent: number;
  legalFee: number;
  cautionFee: number;
  brokeFee: number;
  mgtServiceCharge: number;
}

interface Props {
  methods: UseFormReturn<FormData>;
  errors: FieldErrors<FormData>;
  totalPackages: number;
}

import { DollarSign } from "lucide-react";

const FinancialBreakdownStep = ({methods, errors, totalPackages}: Props) => {
  return (
    <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6 text-[#4CAF50]">
        <div className="bg-[#4CAF50]/10 p-2 rounded-full">
          <DollarSign size={20} />
        </div>
        <h3 className="font-bold text-slate-800">Financial Breakdown</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-[#4CAF50] uppercase ml-1">
            Basic Rent (Annual) *
          </label>
          <input
            type="number"
            {...methods.register("basicRent", {
              valueAsNumber: true,
              required: "Rent is required",
              min: { value: 1, message: "Must be greater than 0" },
            })}
            className="w-full p-3 bg-[#F8FAFC] rounded-xl"
          />
          {errors.basicRent && (
            <p className="text-red-500 text-xs ml-1">
              {errors.basicRent.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Mgt Service Charge
            </label>
            <input
              type="number"
              step="0.01"
              {...methods.register("mgtServiceCharge", {
                valueAsNumber: true,
              })}
              className="w-full p-3 bg-[#F8FAFC] rounded-xl"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Legal Fees
            </label>
            <input
              type="number"
              step="0.01"
              {...methods.register("legalFee", { valueAsNumber: true })}
              className="w-full p-3 bg-[#F8FAFC] rounded-xl"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
            Caution Fee
          </label>
          <input
            type="number"
            step="0.01"
            {...methods.register("cautionFee", { valueAsNumber: true })}
            className="w-full p-3 bg-[#F8FAFC] rounded-xl"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
            Broke Fee
          </label>
          <input
            type="number"
            step="0.01"
            {...methods.register("brokeFee", { valueAsNumber: true })}
            className="w-full p-3 bg-[#F8FAFC] rounded-xl"
          />
        </div>
        <div className="mt-6 p-4 bg-[#4CAF50]/5 rounded-2xl border border-[#4CAF50]/10">
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Total Package
          </p>
          <p className="text-2xl font-bold text-[#4CAF50]">
            ₦{totalPackages.toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinancialBreakdownStep;



