import React from "react";
import { CheckCircle2, Info } from "lucide-react";

interface NotificationProps {
  type: "Success" | "Info";
  message: string;
  time: string;
  isRead: boolean;
  accentColor: string;
}

const NotificationItem = ({
  type,
  message,
  time,
  isRead,
  accentColor,
}: NotificationProps) => {
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
          <div className="flex justify-between items-center mb-3">
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

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[12px]">{time}</span>
              {!isRead && (
                <div
                  style={{ backgroundColor: accentColor }}
                  className="h-2.5 w-2.5 rounded-full"
                />
              )}
            </div>
          </div>

          <h4 className="text-[#162B4C] font-bold text-[16px] leading-snug">
            {message}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
