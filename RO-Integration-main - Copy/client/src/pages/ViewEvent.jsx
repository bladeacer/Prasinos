import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, CardMedia } from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';
import http from '../http';

function ViewEvent() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            console.log('Fetching event with ID:', id);
            try {
                const response = await http.get(`/event/${id}`);
                const eventData = response.data;
                setEvent(eventData);
            } catch (err) {
                console.error('Error fetching event data:', err);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBackClick = () => {
        navigate('/eventsproposal');
    };

    // const handleCardClick = () => {
    //     navigate(`/editevent/${event.id}`);
    // };

    const capitalizeWords = (str) => {
        // Ensure all words start with an uppercase letter
        return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
            // Ensure the first character of each word is uppercase and subsequent capitals are separated with a space
            return txt.charAt(0).toUpperCase() + txt.substr(1).replace(/[A-Z]/g, ' $&');
        });
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

    if (!event) {
        return <Typography color="error">Event data not found</Typography>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Event Details
            </Typography>
            <Card>
                {/* Display event image */}
                {event.eventImage && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={`${import.meta.env.VITE_FILE_BASE_URL}${event.eventImage}`}
                                alt="Event"
                                sx={{ objectFit: 'contain' }}
                            />
                        </Box>
                    </Grid>
                )}
                {/* <Card onClick={handleCardClick}> */}
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Name</Typography>
                            <Typography variant="body1">{event.eventName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Activity</Typography>
                            <Typography variant="body1">{event.eventActivity ? capitalizeWords(event.eventActivity) : 'Not specified'}</Typography>
                        </Grid>
                        {event.otherEventActivity && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Other Event Activity</Typography>
                                <Typography variant="body1">{event.otherEventActivity}</Typography>
                            </Grid>
                        )}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Organizer Type</Typography>
                            <Typography variant="body1">{event.eventOrganizerType ? capitalizeWords(event.eventOrganizerType) : 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Organizer</Typography>
                            <Typography variant="body1">{event.eventOrganizerName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Scope</Typography>
                            <Typography variant="body1">
                                {event.eventScope === 'open' ? 'Open to public' : event.eventScope === 'invitiation' ? 'By invitation' : 'Not specified'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Description</Typography>
                            <Typography variant="body1">{event.eventDescription}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Location</Typography>
                            <Typography variant="body1">{event.eventLocation}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Start Date</Typography>
                            <Typography variant="body1">{event.eventStartDate}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event End Date</Typography>
                            <Typography variant="body1">{event.eventEndDate}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event Start Time</Typography>
                            <Typography variant="body1">{event.eventStartTime}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Event End Time</Typography>
                            <Typography variant="body1">{event.eventEndTime}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Participation Fee</Typography>
                            <Typography variant="body1">{event.participationFee}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Funding Request</Typography>
                            {event.fundingRequests && event.fundingRequests.length > 0 ? (
                                event.fundingRequests.map((request, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Item:</strong> {request.item}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Source:</strong> {request.source}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Purpose:</strong> {request.purpose}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Amount Requested:</strong> {request.amountRequested}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body1">No funding requests</Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Expected Attendance</Typography>
                            <Typography variant="body1">{event.expectedAttendance}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Email</Typography>
                            <Typography variant="body1">{event.email}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Contact Number</Typography>
                            <Typography variant="body1">{event.contactNumber}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Supporting Documents</Typography>
                        {event.supportingDocs && event.supportingDocs.length > 0 ? (
                            event.supportingDocs.map((doc, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <a href={`${import.meta.env.VITE_FILE_BASE_URL}${doc.filename}`} target="_blank" rel="noopener noreferrer">
                                            {doc.actualfilename}
                                        </a>
                                        <strong> - </strong>
                                        {doc.notes && ` ${doc.notes}`}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body1">No supporting documents</Typography>
                        )}
                    </Grid>
                    {["Approved", "Rejected", "Action Needed"].includes(event.eventStatus) && (
                        <Grid item xs={12} style={{ textAlign: 'center' }}>
                            <Typography variant="h6">Admin Comment</Typography>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>{event.adminComment || "-"}</Typography>
                        </Grid>
                    )}
                </CardContent>
            </Card>
            <Box mt={2} mb={2}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button variant="contained" onClick={handleBackClick} startIcon={<ArrowBack />}>
                            Back to Events
                        </Button>
                    </Grid>
                    <Grid item>
                        {user && user.id === event.userId && (
                            <Link to={`/editevent/${event.id}`} style={{ textDecoration: 'none' }}>
                                <Button variant="contained" startIcon={<Edit />}>
                                    Edit Event
                                </Button>
                            </Link>
                        )}
                    </Grid>
                    <Grid item>
                        {user && user.id === event.userId && (event.eventStatus === "Draft" || event.eventStatus === "Rejected") && (
                            <Button variant="contained" onClick={() => onDeleteEvent(event.id)} startIcon={<Delete />} color="secondary">
                                Delete Event
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <Typography variant="body1" > </Typography>
            </Box>
        </Box>
    );
}

export default ViewEvent;
