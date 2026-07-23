import WalletPage from "@/app/components/Wallet/WalletPage";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";

const page = () => {
  return (
    <WalletPage
      breadcrumbBase="/tenant/dashboard"
      walletBasePath="/tenant/wallet"
      pageTitle="Wallet"
      Layout={DashboardLayout}
    />
  );
};

export default page;
