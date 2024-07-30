import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Checkbox, FormControl, FormLabel, FormControlLabel, FormGroup, RadioGroup, Radio, InputLabel, Select, MenuItem, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Add, Delete, Upload, Remove } from '@mui/icons-material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventImage, setImageFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [supportingDocs, setSupportingDocs] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [requestFields, setRequestFields] = useState([]);
    const [eventStatus, checkEventStatus] = useState(null);
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [deleteFromServer, setDeleteFromServer] = useState(false); // Add a state to track if the image should be deleted from the server
    const [apiKey] = useState('AIzaSyAWGu_ttZhiRdqdAQe3PgCE4VZmJivPIiE');

    const formik = useFormik({
        initialValues: {
            email: "",
            contactNumber: "",
            useAccountInfo: false,
            consentApproved: false,
            termsApproved: false,
            eventLocation: "",
            eventDescription: "",
            fundingRequests: [],
            participationFee: 0,
            eventActivity: "",
            otherEventActivity: "",
            eventName: "",
            eventOrganizerType: "",
            eventOrganizerName: "",
            eventScope: "",
            expectedAttendance: "",
            eventStartDate: "",
            eventEndDate: "",
            eventStartTime: "",
            eventEndTime: "",
            eventStatus: ""
        },

        validationSchema: yup.object({
            email: yup.string().email('Invalid email format').required('Email is required'),
            contactNumber: yup.string().matches(/^\d+$/, 'Contact number must be digits only').required('Contact number is required'),
            consentApproved: yup.boolean().oneOf([true], 'Consent is required'),
            termsApproved: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
            eventLocation: yup.string().required('Event location is required'),
            eventDescription: yup.string().trim().min(3, 'Event description must be at least 3 characters long').max(900, 'Event description must be at most 500 characters long').required('Event description is required'),
            eventActivity: yup.string().required('Event activity is required'),
            otherEventActivity: yup.string().notRequired(),
            eventName: yup.string().trim().min(3, 'Event name must be at least 3 characters long').max(100, 'Event name must be at most 100 characters long').required('Event name is required'),
            eventOrganizerType: yup.string().required('Event organizer type is required'),
            eventOrganizerName: yup.string().required('Event organizer name is required'),
            eventScope: yup.string().required('Event scope is required'),
            expectedAttendance: yup.number().required('Expected attendance is required').min(1, 'At least one attendee is required'),
            eventStartDate: yup.date().required('Event start date is required').min(new Date(), "Event can't start from the past"),
            eventEndDate: yup.date().required('Event end date is required').min(yup.ref('eventStartDate'), 'Event must end on or after event start date'),
            eventStartTime: yup.string().required('Event start time is required'),
            eventEndTime: yup.string().required('Event end time is required'),
            participationFee: yup.number().min(0, 'Participation fee cannot be negative')
        }),

        onSubmit: async (data) => {
            if (eventImage) {
                data.eventImage = eventImage;
            } else {
                data.eventImage = 'prasinos_no_image.jpg';
            }
            data.supportingDocs = supportingDocs;
            data.eventStatus = "Pending Review"

            try {
                const response = await http.put(`/event/${id}`, data);
                console.log('Response:', response.data);
                if (deleteFromServer == true) { // Check if handleDeleteImage function is available
                    handleDeleteImage(); // Call handleDeleteImage function
                }
                navigate('/eventsproposal'); // Use navigate from react-router-dom to redirect
            } catch (error) {
                console.error('Error:', error);
            }

        },
    });



    const discardChanges = async () => {
        // Example sanitization function (adjust according to your needs)
        const formData = { originalData }; // Ensure formData is correctly structured

        try {
            const response = await http.put(`/event/${id}`, formData);
            console.log('Response:', response.data);
            window.location.href = 'http://localhost:3000/eventsproposal';
        } catch (error) {
            console.error('Error:', error);
            // Optionally, handle specific errors differently
        }
    };

    const getPlaceIdByName = async (placeName) => {
        if (!placeName) return;
        const searchUrl = `/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&key=${apiKey}`;
        try {
            const response = await fetch(searchUrl);
            if (!response.ok) {
                console.error(`HTTP error: ${response.status} ${response.statusText}`);
                return;
            }
            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Received non-JSON response:", await response.text());
                return;
            }
            const data = await response.json(); 
            if (data.candidates && data.candidates.length > 0) {
                const placeId = data.candidates[0].place_id;
                return placeId;
            } else {
                console.log('No place ID found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            return null;
        }
    };

    const fetchPlaceDetails = async (placeId) => {
        if (!placeId) return;
        const apiUrl = `/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error(`HTTP error: ${response.status} ${response.statusText}`);
                return;
            }
            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Received non-JSON response:", await response.text());
                return;
            }
            const data = await response.json();
            setSelectedLocation(data.result);
            const { lat, lng } = data.result.geometry.location;
            setLat(lat);
            setLng(lng);

            if (lat === null || lng === null) {
                return null;
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    useEffect(() => {
        const fetchPlaceIdAndDetails = async (eventLocation) => {
            if (eventLocation) {
                let placeId = await getPlaceIdByName(eventLocation);
                if (placeId) {
                    fetchPlaceDetails(placeId);
                }
            }
        };

        const fetchEventData = async () => {
            try {
                const response = await http.get(`/event/${id}`);
                const eventData = response.data;
                formik.setValues({
                    ...formik.initialValues,
                    ...eventData
                });
                setImageFile(eventData.eventImage);
                setImagePreview(eventData.imagePreview);
                setSupportingDocs(eventData.supportingDocs);
                checkEventStatus(eventData.eventStatus);
                setRequestFields(eventData.requestChangefields);
                setLoading(false);
                setOriginalData(eventData);
                fetchPlaceIdAndDetails(eventData.eventLocation);
            
            } catch (error) {
                console.error('Error fetching event:', error);
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const saveAsDraft = async () => {
        const formData = { ...formik.values, eventStatus: "Draft" };
        try {
            // Ensure imageFile is set if it exists
            if (eventImage) {
                formData.eventImage = eventImage;
            }
            // Ensure supportingDocs is set
            formData.supportingDocs = supportingDocs;
            const response = await http.put(`/event/${id}`, formData);
            // Redirect or give feedback on success
            window.location.href = 'http://localhost:3000/eventsproposal';
        } catch (error) {
            console.error('Error:', error.config);
            // Handle error
        }
    };

    const handleEventActivityChange = (event) => {
        formik.handleChange(event);
        if (event.target.value !== 'others') {
            formik.setFieldValue('otherEventActivity', '');
        }
    };

    const handleRemoveSupportingDoc = () => {
        setSupportingDocs(supportingDocs.slice(0, supportingDocs.length - 1));
    };

    const handleClickOpen = async () => {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length === 0 && formik.dirty) {
            setOpen(true);
        } else {
            // Manually set all fields as touched to show errors without interfering
            formik.setTouched(
                Object.keys(formik.values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
            );
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = async () => {
        await formik.handleSubmit();
        setOpen(false);
    };

    const handleDeleteRequest = (index) => {
        const updatedRequests = formik.values.fundingRequests.filter((_, i) => i !== index);
        formik.setFieldValue('fundingRequests', updatedRequests);
    };

    const handleTermsClick = () => {
        window.open('/src/Prasinos_termsandconditions.pdf', '_blank');
    };

    const isEditableBasedOnStatus = (field, event) => {
        const editableInDraft = ['email', 'contactNumber', 'eventLocation', 'eventDescription', 'eventActivity', 'otherEventActivity', 'eventName', 'eventOrganizerType', 'eventOrganizerName', 'eventScope', 'expectedAttendance', 'eventStartDate', 'eventEndDate', 'eventStartTime', 'eventEndTime', 'participationFee', 'useAccountInfo', 'supportingDocuments', 'eventImage'];
        const editableInPendingReview = ['eventDescription', 'eventStartDate', 'eventEndDate', 'eventStartTime', 'eventEndTime', 'participationFee', 'eventScope'];

        let localRequestFields = Array.isArray(requestFields) ? [...requestFields] : []; // Ensure requestFields is an array
        if (localRequestFields.includes("eventDateandTime")) {
            localRequestFields = localRequestFields.filter(field => field !== "eventDateandTime");
            localRequestFields.push('eventStartDate', 'eventEndDate', 'eventStartTime', 'eventEndTime');
        }
        const editableInActionNeeded = localRequestFields;

        if (eventStatus === 'Draft') {
            return editableInDraft.includes(field);
        } else if (eventStatus === 'Pending Review') {
            return editableInPendingReview.includes(field);
        } else if (eventStatus === 'Action Needed') {
            return editableInActionNeeded.includes(field);
        }
        return false;
    };

    const handleSupportingDocChange = async (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only PDF, Word, Excel, PowerPoint, JPG/JPEG, and PNG files are allowed');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);

            try {
                const response = await http.post('/file/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const updatedDocs = [...supportingDocs];
                const previewUrl = URL.createObjectURL(file);
                updatedDocs[index] = {
                    ...updatedDocs[index],
                    file: file,
                    actualfilename: file.name,
                    filename: response.data.filename,
                    preview: previewUrl,

                };
                setSupportingDocs(updatedDocs);
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error('Error uploading file');
            }
        }
    };

    const handleSupportingDocNotesChange = (index, value) => {
        const updatedDocs = [...supportingDocs];
        updatedDocs[index].notes = value;
        setSupportingDocs(updatedDocs);
    };

    const handleDeleteSupportingDoc = async (index) => {
        const docToDelete = supportingDocs[index];
        if (docToDelete && docToDelete.filename) {
            try {
                const response = await http.delete(`file/delete/${encodeURIComponent(docToDelete.filename)}`);
                console.log('Response:', response);
                if (response.status === 200) {
                    console.log('Supporting document deleted successfully:', response.data.message);
                    // Remove the document from the state after successful deletion
                    const updatedDocs = supportingDocs.filter((_, i) => i !== index);
                    setSupportingDocs(updatedDocs);
                } else {
                    console.error('Error deleting supporting document: Server responded with status', response.status);
                }
            } catch (error) {
                console.error('Error deleting supporting document:', error);
            }
        }
    };

    const handleAddSupportingDoc = () => {
        setSupportingDocs([...supportingDocs, { file: null, filename: '', notes: '' }]);
    };

    const onFileChange = async (e, index, isEventImage = false) => {
        let file = e.target.files[0];
        if (file) {
            // Check if the file type is an image
            if (isEventImage && !file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }

            if (isEventImage && file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);

            try {
                const response = await http.post('/file/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (isEventImage) {
                    setImageFile(response.data.filename);
                    setImagePreview(URL.createObjectURL(file));
                    setDeleteFromServer(false)
                } else {
                    const newSupportingDocs = [...supportingDocs];
                    newSupportingDocs[index] = {
                        ...newSupportingDocs[index],
                        file,
                        filename: response.data.filename,
                        preview: URL.createObjectURL(file),
                        fileLink: response.data.fileLink // Assuming the backend response includes a file link
                    };
                    setSupportingDocs(newSupportingDocs);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error('Error uploading file');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }


    const onDeleteEvent = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            http.delete(`/event/${eventId}`)
                .then(() => {
                    console.log('Event deleted successfully');
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Error deleting event:', error);
                });
        }
    };
    const fetchLocationSuggestions = async (input) => {
        if (!input) return;
        const apiUrl = `/maps/api/place/autocomplete/json?input=${input}&types=geocode&region=sg&key=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                console.error(`HTTP error: ${response.status} ${response.statusText}`);
                return;
            }
            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Received non-JSON response:", await response.text());
                return;
            }
            const data = await response.json();
            setSuggestions(data.predictions);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, value);
        fetchLocationSuggestions(value);
    };

    const handleSuggestionClick = async (suggestion) => {
        console.log('handleSuggestionClick called with:', suggestion);
        const locationDetails = await fetchPlaceDetails(suggestion.place_id);

        // Ensure eventLocation is a string
        const eventLocation = suggestion.description;
        formik.setFieldValue('eventLocation', eventLocation);

        console.log('Setting eventLocation to:', eventLocation);
        console.log('Location details:', locationDetails);

        if (locationDetails) {
            formik.setFieldValue('formattedAddress', locationDetails.formatted_address);
            formik.setFieldValue('placeId', locationDetails.place_id);
        }

        setSuggestions([]); // Clear suggestions after selection
    };

    const handleDeleteImage = async () => {
        if (eventImage && eventImage !== 'prasinos_no_image.jpg') {
            try {
                const response = await http.delete(`file/delete/${encodeURIComponent(eventImage)}`);
                console.log('Response:', response);
                if (response.status === 200) {
                    const data = response.data;
                    console.log('Image deleted successfully:', data.message);
                } else {
                    console.error('Error deleting image: Server responded with status', response.status);
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

    };

    const handleSubmitforEventImage = async () => {
        setImageFile(null);
        setImagePreview(null);
        setDeleteFromServer(true);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <FormControl component="fieldset" fullWidth margin="dense">
                            <FormLabel component="legend">Event Activity</FormLabel>
                            <RadioGroup
                                aria-label="eventActivity"
                                name="eventActivity"
                                value={formik.values.eventActivity}
                                onChange={handleEventActivityChange}
                                onBlur={formik.handleBlur}
                                row
                            >
                                <FormControlLabel value="treePlanting" control={<Radio />} label="Tree Planting" disabled={!isEditableBasedOnStatus('eventActivity')} />
                                <FormControlLabel value="beachRecycling" control={<Radio />} label="Beach Recycling" disabled={!isEditableBasedOnStatus('eventActivity')} />
                                <FormControlLabel value="pickingUpLitter" control={<Radio />} label="Picking Up Litter" disabled={!isEditableBasedOnStatus('eventActivity')} />
                                <FormControlLabel value="others" control={<Radio />} label="Others (Please specify)" disabled={!isEditableBasedOnStatus('eventActivity')} />
                            </RadioGroup>
                            {formik.values.eventActivity === 'others' && (
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Please specify"
                                    name="EventActivity"
                                    value={formik.values.otherEventActivity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!isEditableBasedOnStatus('otherEventActivity')}
                                    error={formik.touched.otherEventActivity && Boolean(formik.errors.otherEventActivity)}
                                    helperText={formik.touched.otherEventActivity && formik.errors.otherEventActivity}
                                />
                            )}
                            {formik.touched.eventActivity && formik.errors.eventActivity && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.eventActivity}
                                </Typography>
                            )}
                        </FormControl>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Name"
                            name="eventName"
                            disabled={!isEditableBasedOnStatus('eventName')}
                            value={formik.values.eventName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                            helperText={formik.touched.eventName && formik.errors.eventName}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Event Organizer Type</InputLabel>
                            <Select
                                name="eventOrganizerType"
                                value={formik.values.eventOrganizerType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventOrganizerType && Boolean(formik.errors.eventOrganizerType)}
                                disabled={!isEditableBasedOnStatus('eventOrganizerType')}
                            >
                                <MenuItem value="individual">Individual</MenuItem>
                                <MenuItem value="organization">Organization</MenuItem>
                                <MenuItem value="community club">Community Club</MenuItem>
                                <MenuItem value="government agency">Government Agency</MenuItem>
                            </Select>
                            {formik.touched.eventOrganizerType && formik.errors.eventOrganizerType && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.eventOrganizerType}
                                </Typography>
                            )}
                        </FormControl>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Organizer Name"
                            name="eventOrganizerName"
                            disabled={!isEditableBasedOnStatus('eventOrganizerName')}
                            value={formik.values.eventOrganizerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventOrganizerName && Boolean(formik.errors.eventOrganizerName)}
                            helperText={formik.touched.eventOrganizerName && formik.errors.eventOrganizerName}
                        />
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <FormControl component="fieldset" fullWidth margin="dense">
                                    <FormLabel component="legend">Event Scope</FormLabel>
                                    <RadioGroup
                                        aria-label="eventScope"
                                        name="eventScope"
                                        value={formik.values.eventScope}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        row
                                    >
                                        <FormControlLabel value="open" control={<Radio />} label="Open to public" />
                                        <FormControlLabel value="invitiation" control={<Radio />} label="By invitation" />
                                    </RadioGroup>
                                    {formik.touched.eventScope && formik.errors.eventScope && (
                                        <Typography variant="caption" color="error">
                                            {formik.errors.eventScope}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Expected Attendance"
                                    name="expectedAttendance"
                                    type="number"
                                    value={formik.values.expectedAttendance}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.expectedAttendance && Boolean(formik.errors.expectedAttendance)}
                                    helperText={formik.touched.expectedAttendance && formik.errors.expectedAttendance}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Event Start Date"
                                    name="eventStartDate"
                                    type="date"
                                    value={formik.values.eventStartDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={formik.touched.eventStartDate && Boolean(formik.errors.eventStartDate)}
                                    helperText={formik.touched.eventStartDate && formik.errors.eventStartDate}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Event End Date"
                                    name="eventEndDate"
                                    type="date"
                                    value={formik.values.eventEndDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={formik.touched.eventEndDate && Boolean(formik.errors.eventEndDate)}
                                    helperText={formik.touched.eventEndDate && formik.errors.eventEndDate}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Event Start Time"
                                    name="eventStartTime"
                                    type="time"
                                    value={formik.values.eventStartTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={formik.touched.eventStartTime && Boolean(formik.errors.eventStartTime)}
                                    helperText={formik.touched.eventStartTime && formik.errors.eventStartTime}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Event End Time"
                                    name="eventEndTime"
                                    type="time"
                                    value={formik.values.eventEndTime}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={formik.touched.eventEndTime && Boolean(formik.errors.eventEndTime)}
                                    helperText={formik.touched.eventEndTime && formik.errors.eventEndTime}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="on"
                            label="Event Location"
                            name="eventLocation"
                            value={formik.values.eventLocation}
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventLocation && Boolean(formik.errors.eventLocation)}
                            helperText={formik.touched.eventLocation && formik.errors.eventLocation}
                        />
                        {Array.isArray(suggestions) && suggestions.length > 0 && (
                            <List>
                                {suggestions.map((suggestion) => (
                                    <ListItem button key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion)}>
                                        <ListItemText primary={suggestion.description} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        {selectedLocation && (
                            <div style={{ height: '400px', width: '100%' }}>
                                <LoadScript googleMapsApiKey="AIzaSyAWGu_ttZhiRdqdAQe3PgCE4VZmJivPIiE">
                                    <GoogleMap
                                        center={{ lat, lng }}
                                        zoom={15}
                                        mapContainerStyle={{ height: '100%', width: '100%' }}
                                    >
                                        <Marker position={{ lat, lng }} />
                                    </GoogleMap>
                                </LoadScript>
                            </div>
                        )}
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Description"
                            name="eventDescription"
                            value={formik.values.eventDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                            helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                            multiline
                            rows={4}
                        />
                        <Box>
                            <Typography variant="h6">Funding Requests</Typography>
                            <Button disabled={!isEditableBasedOnStatus('fundingRequests')} onClick={() => formik.setFieldValue('fundingRequests', [...formik.values.fundingRequests, { item: '', purpose: '', source: '', amountRequested: '' }])}>
                                Add
                            </Button>
                            {formik.values.fundingRequests.map((request, index) => (
                                <Grid container spacing={2} key={index} alignItems="center">
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Item"
                                            name={`fundingRequests[${index}].item`}
                                            value={request.item}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditableBasedOnStatus('fundingRequests')}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Purpose"
                                            name={`fundingRequests[${index}].purpose`}
                                            value={request.purpose}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditableBasedOnStatus('fundingRequests')}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Source"
                                            name={`fundingRequests[${index}].source`}
                                            value={request.source}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditableBasedOnStatus('fundingRequests')}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            label="Amount Requested"
                                            name={`fundingRequests[${index}].amountRequested`}
                                            value={request.amountRequested}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            disabled={!isEditableBasedOnStatus('fundingRequests')}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton disabled={!isEditableBasedOnStatus('fundingRequests')} onClick={() => handleDeleteRequest(index)}>
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Participation Fee"
                            name="participationFee"
                            type="number"
                            value={formik.values.participationFee}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.participationFee && Boolean(formik.errors.participationFee)}
                            helperText={formik.touched.participationFee && formik.errors.participationFee}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Contact Number"
                            name="contactNumber"
                            value={formik.values.contactNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditableBasedOnStatus('contactNumber')}
                            error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                            helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!isEditableBasedOnStatus('email')}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box>
                            {eventImage && eventImage !== 'prasinos_no_image.jpg' ? (
                                <>
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${eventImage}`}
                                        alt="Preview"
                                        style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', marginBottom: '10px' }}
                                    />
                                    <IconButton onClick={handleSubmitforEventImage} aria-label="delete" color="error" disabled={!isEditableBasedOnStatus('eventImage')}>
                                        <Delete />
                                    </IconButton>
                                </>
                            ) : null}
                            <Button variant="contained" component="label" disabled={!isEditableBasedOnStatus('eventImage')}>
                                Upload Event Image
                                <input type="file" hidden onChange={(e) => onFileChange(e, null, true)} />
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" style={{ margin: 0 }}>
                                    Supporting Documents
                                </Typography>
                                <IconButton
                                    onClick={handleAddSupportingDoc}
                                    style={{ marginLeft: '8px' }}
                                    disabled={!isEditableBasedOnStatus('supportingDocuments')}
                                >
                                    <Add />
                                </IconButton>
                                {supportingDocs.length > 0 && (
                                    <IconButton onClick={handleRemoveSupportingDoc} disabled={!isEditableBasedOnStatus('supportingDocuments')} >
                                        <Remove />
                                    </IconButton>
                                )}
                            </div>
                            {supportingDocs.map((doc, index) => (
                                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <IconButton
                                            component="label"
                                            disabled={!isEditableBasedOnStatus('supportingDocuments')}
                                        >
                                            <Upload />
                                            <input
                                                type="file"
                                                hidden
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.ppt,.pptx"
                                                onChange={(e) => handleSupportingDocChange(e, index)}
                                            />
                                        </IconButton>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            label="Notes"
                                            value={doc.notes}
                                            onChange={(e) => handleSupportingDocNotesChange(index, e.target.value)}
                                            sx={{ flexGrow: 1 }}
                                        />
                                        {doc.filename && (
                                            <>
                                                <Typography variant="body2">
                                                    Uploaded File: {doc.actualfilename.length > 20 ? `${doc.actualfilename.substring(0, 20)}...` : doc.actualfilename}
                                                </Typography>
                                                {doc.file && typeof doc.file.type === 'string' && doc.file.type.startsWith('image/') ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${doc.filename}`}
                                                        alt={doc.filename}
                                                        style={{ maxHeight: 100, maxWidth: 100, marginTop: '8px', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <a
                                                        href={`${import.meta.env.VITE_FILE_BASE_URL}${doc.filename}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ marginTop: '8px' }}
                                                    >
                                                        Preview File
                                                    </a>
                                                )}
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteSupportingDoc(index)}
                                                    disabled={!isEditableBasedOnStatus('supportingDocuments')}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>


                    </Grid>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.useAccountInfo}
                                    onChange={formik.handleChange}
                                    name="useAccountInfo"
                                    disabled={!isEditableBasedOnStatus('useAccountInfo')}
                                />
                            }
                            label="Use account information"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.consentApproved}
                                    onChange={formik.handleChange}
                                    name="consentApproved"
                                    disabled
                                />
                            }
                            label="By submitting this proposal, you understand that all activities are subject to approval and will only be delivered when approved"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.termsApproved}
                                    onChange={formik.handleChange}
                                    disabled
                                    name="termsApproved"
                                />
                            }
                            label={
                                <>
                                    I have read and agreed to the{' '}
                                    <Link
                                        component="button"
                                        onClick={handleTermsClick}
                                        style={{ color: 'blue', textDecoration: 'underline' }}
                                        disabled
                                    >
                                        Terms and Conditions of Prásinos
                                    </Link>
                                </>
                            }
                        />
                    </FormGroup>
                </Grid>
                {/* <Box mt={2} display="flex" justifyContent="flex-end" width="100%" pr={2}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                        Submit Event
                    </Button>
                    <Button variant="outlined" color="primary" type="button" sx={{ mt: 2, mr: 2 }} onClick={saveAsDraft}>
                        Update and Save as Draft
                    </Button>
                    <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => onDeleteEvent(id)}>
                        Delete Event
                    </Button>
                </Box> */}
                <Box mt={2} display="flex" justifyContent="flex-end" width="100%" pr={2}>
                    {eventStatus === "Pending Review" ? (
                        <>
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                                Update Submitted Event
                            </Button>
                            <Button variant="outlined" sx={{ mt: 2 }} onClick={discardChanges}>
                                Discard Changes
                            </Button>
                        </>
                    ) : eventStatus === "Action Needed" ? (
                        <>
                            <div>
                                <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={handleClickOpen}>
                                    Resubmit Event
                                </Button>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{"Resubmit Event"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to resubmit the event? This cannot be undone. Make sure the changes are correct before resubmitting.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={handleConfirm} autoFocus>
                                            Confirm
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <Button variant="contained" type="button" sx={{ mr: 2 }} onClick={handleClickOpen}>
                                    Submit Event
                                </Button>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{"Submit Event"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to submit the event? This cannot be undone. You can save as draft if you are not ready to submit yet. You can only edit limited fields after submission.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={handleConfirm} autoFocus>
                                            Confirm
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            <Button variant="outlined" color="primary" type="button" sx={{ mt: 2, mr: 2 }} onClick={saveAsDraft}>
                                Update and Save as Draft
                            </Button>
                            <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => onDeleteEvent(id)}>
                                Delete Event
                            </Button>
                        </>
                    )}
                </Box>
                <Box mt={2}>     </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default EditEvent;

