"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
export function TrafficChart({
  data,
}: {
  data: { day: string; visits: number }[];
}) {
  return (
    <div className="admin-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#c4cfe333" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="visits"
            stroke="#2563eb"
            fill="url(#traffic-fill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function BreakdownChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <div className="admin-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 20, right: 20 }}
        >
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 10 }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#8d8cdb" radius={[0, 5, 5, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
