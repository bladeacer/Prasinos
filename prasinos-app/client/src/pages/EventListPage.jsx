import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import { Event, Schedule } from '@mui/icons-material';

// Sample event data - replace with actual data fetching logic
const sampleEvents = [
    {
        id: 1,
        eventName: 'Event 1',
        refCode: 'ABC123',
        organization: 'Organization A',
        date: '2024-07-15',
        time: '10:00 AM',
        imageUrl: 'https://example.com/event1-image.jpg',
    },
    {
        id: 2,
        eventName: 'Event 2',
        refCode: 'XYZ456',
        organization: 'Organization B',
        date: '2024-08-01',
        time: '2:00 PM',
        imageUrl: 'https://example.com/event2-image.jpg',
    },
    // Add more events as needed
];

const EventListPage = () => {
    // State to hold events data
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Simulating data fetch from API
        setEvents(sampleEvents);
    }, []);

    return (
        <Box>
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
                                Ref code: {event.refCode}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                By: {event.organization}
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={4}>
                                    <img
                                        src={event.imageUrl}
                                        alt="Event"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Event sx={{ mr: 1 }} />
                                        <Typography>Date: {event.date}</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Schedule sx={{ mr: 1 }} />
                                        <Typography>Time: {event.time}</Typography>
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
