"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyRevenueDto } from "@/types/travel";

interface RevenueChartProps {
  data: MonthlyRevenueDto[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Format currency for Y-axis and Tooltip
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Convert "2024-05" to "T5/2024"
  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split("-");
    return `T${parseInt(month)}/${year}`;
  };

  const chartData = data.map((item) => ({
    ...item,
    formattedMonth: formatMonth(item.month),
  }));

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-[#cdece0] bg-[#f8fffb]">
        <p className="text-[#34594d]">Chưa có dữ liệu thống kê.</p>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full rounded-2xl border border-[#cdece0] bg-white p-5 shadow-sm">
      <h3 className="mb-6 text-xl font-semibold text-[#083b2d]">Doanh thu & Số lượng Booking 6 tháng gần nhất</h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="formattedMonth" 
              tick={{ fill: '#6b7280', fontSize: 13 }} 
              axisLine={{ stroke: '#e5e7eb' }} 
              tickLine={false} 
              dy={10}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatCurrency}
              tick={{ fill: '#6b7280', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#6b7280', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              dx={10}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #cdece0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: any, name: any) => {
                if (name === "Doanh thu" && typeof value === "number") {
                  return [formatFullCurrency(value), name];
                }
                return [value, name];
              }}
              labelStyle={{ fontWeight: 'bold', color: '#083b2d', marginBottom: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Doanh thu"
              barSize={40}
              fill="#7cf4c4"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookingCount"
              name="Số lượng booking"
              stroke="#0a7d59"
              strokeWidth={3}
              dot={{ r: 5, fill: "#0a7d59", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
