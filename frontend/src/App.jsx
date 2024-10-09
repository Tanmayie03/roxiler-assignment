import { useState } from "react";

import "./index.css";
import { Barchart } from "./components/Barchart";
import { Piechart } from "./components/Piechart";
import { Statistics } from "./components/Statistics";
import { Transactions } from "./components/Transactions";

function App() {
  const [month, setMonth] = useState("3"); // Default to March
  const [year, setYear] = useState("2022");

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <>
      <h1 className="px-6 py-6 text-sky-700 bg-sky-100 text-2xl font-bold ">
        Product Dashboard
      </h1>
      <div className="p-6">
        <div className="flex bg-sky-100 justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold text-sky-700">Statistics</h2>

            <div className="my-2">
              <label htmlFor="month">Select Month:</label>
              <select
                id="month"
                value={month}
                className="bg-sky-50 p-2 rounded mx-1"
                onChange={handleMonthChange}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              <label htmlFor="year">Select Year:</label>
              <select
                id="year"
                value={year}
                className="bg-sky-50 p-2 rounded mx-1"
                onChange={handleYearChange}>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <Statistics month={month} year={year} />
          </div>
          <Barchart month={month} year={year} />
          <Piechart month={month} year={year} />
        </div>
        <Transactions month={month} year={year} />
      </div>
    </>
  );
}

export default App;
