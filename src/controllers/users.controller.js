const userModel = require("../models/user.model");

async function getAllUsers(req, res) {
  try {
    const users = await userModel.find({}).select("-password -__v ");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
}

async function getUserById(req, res) {
  try {
    const user = await userModel.findById(req.params.id).select("-password -__v ");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
};
