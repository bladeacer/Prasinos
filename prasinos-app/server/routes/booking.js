const express = require("express");
const router = express.Router();
const { User, Booking, Event } = require("../models");
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require("../middlewares/auth");

router.post("/", validateToken, async (req, res) => {
    const { eventId, userId, attendees, pax, firstName, lastName, email, phoneNumber, dateTimeBooked } = req.body;

    try {
        // Validation to ensure the event and user exist
        const event = await Event.findByPk(eventId);
        const user = await User.findByPk(userId);
        if (!event || !user) {
            return res.status(404).json({ message: "Event or User not found" });
        }

        // Determine if payment is required for the event
        const requiresPayment = event.participationFee > 0;
        const paymentStatus = requiresPayment ? 'unprocessed' : 'processed';

        // Create booking
        const newBooking = await Booking.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            dateTimeBooked: new Date(), // Current date and time
            eventId,
            userId,
            pax,
            attendees,
            requiresPayment,
            paymentStatus
        });

        // Log and respond
        console.log("Booking created successfully:", newBooking);
        res.status(201).json(newBooking); // Send the created booking as a response
    } catch (error) {
        console.error("Error creating booking:", error);
        res
            .status(400)
            .json({
                message: "Error creating booking",
                errors: error.errors || error.message,
            });
    }
});

router.get("/", validateToken, async (req, res) => {
    const search = req.query.search;

    try {
        let condition = {};

        if (search) {
            condition[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
            ];
        }

        const bookings = await Booking.findAll({
            where: condition,
            include: [
                { model: User, as: "user", attributes: ["name"] },
                { model: Event, as: "event", attributes: ["eventName", "participationFee", "eventDescription", "eventLocation", "eventStartDate", "eventEndDate", "eventStartTime", "eventEndTime", "eventOrganizerType", "eventOrganizerName", "eventScope", "eventActivity", "contactNumber", "email", "eventImage"] }
            ],
            order: [["dateTimeBooked", "DESC"]]
        });

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found." });
        }

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: `Error fetching bookings: ${error.message}` });
    }
});

router.get("/:id", async (req, res) => {
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: User, as: "user", attributes: ["name"] },
                { model: Event, as: "event", attributes: ["eventName", "participationFee", "eventDescription", "eventLocation", "eventStartDate", "eventEndDate", "eventStartTime", "eventEndTime", "eventOrganizerType", "eventOrganizerName", "eventScope", "eventActivity", "contactNumber", "email", "eventImage"] }
            ],
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", errors: error.errors || error.message });
    }
});

// Route to get all bookings for a specific user ID
router.get("/user/:userId", validateToken, async (req, res) => {
    const userId = parseInt(req.params.userId); // Get the user ID from the URL parameter

    try {
        // Ensure that the userId is valid and that the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all bookings for the specified user ID
        const bookings = await Booking.findAll({
            where: { userId: userId },
            include: [
                { model: Event, as: "event", attributes: ["eventName", "participationFee", "eventDescription", "eventLocation", "eventStartDate", "eventEndDate", "eventStartTime", "eventEndTime", "eventOrganizerType", "eventOrganizerName", "eventScope", "eventActivity", "contactNumber", "email", "eventImage"] }
            ],
            order: [["dateTimeBooked", "DESC"]]
        });

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: `Error fetching bookings: ${error.message}` });
    }
});

router.put("/:id", validateToken, async (req, res) => {
    const { firstName, lastName, email, phoneNumber, pax } = req.body;
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this booking" });
        }

        const updated = await Booking.update({ firstName, lastName, email, phoneNumber, pax }, {
            where: { id: bookingId }
        });

        if (updated[0]) {
            res.json({ message: "Booking updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update booking with id ${bookingId}` });
        }
    } catch (error) {
        res.status(400).json({ message: "Error updating booking", errors: error.errors || error.message });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: `Booking with id ${bookingId} not found.` });
        }

        if (booking.userId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this booking." });
        }

        const deleted = await Booking.destroy({ where: { id: bookingId } });

        if (deleted) {
            res.json({ message: "Booking deleted successfully." });
        } else {
            res.status(400).json({ message: `Cannot delete booking with id ${bookingId}.` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", errors: error.errors || error.message });
    }
});

module.exports = router;
