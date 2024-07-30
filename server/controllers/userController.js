// Jun Long
const { User } = require("../models");

// Get user points by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (user) {
      res.json({ points: user.points });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user points
const updateUserPoints = async (req, res) => {
  try {
    const userId = req.params.id;
    const { points } = req.body;
    const user = await User.findByPk(userId);
    if (user) {
      user.points = points;
      await user.save();
      res.json({ message: "Points updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserById, updateUserPoints };
