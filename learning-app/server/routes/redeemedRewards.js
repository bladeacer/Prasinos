const express = require("express");
const { RedeemedReward } = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Received POST request with data:", req.body);
  try {
    const newReward = await RedeemedReward.create(req.body);
    res.status(201).json(newReward);
  } catch (error) {
    console.error(
      "Error creating redeemed reward:",
      error.message,
      error.stack
    );
    res.status(500).json({ error: "Failed to create redeemed reward" });
  }
});

module.exports = router;
