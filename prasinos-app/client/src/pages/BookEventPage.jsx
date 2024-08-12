import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const BookEventPage = () => {
    const { id } = useParams();     // Retrieve ID from URL Paramss
    const { user } = useContext(UserContext);
    const navigate = useNavigate(); // Use Navigate for redirection 

    const validateForm = (values) => {
        const errors = {};
        const maxPax = eventDetails?.expectedAttendance || 0; // Maximum pax allowed

        if (values.pax > maxPax) {
            errors.pax = `Number of Pax cannot exceed the expected attendance of ${maxPax}`;
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dateTimeBooked: dayjs().format('YYYY-MM-DD HH:mm'),
            eventId: id,
            pax: 1,
        },
        validate: validateForm, // Use custom validate function
        validationSchema: yup.object({
            firstName: yup
                .string()
                .matches(/^[A-Za-z]+$/, "First name cannot be numbers only")
                .min(3, "First name must be at least 3 characters")
                .required("First name is required"),
            lastName: yup
                .string()
                .matches(/^[A-Za-z]+$/, "Last name cannot be numbers only")
                .min(3, "Last name must be at least 3 characters")
                .required("Last name is required"),
            email: yup
                .string()
                .email("Invalid email address")
                .required("Email is required"),
            phoneNumber: yup
                .string()
                .matches(/^\d+$/, "Phone number must be 8 digits")
                .max(8, 'Phone number must not exceed 8 digits')
                .required("Phone number is required"),
            dateTimeBooked: yup
                .date()
                .required("Date and Time of Booking are required"),
            pax: yup
                .number()
                .positive("PAX must be a positive number")
                .required("PAX is required"),
        }),
        onSubmit: (data) => {
            // Construct the booking data object
            const bookingData = {
                ...data,
                userId: user.id, // Ensure this is sourced from session or global state
                unitPrice: eventDetails.participationFee,
                totalPrice: data.pax * eventDetails.participationFee,
                attendees: [{
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber
                }],
            };

            // Make the POST request with bookingData
            http.post("/booking", bookingData)  // Use bookingData here
                .then((res) => {
                    // Handle successful response
                    if (eventDetails.participationFee > 0) {
                        navigate('/payment', { state: { ...bookingData, event: eventDetails } });
                    } else {
                        navigate(`/booking-success`);
                    }
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error adding booking:", error);
                    toast.error("Failed to add booking.");
                });
        },
    });

    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        // Fetch event details based on the id
        http.get(`/event/${id}`).then(response => {
            setEventDetails(response.data);
        }).catch(error => {
            console.error("Error fetching event details", error);
        });
    }, [id]);

    const [formData, setFormData] = useState({
        pax: 1,
        attendees: [{ firstName: '', lastName: '', email: '', phoneNumber: '' }], // Primary Attendee
        dateTimeBooked: dayjs().format('YYYY-MM-DD HH:mm'),    // Current date and time
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            firstName: formData.attendees[0].firstName,
            lastName: formData.attendees[0].lastName,
            email: formData.attendees[0].email,
            phoneNumber: formData.attendees[0].phoneNumber,
            eventId: eventDetails.id,
            userId: user.id, // Ensure this is sourced from session or global state
            quantity: formData.pax, // Ensure you capture all required details
            unitPrice: eventDetails.participationFee,
            totalPrice: formData.pax * eventDetails.participationFee,
            attendees: formData.attendees,
            dateTimeBooked: formData.dateTimeBooked,
        };

        http.post('/booking', bookingData)
            .then((response) => {
                // Check if the event has a participation fee greater than $0
                if (eventDetails.participationFee > 0) {
                    navigate('/payment', { state: { ...formData, event: eventDetails } });
                } else {
                    // Optionally navigate to a success page or display a message
                    navigate('/booking-success', { state: { ...formData, event: eventDetails } });
                    // Or display a message using a state hook
                    // setState({ message: "Registration successful! No payment required." });
                }
            })
            .catch((error) => {
                console.error("Error creating booking", error);
                toast.error("Failed to create booking.");
            });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                                Pax Available: {eventDetails.expectedAttendance}
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
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            id="phoneNumber"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            disabled
                            id="dateTimeBooked"
                            name="dateTimeBooked"
                            label="Booking Date and Time"
                            value={formik.values.dateTimeBooked}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            id="pax"
                            name="pax"
                            label="Number of Pax"
                            value={formik.values.pax}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.pax && Boolean(formik.errors.pax)}
                            helperText={formik.touched.pax && formik.errors.pax}
                            sx={{ mt: 2 }}
                        />
                        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Button variant="contained" onClick={() => navigate(-1)}>
                                Back
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
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
