import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, List, ListItem, ListItemText, Card, CardContent, Input,
    IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { Search, Clear, Edit, Delete, Event, Schedule } from '@mui/icons-material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

const ITEMS_PER_PAGE = 10;

function StaffBooking() {
    const [bookingList, setBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        pax: 0
    });

    const formik = useFormik({
        initialValues: booking,
        enableReinitialize: true,
        validationSchema: yup.object({
            firstName: yup
                .string()
                .matches(/^[A-Za-z]+$/, "First name can only be alphabets")
                .min(3, "First name must be at least 3 characters")
                .required("First name is required"),
            lastName: yup
                .string()
                .matches(/^[A-Za-z]+$/, "Last name can only be alphabets")
                .min(3, "Last name must be at least 3 characters")
                .required("Last name is required"),
            email: yup
                .string()
                .email("Invalid email address")
                .required("Email is required"),
            phoneNumber: yup
                .string()
                .matches(/^\d{8}$/, "Phone number must be 8 digits")
                .required("Phone number is required"),
            pax: yup
                .number()
                .positive("PAX must be a positive number")
                .required("PAX is required"),
        }),
        onSubmit: async (values) => {
            try {
                // Log the data to check its structure
                console.log('Submitting data:', values);

                // Ensure fields are not undefined and are trimmed
                const cleanedData = {
                    firstName: values.firstName ? values.firstName.trim() : '',
                    lastName: values.lastName ? values.lastName.trim() : '',
                    email: values.email ? values.email.trim() : '',
                    phoneNumber: values.phoneNumber ? values.phoneNumber.trim() : '',
                    pax: values.pax ? parseInt(values.pax.toString().trim(), 10) : 0,
                };

                await http.put(`/booking/${selectedBooking.id}`, cleanedData);
                console.log("Updating booking with data:", values);
                setEditDialogOpen(false);
                setSelectedBooking(null);
                getEvents(); // Refresh the list of events
            } catch (error) {
                console.error('Error updating booking:', error);
            }
        }
    });

    useEffect(() => {
        getEvents();
    }, []);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEvents = async () => {
        try {
            const res = await http.get('/booking');
            const groupedEvents = res.data.reduce((acc, booking) => {
                const event = acc.find(e => e.id === booking.eventId);
                if (event) {
                    event.bookings.push(booking);
                } else {
                    acc.push({
                        id: booking.eventId,
                        eventName: booking.event.eventName,
                        eventOrganizerName: booking.event.eventOrganizerName,
                        eventStartDate: booking.event.eventStartDate,
                        eventEndDate: booking.event.eventEndDate,
                        eventLocation: booking.event.eventLocation,
                        eventStartTime: booking.event.eventStartTime,
                        eventEndTime: booking.event.eventEndTime,
                        participationFee: booking.event.participationFee,
                        eventImage: booking.event.eventImage,
                        bookings: [booking],
                    });
                }
                return acc;
            }, []);
            setBookingList(groupedEvents);
            setTotalPages(Math.ceil(groupedEvents.length / ITEMS_PER_PAGE));
            setLoading(false);
        } catch (error) {
            // Log a detailed error message
            console.error('Error fetching events:', error.message);

            // Log the full error object for more context
            console.error('Full error details:', error);

            // Optionally, you can log the stack trace for debugging purposes
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }

            // If the error is an HTTP error, log the status code and response data
            if (error.response) {
                console.error('HTTP Status:', error.response.status);
                console.error('Response data:', error.response.data);
            }

            setLoading(false);
        }
    };


    const searchEvents = async () => {
        try {
            const res = await http.get(`/booking?search=${search}`);
            const groupedEvents = res.data.reduce((acc, booking) => {
                const event = acc.find(e => e.id === booking.eventId);
                if (event) {
                    event.bookings.push(booking);
                } else {
                    acc.push({
                        id: booking.event.eventId,
                        eventName: booking.event.eventName,
                        eventOrganizerName: booking.event.eventOrganizerName,
                        eventStartDate: booking.event.eventStartDate,
                        eventEndDate: booking.event.eventEndDate,
                        eventLocation: booking.event.eventLocation,
                        eventStartTime: booking.event.eventStartTime,
                        eventEndTime: booking.event.eventEndTime,
                        participationFee: booking.event.participationFee,
                        eventImage: booking.event.eventImage,
                        bookings: [booking],
                    });
                }
                return acc;
            }, []);
            setBookingList(groupedEvents);
            setTotalPages(Math.ceil(groupedEvents.length / ITEMS_PER_PAGE));
            setCurrentPage(1); // Reset to first page on search
        } catch (error) {
            console.error('Error searching events:', error);
        }
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };

    const onClickSearch = () => {
        searchEvents();
    };

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleViewDetails = (event) => {
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedEvent(null);
    };

    const handleOpenEditDialog = (booking) => {
        setSelectedBooking(booking);
        formik.setValues({
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            phoneNumber: booking.phoneNumber,
            pax: booking.pax
        });
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedBooking(null);
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            await http.delete(`/booking/${bookingId}`);
            getEvents();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentEvents = bookingList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box style={{ marginTop: "50px"}}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Staff Bookings - Processed Bookings
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <List>
                {currentEvents.map((event) => (
                    <ListItem key={event.id} sx={{ mb: 2 }}>
                        <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%', p: 2 }}>
                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    mr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundImage: event.eventImage
                                        ? `url(${import.meta.env.VITE_FILE_BASE_URL}${event.eventImage})`
                                        : 'none',
                                    backgroundSize: 'cover',    
                                    backgroundPosition: 'center',
                                    backgroundColor: '#f5f5f5',
                                }}
                            >
                                {!event.eventImage && (
                                    <Typography variant="body2" color="textSecondary">
                                        No Image
                                    </Typography>
                                )}
                            </Box>

                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {event.eventName}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                                        <Event sx={{ mr: 1 }} />
                                        <Typography>Date: {event.eventStartDate} - {event.eventEndDate}</Typography>
                                        <Typography variant="subtitle1">Location: {event.eventLocation}</Typography>
                                        <Typography variant="subtitle1">Fee: ${event.participationFee}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                                        <Schedule sx={{ mr: 1 }} />
                                        <Typography>Time: {event.eventStartTime} - {event.eventEndTime}</Typography>
                                        <Typography variant="subtitle1">Organizer: {event.eventOrganizerName}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" mt={1}>
                                    <Button onClick={() => handleViewDetails(event)}>View Booking Details</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button onClick={goToFirstPage} disabled={currentPage === 1}>
                    &laquo;
                </Button>
                <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    &lsaquo;
                </Button>
                {
                    Array.from({ length: totalPages }, (_, index) => (
                        <Button key={index + 1}
                            onClick={() => goToPage(index + 1)}
                            variant={index + 1 === currentPage ? 'contained' : 'text'}>
                            {index + 1}
                        </Button>
                    ))
                }
                <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    &rsaquo;
                </Button>
                <Button onClick={goToLastPage} disabled={currentPage === totalPages}>
                    &raquo;
                </Button>
            </Box>

            {/* View Booking Details Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogContent>
                    {selectedEvent && selectedEvent.bookings.map((booking) => (
                        <Card key={booking.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Booking ID: {booking.id}</Typography>
                                <Typography variant="subtitle1">Name: {booking.firstName} {booking.lastName}</Typography>
                                <Typography variant="subtitle1">Email: {booking.email}</Typography>
                                <Typography variant="subtitle1">Phone: {booking.phoneNumber}</Typography>
                                <Typography variant="subtitle1">PAX: {booking.pax}</Typography>
                                <Box display="flex" justifyContent="flex-end" sx={{ mt: 1 }}>
                                    <IconButton color="primary" onClick={() => handleOpenEditDialog(booking)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDeleteBooking(booking.id)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Booking Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="First Name"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Phone Number"
                            name="phoneNumber"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="PAX"
                            name="pax"
                            type="number"
                            value={formik.values.pax}
                            onChange={formik.handleChange}
                            error={formik.touched.pax && Boolean(formik.errors.pax)}
                            helperText={formik.touched.pax && formik.errors.pax}
                        />
                        <DialogActions>
                            <Button onClick={handleCloseEditDialog}>Cancel</Button>
                            <Button type="submit" variant="contained">Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default StaffBooking;
