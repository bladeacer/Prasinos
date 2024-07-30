// Branden
const express = require('express');
const router = express.Router();
const { User, EventFeedback } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Validation Schema
const validationSchema = yup.object({
    comment: yup.string().trim().min(3).max(500).required('Comment is required'),
    rating: yup.number().min(0).max(5).required('Rating is required')
});

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await EventFeedback.create(data);
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
            { comment: { [Op.like]: `%${search}%` } },
            { rating: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await EventFeedback.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let eventfeedback = await EventFeedback.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    if (!eventfeedback) {
        res.sendStatus(404);
        return;
    }
    res.json(eventfeedback);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let eventfeedback = await EventFeedback.findByPk(id);
    if (!eventfeedback) {
        res.sendStatus(404);
        return;
    }
    // Check request user id
    let userId = req.user.id;
    if (eventfeedback.userId != userId) {
        res.sendStatus(403);
        return;
    }
    let data = req.body;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await EventFeedback.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({ message: "Event Feedback was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update Event Feedback with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await EventFeedback.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({ message: "Event Feedback was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete Event Feedback with id ${id}.` });
    }
});

module.exports = router;
