import DashboardLayout from "../../components/Tenant-Dashboard/DashboardLayout";

const page = () => {
  return (
    <DashboardLayout>
      <section className="p-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
          <p className="text-gray-600">View and manage your property bookings</p>
        </div>
      </section>
    </DashboardLayout>
  )
}

export default page
