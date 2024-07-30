const express = require("express");
const { RedeemedRewards } = require("../models");
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`GET request received for userId: ${userId}`);
  try {
    const redeemedRewards = await RedeemedRewards.findAll({
      where: { userId },
      order: [["timeRedeemed", "DESC"]],
    });
    res.status(200).json(redeemedRewards);
  } catch (error) {
    console.error(
      "Error fetching redeemed rewards:",
      error.message,
      error.stack
    );
    res.status(500).json({ error: "Failed to fetch redeemed rewards" });
  }
});

router.post("/", async (req, res) => {
  console.log("POST request received with data:", req.body);
  try {
    const newReward = await RedeemedRewards.create(req.body);
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
