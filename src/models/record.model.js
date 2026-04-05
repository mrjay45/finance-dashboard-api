const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"],
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Type is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["salary", "freelance", "investment", "food", "transportation", "entertainment", "utilities", "healthcare", "delivery", "deal","other", "groceries", "rent","tax", "decoration"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  note: {
    type: String,
    trim: true,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by is required"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt:{
    type: Date,
    default: null
  }
}, {
    timestamps: true,
});

const recordModel = mongoose.model("record", recordSchema);

module.exports = recordModel;
