import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { supabase } from "../../config/supabase";
import "./Chart.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

export default function IncomeExpenseSavingOverTime() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    async function fetchData() {
      const { data, error } = await supabase
        .schema('fintrack')
        .from("v_transaction_type_daily")
        .select("*")
        .eq("user_id", userId)
        .order("transaction_date", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      // Prepare labels (dates)
      const dates = [...new Set(data.map((d) => d.transaction_date))];

      // Prepare data by type
      const types = ["income", "expense", "saving"];
      const datasets = types.map((type, idx) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: dates.map((date) => {
          const record = data.find((d) => d.transaction_date === date && d.type === type);
          return record ? Number(record.total_amount) : 0;
        }),
        borderColor: ["#4caf50", "#f44336", "#2196f3"][idx],
        backgroundColor: "transparent",
        tension: 0.3,
      }));

      setChartData({
        labels: dates,
        datasets,
      });
    }

    fetchData();
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="chart-container">
      <h3>Income vs Expense vs Saving Over Time</h3>
      <Line data={chartData} />
    </div>
  );
}
