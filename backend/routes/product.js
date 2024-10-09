const express = require("express");
const axios = require("axios");
const { Product } = require("../db");
const { mongoose } = require("mongoose");
const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const productData = response.data;
    await Product.insertMany(productData);
    res.status(200).json({
      message: "Products successfully added to the database",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding products to the database",
    });
  }
});

router.get("/getTransactions", async (req, res) => {
  const {
    search = "",
    page = 1,
    per_page = 10,
    month = "3",
    year = "2021",
  } = req.query;
  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month" });
  }
  if (isNaN(year) || year < 2021 || year > 2024) {
    return res.status(400).json({ error: "Invalid year" });
  }
  const startOfMonth = new Date(`${year}-${month}-01`);
  const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);
  const query = {
    dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
  };
  if (search) {
    query.$or = [
      {
        title: { $regex: search, $options: "i" },
      },
      {
        description: { $regex: search, $options: "i" },
      },
    ];
    const searchAsNumber = parseFloat(search);
    if (!isNaN(searchAsNumber)) {
      query.$or.push({ price: searchAsNumber });
    }
  }
  try {
    const transactions = await Product.find(query)
      .skip((page - 1) * per_page)
      .limit(per_page);
    const totalCount = await Product.countDocuments(query);
    res.set("X-Total-Count", totalCount);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving transactions",
      error: error.message,
    });
  }
});

router.get("/getStatistics", async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).send("Month is required");
    }
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).send("Invalid month value");
    }
    const totalSales = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$price" },
        },
      },
    ]);

    const soldItems = await Product.countDocuments({
      $expr: {
        $and: [
          { $eq: [{ $month: "$dateOfSale" }, monthInt] },
          { $eq: ["$sold", true] },
        ],
      },
    });

    const notSoldItems = await Product.countDocuments({
      $expr: {
        $and: [
          { $eq: [{ $month: "$dateOfSale" }, monthInt] },
          { $eq: ["$sold", false] },
        ],
      },
    });

    res.status(200).json({
      totalSales: totalSales[0]?.totalSales || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/getBarStatistics", async (req, res) => {
  try {
    const { month = "3", year = "2022" } = req.query;

    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month" });
    }
    if (isNaN(year) || year < 2021 || year > 2022) {
      return res.status(400).json({ error: "Invalid year" });
    }

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];
    const priceCounts = await Promise.all(
      ranges.map(async (range) => {
        const count = await Product.countDocuments({
          dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
          price: { $gte: range.min, $lte: range.max },
        });

        return {
          range: `${range.min}-${
            range.max === Infinity ? "above 900" : range.max
          }`,
          count,
        };
      })
    );
    res.status(200).json(priceCounts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

router.get("/getPieChartData", async (req, res) => {
  try {
    const { month = "3", year = "2021" } = req.query;

    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month" });
    }
    if (isNaN(year) || year < 2021 || year > 2022) {
      return res.status(400).json({ error: "Invalid year" });
    }

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const categoryCounts = await Product.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(categoryCounts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching pie chart data" });
  }
});

// router.get("/getAllStatistics", async (req, res) => {
//   try {
//     const month = req.query.month || "3";
//     const statistics = await router.handle("/getStatistics", {
//       query: { month },
//     });
//     const barChartData = await router.handle("/getBarStatistics", {
//       query: { month },
//     });
//     const pieChartData = await router.handle("/getPieChartData", {
//       query: { month },
//     });
//     const combinedResponse = {
//       statistics,
//       barChartData,
//       pieChartData,
//     };

//     res.status(200).json(combinedResponse);
//   } catch (error) {
//     console.error("Error fetching combined statistics:", error);
//     res.status(500).json({ error: "Error occurred" });
//   }
// });

module.exports = router;
