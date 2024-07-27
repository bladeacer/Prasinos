const { User, Reward } = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middlewares/auth");

const yup = require("yup");
const express = require("express");
const router = express.Router();

router.post("/", validateToken, async (req, res) => {
  const data = req.body;
  data.userId = req.user.id;

  const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    points_needed: yup.number().integer().positive().required(),
    tier_required: yup.string().oneOf(["Bronze", "Silver", "Gold"]).required(),
  });

  try {
    const validatedData = await validationSchema.validate(data, {
      abortEarly: false,
    });
    const result = await Reward.create(validatedData);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/", async (req, res) => {
  const search = req.query.search;
  const condition = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { points_needed: { [Op.like]: `%${search}%` } },
          { tier_required: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  try {
    const list = await Reward.findAll({
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

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const reward = await Reward.findByPk(id, {
      include: { model: User, as: "user", attributes: ["name"] },
    });

    if (!reward) {
      return res.sendStatus(404);
    }

    res.json(reward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    points_needed: yup.number().integer().positive().required(),
    tier_required: yup.string().oneOf(["Bronze", "Silver", "Gold"]).required(),
    imageFile: yup.string().nullable(),
  });

  try {
    await validationSchema.validate(data);

    const reward = await Reward.findByPk(id);
    if (!reward) {
      return res.sendStatus(404);
    }

    await reward.update(data);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating reward:", error);
    res.sendStatus(500);
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const reward = await Reward.findByPk(id);
    if (!reward) {
      return res.sendStatus(404);
    }

    const userId = req.user.id;
    if (reward.userId !== userId) {
      return res.sendStatus(403);
    }

    const num = await Reward.destroy({ where: { id } });
    if (num === 1) {
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
