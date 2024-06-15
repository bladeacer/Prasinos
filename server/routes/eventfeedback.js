const express = require('express');
const router = express.Router();
const { EventFeedback } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        comment: yup.string().trim().min(3).max(500).required('Comment is required'),
        feedback: yup.string().trim().min(3).max(500).required('Feedback is required')
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let result = await EventFeedback.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { comment: { [Op.like]: `%${search}%` } },
            { feedback: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await EventFeedback.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let eventfeedback = await EventFeedback.findByPk(id);
    // Check id not found
    if (!eventfeedback) {
        res.sendStatus(404);
        return;
    }
    res.json(eventfeedback);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let eventfeedback = await EventFeedback.findByPk(id);
    if (!eventfeedback) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        comment: yup.string().trim().min(3).max(500),
        feedback: yup.string().trim().min(3).max(500)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let num = await EventFeedback.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event Feedback was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Event Feedback with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await EventFeedback.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Event Feedback was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Event Feedback with id ${id}.`
        });
    }
});

module.exports = router;