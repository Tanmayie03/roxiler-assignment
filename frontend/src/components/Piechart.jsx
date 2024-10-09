import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
import axios from "axios";

export const Piechart = ({ month, year }) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/getPieChartData?month=${month}&year=${year}`
        );
        setCategoryData(response.data);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchPieChartData();
  }, [month, year]);

  const data = {
    labels: categoryData.map((category) => category._id),
    datasets: [
      {
        label: "Category Distribution",
        data: categoryData.map((category) => category.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="bg-sky-50 my-4 h-fit mx-2 rounded p-6">
      <div
        className="bg-white px-8 pb-8 pt-4"
        style={{ height: "300px", width: "350px" }}>
        <h2 className="font-semibold">Category Statistics</h2>
        <Pie
          data={data}
          className="h-[300px]"
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};
