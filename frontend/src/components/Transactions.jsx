import { useEffect, useState } from "react";
import axios from "axios";

export const Transactions = ({ month, year }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/getTransactions?month=${month}&year=${year}`
        );
        console.log("Fetched Transactions:", response.data);
        setTransactions(response.data);
        setTotalCount(parseInt(response.headers["x-total-count"], 10));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [month, year, page, perPage, search]);
  const totalPages = Math.ceil(totalCount / perPage);
  if (loading) {
    return <div>Loading transactions...</div>;
  }
  if (!transactions.length) {
    return (
      <div>No transactions available for the selected month and year.</div>
    );
  }

  return (
    <div>
      <div className="flex m-4 justify-between">
        <h2 className="text-xl font-semibold text-sky-700">
          Transaction History
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description"
            className="border rounded outline-none p-2 w-96"
          />
        </div>

        <div className="flex  justify-between items-center ">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-2 mx-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400">
            Previous
          </button>
          <span>
            {" "}
            Page {page} of {totalPages}{" "}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2 mx-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400">
            Next
          </button>
        </div>
      </div>
      <table className="bg-sky-50 rounded w-full border border-gray-200  shadow-md  p-4">
        <thead className="bg-sky-100 text-sky-700  ">
          <tr>
            <th className="p-4 w-32 text-center">ID</th>
            <th className="p-4 w-96">Title</th>
            <th className="p-4 w-96">Description</th>
            <th className="p-4 w-32">Price</th>
            <th className="p-4 w-32">Sold</th>
            <th className="p-4 w-32">Date of Sale</th>
          </tr>
        </thead>
        <tbody className="text-left">
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="p-2 border-t hover:bg-sky-100">
              <td className="p-2  w-32 text-center">{transaction.id}</td>
              <td className="p-2 w-96">{transaction.title}</td>
              <td className="pt-2 w-96x text-ellipsis line-clamp-1">
                {transaction.description}
              </td>
              <td className="p-2 w-32 text-center">${transaction.price}</td>
              <td className="p-2 w-32 text-center">
                {transaction.sold ? "Yes" : "No"}
              </td>
              <td className="p-2 w-32 text-center">
                {new Date(transaction.dateOfSale).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
