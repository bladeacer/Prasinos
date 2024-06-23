import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Divider } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, DateRange, Event, Timer, AttachMoney,Delete } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Events() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEvents = () => {
        http.get('/event').then((res) => {
            setEventList(res.data);
        });
    };

    const searchEvents = () => {
        http.get(`/event?search=${search}`).then((res) => {
            setEventList(res.data);
        });
    };

    useEffect(() => {
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

    const onDeleteEvent = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            http.delete(`/event/${eventId}`)
                .then(() => {
                    // Remove the deleted event from the eventList state
                    setEventList(eventList.filter(event => event.id !== eventId));
                })
                .catch(error => {
                    console.error('Error deleting event:', error);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Event Proposal
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addevent">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    eventList.map((event, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
                                <Card>
                                    {
                                        event.eventImage && (
                                            <Box className="aspect-ratio-container">
                                                <img
                                                    alt="event"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${event.eventImage}`}
                                                />
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {event.eventName}
                                            </Typography>
                                            {
                                                user && user.id === event.userId && (
                                                        <>
                                                            <Link to={`/editevent/${event.id}`}>
                                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                                    <Edit />
                                                                </IconButton>
                                                            </Link>
                                                            <IconButton color="error" sx={{ padding: '4px' }} onClick={() => onDeleteEvent(event.id)}>
                                                                <Delete />
                                                            </IconButton>
                                                        </>
                                                )
                                            }
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccountCircle sx={{ mr: 1 }} />
                                            <Typography>
                                                {event.eventOrganizerName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                            {`${dayjs(event.eventStartDate).format('YYYY-MM-DD')} - ${dayjs(event.eventEndDate).format('YYYY-MM-DD')}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <Timer sx={{ mr: 1 }} />
                                            <Typography>
                                                {`${event.eventStartTime} - ${event.eventEndTime}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <LocationOn sx={{ mr: 1 }} />
                                            <Typography>
                                                {event.eventLocation}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <AttachMoney sx={{ mr: 1 }} />
                                            <Typography>
                                                {`${event.participationFee}`}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Events;
