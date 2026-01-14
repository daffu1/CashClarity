import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

interface Props {
  data: Transaction[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];

const TransactionChart: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<"line" | "pie">("line");

  // line chart
  const aggregatedByDate = data.reduce<Record<string, number>>((acc, t) => {
    const parsedDate = dayjs(t.date, ["YYYY-MM-DD", "MM/DD/YYYY"]);
    if (parsedDate.isValid()) {
      const formatted = parsedDate.format("MMM DD, YYYY");
      acc[formatted] = (acc[formatted] || 0) + t.amount;
    }
    return acc;
  }, {});

  const chartData = Object.entries(aggregatedByDate).map(([date, total]) => ({
    date,
    amount: total,
  }));

  // pie chart
  const aggregatedByDesc = data.reduce<Record<string, number>>((acc, t) => {
    const key = t.description.split(" ")[0]; // basic category from first word
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.entries(aggregatedByDesc).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setView("line")}
          className={`px-4 py-2 rounded-l-md text-sm font-medium transition border ${
            view === "line" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"
          }`}
        >
          Spending Over Time
        </button>
        <button
          onClick={() => setView("pie")}
          className={`px-4 py-2 rounded-r-md text-sm font-medium transition border ${
            view === "pie" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"
          }`}
        >
          By Category
        </button>
      </div>

      <div className="w-full h-96">
        {view === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TransactionChart;
