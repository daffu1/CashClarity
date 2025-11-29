import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Transaction = {
  date: string;
  description: string;
  amount: number;
};

type Props = {
  data: Transaction[];
};

const Charts = ({ data }: Props) => {
  
  const summarized = data.reduce((acc: Record<string, number>, txn) => {
    const date = new Date(txn.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    acc[key] = (acc[key] || 0) + txn.amount;
    return acc;
  }, {});

  const chartData = Object.entries(summarized).map(([date, total]) => ({
    date,
    total: parseFloat(total.toFixed(2)),
  }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
