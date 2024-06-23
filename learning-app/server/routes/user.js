const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Reward } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");
require("dotenv").config();

router.post("/register", async (req, res) => {
  let data = req.body;

  // Validate request body
  let validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "name only allow letters, spaces and characters: ' - , ."
      ),
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
        "password at least 1 letter and 1 number"
      ),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data
    // Check email
    let user = await User.findOne({
      where: { email: data.email },
    });
    if (user) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);

    // Create user
    let result = await User.create(data);
    res.json({
      message: `Email ${result.email} was registered successfully.`,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.post("/login", async (req, res) => {
  let data = req.body;

  // Validate request body
  let validationSchema = yup.object({
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
        "password at least 1 letter and 1 number"
      ),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data
    // Check email and password
    let errorMsg = "Email or password is not correct.";
    let user = await User.findOne({
      where: { email: data.email },
    });
    if (!user) {
      res.status(400).json({ message: errorMsg });
      return;
    }
    let match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      res.status(400).json({ message: errorMsg });
      return;
    }
    // Return user info
    let userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });
    res.json({
      accessToken: accessToken,
      user: userInfo,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/auth", validateToken, (req, res) => {
  let userInfo = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  };
  res.json({
    user: userInfo,
  });
});

router.get("/user-rewards/:userid", validateToken, async (req, res) => {
  let userId = req.params.userid;

  try {
    let user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "points", "tier"],
      include: [
        {
          model: Reward,
          as: "rewards", // Ensure this alias matches the one in User model association
          attributes: ["id", "name", "points_needed", "tier_required"],
        },
      ],
    });

    // Check if user is not found
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

router.put("/user-rewards/:userid", async (req, res) => {
  const userId = req.params.userid;
  const { points, tier } = req.body;

  // Validate tier value
  if (tier > 3 || tier < 0) {
    return res.status(400).json({ message: "Tier must be between 0 and 3." });
  }

  try {
    // Find user by id
    let user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user's points and tier
    user.points = points;
    user.tier = tier;
    await user.save();

    res.json({ message: "User data updated successfully.", user });
  } catch (err) {
    console.error("Error updating user data:", err);
    res
      .status(500)
      .json({ message: "Failed to update user data.", error: err.message });
  }
});

module.exports = router;
