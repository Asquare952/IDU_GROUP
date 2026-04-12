"use client";
import React from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ANALYTICS_STATS, MOCK_CHART_DATA, TOP_PROPERTIES } from "./data/analyticsData";
import Image from "next/image";

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <header>
          <h2 className="text-3xl font-bold text-slate-800">
            Insight & Analytics
          </h2>
          <p className="text-slate-500">
            Track how your properties are performing across Lagos.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ANALYTICS_STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
            >
              <div
                className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
              >
                <stat.icon size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">
              Property View Trends
            </h3>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_CHART_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "15px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Top Performing</h3>
            <div className="space-y-6">
              {TOP_PROPERTIES.map((property) => (
                <div key={property.id} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-50">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {property.title}
                    </p>
                    <p className="text-[11px] text-[#4CAF50] font-bold uppercase tracking-tight">
                      {property.views}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
