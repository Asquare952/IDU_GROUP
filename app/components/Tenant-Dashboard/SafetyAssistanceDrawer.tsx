"use client";

// ============================================================================
// SafetyAssistanceDrawer
// ----------------------------------------------------------------------------
// Shared "Safety Assistance" modal used by BOTH the tenant dashboard and the
// safety-center page. It owns:
//   - the action menu (Report Agent / Alert Support / Share Location)
//   - the report form (fake listing OR report agent, depending on template)
//   - the useFileReport mutation, validation, and toast feedback
//
// Pages only need to keep:
//   - `isSafetyOpen` state
//   - the floating red AlertTriangle trigger button
// and render:
//   <SafetyAssistanceDrawer open={isSafetyOpen} onClose={...} />
//
// If a page wants the drawer to open STRAIGHT into a report form (e.g. the
// safety-center cards), pass `templateId` (1 = fake listing, 2 = report agent).
// ============================================================================

import React, { useEffect, useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { toast } from "react-toastify";
import { useFileReport } from "@/app/api/features/report";
import { SafetyAction } from "@/app/components/Tenant-Dashboard/config/DashboardDatas";
import {
  reportSuccessToastOptions,
  reportTemplates,
  reportTypeOptions,
  safetyActionFeedback,
  showGreenSafetyToast,
  type ReportType,
  type ReportTemplate,
} from "@/app/tenant/safety-center/center/center";

type SafetyAssistanceDrawerProps = {
  /** Whether the drawer is visible. */
  open: boolean;
  /** Called when the user closes it (X, Cancel, backdrop click, after submit). */
  onClose: () => void;
  /**
   * Optional: which report form to show when opened.
   * 1 = Report Fake Listing (search_name), 2 = Report Agent (report_user_id).
   * Pass null / omit to show the action menu instead.
   */
  templateId?: number | null;
};

const SafetyAssistanceDrawer = ({
  open,
  onClose,
  templateId = null,
}: SafetyAssistanceDrawerProps) => {
  const [selectedReportTemplate, setSelectedReportTemplate] =
    useState<ReportTemplate | null>(null);
  const [reportType, setReportType] = useState<ReportType>("fraud");
  const [targetValue, setTargetValue] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const fileReportMutation = useFileReport();

  // Every time the drawer opens, reset to a clean state.
  // If the page asked for a specific template, jump straight to that form.
  useEffect(() => {
    if (!open) {
      return;
    }

    const template = templateId != null ? reportTemplates[templateId] : null;

    setSelectedReportTemplate(template ?? null);
    setReportType(template?.defaultReportType ?? "fraud");
    setTargetValue("");
    setReportMessage("");
  }, [open, templateId]);

  const closeDrawer = () => {
    onClose();
    setSelectedReportTemplate(null);
    setReportType("fraud");
    setTargetValue("");
    setReportMessage("");
  };

  const handleSafetyAction = (actionId: number) => {
    // Action id 1 = "Report Agent" -> open template 2 (agent user ID form).
    // TODO: confirm this matches the `id` of the "Report Agent" entry in
    // SafetyAction inside config/DashboardDatas. If the id differs, change
    // the check below.
    if (actionId === 1) {
      const template = reportTemplates[2];

      if (template) {
        setSelectedReportTemplate(template);
        setReportType(template.defaultReportType);
        setTargetValue("");
        setReportMessage("");
      }
      return;
    }

    // Everything else (Alert Support, Share Location) isn't wired to a
    // backend yet -> show the green notice toast instead.
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
      // The backend accepts exactly ONE target field per report:
      // either `search_name` (fake listing) or `report_user_id` (agent).
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
      closeDrawer();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your report right now.",
      );
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end p-6 md:p-10">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[560px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {selectedReportTemplate ? (
          /* ------------------------- Report form ------------------------- */
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
                    onClick={closeDrawer}
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
                Send a report directly to the safety team. The backend accepts
                exactly one target field.
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
                  onChange={(event) => setTargetValue(event.target.value)}
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
                  onChange={(event) => setReportMessage(event.target.value)}
                  placeholder="Tell us what happened and what you want us to check."
                  rows={4}
                  disabled={fileReportMutation.isPending}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] disabled:bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeDrawer}
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
                  {fileReportMutation.isPending ? "Sending..." : "Send Report"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            {/* ----------------------- Action menu ----------------------- */}
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-2.5 rounded-2xl">
                  <ShieldAlert className="text-[#FF3B30]" size={20} />
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-[#162B4C] leading-tight">
                Safety Assistance
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                If you feel unsafe or suspect a scam, choose an action below.
              </p>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default SafetyAssistanceDrawer;
