import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import CreateRentalForm from "@/features/rentals/create/components/CreateRentalForm";

const page = () => {
  return (
    <DashboardLayout>
      <section className=" bg-white w-full h-full p-7">
        <CreateRentalForm />
      </section>
    </DashboardLayout>
  );
};

export default page;
