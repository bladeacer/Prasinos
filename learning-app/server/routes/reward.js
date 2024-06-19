const { User, Reward } = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middlewares/auth");

const yup = require("yup");
const express = require("express");
const router = express.Router();

router.post("/", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;

  // Validate request body
  let validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    points_needed: yup.number().integer().positive().required(),
    tier_required: yup.number().integer().positive().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data
    let result = await Reward.create(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { points_needed: { [Op.like]: `%${search}%` } },
      { tier_required: { [Op.like]: `%${search}%` } },
    ];
  }
  // You can add condition for other columns here
  // e.g. condition.columnName = value;
  let list = await Reward.findAll({
    where: condition,
    order: [["createdAt", "DESC"]],
    include: { model: User, as: "user", attributes: ["name"] },
  });
  res.json(list);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let reward = await Reward.findByPk(id, {
    include: { model: User, as: "user", attributes: ["name"] },
  });
  // Check id not found
  if (!reward) {
    res.sendStatus(404);
    return;
  }
  res.json(reward);
});

router.put("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let reward = await Reward.findByPk(id);
  if (!reward) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (reward.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    points_needed: yup.number().integer().positive().required(),
    tier_required: yup.number().integer().positive().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
  let num = await Reward.update(data, {
    where: { id: id },
  });
  if (num == 1) {
    res.json({
      message: "Reward was updated successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot update reward with id ${id}.`,
    });
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let reward = await Reward.findByPk(id);
  if (!reward) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (reward.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let num = await Reward.destroy({
    where: { id: id },
  });
  if (num == 1) {
    res.json({
      message: "Reward was deleted successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot delete reward with id ${id}.`,
    });
  }
});

module.exports = router;
