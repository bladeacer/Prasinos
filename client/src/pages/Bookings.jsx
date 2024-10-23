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
import { UserContext, StaffContext } from '/src/contexts/Contexts.js';

const ITEMS_PER_PAGE = 10;

function Bookings() {
    const [bookingList, setBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { user } = useContext(UserContext);
    const [booking, setBooking] = useState({
        title: "",
        description: ""
    });

    const formik = useFormik({
        initialValues: booking,
        enableReinitialize: true,
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
                    dateTimeBooked: values.dateTimeBooked ? values.dateTimeBooked.trim() : '',
                    pax: values.pax ? parseInt(values.pax.toString().trim(), 10) : 0,
                };

                console.log('Cleaned data:', cleanedData);

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
        if (user) {
            getEvents();
        }
    }, [user]);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEvents = async () => {
        if (!user) return;

        try {
            // Use the new endpoint to fetch events by user ID
            const res = await http.get(`/booking/user/${user.id}`);
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
                        eventStartTime: booking.event.eventStartTime,
                        eventEndTime: booking.event.eventEndTime,
                        eventLocation: booking.event.eventLocation,
                        eventImage: booking.event.eventImage,
                        participationFee: booking.event.participationFee,
                        bookings: [booking],
                    });
                }
                return acc;
            }, []);
            setBookingList(groupedEvents);
            setTotalPages(Math.ceil(groupedEvents.length / ITEMS_PER_PAGE));
            console.log(`${import.meta.env.VITE_FILE_BASE_URL}${eventImage}`)
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            console.log('Finished fetching events');
        }
    };

    const searchEvents = async () => {
        if (!user) return;

        try {
            // Use the new endpoint with a search parameter
            const res = await http.get(`/booking/user/${user.id}&search=${search}`);
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
                        eventStartTime: booking.event.eventStartTime,
                        eventEndTime: booking.event.eventEndTime,
                        eventLocation: booking.event.eventLocation,
                        eventImage: booking.event.eventImage,
                        bookings: [booking],
                    });
                }
                return acc;
            }, []);
            setBookingList(groupedEvents);
            setTotalPages(Math.ceil(groupedEvents.length / ITEMS_PER_PAGE));
            setCurrentPage(1); // Reset to first page on search
            console.log(`${import.meta.env.VITE_FILE_BASE_URL}${eventImage}`)
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

    return (
        <Box style={{ marginTop: "50px"}}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Bookings
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
                {user && (
                    <Link to="/eventlistpage">
                        <Button variant='contained'>Register for Event</Button>
                    </Link>
                )}
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

            {/* Booking Details Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogContent>
                    {selectedEvent && (
                        <Box>
                            <Typography variant="h6">Attendees</Typography>
                            <List>
                                {selectedEvent && selectedEvent.bookings.map(booking => (
                                    <ListItem key={booking.id}>
                                        <ListItemText
                                            primary={`${booking.firstName} ${booking.lastName}`}
                                            secondary={`PAX: ${booking.pax}, Email: ${booking.email}, Phone: ${booking.phoneNumber}`}
                                        />
                                        <IconButton onClick={() => handleOpenEditDialog(booking)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteBooking(booking.id)}>
                                            <Delete />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Booking Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} fullWidth>
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="phoneNumber"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="pax"
                            name="pax"
                            label="PAX"
                            type="number"
                            value={formik.values.pax}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
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

export default Bookings;
