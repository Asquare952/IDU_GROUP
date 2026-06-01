"use client";

import { FormEvent, ReactNode, useId, useState } from "react";
import { useJoinWaitlist } from "@/app/api/features/waitlist";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import { isAxiosError } from "axios";

type WaitlistButtonProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getWaitlistErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 404) {
      return "The waitlist service is not available yet. Please try again later.";
    }

    return (
      error.response?.data?.message ||
      error.message ||
      "Failed to join waitlist. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to join waitlist. Please try again.";
};

const WaitlistButton = ({
  children,
  className,
  title = "Join our waitlist",
  description = "Be the first to know when we launch! Enter your email to join our exclusive waitlist.",
}: WaitlistButtonProps) => {
  const emailInputId = useId();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { mutate: joinWaitlist, isPending } = useJoinWaitlist();

  const closeModal = () => {
    if (!isPending) {
      setIsWaitlistOpen(false);
    }
  };

  const handleJoinWaitlist = (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    joinWaitlist(normalizedEmail, {
      onSuccess: (data) => {
        toast.success(data.message || "Successfully joined the waitlist!");
        setEmail("");
        setIsWaitlistOpen(false);
      },
      onError: (error) => {
        toast.error(getWaitlistErrorMessage(error));
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsWaitlistOpen(true)}
        className={className}
      >
        {children}
      </button>

      {isWaitlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
                aria-label="Close waitlist modal"
              >
                <X size={24} />
              </button>
            </div>

            <p className="mb-6 text-gray-600">{description}</p>

            <form onSubmit={handleJoinWaitlist} className="space-y-4">
              <div>
                <label
                  htmlFor={emailInputId}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#43A047]"
                  disabled={isPending}
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#43A047] px-4 py-2 font-bold text-white transition-all hover:bg-[#3a8a3d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {isPending ? "Joining..." : "Join Waitlist"}
              </button>

              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 font-bold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitlistButton;
