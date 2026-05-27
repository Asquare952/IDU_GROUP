import React from "react";
import { CheckCircle2, Info, LoaderCircle, Trash2 } from "lucide-react";

interface NotificationProps {
  type: "Success" | "Info";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  accentColor: string;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
  isDeleting?: boolean;
  isMarkingAsRead?: boolean;
}

const NotificationItem = ({
  type,
  message,
  time,
  isRead,
  accentColor,
  onDelete,
  onMarkAsRead,
  isDeleting = false,
  isMarkingAsRead = false,
}: NotificationProps) => {
  const displayMessage = message || "No extra details available.";

  return (
    <div className="relative bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden mb-4">
      <div
        style={{ backgroundColor: accentColor }}
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-full"
      />

      <div className="flex items-start gap-4">
        <div style={{ color: accentColor }} className="mt-1">
          {type === "Success" ? <CheckCircle2 size={24} /> : <Info size={24} />}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-3 gap-3">
            <span
              style={{
                color: accentColor,
                borderColor: `${accentColor}20`,
                backgroundColor: `${accentColor}10`,
              }}
              className="border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight"
            >
              {type}
            </span>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {!isRead && onMarkAsRead ? (
                <button
                  type="button"
                  onClick={onMarkAsRead}
                  disabled={isMarkingAsRead}
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-[#43A047] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMarkingAsRead ? (
                    <LoaderCircle size={12} className="animate-spin" />
                  ) : null}
                  Mark as read
                </button>
              ) : null}
              {onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-500 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? (
                    <LoaderCircle size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Delete
                </button>
              ) : null}
              <span className="text-slate-400 text-[12px]">{time}</span>
              {!isRead && (
                <div
                  style={{ backgroundColor: accentColor }}
                  className="h-2.5 w-2.5 rounded-full"
                />
              )}
            </div>
          </div>

          
            <div className="space-y-2">
              <h4 className="text-[#162B4C] font-bold text-[16px] leading-snug">
              {displayMessage.length > 60 ? `${displayMessage.slice(0, 60)}...`
                : displayMessage}
              </h4>
              <p className="text-sm leading-6 text-slate-600">
                {displayMessage}
              </p>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
