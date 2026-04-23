import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const colors = ["#06b6d4", "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];

const GrievancePieChart = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={84}>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GrievancePieChart;
