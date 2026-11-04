"use client";

interface ShortletReserveProps {
  pricePerNight: number;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  canBook: boolean;
  cleaningFee?: number;
  securityDeposit?: number;
  onReserve?: () => void;
}

export default function ShortletReserve({
  pricePerNight,
  checkIn,
  checkOut,
  guests,
  canBook,
  cleaningFee,
  securityDeposit,
  onReserve,
}: ShortletReserveProps) {
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;
  const subtotal = nights * pricePerNight;
  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Select dates";

  return (
    <aside className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
      <div className="mb-5">
        <span className="text-2xl font-bold text-gray-900">
          ₦{pricePerNight.toLocaleString()}
        </span>
        <span className="text-gray-500"> / night</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-300">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <div className="min-w-0 p-3">
            <p className="text-xs font-semibold text-gray-700">CHECK-IN</p>
            <p className="mt-1 truncate text-sm text-gray-600">
              {formatDate(checkIn)}
            </p>
          </div>
          <div className="min-w-0 p-3">
            <p className="text-xs font-semibold text-gray-700">CHECK-OUT</p>
            <p className="mt-1 truncate text-sm text-gray-600">
              {formatDate(checkOut)}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-300 p-3">
          <p className="text-xs font-semibold text-gray-700">GUESTS</p>
          <p className="mt-1 text-sm text-gray-600">
            {guests} {guests === 1 ? "guest" : "guests"}
          </p>
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between gap-3 text-gray-600">
            <span>
              ₦{pricePerNight.toLocaleString()} × {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 font-bold text-gray-900">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          {cleaningFee !== undefined && cleaningFee > 0 && (
            <div className="flex justify-between gap-3 text-gray-600">
              <span>Cleaning fee</span>
              <span>₦{cleaningFee.toLocaleString()}</span>
            </div>
          )}
          {securityDeposit !== undefined && securityDeposit > 0 && (
            <div className="flex justify-between gap-3 text-gray-600">
              <span>Security deposit</span>
              <span>₦{securityDeposit.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onReserve}
        disabled={!canBook || !checkIn || !checkOut || nights <= 0}
        className="mt-5 min-h-12 w-full rounded-full bg-[#43A047] py-3 font-semibold text-white transition hover:bg-[#388E3C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Book now
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        {canBook
          ? "Booking and payment will be available soon."
          : "This property is not currently available to book."}
      </p>
    </aside>
  );
}
