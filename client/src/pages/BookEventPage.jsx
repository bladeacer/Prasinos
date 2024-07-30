import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import dayjs from 'dayjs';
import global from '../global';

const BookEventPage = () => {
    const { id } = useParams();     // Retrieve ID from URL Params
    const { user } = useContext(UserContext);
    const navigate = useNavigate(); // Use Navigate for redirection 

    const [eventDetails, setEventDetails] = useState(null);
    const [formData, setFormData] = useState({
        pax: 1,
        attendees: [
            { firstName: '', lastName: '', email: '', phoneNumber: '' } // Primary Attendee
        ],
        additionalAttendees: [],
        bookingDateTime: dayjs().format('YYYY-MM-DD HH:mm'),    // Current date and time
    });

    useEffect(() => {
        // Fetch event details based on the id
        http.get(`/event/${id}`).then(response => {
            setEventDetails(response.data);
        }).catch(error => {
            console.error("Error fetching event details", error);
        });
    }, [id]);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const bookingData = {
            firstName: formData.attendees[0].firstName,
            lastName: formData.attendees[0].lastName,
            email: formData.attendees[0].email,
            phoneNumber: formData.attendees[0].phoneNumber,
            eventId: eventDetails.id,
            userId: user.id, // Ensure this is sourced from session or global state
        };

        http.post('/booking', bookingData)
            .then((response) => {
                navigate('/booking-success', { state: { ...formData, event: eventDetails } });
            })
            .catch((error) => {
                console.error("Error creating booking", error);
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaxChange = (event) => {
        const pax = parseInt(event.target.value, 10);
        const attendees = [...formData.attendees];
        while (attendees.length < pax) {
            attendees.push({ firstName: '', lastName: '', email: '', phoneNumber: '' });
        }
        while (attendees.length > pax) {
            attendees.pop();
        }
        setFormData({ ...formData, pax, attendees });
    };

    const handleAttendeeChange = (index, field, value) => {
        const attendees = [...formData.attendees];
        attendees[index][field] = value;
        setFormData({ ...formData, attendees });
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
                                Start Date: {dayjs(eventDetails.eventStartDate).format(`YYYY-MM-DD`)}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                End Date: {dayjs(eventDetails.eventEndDate).format(`YYYY-MM-DD`)}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Start Time: {eventDetails.eventStartTime}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                End Time: {eventDetails.eventEndTime}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Venue: {eventDetails.eventLocation}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Entry Fee: ${eventDetails.participationFee}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Ref Code: {eventDetails.id}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Organizer: {eventDetails.eventOrganizerName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Event Description: {eventDetails.eventDescription}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        {formData.attendees.map((attendee, index) => (
                            <Box key={index} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    id={`firstName-${index}`}
                                    name={`firstName-${index}`}
                                    label={`Attendee First Name`}
                                    value={attendee.firstName}
                                    onChange={(e) => handleAttendeeChange(index, 'firstName', e.target.value)}
                                    sx={{ mt: 1 }}
                                />
                                <TextField
                                    fullWidth
                                    id={`lastName-${index}`}
                                    name={`lastName-${index}`}
                                    label={`Attendee Last Name`}
                                    value={attendee.lastName}
                                    onChange={(e) => handleAttendeeChange(index, 'lastName', e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    id={`email-${index}`}
                                    name={`email-${index}`}
                                    label={`Attendee Email`}
                                    value={attendee.email}
                                    onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    id={`phoneNumber-${index}`}
                                    name={`phoneNumber-${index}`}
                                    label={`Attendee Phone Number`}
                                    value={attendee.phoneNumber}
                                    onChange={(e) => handleAttendeeChange(index, 'phoneNumber', e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        ))}
                        <TextField
                            fullWidth
                            disabled
                            id="bookingDateTime"
                            name="bookingDateTime"
                            label="Booking Date and Time"
                            value={formData.bookingDateTime}
                            sx={{ mt: 2 }}
                        />
                        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Button variant="contained" onClick={() => navigate(-1)}>
                                Back
                            </Button>
                            <Button variant="contained" onClick={handleFormSubmit} color="primary">
                                Register Now
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
};

export default BookEventPage;
