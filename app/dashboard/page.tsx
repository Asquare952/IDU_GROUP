import DashboardLayout from "../components/Dashboard/DashboardLayout"
import { DashMetrics, DashboardListings, Inquiries } from "../components/Dashboard/config/DashboardDatas"
import Image from "next/image"
import { PenLine } from 'lucide-react';
import ReviewGraph from "@/public/assets/income-overview-graph.png";
import SnapshotGraph from "@/public/assets/tenants-activity-snapshot-graph.png"


export default function page() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return " bg-[#D9ECDA] py-1 px-2 text-[#43A047] rounded-full";
      case "Pending":
        return "bg-[#FFFBEF] py-1 px-2 text-[#FFCD36] rounded-full";
      case "Rented":
        return " bg-[#DBE8FF] py-1 px-2 text-[#4B8EFF] rounded-full";

      default:
        break;
    }
  }



  return (
    <DashboardLayout>
      <section className=" flex flex-col gap-6 p-3">
        <div className=" flex justify-between">
          <div className=" flex flex-col gap-0.5">
            <h1 className=" font-bold text-[32px] text-[#162B4C]">Welcome,Daniel</h1>
            <p className=" font-normal text-[16px] text-[#3D3F42]">Here is how your properties are performing today</p>
          </div>

          <form>
            <select className=" align-top bg-[#EBECED] border border-[#D6D8DB] outline-none py-2 px-3 rounded-[8px]">
              <option>Last 5 months</option>
            </select>
          </form>
        </div>


        {/* metrics */}
        <div className=" grid grid-cols-2 lg:grid-cols-4 gap-2 ">
          {DashMetrics.map((item) => {
            const { id, name, percentage, figure, image } = item
            return (
              <div key={id} className=" flex flex-col gap-2 bg-[#FFFFFF] py-2 px-3 rounded-2xl">
                <div className="flex justify-between gap-1.5">
                  <div className="flex flex-col gap-1">
                    <Image src={image} width={32} height={32} alt="" className=" bg-[#43A047] p-1 text-white rounded" />
                    <h3>{name}</h3>
                  </div>
                  <p className=" font-bold text-4xl text-[#162B4C]">{figure}</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className=" bg-[#D9ECDA] text-[#43A047] py-1 px-3 rounded-2xl">+{percentage}</p>
                  <p>This month</p>
                </div>
              </div>
            )
          })}
        </div>


        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {/* dashboard properties listings */}
          <div className=" flex flex-col gap-3.5 bg-[#FFFFFF] py-4 px-6 rounded-[12px]">
            <div className=" flex justify-between">
              <div className=" flex flex-col gap-0.5">
                <h1 className=" font-bold text-[32px] text-[#162B4C]">Your Listings</h1>
                <p className=" font-normal text-[16px] text-[#3D3F42]">Manage, edit, or track your current properties.</p>
              </div>

              <form>
                <select className=" align-top bg-[#EBECED] border-none outline-none py-2 px-3 rounded-[8px]">
                  <option>Last 5 months</option>
                </select>
              </form>
            </div>


            <table className=" border-collapse w-full overflow-x-auto">
              <thead className=" text-left">
                <tr>
                  <th className="">Property</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Inquiries</th>
                  <th>Views</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="">
                {DashboardListings.map((item) => {
                  const { id, image, status, name, location, price, inquiries, views } = item
                  return (
                    <tr key={id} >
                      <td className=" flex gap-1 py-2">
                        <Image src={image} width={42} height={32} alt="" />
                        <div className=" flex flex-col gap-0.5">
                          <h3 className=" font-semibold text-[15px] text-[#7A7E84]">{name}</h3>
                          <p className=" font-normal text-[10px] text-[#7A7E84]">{location}</p>
                        </div>
                      </td>
                      <td className=" text-center font-normal text-[12px]">
                        <p className={`${getStatusStyle(status)}`}>{status}</p>
                      </td>
                      <td className=" text-center font-semibold text-[12px] text-[#7A7E84]">
                        ${price}k
                      </td>
                      <td className=" text-center font-semibold text-[12px] text-[#7A7E84]">
                        {inquiries}
                      </td>
                      <td className=" text-center font-semibold text-[12px] text-[#7A7E84]">
                        {views}k
                      </td>
                      <td className=" flex justify-center">
                        <PenLine className="" />
                      </td>
                    </tr>
                  )
                })}

              </tbody>

            </table>
          </div>

          {/* inquiries */}
          <div className=" flex flex-col gap-6 bg-white p-4 rounded-[12px]">
            <div className=" flex flex-col gap-0.5">
              <h1 className=" font-bold text-[32px] text-[#162B4C]">Recent Inquiries</h1>
              <p className=" font-normal text-[16px] text-[#3D3F42]">See who is interested in your properties</p>
            </div>

            <div className=" flex flex-col gap-6">
              {Inquiries.map((item) => {
                const { id, name, message, image, figure } = item
                return (
                  <div key={id} className="flex justify-between items-center">
                    <div className=" flex items-center gap-1">
                      <Image src={image} width={49} height={49} alt="" />
                      <div>
                        <h3 className="font-semibold text-[15px] text-[#7A7E84]">{name}</h3>
                        <p className="font-normal text-[10px] text-[#7A7E84]">{message}</p>
                      </div>
                    </div>
                    <div className=" bg-[#D9ECDA] text-[#43A047] w-[24px] h-[24px] rounded-full text-center">
                      <p>{figure}</p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>

          {/* income overviews */}
          <div className="flex flex-col gap-6 bg-white p-4 rounded-[12px]">
            <div className=" flex justify-between">
              <div className=" flex flex-col gap-0.5">
                <h1 className=" font-medium text-[20px] text-[#162B4C]">Income overview</h1>
                <p className=" font-normal text-[16px] text-[#3D3F42] w-[273px]">Monitor your rental income
                  performance over time</p>
              </div>
              <div className=" flex flex-col gap-0.5">
                <h1 className=" font-bold text-[24px] text-[#162B4C]">$20,000</h1>
                <div className="flex items-center gap-1">
                  <p className=" bg-[#D9ECDA] text-[#43A047] py-1 px-3 rounded-2xl">+12%</p>
                  <p>This month</p>
                </div>
              </div>

              <form>
                <select className=" align-top bg-[#EBECED] border-none outline-none py-2 px-3 rounded-[8px]">
                  <option>Last 5 months</option>
                </select>
              </form>

            </div>

            <div>
              <Image src={ReviewGraph} width={604} height={258} alt="" />
            </div>
          </div>

          {/* Tenants activity snapshots */}
          <div className="flex flex-col bg-white p-4 rounded-[12px] gap-10">
            <div className=" flex flex-col gap-1.5">
              <h4 className=" font-medium text-[20px] text-[#162B4C]">Tenants activity snapshots</h4>
              <p className=" font-normal text-[14px] text-[#999EA5] w-[340px]">Stay informed about tenant engagement, lease renewals, and occupancy trends.</p>
            </div>

            <div className=" flex flex-col gap-[75px]">
              <div className=" flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-semibold text-[12px] text-[#3D3F42]">Occupancy rate:</h4>
                  <p className="font-medium text-[10px] text-[#7A7E84] w-[178px]">Percentage of rented properties this month</p>
                </div>
                <div className=" flex flex-col items-center gap-2">
                  <Image src={SnapshotGraph} width={76} height={76} alt="" />
                  <div className=" flex items-center gap-1">
                    <p className=" bg-[#D9ECDA] text-[#43A047] py-1 px-3 rounded-2xl">+12%</p>
                    <span className=" font-normal text-[14px] text-[#999EA5]">this month</span>
                  </div>
                </div>
              </div>
              <div>
                <div className=" flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-semibold text-[12px] text-[#3D3F42]">Tenant activity:</h4>
                    <p className="font-medium text-[10px] text-[#7A7E84] w-[178px]">Track how your active tenants are this month</p>
                  </div>
                  <div className=" flex items-center gap-2">
                    <div className=" flex items-center bg-[#43A047] py-2 px-3 border border-[#D6D8DB] text-white rounded-[8px]">
                      <p>35</p>
                    </div>
                    <div className=" flex items-center bg-[#9EFF71] py-2 px-3 border border-[#D6D8DB] text-white rounded-[8px]">
                      <p>12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}

        </div>
      </section>
    </DashboardLayout>

  )
}
