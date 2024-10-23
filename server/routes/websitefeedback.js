const express = require('express');
const router = express.Router();
const { WebsiteFeedback } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

// Validation Schema
const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required('Full Name is required'),
    email: yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
    reporttype: yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback', 'Frequently Asked Questions'], 'Invalid report type').required('Purpose of report is required'),
    elaboration: yup.string().trim().min(3).max(500).required('Elaboration is required')
});

const statusSchema = yup.object({
    status: yup.string().oneOf(['Pending', 'In Progress', 'Resolved'], 'Invalid status').required('Status is required'),
});

const staffIdSchema = yup.object({
    staffId: yup.number().integer().required('Staff ID is required') // Add adminId validation
});

router.post("/", async (req, res) => {
    let data = req.body;
    console.log("Received data:", data);
    try {
        // Validate the data against the schema
        data = await validationSchema.validate(data, { abortEarly: false });
        
        // Attempt to create a new entry in the WebsiteFeedback model
        let result = await WebsiteFeedback.create(data); // Ensure `userId` is included here
        
        // Send the successful result as a JSON response
        res.json(result);
    } catch (err) {
        // Detailed error handling
        if (err.name === "ValidationError") {
            // Extract and format validation errors
            const validationErrors = err.inner.map(error => ({
                field: error.path,
                message: error.message,
                value: error.value
            }));

            // Respond with a 400 status and detailed validation errors
            res.status(400).json({
                status: "error",
                message: "Validation failed. Please correct the following errors and try again.",
                errors: validationErrors
            });
        } else {
            // Log the error for debugging purposes
            console.error("An unexpected error occurred:", err);

            // Respond with a generic 500 status and a detailed message
            res.status(500).json({
                status: "error",
                message: "An unexpected error occurred. Please try again later or contact support if the issue persists.",
                error: err.message
            });
        }
    }
});



router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let userId = req.query.userId;

    if (userId) {
        condition.userId = userId;
    }

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
            res.json({ message: "Website Feedback was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update Website Feedback with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Modify this route to update both status and adminId, or just adminId if status is not provided
router.patch("/:id/status", async (req, res) => {
    let id = req.params.id;
    let websitefeedback = await WebsiteFeedback.findByPk(id);

    if (!websitefeedback) {
        return res.status(404).json({ error: `No feedback found with id ${id}.` });
    }

    let data = req.body;
    try {
        // Validate only if status is present in the request body
        if (data.status) {
            data = await statusSchema.validate(data, { abortEarly: false });
        } else if (data.staffId) {
            data = await staffIdSchema.validate(data, { abortEarly: false });
        }

        // Update only the provided fields (status, adminId)
        const [affectedRows] = await WebsiteFeedback.update(data, {
            where: { id: id }
        });

        if (affectedRows === 1) {
            res.json({ message: "Status and/or adminId were updated successfully." });
        } else if (affectedRows === 0) {
            res.status(400).json({ error: `No changes were made. Please ensure the data is correct and try again.` });
        } else {
            res.status(500).json({ error: `Unexpected error occurred while updating status/adminId with id ${id}.` });
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({
                error: 'Validation failed.',
                details: err.errors.map(e => e.message)  // Extract validation error messages
            });
        } else {
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred while processing your request.',
                details: err.message
            });
        }
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await WebsiteFeedback.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({ message: "Website Feedback was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete Website Feedback with id ${id}.` });
    }
});

module.exports = router;
