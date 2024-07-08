// reward.js (model)
module.exports = (sequelize, DataTypes) => {
  const Reward = sequelize.define(
    "Reward",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      points_needed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tier_required: {
        type: DataTypes.ENUM,
        values: ["Bronze", "Silver", "Gold"],
        allowNull: false,
      },
      imageFile: {
        type: DataTypes.STRING(20),
      },
    },
    {
      tableName: "rewards",
    }
  );

  Reward.associate = (models) => {
    Reward.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Reward;
};

// reward.js (route)
const { User, Reward } = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middlewares/auth");

const yup = require("yup");
const express = require("express");
const router = express.Router();

// Create a reward
router.post("/", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;

  // Validate request body
  let validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    points_needed: yup.number().integer().positive().required(),
    tier_required: yup.string().oneOf(["Bronze", "Silver", "Gold"]).required(),
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

// Get all rewards
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

  try {
    let list = await Reward.findAll({
      where: condition,
      order: [["createdAt", "DESC"]],
      include: { model: User, as: "user", attributes: ["name"] },
    });

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a single reward by id
router.get("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let reward = await Reward.findByPk(id, {
      include: { model: User, as: "user", attributes: ["name"] },
    });

    if (!reward) {
      res.sendStatus(404);
      return;
    }

    res.json(reward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a reward by id
router.put("/:id", validateToken, async (req, res) => {
  let id = req.params.id;

  try {
    // Check reward exists
    let reward = await Reward.findByPk(id);
    if (!reward) {
      res.sendStatus(404);
      return;
    }

    // Check request user id
    let userId = req.user.id;
    if (reward.userId !== userId) {
      res.sendStatus(403);
      return;
    }

    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
      name: yup.string().trim().min(3).max(100).required(),
      description: yup.string().trim().min(3).max(500).required(),
      points_needed: yup.number().integer().positive().required(),
      tier_required: yup
        .string()
        .oneOf(["Bronze", "Silver", "Gold"])
        .required(),
    });

    data = await validationSchema.validate(data, { abortEarly: false });

    // Process valid data
    let num = await Reward.update(data, { where: { id: id } });

    if (num == 1) {
      res.json({ message: "Reward was updated successfully." });
    } else {
      res.status(400).json({ message: `Cannot update reward with id ${id}.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a reward by id
router.delete("/:id", validateToken, async (req, res) => {
  let id = req.params.id;

  try {
    // Check reward exists
    let reward = await Reward.findByPk(id);
    if (!reward) {
      res.sendStatus(404);
      return;
    }

    // Check request user id
    let userId = req.user.id;
    if (reward.userId !== userId) {
      res.sendStatus(403);
      return;
    }

    let num = await Reward.destroy({ where: { id: id } });

    if (num == 1) {
      res.json({ message: "Reward was deleted successfully." });
    } else {
      res.status(400).json({ message: `Cannot delete reward with id ${id}.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
