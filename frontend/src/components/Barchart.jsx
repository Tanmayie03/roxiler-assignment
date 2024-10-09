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
import { Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
import axios from "axios";

export const Barchart = ({ month, year }) => {
  const [priceRanges, setPriceRanges] = useState([]);

  useEffect(() => {
    const fetchBarStatistics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/getBarStatistics?month=${month}&year=${year}`
        );
        setPriceRanges(response.data);
      } catch (error) {
        console.error("Error fetching bar statistics:", error);
      }
    };

    fetchBarStatistics();
  }, [month, year]);

  const data = {
    labels: priceRanges.map((range) => range.range),
    datasets: [
      {
        label: "Number of Products",
        data: priceRanges.map((range) => range.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-sky-50 h-fit rounded my-4 p-6">
      <div className="bg-white p-4" style={{ height: "300px", width: "350px" }}>
        <h2 className="font-semibold">Price Range Statistics</h2>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};
