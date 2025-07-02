import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
import { supabase } from "../../config/supabase";
import "./Chart.css";


export default function SavingsGrowth() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    async function fetchData() {
      const { data, error } = await supabase
        .schema('fintrack')
        .from("v_savings_over_time")
        .select("*")
        .eq("user_id", userId)
        .order("transaction_date", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      const dates = data.map((d) => d.transaction_date);
      const savings = data.map((d) => Number(d.total_savings));

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Savings Over Time",
            data: savings,
            borderColor: "#2196f3",
            backgroundColor: "transparent",
            tension: 0.3,
          },
        ],
      });
    }

    fetchData();
  }, []);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="chart-container">
      <h3>Savings Growth Over Time</h3>
      <Line data={chartData} />
    </div>
  );
}
