"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

const CallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = Cookies.get("USER_ROLE");
    const walletPath =
      role === "landlord" ? "/landlord/wallet" : "/tenant/wallet";

    const status = searchParams.get("status");
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");

    const queryParts = [];
    if (status) queryParts.push(`topup_status=${encodeURIComponent(status)}`);
    if (txRef) queryParts.push(`tx_ref=${encodeURIComponent(txRef)}`);
    if (transactionId)
      queryParts.push(`transaction_id=${encodeURIComponent(transactionId)}`);

    const query = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

    const timer = window.setTimeout(() => {
      router.replace(`${walletPath}${query}`);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#43A047]" />
        <h1 className="text-lg font-semibold text-slate-900">
          Verifying your wallet top-up
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Please wait while we return you to your wallet.
        </p>
      </div>
    </main>
  );
};

const Page = () => (
  <Suspense
    fallback={
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <Loader2 className="h-8 w-8 animate-spin text-[#43A047]" />
      </main>
    }
  >
    <CallbackContent />
  </Suspense>
);

export default Page;
