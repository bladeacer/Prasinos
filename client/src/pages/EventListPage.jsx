//  Manveer
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import { Event, Schedule, Code, Person } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';

const EventListPage = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    const sortEventsByStartDate = (events) => events.sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));

    useEffect(() => {
        http.get('/event')
            .then((res) => {
                let eventData = res.data;
                eventData = eventData.filter(event => event.eventStatus === 'Approved');
                let sortedEvent = sortEventsByStartDate(eventData);
                setEvents(sortedEvent);
                setError(''); // Clear any previous error
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    setError('No events at the moment');
                } else {
                    setError('An error occurred while fetching events');
                }
            });
    }, []);

    return (
        <Box sx={{ p: 3 }} style={{ marginLeft: "5%", marginRight: "-10%", marginTop: "130px"}}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
                Upcoming Events
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <div>
                {error ? (
                    <p>{error}</p>
                ) : (
                    <ul>
                        {events.map(event => (
                            <li key={event.id}>{event.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            {events.map((event) => (
                <Box key={event.id} sx={{ mb: 3 }}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${event.eventImage}`}
                                        alt="Event"
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="h5" gutterBottom>
                                        {event.eventName}
                                    </Typography>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        {/* <Code sx={{ mr: 1 }} /> */}
                                        <Typography>
                                            Ref code: {event.id}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Event sx={{ mr: 1 }} />
                                        <Typography variant="body1">{dayjs(event.eventStartDate).format('MMM D, YYYY')} - {dayjs(event.eventEndDate).format('MMM D, YYYY')}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Schedule sx={{ mr: 1 }} />
                                        <Typography variant="body1">{event.eventStartTime} - {event.eventEndTime}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Person sx={{ mr: 1 }} />
                                        <Typography>
                                            {event.eventOrganizerName}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/bookeventpage/${event.id}`}
                                    >
                                        Register Now
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
};

export default EventListPage;

