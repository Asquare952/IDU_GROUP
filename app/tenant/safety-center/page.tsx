"use client";

import React, { useState } from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import {
  CommonScamsData,
  SafetyBannerData,
  SafetyReportCards,
  SafetyTipsData,
  SafetyAction,
} from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  ShieldAlert,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useFileReport } from "@/app/api/features/report";
import {
  reportSuccessToastOptions,
  reportTemplates,
  reportTypeOptions,
  safetyActionFeedback,
  safetyCenterIconMap,
  showGreenSafetyToast,
  type ReportType,
  type ReportTemplate,
} from "./center/center";

const Page = () => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [selectedReportTemplate, setSelectedReportTemplate] =
    useState<ReportTemplate | null>(null);
  const [reportType, setReportType] = useState<ReportType>("fraud");
  const [targetValue, setTargetValue] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const fileReportMutation = useFileReport();

  const closeSafetyDrawer = () => {
    setIsSafetyOpen(false);
    setSelectedReportTemplate(null);
    setReportType("fraud");
    setTargetValue("");
    setReportMessage("");
  };

  const openSafetyDrawer = () => {
    setIsSafetyOpen(true);
    setSelectedReportTemplate(null);
    setReportType("fraud");
    setTargetValue("");
    setReportMessage("");
  };

  const openReportTemplate = (cardId: number) => {
    const template = reportTemplates[cardId];

    if (!template) {
      showGreenSafetyToast(
        "Support contact is not connected yet. Use the report form for suspicious listings or agents.",
      );
      return;
    }

    setIsSafetyOpen(true);
    setSelectedReportTemplate(template);
    setReportType(template.defaultReportType);
    setTargetValue("");
    setReportMessage("");
  };

  const handleSafetyAction = (actionId: number) => {
    if (actionId === 1) {
      openReportTemplate(2);
      return;
    }

    showGreenSafetyToast(
      safetyActionFeedback[actionId] ||
        "This action is not connected yet in this build.",
    );
  };

  const handleReportSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedReportTemplate) {
      return;
    }

    const trimmedTarget = targetValue.trim();
    const trimmedMessage = reportMessage.trim();

    if (!trimmedTarget) {
      toast.error(
        `Please enter the ${selectedReportTemplate.targetLabel.toLowerCase()}.`,
      );
      return;
    }

    if (!trimmedMessage) {
      toast.error("Please describe the issue before submitting.");
      return;
    }

    try {
      const payload =
        selectedReportTemplate.targetField === "search_name"
          ? {
              report_message: trimmedMessage,
              report_type: reportType,
              search_name: trimmedTarget,
            }
          : {
              report_message: trimmedMessage,
              report_type: reportType,
              report_user_id: trimmedTarget,
            };

      await fileReportMutation.mutateAsync(payload);
      toast.success(
        "Report submitted successfully.",
        reportSuccessToastOptions,
      );
      closeSafetyDrawer();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your report right now.",
      );
    }
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
                  onClick={() =>
                    template
                      ? openReportTemplate(card.id)
                      : showGreenSafetyToast(
                          "Support contact is not connected yet. Please use the report options for suspicious listings or agents.",
                        )
                  }
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

        <div className="p-6 flex flex-col gap-3">
          {isSafetyOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6 md:p-10">
              <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[560px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                {selectedReportTemplate ? (
                  <form onSubmit={handleReportSubmit}>
                    <div className="p-6 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-red-50 p-2.5 rounded-2xl">
                          <ShieldAlert className="text-[#FF3B30]" size={20} />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReportTemplate(null);
                              setReportType("fraud");
                              setTargetValue("");
                              setReportMessage("");
                            }}
                            className="cursor-pointer text-sm font-semibold text-gray-500 hover:text-gray-700"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={closeSafetyDrawer}
                            className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-[#162B4C] leading-tight">
                        {selectedReportTemplate.targetField === "search_name"
                          ? "Report Fake Listing"
                          : "Report Agent"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Send a report directly to the safety team. The backend
                        accepts exactly one target field.
                      </p>
                    </div>

                    <div className="px-8 pb-8 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {selectedReportTemplate.targetLabel}
                        </label>
                        <input
                          type="text"
                          value={targetValue}
                          onChange={(event) =>
                            setTargetValue(event.target.value)
                          }
                          placeholder={selectedReportTemplate.targetPlaceholder}
                          disabled={fileReportMutation.isPending}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] disabled:bg-gray-50"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          {selectedReportTemplate.targetHint}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report category
                        </label>
                        <select
                          value={reportType}
                          onChange={(event) =>
                            setReportType(event.target.value as ReportType)
                          }
                          disabled={fileReportMutation.isPending}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] disabled:bg-gray-50"
                        >
                          {reportTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report details
                        </label>
                        <textarea
                          value={reportMessage}
                          onChange={(event) =>
                            setReportMessage(event.target.value)
                          }
                          placeholder="Tell us what happened and what you want us to check."
                          rows={4}
                          disabled={fileReportMutation.isPending}
                          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] disabled:bg-gray-50"
                        />
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={closeSafetyDrawer}
                          disabled={fileReportMutation.isPending}
                          className="cursor-pointer flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={fileReportMutation.isPending}
                          className="cursor-pointer flex-1 rounded-xl bg-[#43A047] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-400"
                        >
                          {fileReportMutation.isPending
                            ? "Sending..."
                            : "Send Report"}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-red-50 p-2.5 rounded-2xl">
                        <ShieldAlert className="text-[#FF3B30]" size={20} />
                      </div>
                      <button
                        type="button"
                        onClick={closeSafetyDrawer}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-[#162B4C] leading-tight">
                      Safety Assistance
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      If you feel unsafe or suspect a scam, choose an action
                      below.
                    </p>
                  </div>
                )}

                {!selectedReportTemplate && (
                  <div className="p-6 flex flex-col gap-4">
                    {SafetyAction.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleSafetyAction(action.id)}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                       ${
                         action.variant === "danger"
                           ? "bg-[#FF3B30] text-white hover:bg-red-700"
                           : action.variant === "Success" ||
                               action.variant === "success"
                             ? "bg-[#43A047] text-white hover:bg-green-700"
                             : "bg-[#F2F2F7] text-[#162B4C] hover:bg-gray-200"
                       }`}
                      >
                        <action.icon size={18} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stacked above the global chat launcher (bottom-10 right-10) so they don't overlap */}
        <button
          type="button"
          onClick={isSafetyOpen ? closeSafetyDrawer : openSafetyDrawer}
          className="cursor-pointer fixed bottom-32 right-10 bg-[#FF3B30] text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all z-40 active:scale-90"
        >
          <AlertTriangle size={24} />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Page;
