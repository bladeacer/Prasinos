import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';

const BookEventPage = () => {
    const { id } = useParams();     // Retrieve ID from URL Params
    const navigate = useNavigate(); // Use Navigate for redirection 
    
    const [eventDetails, setEventDetails] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pax: '',
        phoneNumber: '',
        bookingDateTime: dayjs().format('YYYY-MM-DD HH:mm'),    // Current date and time
    });

    useEffect(() => {
        // Fetch event details based on the id
        http.get(`/events/${id}`).then(response => {
            setEventDetails(response.data);
        }).catch(error => {
            console.error("Error fetching event details", error);
        });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (Object.values(formData).some(field => field === '')) {
            alert('Please fill in all required fields.');
            return;
        }

        if (eventDetails.entryFee > 0) {
            navigate('/payment', { state: { ...formData, event: eventDetails } });
        } else {
            http.post('/booking', { ...formData, eventId: eventDetails.id }).then(() => {
                navigate('/booking-success', { state: { ...formData, event: eventDetails } });
            }).catch(error => {
                console.error("Error creating booking", error);
            });
        }
    };

    if (!eventDetails) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                BOOK EVENT: {eventDetails.eventName}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Event Details
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Date: {dayjs(eventDetails.date).format(global.dateFormat)}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Time: {eventDetails.time}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Venue: {eventDetails.venue}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Entry Fee: ${eventDetails.entryFee}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Ref Code: {eventDetails.refCode}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Description: {eventDetails.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <TextField fullWidth id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} sx={{ mt: 2 }} />
                        <TextField fullWidth id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} sx={{ mt: 2 }} />
                        <TextField fullWidth id="email" name="email" label="Email" value={formData.email} onChange={handleChange} sx={{ mt: 2 }} />
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="pax-label">Number of Pax</InputLabel>
                            <Select labelId="pax-label" id="pax" name="pax" value={formData.pax} onChange={handleChange} label="Number of Pax">
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField fullWidth id="phoneNumber" name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} sx={{ mt: 2 }} />
                        <TextField fullWidth disabled id="bookingDateTime" name="bookingDateTime" label="Booking Date and Time" value={formData.bookingDateTime} sx={{ mt: 2 }} />
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
                <Button variant="contained" onClick={() => navigate(-1)}>
                    Back
                </Button>
                <Button variant="contained" onClick={handleFormSubmit} color="primary">
                    Register Now
                </Button>
            </Box>
        </Box>
    );
};

export default BookEventPage;
