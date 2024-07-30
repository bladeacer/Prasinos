// Manveer
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import { Event, Schedule } from '@mui/icons-material';
import http from '../http';

const EventListPage = () => {
    const [events, setEvents] = useState([]);

    const sortEventsByStartDate = (events) => events.sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));

    useEffect(() => {
        http.get('/event').then((res) => {
            let eventData = res.data;
            eventData = eventData.filter(event => event.eventStatus === 'Approved');
            let sortedEvent = sortEventsByStartDate(eventData);
            setEvents(sortedEvent);
        }, []);
    });

    return (
        <Box style={{ marginLeft: "5%", marginRight: "-10%", marginTop: "130px"}}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>
            <Divider sx={{ my: 2 }} />

            {events.map((event) => (
                <Box key={event.id} sx={{ my: 2 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {event.eventName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Ref code: {event.id}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                By: {event.eventOrganizerName}
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={4}>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${event.eventImage}`}
                                        alt="Event"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Event sx={{ mr: 1 }} />
                                        <Typography>Date: {event.eventStartDate} - {event.eventEndDate}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Schedule sx={{ mr: 1 }} />
                                        <Typography>Time: {event.eventStartTime} - {event.eventEndTime}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to={`/bookeventpage/${event.id}`} // Navigate to BookEventPage with eventId
                                >
                                    Register Now
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
};

export default EventListPage;

