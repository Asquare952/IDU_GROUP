"use client";
import React from "react";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/TenantHeroSection";
import PropertyCard from "@/app/components/TenantPropertyCard";
import { PROPERTY_LIST } from "@/app/components/tenant-properties";
import { useFetchProperties } from "@/app/api/features/property/property.queries";

const Page = () => {
  const { data: properties, isLoading } = useFetchProperties();
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 md:pt-5">
        <HeroSection />
        <section className="px-6 md:px-12 mt-24 pb-20">
          {isLoading ? <p className=" text-2xl text-center font-semibold mt-4">Loading properties...</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties?.map((house) => (
              <PropertyCard key={house.id} house={house} />
            ))}
          </div>}

        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
