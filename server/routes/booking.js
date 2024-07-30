const express = require('express');
const router = express.Router();
const { User, Booking, Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    const { firstName, lastName, email, phoneNumber, eventId, userId } = req.body;

    try {
        // Validation to ensure the event and user exist
        const event = await Event.findByPk(eventId);
        const user = await User.findByPk(userId);
        if (!event || !user) {
            return res.status(404).json({ message: "Event or User not found" });
        }

        // Create booking
        const newBooking = await Booking.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            dateTimeBooked: new Date(), // Current date and time
            eventId,
            userId
        });

        // Log and respond
        console.log('Booking created successfully:', newBooking);
        res.status(201).json(newBooking); // Send the created booking as a response

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ message: "Error creating booking", errors: error.errors || error.message });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let eventId = req.query.eventId;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    if (eventId) {
        condition.eventId = eventId;
    }

    let list = await Booking.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: [
            { model: User, as: "user", attributes: ['name'] },
            { model: Event, as: "event", attributes: ['eventName'] }
        ]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let booking = await Booking.findByPk(id, {
        include: [
            { model: User, as: "user", attributes: ['name'] },
            { model: Event, as: "event", attributes: ['eventName'] }
        ]
    });

    // Check id not found
    if (!booking) {
        res.sendStatus(404);
        return;
    }
    res.json(booking);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let booking = await Booking.findByPk(id);
    if (!booking) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (booking.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500),
        pax: yup.number(),
        date: yup.date(),
        time: yup.string().trim()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Booking.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Booking was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update booking with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let booking = await Booking.findByPk(id);
    if (!booking) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (booking.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Booking.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Booking was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete booking with id ${id}.`
        });
    }
});

module.exports = router;