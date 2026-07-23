"use client";

import WalletTransactionDetails from "@/app/components/Wallet/WalletTransactionDetails";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";

const page = () => {
  return (
    <WalletTransactionDetails
      Layout={DashboardLayout}
      dashboardBase="/tenant/dashboard"
      walletBasePath="/tenant/wallet"
    />
  );
};

export default page;
