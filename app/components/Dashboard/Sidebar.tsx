// "use client";
// import { sidebarItems, sidebarItems2 } from "./config/SidebarItems";
// import { useAuth } from "../context/AuthContext";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import rentUloLogo from "@/public/assets/IDU-LOGO-1.png";
// import Image from "next/image";

// const Sidebar = () => {
//   const pathname = usePathname();
//   const { logout } = useAuth();

//   return (
//     <aside className="fixed left-0 top-0 hidden h-screen w-[280px] flex-col border border-[#EBECED] bg-white p-3 lg:flex">
//       <div className="flex items-center gap-2 px-1 py-3">
//         <Link href="/" className="flex items-center gap-2">
//           <Image src={rentUloLogo} width={32.7} alt="RentULO Logo" />
//           <h2 className="font-bold text-[22px] text-[#000000]">
//             Rent<span className="text-[#43A047]">ULO</span>
//           </h2>
//         </Link>
//       </div>
//       <div className="flex-1 overflow-y-auto hide-scrollbar">
//         <nav className="flex flex-col gap-6 mt-10">
//           {sidebarItems.map((item) => {
//             const { id, name, path, action, icon: Icon } = item;
//             const isActive = !!path && pathname === path;
//             const className = `flex items-center gap-3 py-3 px-4 text-sm font-medium transition-all rounded-lg ${isActive ? "bg-[#43A047] text-white" : " hover:bg-[#43A047] hover:text-white"}`;

//             return (
//               <Link href={path ?? "#"} key={id} className={className}>
//                 <Icon size={20} />
//                 <span>{name}</span>
//               </Link>
//             );
//           })}
//         </nav>
//         <div className="border-t border-[#EBECED] px-3 py-4">
//           <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
//             Others
//           </h3>
//           <nav className=" flex flex-col gap-2 mt-10">
//             <h1>Others</h1>
//             {sidebarItems2.map((item) => {
//               const { id, name, path, action, icon: Icon } = item;
//               const isActive = !!path && pathname === path;
//               const className = `flex items-center gap-2 py-3 px-6 rounded-[8px] ${isActive ? "bg-[#43A047] text-white" : " hover:bg-[#43A047] hover:text-white"}`;
//               const logoutClassName =
//                 "flex items-center gap-2 py-3 px-6 rounded-[8px] text-[#DC2626]";

//               if (action === "logout") {
//                 return (
//                   <button
//                     key={id}
//                     type="button"
//                     onClick={logout}
//                     className={logoutClassName}
//                   >
//                     <Icon />
//                     <span>{name}</span>
//                   </button>
//                 );
//               }
//               return (
//                 <Link
//                   href={(path as string) || "#"}
//                   key={id}
//                   className={`flex items-center gap-2 py-3 px-6 rounded-[8px] transition-all ${
//                     isActive
//                       ? "bg-[#43A047] text-white"
//                       : "hover:bg-[#43A047] hover:text-white"
//                   }`}
//                 >
//                   <Icon size={20} />
//                   <span>{name}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         <div style={{ height: "100px" }} />
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

"use client";

import { sidebarItems, sidebarItems2 } from "./config/SidebarItems";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import rentUloLogo from "@/public/assets/IDU-LOGO-1.png";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[280px] flex-col border-r border-[#EBECED] bg-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src={rentUloLogo} width={32.7} alt="RentULO Logo" />
          <h2 className="font-bold text-[22px] text-[#000000]">
            Rent<span className="text-[#43A047]">ULO</span>
          </h2>
        </Link>
      </div>

      {/* Main Navigation - takes available space */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4">
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const { id, name, path, icon: Icon } = item;
            const isActive = !!path && pathname === path;

            return (
              <Link
                href={path ?? "#"}
                key={id}
                className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#43A047] text-white"
                    : "text-[#3D3F42] hover:bg-[#43A047] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Others Section - pushed to bottom */}
      <div className="border-t border-[#EBECED] px-3 py-3">
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Others
        </h3>
        <nav className="flex flex-col gap-2">
          {sidebarItems2.map((item) => {
            const { id, name, path, action, icon: Icon } = item;
            const isActive = !!path && pathname === path;

            if (action === "logout") {
              return (
                <button
                  key={id}
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#DC2626] transition-all hover:bg-red-50"
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </button>
              );
            }

            return (
              <Link
                href={path ?? "#"}
                key={id}
                className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#43A047] text-white"
                    : "text-[#3D3F42] hover:bg-[#43A047] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
