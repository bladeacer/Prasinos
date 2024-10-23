const express = require('express');
const router = express.Router();
const { Booking, User, Event } = require('../models');

// Route to get users who booked a specific event
router.get('/:id', async (req, res) => {
    try {
        console.log(req.params);
        const eventId = req.params.id;
        const bookings = await Booking.findAll({
            where: { eventId },
            include: { model: User, as: "user", attributes: ['name'] }
        });
        if (!bookings || bookings.length === 0) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(bookings);
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
});

// Route to update a user's booking for a specific event
router.put('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const attendanceJson = req.body;

        console.log('Received attendance data:', attendanceJson); // Log the received data

        // Ensure attendanceJson is an array
        if (!Array.isArray(attendanceJson)) {
            console.error('Attendance data is not an array'); // Log the error
            return res.status(400).json({ error: 'Attendance data should be an array' });
        }

        // Iterate over the attendanceJson array
        for (const attendance of attendanceJson) {
            const { date, id, present } = attendance;

            // Validate required fields
            if (!date || !id) {
                console.error('Missing date or userId:', attendance); // Log the error
                return res.status(400).json({ error: 'Date and userId are required' });
            }

            // Find the booking by eventId and userId
            const booking = await Booking.findOne({
                where: { eventId, id }
            });

            console.log('Found booking:', booking); // Log the booking

            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            } else {
                if (present) {
                    // Add or update attendance record
                    if (Array.isArray(booking.attendance)) {
                        if (!booking.attendance.some(existingAttendance =>
                            existingAttendance.date === attendance.date && existingAttendance.id === attendance.id)) {
                            booking.attendance.push(attendance);
                        }
                    } else if (booking.attendance) {
                        booking.attendance = [booking.attendance, attendance];
                    } else {
                        booking.attendance = [attendance];
                    }
                } else {
                    // Remove attendance record
                    if (Array.isArray(booking.attendance)) {
                        booking.attendance = booking.attendance.filter(existingAttendance =>
                            !(existingAttendance.date === attendance.date && existingAttendance.id === attendance.id));
                    }
                }

                try {
                    console.log('Updated attendance:', booking.attendance);
                    await Booking.update(
                        { attendance: booking.attendance },
                        { where: { id: booking.id } }
                    );
                    console.log('Attendance saved successfully.');
                } catch (error) {
                    console.error('Error saving attendance:', error);
                }
            }
        }

        res.json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Failed to update attendance:', error); // Log the error
        res.status(500).json({ error: 'Failed to update attendance' });
    }
});


module.exports = router;