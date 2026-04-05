const recordModel = require("../models/record.model");

async function getSummary(req, res) {
  try {
    const totalIncome = await recordModel.aggregate([
      {
        $match: { type: "income", isDeleted: false },
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } },
      },
    ]);

    const totalExpense = await recordModel.aggregate([
      {
        $match: { type: "expense", isDeleted: false },
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } },
      },
    ]);

    const netBalance =
      (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0);

    return res.status(200).json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      netBalance: netBalance,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
}

async function getAllCategorySummary(req, res) {
  try {
    const categorySummary = await recordModel.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      allCategoriesSummary: categorySummary,
    });
  } catch (error) {
    console.error("Error fetching category summary:", error);
    return res.status(500).json({ error: "Failed to fetch category summary" });
  }
}

async function getCategorySummary(req, res) {
  try {
    const { category } = req.params;

    const categorySummary = await recordModel.aggregate([
      {
        $match: { category: category, isDeleted: false },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);
    return res.status(200).json({
      categorySummary: categorySummary,
    });
  } catch (error) {
    console.log("Error fetching category: ", error);
    res.status(500).json({ error: "Failed to fetch category summary" });
  }
}

async function getTrends(req, res) {
  try {
    const trends = await recordModel.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          income: 1,
          expense: 1,
        },
      },
    ]);
    return res.status(200).json({
      trends: trends,
    });
  } catch (error) {
    console.error("Error fetching trends:", error);
    return res.status(500).json({ error: "Failed to fetch trends" });
  }
}

async function getRecentRecords(req, res) {
  try {
    const recentRecords = await recordModel.find({ isDeleted: false }).populate("createdBy", "name email").sort({ date: -1 }).limit(10);
    return res.status(200).json({
      recentRecords: recentRecords,
    });
  } catch (error) {
    console.error("Error fetching recent records:", error);
    return res.status(500).json({ error: "Failed to fetch recent records" });
  }
}
module.exports = {
  getSummary,
  getAllCategorySummary,
  getCategorySummary,
  getTrends,
  getRecentRecords
};
