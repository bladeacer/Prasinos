const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Reward } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");
const {
  getUserById,
  updateUserPoints,
} = require("../controllers/userController");
require("dotenv").config();

router.post("/register", async (req, res) => {
  const data = req.body;

  const validationSchema = yup.object({
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
    phoneNumber: yup.string().trim().required('Phone number is required'),
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
    const validatedData = await validationSchema.validate(data, {
      abortEarly: false,
    });

    const existingUser = await User.findOne({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    validatedData.password = await bcrypt.hash(validatedData.password, 10);

    const newUser = await User.create(validatedData);
    res.json({
      message: `Email ${newUser.email} was registered successfully.`,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.post("/login", async (req, res) => {
  const data = req.body;

  const validationSchema = yup.object({
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
    const validatedData = await validationSchema.validate(data, {
      abortEarly: false,
    });

    const user = await User.findOne({ where: { email: validatedData.email } });
    if (
      !user ||
      !(await bcrypt.compare(validatedData.password, user.password))
    ) {
      return res
        .status(400)
        .json({ message: "Email or password is not correct." });
    }

    const userInfo = { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber,};
    const accessToken = sign(userInfo, process.env.APP_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    res.json({ accessToken, user: userInfo });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/auth", validateToken, (req, res) => {
  const userInfo = {
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    phoneNumber: req.user.phoneNumber,
    role: req.user.role
  };
  res.json({ user: userInfo });
});

router.get("/user-rewards/:userid", validateToken, async (req, res) => {
  const userId = req.params.userid;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "points", "tier"],
      include: [
        {
          model: Reward,
          as: "rewards",
          attributes: ["id", "name", "points_needed", "tier_required"],
        },
      ],
    });

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

router.put("/user-rewards/:id", async (req, res) => {
  const userId = req.params.id;
  const { points, tier } = req.body; // Removed `setPoints`

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user's points with the provided value
    if (points !== undefined) {
      user.points = points; // Set points directly to the provided value
    }

    // Update tier if provided
    if (tier) {
      if (["Bronze", "Silver", "Gold"].includes(tier)) {
        user.tier = tier;
      } else {
        return res.status(400).json({ message: "Invalid tier value." });
      }
    }

    await user.save();

    res.json({ message: "User points updated successfully.", user });
  } catch (error) {
    console.error("Error updating user points:", error);
    res
      .status(500)
      .json({ message: "Error updating user points.", error: error.message });
  }
});

module.exports = router;
