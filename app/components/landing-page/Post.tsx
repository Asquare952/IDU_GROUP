"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Post = () => {
    const router = useRouter();
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    userRole: null as "tenant" | "landlord" | null,
    loading: true,
  });
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/features/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        setAuth({
          isLoggedIn: data.isLoggedIn,
          userRole: data.userRole,
          loading: false,
        });
      } catch {
        setAuth({ isLoggedIn: false, userRole: null, loading: false });
      }
    };
    checkAuth();
  }, []);

  const handleListProperty = () => {
    if (auth.loading) return;
    if (!auth.isLoggedIn) {
      router.push("/login");
    } else if (auth.userRole === "landlord") {
      router.push("/landlord/dashboard");
    }
  };
  return (
    <div>
      <div className="w-full relative overflow-hidden py-20 bg-[#E8F0E9]">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/bent line 5.png"
            alt=""
            width={500}
            height={500}
            className="absolute top-[-10%] right-[-5%] opacity-30"
          />
          <Image
            src="/bent line 1.png"
            alt=""
            width={500}
            height={500}
            className="absolute bottom-[-10%] left-[-5%] opacity-30"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-semibold text-4xl md:text-5xl leading-tight text-gray-900">
              List your Properties and Get Real
              <br className="hidden md:block" />
              Tenants Fast
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 mt-6 max-w-2xl mx-auto">
              Post your house once, and reach verified tenants in your location
            </p>
            {auth.userRole === "landlord" && <button onClick={handleListProperty} className="bg-[#34A853] hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full transition-all mt-10 shadow-lg flex items-center gap-2 mx-auto cursor-pointer transition-all active:scale-95">
              Start Listing <span className="text-sm">&rarr;</span>
            </button>}
            
          </div>
          <div className="flex justify-center mt-16">
            <div className="relative w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
              <Image
                src="/Landlord Dashboard.webp"
                alt="Landlord Dashboard"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
