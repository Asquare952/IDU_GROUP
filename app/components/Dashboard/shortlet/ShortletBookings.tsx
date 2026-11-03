"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface ShortletBookingsProps {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  maxGuests?: number;
  blockedDates?: string[];
  availableFrom?: string;
  availableTo?: string;
  minimumStay?: number;
  maximumStay?: number;
  onStayChange: (stay: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
  }) => void;
}

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ShortletBookings({
  checkIn,
  checkOut,
  guests,
  maxGuests,
  blockedDates = [],
  availableFrom,
  availableTo,
  minimumStay,
  maximumStay,
  onStayChange,
}: ShortletBookingsProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const firstAvailableDate = availableFrom ? new Date(availableFrom) : null;
  const lastAvailableDate = availableTo ? new Date(availableTo) : null;
  firstAvailableDate?.setHours(0, 0, 0, 0);
  lastAvailableDate?.setHours(0, 0, 0, 0);
  const secondMonth = new Date(
    firstMonth.getFullYear(),
    firstMonth.getMonth() + 1,
    1,
  );

  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Select date";

  const selectDate = (date: Date) => {
    if (isDateUnavailable(date)) {
      return;
    }

    if (!checkIn || checkOut || date <= checkIn) {
      onStayChange({ checkIn: date, checkOut: null, guests });
    } else {
      onStayChange({ checkIn, checkOut: date, guests });
    }
  };

  const isDateUnavailable = (date: Date) =>
    date < today ||
    (firstAvailableDate !== null && date < firstAvailableDate) ||
    (lastAvailableDate !== null && date > lastAvailableDate) ||
    blockedDates.includes(dateKey(date));

  const isSelected = (date: Date) =>
    checkIn?.getTime() === date.getTime() ||
    checkOut?.getTime() === date.getTime();
  const isBetween = (date: Date) =>
    Boolean(checkIn && checkOut && date > checkIn && date < checkOut);

  const renderCalendar = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startOffset = (firstDay + 6) % 7;

    return (
      <div className="min-w-0 flex-1">
        <h3 className="mb-5 text-center font-semibold text-gray-900">
          {month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <span key={day} className="pb-2 text-xs font-medium text-gray-500">
              {day}
            </span>
          ))}
          {Array.from({ length: startOffset }, (_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const date = new Date(year, monthIndex, index + 1);
            const disabled = isDateUnavailable(date);
            const selected = isSelected(date);
            const between = isBetween(date);

            return (
              <button
                key={index + 1}
                type="button"
                disabled={disabled}
                onClick={() => selectDate(date)}
                aria-label={date.toDateString()}
                aria-pressed={selected}
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition ${
                  selected
                    ? "bg-[#43A047] font-semibold text-white"
                    : between
                      ? "rounded-none bg-[#E8F5E9] text-[#2E7D32]"
                      : disabled
                        ? "cursor-not-allowed text-gray-300 line-through"
                        : "text-gray-700 hover:border hover:border-[#43A047]"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section
      id="booking"
      className="min-w-0 border-b border-gray-200 py-8"
      aria-label="Choose shortlet dates"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {checkIn && checkOut ? "Your stay" : "Choose your stay"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {checkIn && checkOut
            ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
            : "Select your check-in and check-out dates"}
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonthOffset((value) => Math.max(0, value - 1))}
          disabled={monthOffset <= 0}
          aria-label="Previous month"
          className="rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-xs text-gray-500">Select your dates</span>
        <button
          type="button"
          onClick={() => setMonthOffset((value) => value + 1)}
          aria-label="Next month"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {renderCalendar(firstMonth)}
        {renderCalendar(secondMonth)}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={18} />
          {availableFrom && availableTo
            ? `Available ${formatDate(new Date(availableFrom))} – ${formatDate(
                new Date(availableTo),
              )}`
            : blockedDates.length > 0
              ? "Unavailable dates are marked"
              : "Availability dates will be confirmed during booking"}
        </div>
        <button
          type="button"
          onClick={() =>
            onStayChange({ checkIn: null, checkOut: null, guests })
          }
          className="text-sm font-medium text-gray-600 underline hover:text-[#43A047]"
        >
          Clear dates
        </button>
      </div>

      <label
        htmlFor="booking-guests"
        className="mt-6 block max-w-xs text-sm font-medium text-gray-700"
      >
        Guests
        {maxGuests ? (
          <select
            id="booking-guests"
            value={guests}
            onChange={(event) =>
              onStayChange({
                checkIn,
                checkOut,
                guests: Number(event.target.value),
              })
            }
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
          >
            {Array.from({ length: maxGuests }, (_, index) => index + 1).map(
              (number) => (
                <option key={number} value={number}>
                  {number} {number === 1 ? "guest" : "guests"}
                </option>
              ),
            )}
          </select>
        ) : (
          <input
            id="booking-guests"
            type="number"
            min={1}
            value={guests}
            onChange={(event) =>
              onStayChange({
                checkIn,
                checkOut,
                guests: Math.max(1, Number(event.target.value)),
              })
            }
            className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
          />
        )}
      </label>
      {(minimumStay !== undefined || maximumStay !== undefined) && (
        <p className="mt-4 text-sm text-gray-500">
          Stay length
          {minimumStay !== undefined ? `: minimum ${minimumStay} night(s)` : ""}
          {maximumStay !== undefined
            ? `${minimumStay !== undefined ? ", " : ": "}maximum ${maximumStay} night(s)`
            : ""}
        </p>
      )}
    </section>
  );
}
