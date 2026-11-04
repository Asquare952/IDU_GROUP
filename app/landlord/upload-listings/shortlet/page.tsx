import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import ShortletForm from "@/features/rentals/create/components/ShortletForm";

const page = () => {
  return (
    <DashboardLayout>
      <section className=" bg-white w-full h-full p-7">
        <ShortletForm />
      </section>
    </DashboardLayout>
  );
};

export default page;
