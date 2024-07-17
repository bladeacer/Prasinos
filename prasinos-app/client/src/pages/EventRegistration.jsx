import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import http from '../http';

function EventRegistration({ event }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        pax: 1
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (event.entryFee > 0) {
            // Navigate to the payment page with the form data and event details
            navigate('/payment', { state: { ...formData, event } });
        } else {
            // Directly add the booking to the database for free events
            http.post('/booking', { ...formData, eventId: event.id }).then(() => {
                navigate('/booking-success', { state: { ...formData, event } });
            }).catch(error => {
                console.error("Error creating booking", error);
            });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Register for {event.eventName}
            </Typography>
            <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Number of Pax" name="pax" type="number" value={formData.pax} onChange={handleChange} fullWidth margin="dense" />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Register</Button>
        </Box>
    );
}

export default EventRegistration;
