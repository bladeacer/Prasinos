const express = require('express');
const router = express.Router();
const { Event, User } = require('../models');
const { validateToken } = require('../middlewares/auth');
const yup = require('yup');
const { Op } = require('sequelize');

// POST /events - Create a new event
router.post("/events", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;

    const validationSchema = yup.object().shape({
        eventName: yup.string().trim().min(3).max(100).required(),
        eventDescription: yup.string().trim().min(3).max(900).required(),
        eventLocation: yup.string().trim().required(),
        eventStartDate: yup.string().trim().required(),
        eventEndDate: yup.string().trim().required(),
        eventStartTime: yup.string().trim().required(),
        eventEndTime: yup.string().trim().required(),
        eventActivity: yup.string().trim().required(),
        otherEventActivity: yup.string().notRequired(),
        eventOrganizerType: yup.string().trim().required(),
        eventOrganizerName: yup.string().trim().required(),
        eventScope: yup.string().trim().required(),
        expectedAttendance: yup.number().positive().integer().required(),
        consentApproved: yup.boolean().oneOf([true], 'Consent approval is required').required(),
        termsApproved: yup.boolean().oneOf([true], 'Terms approval is required').required(),
        eventImage: yup.string().trim().optional(),
        supportingDocs: yup.mixed().optional(),
        fundingRequests: yup.mixed().optional()
    });

    try {
        console.log("Data before validation:", data);
        data = await validationSchema.validate(data, { abortEarly: false });
        console.log("Data after validation:", data);

        let result = await Event.create(data);
        console.log('Database insert result:', result); // Debug log
        res.status(201).json(result);
    } catch (err) {
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeDatabaseError') {
            console.error('Sequelize error:', err); // Log Sequelize errors
            res.status(500).json({ message: 'Database error', error: err.message });
        } else {
            console.error('Validation errors:', err.errors);
            res.status(400).json({ message: 'Failed to create event', errors: err.errors });
        }
    }
});

// GET /events - Retrieve all events
router.get('/', async (req, res) => {
    const { search } = req.query;
    let whereCondition = {};

    // If search query is provided, construct the where condition
    if (search) {
        whereCondition = {
            [Op.or]: [
                { eventName: { [Op.like]: `%${search}%` } }, // Case-insensitive search for event name
                { eventOrganizerName: { [Op.like]: `%${search}%` } } // Case-insensitive search for organizer name
            ]
        };
    }

    try {
        let events = await Event.findAll({
            where: whereCondition,
            include: { model: User, as: "user", attributes: ['name'] }
        });
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch events', error: err.message });
    }
});

// GET /events/:id - Retrieve a specific event by ID
router.get("/:id", async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await Event.findByPk(eventId, {
            include: { model: User, as: "user", attributes: ['name'] }
        });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /events/:id - Update an event by ID
router.put("/:id", validateToken, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;
    let data = req.body;

    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        if (event.userId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const validationSchema = yup.object({
            title: yup.string().trim().min(3).max(100),
            description: yup.string().trim().min(3).max(500)
            // Add more fields here as per your Event model
        });

        data = await validationSchema.validate(data, { abortEarly: false });

        await Event.update(data, {
            where: { id: eventId }
        });

        res.json({ message: 'Event updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /events/:id - Delete an event by ID
router.delete("/:id", validateToken, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        if (event.userId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await Event.destroy({
            where: { id: eventId }
        });

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
