import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CardMedia, IconButton, TextField, Menu, MenuItem, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { CheckCircle, Cancel, ChangeCircle, AccountCircle, AccessTime, Timer, LocationOn, AttachMoney, Close, Undo } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';

function ReviewEvents() {
    const [eventsToReview, setEventsToReview] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRequestChangeClicked, setIsRequestChangeClicked] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);
    const [comment, setComment] = useState('');

    const fetchEventsToReview = () => {
        http.get('/event?status=Pending Review').then((res) => {
            setEventsToReview(res.data);
        }).catch(error => console.error('Error fetching events for review:', error));
    };

    const activities = [
        { label: 'Tree Planting', value: 'treePlanting' },
        { label: 'Beach Recycling', value: 'beachRecycling' },
        { label: 'Picking Up Litter', value: 'pickingUpLitter' },
        { label: 'Others', value: 'others' },
    ];

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleActivityChange = (event) => {
        const value = event.target.name;
        setSelectedActivities(prev => {
            const newActivities = prev.includes(value) ? prev.filter(activity => activity !== value) : [...prev, value];
            // Optionally, call a function to filter events based on newActivities
            return newActivities;
        });
    };

    // Example function to fetch and filter events, adjust as necessary
    const fetchAndFilterEvents = () => {
        http.get('/event').then((res) => {
            let filteredEvents = res.data;
            if (selectedActivities.length > 0) {
                filteredEvents = filteredEvents.filter(event => selectedActivities.includes(event.eventActivity));
            }
            setEventsToReview(filteredEvents);
        }).catch(error => console.error('Error fetching events:', error));
    };

    const showToast = (message, actionCallback) => {
        const toastType = message === "Event Approving" ? toast.success : message === "Event Rejecting" ? toast.error : toast.info;
        const toastId = toastType(message, {
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
            progress: undefined,
            closeButton: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => {
                    toast.dismiss(toastId);
                    actionCallback();
                }}>
                    <Undo style={{
                        color: 'black', // Change icon color
                        fontSize: '24px', // Adjust icon size
                    }} />
                    <span style={{ color: 'black', fontSize: '12px' }}>Revert</span>
                </div>
            ),
        });
    };

    // Inside the approveEvent function, add a dialog prompt for admin comments
    const approveEvent = (eventId) => {

        setIsDialogOpen(false);
        showToast("Event Approving", () => undoApproval());

        function undoApproval() {
            clearTimeout(approvalTimeout);
            return
        }

        const approvalTimeout = setTimeout(() => {
            performApproval(eventId);
        }, 4000);

        function performApproval(eventId) {


            http.get('/user/auth').then((res) => {
                const adminId = res.data.user.id;
                if (comment) {
                    http.put(`/event/${eventId}`, { eventStatus: 'Approved', adminComment: comment, adminId: adminId })
                        .then(() => {
                            setEventsToReview(eventsToReview.filter(event => event.id !== eventId));
                        })
                } else {
                    http.put(`/event/${eventId}`, { eventStatus: 'Approved', adminId: adminId })
                        .then(() => {
                            setEventsToReview(eventsToReview.filter(event => event.id !== eventId));
                        })
                }
            }).catch(error => {
                toast.error('Error approving event');
            });

        }
    };

    // Inside the rejectEvent function, add a dialog prompt for admin comments
    const rejectEvent = (eventId) => {

        setIsDialogOpen(false);
        showToast("Event Rejecting", () => undoRejection());

        function undoRejection() {
            clearTimeout(rejectionTimeout);
            return
        }

        const rejectionTimeout = setTimeout(() => {
            performRejection(eventId);
        }, 4000);


        function performRejection(eventId) {
            http.get('/user/auth').then((res) => {
                const adminId = res.data.user.id;
                if (comment) {
                    http.put(`/event/${eventId}`, { eventStatus: 'Rejected', adminComment: comment, adminId: adminId })
                        .then(() => {
                            setEventsToReview(eventsToReview.filter(event => event.id !== eventId));
                        })
                } else {
                    http.put(`/event/${eventId}`, { eventStatus: 'Rejected', adminId: adminId })
                        .then(() => {
                            setEventsToReview(eventsToReview.filter(event => event.id !== eventId));
                        })
                }
            }).catch(error => {
                toast.error('Error rejecting event');
            });
        }
    };

    const requestChanges = (eventId) => {
        setIsRequestChangeClicked(true);
    };

    const handleFieldChange = (field) => {
        setSelectedFields(prev => {
            if (prev.includes(field)) {
                return prev.filter(f => f !== field);
            } else {
                return [...prev, field];
            }
        });
    };

    const submitRequest = (eventId) => {
        if (selectedFields.length === 0) {
            alert("Please select at least one field to request changes for.");
            return;
        }
        setIsDialogOpen(false);
        showToast("Event Requesting Changes", () => undoRequestChange());

        function undoRequestChange() {
            clearTimeout(requestChangeTimeout);
            return
        }

        const requestChangeTimeout = setTimeout(() => {
            performRequestChange(eventId);
        }, 4000);

        function performRequestChange(eventId) {
            http.get('/user/auth').then((res) => {
                const adminId = res.data.user.id;
                if (comment) {
                    http.put(`/event/${eventId}`, { eventStatus: 'Action Needed', adminComment: comment, adminId: adminId, requestChangefields: selectedFields })
                        .then(() => {
                            setEventsToReview(eventsToReview.filter(event => event.id !== eventId));
                        })
                } else {
                    http.put(`/event/${eventId}`, { eventStatus: 'Action Needed', adminId: adminId, requestChangefields: selectedFields })
                        .then(() => {
                            setEventsToReview(eventsToReview.filter(event => event.id !== eventId));
                        })
                }
            }).catch(error => {
                toast.error('Error requesting changes for event');
            });
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        fetchAndFilterEvents();
    }, [selectedActivities]);

    const capitalizeWords = (str) => {
        // Ensure all words start with an uppercase letter
        return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
            // Ensure the first character of each word is uppercase and subsequent capitals are separated with a space
            return txt.charAt(0).toUpperCase() + txt.substr(1).replace(/[A-Z]/g, ' $&');
        });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Review Events
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button aria-controls="activity-menu" aria-haspopup="true" onClick={handleClick} variant='contained' sx={{ mr: { xs: 0.5, sm: 1.5, md: 2.5 } }}>
                Sort by Activities
            </Button>
            <Menu
                id="activity-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <FormControl component="fieldset">
                    <FormGroup>
                        {activities.map((activity) => (
                            <MenuItem key={activity.value} onClick={(e) => e.stopPropagation()}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedActivities.includes(activity.value)}
                                            onChange={handleActivityChange}
                                            name={activity.value}
                                        />
                                    }
                                    label={activity.label}
                                />
                            </MenuItem>
                        ))}
                    </FormGroup>
                </FormControl>
            </Menu>
            </Box>
            <Grid container spacing={2}>
                {eventsToReview.map((event) => (
                    <Grid item xs={12} md={6} lg={4} key={event.id} onClick={() => handleEventClick(event)}>
                        <Card sx={{
                            '&:hover': {
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
                                transform: 'translateY(-5px)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            },
                            borderRadius: '8px',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            cursor: 'pointer',
                        }}>
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
                            <Typography
                                sx={{
                                    backgroundColor: event.eventStatus === 'Approved' ? '#28a745' :
                                        event.eventStatus === 'Pending Review' ? '#d39e00' :
                                            event.eventStatus === 'Rejected' ? '#dc3545' :
                                                event.eventStatus === 'Draft' ? '#6c757d' :
                                                    event.eventStatus === 'Action Needed' ? '#007bff' : '#f44336',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {event.eventStatus}
                            </Typography>
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {event.eventName}
                                    </Typography>
                                    {/* {
                                                user && user.id === event.userId && (
                                                    <>
                                                        <IconButton color="primary" sx={{ padding: '4px' }} href={`/editevent/${event.id}`} >
                                                            <Edit />
                                                        </IconButton>
                                                        {event.eventStatus !== "Pending Review" && (
                                                            <IconButton color="error" sx={{ padding: '4px' }} onClick={() => onDeleteEvent(event.id)}>
                                                                <Delete />
                                                            </IconButton>
                                                        )}
                                                        <IconButton color="primary" sx={{ padding: '4px' }} href={`/event/${event.id}`}>
                                                            <Visibility />
                                                        </IconButton>
                                                    </>
                                                )
                                            } */}
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
                ))}
            </Grid>
            {selectedEvent && (
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth={true} maxWidth="md">
                    <IconButton
                        aria-label="close"
                        onClick={() => setIsDialogOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                    <DialogTitle>Event Details</DialogTitle>
                    <DialogContent>
                        <Card>
                            {/* Display event image */}
                            {selectedEvent.eventImage && (
                                <Grid item xs={12}>
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <CardMedia
                                            component="img"
                                            height="300"
                                            image={`${import.meta.env.VITE_FILE_BASE_URL}${selectedEvent.eventImage}`}
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
                                        <Typography variant="body1">{selectedEvent.eventName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Activity</Typography>
                                        <Typography variant="body1">{selectedEvent.eventActivity ? capitalizeWords(selectedEvent.eventActivity) : 'Not specified'}</Typography>
                                    </Grid>
                                    {selectedEvent.otherEventActivity && (
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Other Event Activity</Typography>
                                            <Typography variant="body1">{selectedEvent.otherEventActivity}</Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Organizer Type</Typography>
                                        <Typography variant="body1">{selectedEvent.eventOrganizerType ? capitalizeWords(selectedEvent.eventOrganizerType) : 'Not specified'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Organizer</Typography>
                                        <Typography variant="body1">{selectedEvent.eventOrganizerName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Scope</Typography>
                                        <Typography variant="body1">
                                            {selectedEvent.eventScope === 'open' ? 'Open to public' : selectedEvent.eventScope === 'invitiation' ? 'By invitation' : 'Not specified'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Description</Typography>
                                        <Typography variant="body1">{selectedEvent.eventDescription}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Location</Typography>
                                        <Typography variant="body1">{selectedEvent.eventLocation}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Start Date</Typography>
                                        <Typography variant="body1">{selectedEvent.eventStartDate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event End Date</Typography>
                                        <Typography variant="body1">{selectedEvent.eventEndDate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event Start Time</Typography>
                                        <Typography variant="body1">{selectedEvent.eventStartTime}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Event End Time</Typography>
                                        <Typography variant="body1">{selectedEvent.eventEndTime}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Participation Fee</Typography>
                                        <Typography variant="body1">{selectedEvent.participationFee}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Funding Request</Typography>
                                        {selectedEvent.fundingRequests && selectedEvent.fundingRequests.length > 0 ? (
                                            selectedEvent.fundingRequests.map((request, index) => (
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
                                        <Typography variant="body1">{selectedEvent.expectedAttendance}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Email</Typography>
                                        <Typography variant="body1">{selectedEvent.email}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Contact Number</Typography>
                                        <Typography variant="body1">{selectedEvent.contactNumber}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Supporting Documents</Typography>
                                    {selectedEvent.supportingDocs && selectedEvent.supportingDocs.length > 0 ? (
                                        selectedEvent.supportingDocs.map((doc, index) => (
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
                                    <>
                                        <TextField
                                            label="Admin's comment"
                                            multiline
                                            rows={4}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </>
                                </Grid>
                            </CardContent>
                        </Card>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<CheckCircle />} onClick={() => approveEvent(selectedEvent.id)}>Approve</Button>
                        <Button startIcon={<Cancel />} onClick={() => rejectEvent(selectedEvent.id)} color="error">Reject</Button>
                        <Button startIcon={<ChangeCircle />} onClick={() => requestChanges(selectedEvent.id)} style={{ color: '#007bff' }}>Request Change</Button>
                    </DialogActions>
                    {isRequestChangeClicked && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                <h3>Select fields to request changes:</h3>
                            </div>
                            <div style={{
                                display: 'grid',
                                justifyContent: 'center',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '10px',
                                alignItems: 'center',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventName" onChange={() => handleFieldChange('eventName')} />
                                    <label htmlFor="eventName">Event Name</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventDate" onChange={() => handleFieldChange('eventDate')} />
                                    <label htmlFor="eventDate">Event Date</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventLocation" onChange={() => handleFieldChange('eventLocation')} />
                                    <label htmlFor="eventLocation">Event Location</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventDescription" onChange={() => handleFieldChange('eventDescription')} />
                                    <label htmlFor="eventDescription">Event Description</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventActivity" onChange={() => handleFieldChange('eventActivity')} />
                                    <label htmlFor="eventActivity">Event Activity</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventOrganizer" onChange={() => handleFieldChange('eventOrganizer')} />
                                    <label htmlFor="eventOrganizer">Event Organizer</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="expectedAttendance" onChange={() => handleFieldChange('expectedAttendance')} />
                                    <label htmlFor="expectedAttendance">Expected Attendance</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="participationFee" onChange={() => handleFieldChange('participationFee')} />
                                    <label htmlFor="participationFee">Participation Fee</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="fundingRequests" onChange={() => handleFieldChange('fundingRequests')} />
                                    <label htmlFor="fundingRequests">Funding Request</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="supportingDocuments" onChange={() => handleFieldChange('supportingDocuments')} />
                                    <label htmlFor="supportingDocuments">Supporting Documents</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventImage" onChange={() => handleFieldChange('eventImage')} />
                                    <label htmlFor="eventImage">Event Image</label>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <input type="checkbox" id="eventScope" onChange={() => handleFieldChange('eventScope')} />
                                    <label htmlFor="eventScope">Event Scope</label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                                <Button variant="contained" component="label" onClick={() => submitRequest(selectedEvent.id)}>Submit Request</Button>
                            </div>
                        </div>
                    )}
                </Dialog>
            )}
            <ToastContainer />
        </Box>
    );
}

export default ReviewEvents;