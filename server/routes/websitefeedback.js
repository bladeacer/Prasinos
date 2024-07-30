// Branden
const express = require('express');
const router = express.Router();
const { WebsiteFeedback } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

// Validation Schema
const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required('Full Name is required'),
    email: yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
    reporttype: yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback'], 'Invalid report type').required('Purpose of report is required'),
    elaboration: yup.string().trim().min(3).max(500).required('Elaboration is required')
});

const statusSchema = yup.object({
    status: yup.string().oneOf(['Pending', 'In Progress', 'Resolved'], 'Invalid status').required('Status is required')
});

router.post("/", async (req, res) => {
    let data = req.body;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await WebsiteFeedback.create(data);
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
            { id: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { reporttype: { [Op.like]: `%${search}%` } },
            { elaboration: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await WebsiteFeedback.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let websitefeedback = await WebsiteFeedback.findByPk(id);
    if (!websitefeedback) {
        res.sendStatus(404);
        return;
    }
    res.json(websitefeedback);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let websitefeedback = await WebsiteFeedback.findByPk(id);
    if (!websitefeedback) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await WebsiteFeedback.update(data, {
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

router.patch("/:id/status", async (req, res) => {
    let id = req.params.id;
    let websitefeedback = await WebsiteFeedback.findByPk(id);
    if (!websitefeedback) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    try {
        data = await statusSchema.validate(data, { abortEarly: false });
        let num = await WebsiteFeedback.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({ message: "Status was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update status with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await WebsiteFeedback.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({ message: "Event Feedback was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete Event Feedback with id ${id}.` });
    }
});

module.exports = router;
