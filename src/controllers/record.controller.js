const recordModel = require("../models/record.model");

async function createRecord(req, res) {
  try {
    const { amount, type, category, date, note } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const record = await recordModel.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user._id,
    });

    return res
      .status(201)
      .json({ message: "Record created successfully", record });
  } catch (error) {
    console.error("Error creating record:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getRecords(req, res) {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const totalRecords = await recordModel.countDocuments(filter);
    const records = await recordModel
      .find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      totalRecords,
      records,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getRecordById(req, res) {
  try {
    const { id } = req.params;

    const record = await recordModel.findOne({ _id: id, isDeleted: false });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ record });
  } catch (error) {
    console.log("Error fetching record by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateRecord(req, res) {
  // Implementation for updating a record
  try {
    const { amount, type, category, date, note } = req.body;

    if (type && !["income", "expense"].includes(type)) {
      return res.status(400).json({
        error: "Invalid type. Must be 'income' or 'expense'.",
      });
    }

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive number.",
      });
    }

    const updateFields = {};

    if (amount !== undefined) updateFields.amount = amount;
    if (type) updateFields.type = type;
    if (category) updateFields.category = category;
    if (date) updateFields.date = date;
    if (note) updateFields.note = note;

    const updatedRecord = await recordModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({
      message: "Record updated successfully",
      record: updatedRecord,
    });
  } catch (error) {
    console.log("Error while updating record: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteRecord(req, res) {
  try {
    const deletedRecord = await recordModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true },
    );

    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.log("Error while deleting record: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
