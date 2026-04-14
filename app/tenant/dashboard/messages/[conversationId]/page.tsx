import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import Chat from "@/app/components/Chat";

const page = () => {
  return (
    <DashboardLayout>
      <Chat />
    </DashboardLayout>
  );
};

export default page;
