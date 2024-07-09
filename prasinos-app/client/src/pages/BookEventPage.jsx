import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import dayjs from 'dayjs';

const BookEventPage = () => {
    const { id } = useParams(); // Retrieve id from URL params
    const navigate = useNavigate(); // Use navigate for redirection

    // Sample event details - replace with actual data fetching logic
    const [eventDetails, setEventDetails] = useState({
        eventName: "Sample Event",
        date: "2024-07-01",
        time: "15:00",
        venue: "Sample Venue",
        entryFee: "$10",
        refCode: "ABC123",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imageUrl: "https://example.com/event-image.jpg",
    });

    useEffect(() => {
        // Fetch event details based on the id
        // Example: http.get(`/events/${id}`).then(response => setEventDetails(response.data));
    }, [id]);

    // Form state for user details
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        pax: '',
        country: '',
        phoneNumber: '',
        bookingDateTime: dayjs().format('YYYY-MM-DD HH:mm'), // Current date and time
    });

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Check for missing fields
        if (Object.values(formData).some(field => field === '')) {
            alert('Please fill in all required fields.');
            return;
        }

        // Implement your booking submission logic here
        console.log(formData); // Replace with actual submission code

        alert('Booking submitted successfully!');

        // Redirect to the payment page with the formData
        navigate('/payment', { state: formData });
        // history.push('/events'); // Replace with the appropriate route
    };

    // Sample list of countries/regions - replace with actual data fetching logic
    const countries = ['Country A', 'Country B', 'Country C'];

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
                                Date: {eventDetails.date}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Time: {eventDetails.time}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Venue: {eventDetails.venue}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Entry Fee: {eventDetails.entryFee}
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
                        <TextField
                            fullWidth
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="pax-label">Number of Pax</InputLabel>
                            <Select
                                labelId="pax-label"
                                id="pax"
                                name="pax"
                                value={formData.pax}
                                onChange={handleChange}
                                label="Number of Pax"
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                {/* Add more options as needed */}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="country-label">Country/Region</InputLabel>
                            <Select
                                labelId="country-label"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                label="Country/Region"
                            >
                                {countries.map((country, index) => (
                                    <MenuItem key={index} value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            id="phoneNumber"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            disabled
                            id="bookingDateTime"
                            name="bookingDateTime"
                            label="Booking Date and Time"
                            value={formData.bookingDateTime}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
                {/* <Button variant="contained" onClick={() => history.goBack()}>
                    Back
                </Button> */}
                <Button variant="contained" onClick={handleFormSubmit} color="primary">
                    Register Now
                </Button>
            </Box>
        </Box>
    );
};

export default BookEventPage;
