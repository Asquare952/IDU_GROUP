"use client";

import React, { useState } from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import {
  CommonScamsData,
  SafetyBannerData,
  SafetyReportCards,
  SafetyTipsData,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import { AlertTriangle, ArrowRight, Shield } from "lucide-react";
import {
  reportTemplates,
  safetyCenterIconMap,
  showGreenSafetyToast,
} from "./center/center";
// Shared safety drawer (action menu + report forms) - modal logic lives there.
import SafetyAssistanceDrawer from "@/app/components/Tenant-Dashboard/SafetyAssistanceDrawer";

const Page = () => {
  // isSafetyOpen: whether the shared drawer is visible.
  // safetyTemplateId: which report form to show when it opens
  //   (1 = fake listing, 2 = report agent). null -> action menu.
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [safetyTemplateId, setSafetyTemplateId] = useState<number | null>(null);

  const closeSafetyDrawer = () => {
    setIsSafetyOpen(false);
    setSafetyTemplateId(null);
  };
  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F8F9FA] min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#162B4C]">Safety Center</h2>
          <p className="text-gray-500 mt-2 text-base">
            Your security is our priority. Learn how to stay safe while
            searching for houses.
          </p>
        </div>

        <div className="bg-[#43A047] rounded-[2rem] p-6 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">
                {SafetyBannerData.title}
              </h3>
              <p className="text-sm text-green-50 opacity-90">
                {SafetyBannerData.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={() =>
                showGreenSafetyToast(
                  "Emergency hotline is not connected yet in this build.",
                )
              }
              className="flex-1 md:flex-none bg-white text-[#43A047] px-6 py-3 rounded-xl font-bold cursor-pointer"
            >
              Call {SafetyBannerData.emergencyLine}
            </button>
            <button
              type="button"
              onClick={() =>
                showGreenSafetyToast("Live chat support is not connected yet.")
              }
              className="flex-1 md:flex-none bg-white/20 text-white px-6 py-3 rounded-xl font-bold border border-white/30 cursor-pointer"
            >
              {SafetyBannerData.chatText}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {SafetyReportCards.map((card) => {
            const Icon = safetyCenterIconMap[card.icon];
            const template = reportTemplates[card.id];

            return (
              <div
                key={card.id}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`${card.bgColor} w-10 h-10 rounded-xl flex items-center justify-center mb-5`}
                  >
                    <Icon className={card.iconColor} size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-[#162B4C] mb-2">
                    {card.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed mb-5">
                    {card.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (template) {
                      // Open the shared drawer straight into this card's form.
                      setSafetyTemplateId(card.id);
                      setIsSafetyOpen(true);
                    } else {
                      showGreenSafetyToast(
                        "Support contact is not connected yet. Please use the report options for suspicious listings or agents.",
                      );
                    }
                  }}
                  className="flex items-center gap-2 text-[#43A047] font-bold group-hover:gap-3 transition-all cursor-pointer"
                >
                  {template ? "Submit Report" : "Contact Support"}
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#162B4C] mb-8">Safety Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SafetyTipsData.map((tip) => {
              const Icon = safetyCenterIconMap[tip.icon];

              return (
                <div
                  key={tip.id}
                  className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex gap-5 items-start"
                >
                  <div className={`${tip.bgColor} p-2.5 rounded-2xl`}>
                    <Icon className={tip.color} size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#162B4C] mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-50 shadow-sm w-full">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-red-50 p-2.5 rounded-2xl">
              <AlertTriangle className="text-red-600" size={18} />
            </div>
            <h3 className="text-xl font-bold text-[#162B4C]">
              Common Housing Scams to Watch For
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-12">
            {CommonScamsData.map((scam) => (
              <div
                key={scam.id}
                className="border-b border-gray-50 last:border-0 pb-8 last:pb-0"
              >
                <h4 className="text-lg font-semibold text-red-600 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  {scam.title}
                </h4>
                <p className="text-gray-500 text-base leading-relaxed max-w-none">
                  {scam.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shared drawer. templateId = 1 (fake listing) or 2 (report agent)
            opens it straight into that form; null shows the action menu. */}
        <SafetyAssistanceDrawer
          open={isSafetyOpen}
          onClose={closeSafetyDrawer}
          templateId={safetyTemplateId}
        />

        {/* Stacked above the global chat launcher (bottom-10 right-10) so they don't overlap */}
        <button
          type="button"
          onClick={() => {
            setSafetyTemplateId(null); // always open on the action menu
            setIsSafetyOpen(true);
          }}
          className="cursor-pointer fixed bottom-32 right-10 bg-[#FF3B30] text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all z-40 active:scale-90"
        >
          <AlertTriangle size={24} />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Page;
