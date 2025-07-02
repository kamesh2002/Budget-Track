import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
import { supabase } from "../../config/supabase";
import "./Chart.css";

export default function MonthlyIncomeExpense() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    async function fetchData() {
      const { data, error } = await supabase
        .schema('fintrack')
        .from("v_monthly_income_expense")
        .select("*")
        .eq("user_id", userId)
        .order("month", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      // Get unique months sorted
      const months = [...new Set(data.map((d) => d.month))];

      const types = ["income", "expense"];

      const datasets = types.map((type, idx) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: months.map((month) => {
          const record = data.find((d) => d.month === month && d.type === type);
          return record ? Number(record.total_amount) : 0;
        }),
        backgroundColor: ["#4caf50", "#f44336"][idx],
      }));

      setChartData({
        labels: months.map((m) => new Date(m).toLocaleDateString("default", { year: "numeric", month: "short" })),
        datasets,
      });
    }

    fetchData();
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="chart-container">
      <h3>Monthly Income and Expenses Comparison</h3>
      <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
    </div>
  );
}
