// Zara
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import axios from 'axios';
import { useFormik } from "formik";
import * as yup from "yup";
import UserContext from '../contexts/UserContext';
import global from '../global';
import EventCard from './EventCard';
import EventDetailOverlay from './EventDetailOverlay';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Bookings() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [bookingList, setBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const [editBooking, setEditBooking] = useState(null);
    const [eventList, setEventList] = useState([]);
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getBookings = () => {
        http.get('/booking').then((res) => {
            setBookingList(res.data);
        });
    };

    const getEvents = () => {
        http.get('/event').then((res) => {
            setEventList(res.data);
        }).catch(error => {
            console.error("Error fetching events", error);
        });
    };

    const searchBookings = () => {
        http.get(`/booking?search=${search}`).then((res) => {
            setBookingList(res.data);
        });
    };

    const searchEvents = () => {
        http.get(`/event?search=${search}`).then((res) => {
            setEventList(res.data);
        }).catch(error => {
            console.error("Error searching events", error);
        });
    };

    const getBookingsForEvent = (eventId) => {
        http.get(`/booking?eventId=${eventId}`).then((res) => {
            setBookingList(res.data);
            const selectedEvent = eventList.find(event => event.id === eventId);
            setSelectedEvent(selectedEvent);
        }).catch(error => {
            console.error("Error fetching bookings for event", error);
        });
    };

    useEffect(() => {
        axios.get('/api/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Failed to fetch events:', error));
        getEvents();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };

    const onClickSearch = () => {
        searchEvents();
    }

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    const handleEditBooking = (booking) => {
        setEditBooking(booking);
    };

    const handleSaveBooking = () => {
        http.put(`/booking/${editBooking.id}`, editBooking).then((res) => {
            setEditBooking(null);
            getBookingsForEvent(selectedEvent.id);
        }).catch(error => {
            console.error("Error saving booking", error);
        });
    };

    const handleEditChange = (e) => {
        setEditBooking({ ...editBooking, [e.target.name]: e.target.value });
    };

    return (
        <Box style={{ marginLeft: "5%", marginRight: "-10%", marginTop: "130px"}}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Bookings - Staff
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
            </Box>

            <Grid container spacing={2}>
                {eventList.map((event) => (
                    <Grid item xs={12} key={event.id}>
                        <Card onClick={() => getBookingsForEvent(event.id)}>
                            {event.imageFile && (
                                <Box className="aspect-ratio-container">
                                    <img alt="event" src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`} />
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h6">{event.title}</Typography>
                                <Typography>{event.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {selectedEvent && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        {selectedEvent.eventName}
                    </Typography>
                    <Typography variant="body1">{selectedEvent.description}</Typography>
                    <Typography variant="body2" color="textSecondary">Date: {dayjs(selectedEvent.date).format(global.dateFormat)}</Typography>
                    <Typography variant="body2" color="textSecondary">Time: {selectedEvent.time}</Typography>
                    <Typography variant="body2" color="textSecondary">Organization: {selectedEvent.organization}</Typography>
                    <Typography variant="body2" color="textSecondary">Reference Code: {selectedEvent.refCode}</Typography>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Bookings for {selectedEvent.eventName}
                    </Typography>
                    <Grid container spacing={2}>
                        {bookingList.map((booking) => (
                            <Grid item xs={12} key={booking.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {booking.title}
                                            </Typography>
                                            <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleEditBooking(booking)}>
                                                <Edit />
                                            </IconButton>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>{booking.user?.name}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>{dayjs(booking.createdAt).format(global.datetimeFormat)}</Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{booking.description}</Typography>
                                        <Typography>Pax: {booking.pax}</Typography>
                                        <Typography>Date: {dayjs(booking.date).format(global.dateFormat)}</Typography>
                                        <Typography>Time: {booking.time}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <div>
                {Array.isArray(events) && events.map(event => (
                    <EventCard key={event.id} event={event} onSelect={() => setSelectedEvent(event)} />
                ))}
                {selectedEvent && (
                    <EventDetailOverlay
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                        onUserSelect={(user) => console.log('User selected', user)}
                    />
                )}
            </div>

            <Dialog open={!!editBooking} onClose={() => setEditBooking(null)}>
                <DialogTitle>Edit Booking</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        value={editBooking?.title || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={4}
                        value={editBooking?.description || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="Pax"
                        name="pax"
                        fullWidth
                        value={editBooking?.pax || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        name="date"
                        fullWidth
                        value={editBooking?.date || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="Time"
                        name="time"
                        fullWidth
                        value={editBooking?.time || ''}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditBooking(null)}>Cancel</Button>
                    <Button onClick={handleSaveBooking} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Bookings;
