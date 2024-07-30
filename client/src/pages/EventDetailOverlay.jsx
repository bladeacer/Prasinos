// Manveer
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';

const EventDetailOverlay = ({ event, onClose }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get(`/events/${event.id}/bookings`)
            .then(response => setBookings(response.data))
            .catch(error => console.error('Error fetching bookings:', error));
    }, [event.id]);

    const handleDeleteBooking = (bookingId) => {
        axios.delete(`/bookings/${bookingId}`)
            .then(() => {
                setBookings(prev => prev.filter(booking => booking.id !== bookingId));
                alert('Booking deleted successfully');
            })
            .catch(error => console.error('Error deleting booking:', error));
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {event.name}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Venue: {event.venue}
                </Typography>
                {bookings.map(booking => (
                    <Box key={booking.id}>
                        <Typography>{booking.user.firstName} {booking.user.lastName} - {booking.pax} Pax</Typography>
                        <Button onClick={() => handleDeleteBooking(booking.id)}>Delete</Button>
                    </Box>
                ))}
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default EventDetailOverlay;
