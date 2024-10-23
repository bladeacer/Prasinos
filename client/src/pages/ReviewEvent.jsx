import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle, CardMedia, IconButton, TextField, Menu, MenuItem, FormControl, FormGroup, FormControlLabel, Checkbox, List, ListItem, ListItemAvatar, Avatar, ListItemText, Input, Container, Tab, Tabs, Tooltip } from '@mui/material';
import { CheckCircle, Cancel, ChangeCircle, AccountCircle, AccessTime, Timer, LocationOn, AttachMoney, Close, Undo, Search, Clear, ViewModule, ViewList } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import emailjs from '@emailjs/browser';

function ReviewEvents() {
    const [eventsToReview, setEventsToReview] = useState([]);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRequestChangeClicked, setIsRequestChangeClicked] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');
    const [displayMode, setDisplayMode] = useState('list');
    const [search, setSearch] = useState('');
    const [selectedTab, setSelectedTab] = useState('All');
    const [shouldSendEmail, setShouldSendEmail] = useState(false);
    const [eventCounts, setEventCounts] = useState({
        All: 0,
        'Pending Review': 0,
        Approved: 0,
        Rejected: 0,
        'Action Needed': 0,
    });

    // const fetchEventsToReview = () => {
    //     http.get('/event?status=Pending Review').then((res) => {
    //         setEventsToReview(res.data);
    //     }).catch(error => console.error('Error fetching events for review:', error));
    // };

    const activities = [
        { label: 'Tree Planting', value: 'treePlanting' },
        { label: 'Beach Recycling', value: 'beachRecycling' },
        { label: 'Picking Up Litter', value: 'pickingUpLitter' },
        { label: 'Others', value: 'others' },
    ];

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const onSearchChange = (e) => setSearch(e.target.value);

    const getEventIdEmail = async (eventId) => {
        try {
            const response = await http.get(`/event/${eventId}`);
            const eventData = response.data;
            setSelectedEmail(eventData.email);
            setShouldSendEmail(true); // Indicate that the email should be sent
        } catch (error) {
            console.error('Error fetching event:', error);
            setError('Failed to retrieve event data');
        }
    };

    useEffect(() => {
        if (shouldSendEmail) {
            sendEmail();
            setShouldSendEmail(false); // Reset the flag
        }
    }, [selectedEmail, shouldSendEmail]);

    function sendEmail() {
        const templateParams = {
            from_name: "PrásinosSG",
            message: reply,
            email: selectedEmail,
        };
    
        emailjs.send('service_v19cj05', 'template_zbxnmeb', templateParams, '_9k74a0UPRk_HmD_F')
          .then((result) => {
            console.log('Email successfully sent!', result.status, result.text);
          })
          .catch((error) => {
            console.error('Failed to send email:', error);
          });
    }

    const handleActivityChange = (event) => {
        const value = event.target.name;
        setSelectedActivities(prev => {
            const newActivities = prev.includes(value) ? prev.filter(activity => activity !== value) : [...prev, value];
            return newActivities;
        });
    };

    const searchEvents = () => {
        http.get(`/event?search=${encodeURIComponent(search)}`).then((res) => {
            setEventsToReview(res.data);
        }).catch(error => console.error('Error searching events:', error));
    };


    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };

    const onClickSearch = () => searchEvents();

    const onClickClear = () => {
        setSearch('');
        fetchAndFilterEvents();
    };

    const toggleDisplayMode = () => {
        setDisplayMode(displayMode === 'list' ? 'card' : 'list');
    };

    const sortEventsByStartDate = (events) => events.sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));

    const fetchAndFilterEvents = () => {
        http.get('/event').then((res) => {
            let filteredEvents = res.data;

            // Exclude events with status "Draft"
            filteredEvents = filteredEvents.filter(event => event.eventStatus !== 'Draft');

            if (selectedTab !== 'All') {
                filteredEvents = filteredEvents.filter(event => event.eventStatus === selectedTab);
            }
            if (selectedActivities.length > 0) {
                filteredEvents = filteredEvents.filter(event => selectedActivities.includes(event.eventActivity));
            }
            const sortedEvents = sortEventsByStartDate(filteredEvents);
            setEventsToReview(sortedEvents);

            // Calculate counts for each status
            const counts = {
                All: filteredEvents.length,
                'Pending Review': filteredEvents.filter(event => event.eventStatus === 'Pending Review').length,
                Approved: filteredEvents.filter(event => event.eventStatus === 'Approved').length,
                Rejected: filteredEvents.filter(event => event.eventStatus === 'Rejected').length,
                'Action Needed': filteredEvents.filter(event => event.eventStatus === 'Action Needed').length,
            };
            setEventCounts(counts);
        }).catch(error => console.error('Error fetching events:', error));
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        fetchAndFilterEvents();
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
// Inside the approveEvent function, add a dialog prompt for admin comments
    const approveEvent = (eventId) => {
        setIsDialogOpen(false);
        showToast("Event Approving", () => undoApproval());

        function undoApproval() {
            clearTimeout(approvalTimeout);
            return;
        }

        const approvalTimeout = setTimeout(() => {
            performApproval(eventId);
        }, 4000);

        function performApproval(eventId) {
            getEventIdEmail(eventId);
            setReply('Your event has been approved!');
            sendEmail();
            http.get('/user/auth').then((res) => {
                const adminId = res.data.user.id;
                const updateData = { eventStatus: 'Approved', adminId: adminId };
                if (comment) {
                    updateData.adminComment = comment;
                }
                http.put(`/event/${eventId}`, updateData)
                    .then(() => {
                        setEventsToReview(eventsToReview.map(event =>
                            event.id === eventId ? { ...event, eventStatus: 'Approved' } : event
                        ));
                        fetchAndFilterEvents();
                    })
                    .catch(error => {
                        toast.error('Error approving event');
                    });
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
            return;
        }

        const rejectionTimeout = setTimeout(() => {
            performRejection(eventId);
        }, 4000);

        function performRejection(eventId) {
            getEventIdEmail(eventId);
            setReply('Your event has been rejected!');
            sendEmail(reply, selectedEmail);
            http.get('/user/auth').then((res) => {
                const adminId = res.data.user.id;
                const updateData = { eventStatus: 'Rejected', adminId: adminId };
                if (comment) {
                    updateData.adminComment = comment;
                }
                http.put(`/event/${eventId}`, updateData)
                    .then(() => {
                        setEventsToReview(eventsToReview.map(event =>
                            event.id === eventId ? { ...event, eventStatus: 'Rejected' } : event
                        ));
                        fetchAndFilterEvents();
                    })
                    .catch(error => {
                        toast.error('Error rejecting event');
                    });
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
            getEventIdEmail(eventId);
            setReply('Your event require changes!');
            sendEmail();
            http.get('/user/auth').then((res) => {
                const adminId = res.data.user.id;
                const updateData = { eventStatus: 'Action Needed', adminId: adminId, requestChangefields: selectedFields };
                if (comment) {
                    updateData.adminComment = comment;
                }
                http.put(`/event/${eventId}`, updateData)
                    .then(() => {
                        setEventsToReview(eventsToReview.map(event =>
                            event.id === eventId ? { ...event, eventStatus: 'Action Needed', adminComment: comment, requestChangefields: selectedFields } : event
                        ));
                        fetchAndFilterEvents();
                    })
                    .catch(error => {
                        toast.error('Error requesting changes for event');
                    });
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
    }, [selectedActivities, selectedTab]);

    const capitalizeWords = (str) => {
        // Ensure all words start with an uppercase letter
        return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
            // Ensure the first character of each word is uppercase and subsequent capitals are separated with a space
            return txt.charAt(0).toUpperCase() + txt.substr(1).replace(/[A-Z]/g, ' $&');
        });
    };

    return (
        <Box style={{ marginTop: "50px"}}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Review Events
            </Typography>
            <Container>
                {/* Parent Box for alignment */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
                    {/* Search Bar Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Input
                            value={search}
                            placeholder="Search"
                            onChange={onSearchChange}
                            onKeyDown={onSearchKeyDown}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <IconButton color="primary" onClick={onClickSearch}>
                                <Search />
                            </IconButton>
                            <IconButton color="default" onClick={onClickClear}>
                                <Clear />
                            </IconButton>
                        </div>
                    </Box>
                    <Tabs value={selectedTab} onChange={handleTabChange}>
                        <Tab label={`All (${eventCounts.All})`} value="All" />
                        <Tab label={`Pending Review (${eventCounts['Pending Review']})`} value="Pending Review" />
                        <Tab label={`Approved (${eventCounts.Approved})`} value="Approved" />
                        <Tab label={`Rejected (${eventCounts.Rejected})`} value="Rejected" />
                        <Tab label={`Action Needed (${eventCounts['Action Needed']})`} value="Action Needed" />
                    </Tabs>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={displayMode === 'list' ? 'Show as Cards' : 'Show as List'}>
                            <IconButton onClick={toggleDisplayMode} color="primary">
                                {displayMode === 'list' ? <ViewModule /> : <ViewList />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Filter and Display Mode Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', width: '100%' }}>
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
            </Container>
            {displayMode === 'list' ? (
                <List>
                    {eventsToReview.map((event) => (
                        <ListItem
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            sx={{
                                display: 'flex', // Make the ListItem a flex container
                                justifyContent: 'space-between', // Space between children
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                cursor: 'pointer',
                                padding: '10px',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemAvatar>
                                    {event.eventImage && (
                                        <Avatar
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${event.eventImage}`}
                                            alt="event"
                                        />
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={event.eventName}
                                    secondary={
                                        <>
                                            <Box mb={0.5}> {/* Adjust the value as needed */}
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {event.eventOrganizerName}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="row">
                                                <Box display="flex" flexDirection="column" alignItems="start" mr={2}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }} >
                                                        <AccessTime sx={{ mr: 1, fontSize: '1rem' }} />
                                                        <span>{dayjs(event.eventStartDate).format('YYYY-MM-DD')} - {dayjs(event.eventEndDate).format('YYYY-MM-DD')}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Timer sx={{ mr: 1, fontSize: '1rem' }} />
                                                        <span>{event.eventStartTime} - {event.eventEndTime}</span>
                                                    </div>
                                                </Box>
                                                <Box display="flex" flexDirection="column" alignItems="start" justifyContent="center">
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <LocationOn sx={{ mr: 1, fontSize: '1rem' }} />
                                                        <span>{event.eventLocation}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <AttachMoney sx={{ mr: 1, fontSize: '1rem' }} />
                                                        <span>{`${event.participationFee}`}</span>
                                                    </div>
                                                </Box>
                                            </Box>
                                        </>
                                    }
                                />
                            </Box>
                            <Box
                                sx={{
                                    backgroundColor: event.eventStatus === 'Approved' ? '#28a745' : event.eventStatus === 'Pending Review' ? '#d39e00' : event.eventStatus === 'Rejected' ? '#dc3545' : event.eventStatus === 'Draft' ? '#6c757d' : event.eventStatus === 'Action Needed' ? '#007bff' : '#f44336',
                                    alignSelf: 'right', // Align the status container vertically
                                    padding: '4px 8px', // Add some padding around the text
                                    borderRadius: '4px', // Optional: add a border radius for rounded corners
                                }}
                            >
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{
                                        color: 'white', // Set text color to white
                                    }}
                                >
                                    {event.eventStatus}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            ) : (
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
                </Grid>)}
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
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6">Username</Typography>
                                        <Typography variant="body1">{selectedEvent.user.name}</Typography>
                                    </Grid>
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
                                <IconButton variant="contained" onClick={() => setIsRequestChangeClicked(false)} style={{ marginLeft: '10px' }}>
                                    <Close />
                                </IconButton>
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
                                    <input type="checkbox" id="eventDate" onChange={() => handleFieldChange('eventDateandTime')} />
                                    <label htmlFor="eventDate">Event Date and Time</label>
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