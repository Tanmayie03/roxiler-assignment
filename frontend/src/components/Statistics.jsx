import { useEffect, useState } from "react";
import axios from "axios";
export const Statistics = ({ month }) => {
  const [data, setData] = useState({
    totalSales: 0,
    soldItems: 0,
    notSoldItems: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/getStatistics?month=${month}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [month]);

  return (
    <div className="">
      <div className="bg-sky-50 flex flex-col p-4 my-4  rounded text-lg w-72">
        <h1 className="font-bold pb-2 text-sky-700">Overall statistics</h1>
        <p className="py-1">
          <span className="font-semibold">Total Sales: </span> $
          {data.totalSales}
        </p>
        <p className="py-1">
          <span className="font-semibold">Sold Items: </span> {data.soldItems}
        </p>
        <p className="py-1">
          <span className="font-semibold">Not Sold Items: </span>{" "}
          {data.notSoldItems}
        </p>
      </div>
    </div>
  );
};
