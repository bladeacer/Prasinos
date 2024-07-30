// Manveer
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const EventCard = ({ event, onSelect }) => {
    return (
        <Card sx={{ margin: 2 }} onClick={() => onSelect(event)}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {event.name}
                </Typography>
                <Typography color="text.secondary">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </Typography>
                <Typography color="text.secondary">
                    {event.venue}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default EventCard;
