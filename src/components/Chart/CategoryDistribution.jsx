import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { supabase } from "../../config/supabase";
import "./Chart.css";


export default function CategoryDistribution({ categoryType = "expense" }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    async function fetchData() {
      const { data, error } = await supabase
        .schema('fintrack')
        .from("v_category_amount")
        .select("*")
        .eq("user_id", userId)
        .eq("category_type", categoryType)
        .order("total_amount", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setChartData({
        labels: data.map((d) => d.category_name),
        datasets: [
          {
            label: `Category wise ${categoryType}`,
            data: data.map((d) => Number(d.total_amount)),
            backgroundColor: data.map(() => getRandomColor()),
          },
        ],
      });
    }

    fetchData();
  }, [categoryType]);

  // Helper for random pastel colors
  function getRandomColor() {
    const pastel = () =>
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
    return pastel();
  }

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="chart-container">
      <h3>{categoryType.charAt(0).toUpperCase() + categoryType.slice(1)} by Category</h3>
      <Pie data={chartData} />
    </div>
  );
}
