import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

interface Props {
  data: Transaction[];
}

const TransactionChart: React.FC<Props> = ({ data }) => {
  const aggregatedByDate = data.reduce<Record<string, number>>((acc, t) => {
    const date = dayjs(t.date).format("MM/DD/YYYY");
    acc[date] = (acc[date] || 0) + t.amount;
    return acc;
  }, {});

  const chartData = Object.entries(aggregatedByDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) =>
      dayjs(a.date, "MM/DD/YYYY").unix() - dayjs(b.date, "MM/DD/YYYY").unix()
    );

  return (
    <div className="w-full h-[550px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 30, right: 40, bottom: 80, left: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => dayjs(str, "MM/DD/YYYY").format("MMM DD, YYYY")}
            angle={-45}
            textAnchor="end"
            height={80}
            label={{
              value: "Date",
              position: "insideBottom",
              offset: -20,
              style: { fill: "#555", fontSize: 14 },
            }}
          />
          <YAxis
            tickFormatter={(value) => `$${Math.round(value)}`}
            label={{
              value: "Amount ($)",
              angle: -90,
              position: "insideLeft",
              offset: -20, 
              style: { fill: "#555", fontSize: 14 },
            }}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            labelFormatter={(label: string) =>
              `Date: ${dayjs(label, "MM/DD/YYYY").format("MMM DD, YYYY")}`
            }
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
