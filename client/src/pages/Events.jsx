import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Divider, RadioGroup, FormControlLabel, Radio, Menu, FormControl, FormGroup, MenuItem, Checkbox } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, DateRange, Event, Timer, AttachMoney, Delete, Visibility, ClearAll, EventAvailable } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Events() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedActivities, setSelectedActivities] = useState([]);

    const onSearchChange = (e) => setSearch(e.target.value);

    const sortEventsByStartDate = (events) => events.sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));

    const getEvents = (activities = selectedActivities) => {
        // Check if user.id is available
        if (!user || !user.id || user.role) {
            setEventList([]); // Set event list to empty array
            return; // Return early if user.id or user.role is not available
        }
        http.get('/event', {
            params: {
                userId: user.id // Include user_id in the request parameters
            }
        }).then((res) => {
            let filteredEvents = res.data;

            // Filter events to include only those created by the logged-in user
            filteredEvents = filteredEvents.filter(event => event.userId === user.id);

            // Step 3: Filter events if there are selected activities
            if (activities.length > 0) {
                filteredEvents = filterEventsByActivity(filteredEvents, activities);
            }
            const sortedEvents = sortEventsByStartDate(filteredEvents);
            setEventList(sortedEvents);
        }).catch(error => console.error('Error fetching events:', error));
    };


    const searchEvents = () => {
        http.get(`/event?search=${encodeURIComponent(search)}`).then((res) => {
            let searchEvents = res.data;
            searchEvents = searchEvents.filter(event => event.userId === user.id);
            const sortedEvents = sortEventsByStartDate(searchEvents);
            setEventList(sortedEvents);
        }).catch(error => console.error('Error searching events:', error));
    };

    useEffect(() => getEvents(), []);

    const handleActivityChange = (event) => {
        const value = event.target.name;
        setSelectedActivities(prev => {
            const newActivities = prev.includes(value) ? prev.filter(activity => activity !== value) : [...prev, value];
            // Call getEvents with the new set of selected activities
            getEvents(newActivities);
            return newActivities;
        });
    };

    const filterEventsByActivity = (events, selectedActivities) => {
        if (selectedActivities.length === 0) return events;
        return events.filter(event => selectedActivities.includes(event.eventActivity));
    };

    const activities = [
        { label: 'Tree Planting', value: 'treePlanting' },
        { label: 'Beach Recycling', value: 'beachRecycling' },
        { label: 'Picking Up Litter', value: 'pickingUpLitter' },
        { label: 'Others', value: 'others' },
    ];

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };

    const onClickSearch = () => searchEvents();

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    const onDeleteEvent = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            http.delete(`/event/${eventId}`)
                .then(() => setEventList(eventList.filter(event => event.id !== eventId)))
                .catch(error => console.error('Error deleting event:', error));
        }
    };

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

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
                <IconButton color="buttton"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Button aria-controls="activity-menu" aria-haspopup="true" onClick={handleClick} variant='contained' sx={{ mr: { xs: 0.5, sm: 1.5, md: 2.5 } }}>
                    Filter by Activities
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
                {
                    user && user.role !== 'admin' && (
                        <Link to="/addevent">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>


            {/* <RadioGroup
                row
                aria-labelledby="activity-sort-label"
                name="activity-sort"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(selectedActivity === e.target.value ? '' : e.target.value)}
            >
                <FormControlLabel value="treePlanting" control={<Radio />} label="Tree Planting" />
                <FormControlLabel value="beachRecycling" control={<Radio />} label="Beach Recycling" />
                <FormControlLabel value="pickingUpLitter" control={<Radio />} label="Picking Up Litter" />
                <FormControlLabel value="others" control={<Radio />} label="Others" />
                <IconButton color="default" onClick={() => setSelectedActivity('')}>  
                    <ClearAll />
                </IconButton>
            </RadioGroup> */}

            <Grid container spacing={2}>
                {
                    eventList.map((event, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
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
                                            {
                                                user && user.id === event.userId && user.role !== 'admin' && (
                                                    <>
                                                        {event.eventStatus !== "Rejected" && (
                                                            <IconButton color="primary" sx={{ padding: '4px' }} href={`/editevent/${event.id}`}>
                                                                <Edit />
                                                            </IconButton>
                                                        )}
                                                        {!["Pending Review", "Approved", "Action Needed"].includes(event.eventStatus) && (
                                                            <IconButton color="error" sx={{ padding: '4px' }} onClick={() => onDeleteEvent(event.id)}>
                                                                <Delete />
                                                            </IconButton>
                                                        )}
                                                        <IconButton color="primary" sx={{ padding: '4px' }} href={`/event/${event.id}`}>
                                                            <Visibility />
                                                        </IconButton>
                                                        {user.id === event.userId && event.eventStatus === "Approved" && (
                                                            <IconButton color="primary" sx={{ padding: '4px' }} href={`/attendance/${event.id}`}>
                                                                <EventAvailable />
                                                            </IconButton>
                                                        )}
                                                    </>
                                                )
                                            }

                                            {/* <Link to={`/event/${event.id}`} onClick={(e) => e.stopPropagation()}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Visibility />
                                                </IconButton>
                                            </Link> */}
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
            <Box mt={5}>     </Box>
        </Box>
    );
}

export default Events;
