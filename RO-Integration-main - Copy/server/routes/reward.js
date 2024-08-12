const { User, Reward } = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middlewares/auth");

const yup = require("yup");
const express = require("express");
const router = express.Router();

router.post("/", validateToken, async (req, res) => {
  const data = req.body;
  data.staffId = req.user.id;
  console.log("Data received:", data);

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

    validatedData.isDeleted = false;

    const result = await Reward.create(validatedData);
    res.json(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error('Validation Error:', {
        message: err.message,
        errors: err.errors,
        path: err.path,
        value: err.value,
      });
      res.status(400).json({
        message: 'Validation failed',
        errors: err.errors,
        details: {
          message: err.message,
          path: err.path,
          value: err.value,
        },
      });
    } else {
      console.error('Unexpected Error:', err);
      res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
    }
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
    const conditions = {
      ...condition,
      isDeleted: false,
    };

    console.log("Conditions used for query:", conditions);

    // Ensure associations are defined properly in your models
    const list = await Reward.findAll({
      where: conditions,
      attributes: [
        "id",
        "name",
        "description",
        "imageFile",
        "points_needed",
        "tier_required",
        "staffId",
        "isDeleted",
        "createdAt",
        "updatedAt"
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Query result:", list);

    if (list.length === 0) {
      console.log("No rewards found matching the criteria.");
    }

    res.json(list);
  } catch (error) {
    console.error("Error fetching rewards:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});



router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const reward = await Reward.findByPk(id, {
      attributes: [
        'id',
        'name',
        'description',
        'points_needed',
        'tier_required',
        'imageFile',
        'staffId',
        'createdAt',
        'updatedAt',
        'isDeleted'
      ]
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

    const reward = await Reward.findByPk(id, {
      attributes: [
        'id',
        'name',
        'description',
        'points_needed',
        'tier_required',
        'imageFile',
        'staffId',
        'createdAt',
        'updatedAt',
        'isDeleted'
      ]
    });

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

// Example middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    console.log("User is not an admin. Forbidden.");
    res.sendStatus(403);
  }
};

// DELETE route for reward deletion
router.delete("/:id", (req, res, next) => {
  console.log("DELETE request received for reward with ID:", req.params.id);
  next();
}, validateToken, isAdmin, async (req, res) => {
  const id = req.params.id;

  console.log("DELETE request processing for reward with ID:", id);

  try {
    const reward = await Reward.findByPk(id, {
      attributes: [
        'id',
        'name',
        'description',
        'points_needed',
        'tier_required',
        'imageFile',
        'staffId',
        'createdAt',
        'updatedAt',
        'isDeleted'
      ]
    });
    if (!reward) {
      console.log(`Reward with ID ${id} not found.`);
      return res.sendStatus(404);
    }

    // Mark the reward as deleted
    const rewards = await Reward.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'description',
        'points_needed',
        'tier_required',
        'imageFile',
        'staffId',
        'createdAt',
        'updatedAt',
        'isDeleted'
      ]
    });

    if (rewards) {
        rewards.isDeleted = true;
        await rewards.save();
        console.log(`Reward with ID ${id} was soft deleted successfully.`);
        res.json({ message: "Reward was soft deleted successfully." });
    } else {
        console.log(`No Reward found with ID ${id}.`);
        res.status(404).json({ message: "Reward not found." });
    }
    

  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
