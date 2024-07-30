import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Checkbox, FormControl, FormLabel, FormControlLabel, FormHelperText, FormGroup, RadioGroup, Radio, InputLabel, Select, MenuItem, IconButton, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Add, Delete, Upload, Remove } from '@mui/icons-material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { useEffect } from 'react';
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import communityClubs from '../../../server/CommunityClubs.json';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function AddEvent() {
    const { user } = useContext(UserContext);
    const [imageFile, setImageFile] = useState(null);
    const [supportingDocs, setSupportingDocs] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [apiKey] = useState('AIzaSyAWGu_ttZhiRdqdAQe3PgCE4VZmJivPIiE');

    const readClubs = communityClubs.filter(club =>
        club.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const validate = values => {
        const errors = {};

        if (values.eventActivity === 'others' && !values.otherEventActivity) {
            errors.otherEventActivity = 'Please specify the activity';
        }

        return errors;
    };

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
            eventStatus: "",
        },

        validationSchema: yup.object().shape({
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
            expectedAttendance: yup.number().required('Expected attendance is required').min(2, 'At least two attendees are required').positive('Expected attendance must be a positive number or zero'),
            eventStartDate: yup.date().required('Event start date is required').min(new Date(), "Event can't start today or from the past"),
            eventEndDate: yup.date().required('Event end date is required').min(yup.ref('eventStartDate'), 'Event must end on or after event start date'),
            eventStartTime: yup.string().required('Event start time is required'),
            eventEndTime: yup.string().required('Event end time is required'),
            participationFee: yup.number().min(0, 'Participation fee cannot be negative')
        }),

        validate,

        onSubmit: async (data) => {

            try {
                // Ensure imageFile is set if it exists
                if (imageFile) {
                    data.eventImage = imageFile;
                } else {
                    data.eventImage = 'prasinos_no_image.jpg';
                }

                // Ensure supportingDocs is set
                data.supportingDocs = supportingDocs;
                data.eventStatus = "Pending Review"

                const response = await http.post('/event/events', data);

                // Redirect on success
                window.location.href = 'http://localhost:3000/eventsproposal';
            } catch (error) {
                console.error('Error:', error.config);
            }

        }


    });

    const saveAsDraft = async () => {
        const formData = { ...formik.values, eventStatus: "Draft" };
        try {
            // Ensure imageFile is set if it exists
            if (imageFile) {
                formData.eventImage = imageFile;
            }
            // Ensure supportingDocs is set
            formData.supportingDocs = supportingDocs;
            const response = await http.post('/events', formData);
            // Redirect or give feedback on success
            window.location.href = 'http://localhost:3000/eventsproposal';
        } catch (error) {
            console.error('Error:', error.config);
            // Handle error
        }
    };

    useEffect(() => {
        if (formik.values.useAccountInfo) {
            formik.setFieldValue('email', user.email);
            formik.setFieldValue('contactNumber', user.phoneNumber);
        } else {
            formik.setFieldValue('email', '');
            formik.setFieldValue('contactNumber', '');
        }
    }, [formik.values.useAccountInfo, user]);


    const handleEventActivityChange = (event) => {
        formik.handleChange(event);
        if (event.target.value !== 'others') {
            formik.setFieldValue('otherEventActivity', '');
        }
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

    const handleDeleteImage = async () => {
        if (imageFile) {
            try {
                const response = await http.delete(`file/delete/${encodeURIComponent(imageFile)}`);
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
        setImageFile(null);
        setImagePreview(null);
    };

    // const validateLocation = async (location) => {
    //     const geocodeUrl = `/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    //     console.log('Validating location with URL:', geocodeUrl);

    //     try {
    //         const geocodeResponse = await axios.get(geocodeUrl);
    //         console.log('Geocode response:', geocodeResponse);

    //         const geocodeResults = geocodeResponse.data.results;
    //         if (geocodeResults) {
    //             const locationData = geocodeResults[0];
    //             const country = locationData.address_components.find(component =>
    //                 component.types.includes('country')
    //             );

    //             if (country && country.short_name === 'SG') {
    //                 setIsLocationValid(true);
    //                 return true;
    //             } else {
    //                 setIsLocationValid(false);
    //                 return false;
    //             }
    //         } else {
    //             setIsLocationValid(false);
    //             return false;
    //         }
    //     } catch (error) {
    //         console.error('Error validating location:', error);
    //         setIsLocationValid(false);
    //         return false;
    //     }
    // };

    const handleDeleteRequest = (index) => {
        const updatedRequests = formik.values.fundingRequests.filter((_, i) => i !== index);
        formik.setFieldValue('fundingRequests', updatedRequests);
    };

    const handleTermsClick = () => {
        window.open('/src/Prasinos_termsandconditions.pdf', '_blank');
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

                if (file.size > 1024 * 1024) {
                    toast.error('Maximum file size is 1MB');
                    return;
                }
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

    const handleRemoveSupportingDoc = () => {
        setSupportingDocs(supportingDocs.slice(0, supportingDocs.length - 1));
    };

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            // Check if the file type is an image
            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }

            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                    setImagePreview(URL.createObjectURL(file));
                })
                .catch(function (error) {
                    console.log(error.response);
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
            console.log('Fetched data:', data); // Add this line to log the fetched data
            setSelectedLocation(data.result);
            const { lat, lng } = data.result.geometry.location;
            setLat(lat);
            setLng(lng);

            if (lat === null || lng === null) {
                return null;
            }
            
        console.log('Place details:', data.result);
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
};

const handleSuggestionClick = async (suggestion) => {
    console.log('handleSuggestionClick called with:', suggestion);
    const locationDetails = await fetchPlaceDetails(suggestion.place_id);

    // Ensure eventLocation is a string
    const eventLocation = suggestion.description;
    formik.setFieldValue('eventLocation', eventLocation);

    console.log('Setting eventLocation to:', eventLocation);
    console.log('Location details:', locationDetails);

    // Use locationDetails if needed
    if (locationDetails) {
        // Example: Set additional form fields based on locationDetails
        formik.setFieldValue('formattedAddress', locationDetails.formatted_address);
        formik.setFieldValue('placeId', locationDetails.place_id);
        // Add more fields as needed
    }

    setSuggestions([]); // Clear suggestions after selection
};

return (
    <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
            Add Event
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
                            <FormControlLabel value="treePlanting" control={<Radio />} label="Tree Planting" />
                            <FormControlLabel value="beachRecycling" control={<Radio />} label="Beach Recycling" />
                            <FormControlLabel value="pickingUpLitter" control={<Radio />} label="Picking Up Litter" />
                            <FormControlLabel value="others" control={<Radio />} label="Others (Please specify)" />
                        </RadioGroup>
                        {formik.values.eventActivity === 'others' && (
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Please specify"
                                name="otherEventActivity"
                                value={formik.values.otherEventActivity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                        value={formik.values.eventName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                        helperText={formik.touched.eventName && formik.errors.eventName}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel
                            style={{
                                color: formik.touched.eventOrganizerType && formik.errors.eventOrganizerType ? '#d42f2f' : '#666666',
                                backgroundColor: formik.touched.eventOrganizerType ? 'white' : 'transparent', // Adjust based on your form's design
                                padding: '0 5px',
                                margin: '-1px 0',
                            }}
                        >
                            Event Organizer Type
                        </InputLabel>
                        <Select
                            name="eventOrganizerType"
                            value={formik.values.eventOrganizerType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventOrganizerType && Boolean(formik.errors.eventOrganizerType)}
                        >
                            <MenuItem value="individual">Individual</MenuItem>
                            <MenuItem value="organization">Organization</MenuItem>
                            <MenuItem value="community club">Community Club</MenuItem>
                            <MenuItem value="government agency">Government Agency</MenuItem>
                        </Select>
                        {formik.touched.eventOrganizerType && formik.errors.eventOrganizerType && (
                            <FormHelperText error>{formik.errors.eventOrganizerType}</FormHelperText>
                        )}
                    </FormControl>

                    {formik.values.eventOrganizerType === "community club" ? (
                        <FormControl fullWidth margin="dense">
                            <InputLabel
                                style={{
                                    color: formik.touched.eventOrganizerType && formik.errors.eventOrganizerType ? '#d42f2f' : '#666666',
                                    backgroundColor: formik.touched.eventOrganizerType ? 'white' : 'transparent', // Adjust based on your form's design
                                    padding: '0 5px',
                                    margin: '-1px 0',
                                }}
                            >
                                Event Organizer Name
                            </InputLabel>
                            <Select
                                name="eventOrganizerName"
                                value={formik.values.eventOrganizerName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventOrganizerName && Boolean(formik.errors.eventOrganizerName)}
                            >
                                {readClubs.map((club, index) => (
                                    <MenuItem key={index} value={club}>
                                        {club}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.eventOrganizerName && formik.errors.eventOrganizerName && (
                                <FormHelperText error>{formik.errors.eventOrganizerName}</FormHelperText>
                            )}
                        </FormControl>
                    ) : (
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Organizer Name"
                            name="eventOrganizerName"
                            value={formik.values.eventOrganizerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventOrganizerName && Boolean(formik.errors.eventOrganizerName)}
                            helperText={formik.touched.eventOrganizerName && formik.errors.eventOrganizerName}
                        />
                    )}
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
                                    <FormControlLabel value="invitation" control={<Radio />} label="By invitation" />
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
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Expected Attendance"
                                name="expectedAttendance"
                                type="number"
                                value={formik.values.expectedAttendance}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.expectedAttendance && Boolean(formik.errors.expectedAttendance)}
                                helperText={formik.touched.expectedAttendance && formik.errors.expectedAttendance}
                                inputProps={{
                                    min: "2", // Minimum value allowed is 2
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                type="date"
                                label="Event Start Date"
                                name="eventStartDate"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.eventStartDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventStartDate && Boolean(formik.errors.eventStartDate)}
                                helperText={formik.touched.eventStartDate && formik.errors.eventStartDate}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                type="date"
                                label="Event End Date"
                                name="eventEndDate"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.eventEndDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventEndDate && Boolean(formik.errors.eventEndDate)}
                                helperText={formik.touched.eventEndDate && formik.errors.eventEndDate}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                type="time"
                                label="Event Start Time"
                                name="eventStartTime"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.eventStartTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventStartTime && Boolean(formik.errors.eventStartTime)}
                                helperText={formik.touched.eventStartTime && formik.errors.eventStartTime}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                type="time"
                                label="Event End Time"
                                name="eventEndTime"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.eventEndTime}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                        multiline minRows={2}
                        label="Event Description"
                        name="eventDescription"
                        value={formik.values.eventDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                        helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                    />
                    {/* Funding Requests */}
                    <Box>
                        <Typography variant="h6">Funding Requests</Typography>
                        <Button onClick={() => formik.setFieldValue('fundingRequests', [...formik.values.fundingRequests, { item: '', purpose: '', source: '', amountRequested: '' }])}>
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
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton onClick={() => handleDeleteRequest(index)}>
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        type="number"
                        label="Participation Fee"
                        name="participationFee"
                        value={formik.values.participationFee}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.participationFee && Boolean(formik.errors.participationFee)}
                        helperText={formik.touched.participationFee && formik.errors.participationFee}
                        inputProps={{
                            min: "0", // Ensures the input does not accept negative numbers
                        }}
                    />
                    <Typography variant="h6">Contact Information</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{
                            readOnly: formik.values.useAccountInfo,
                            style: { backgroundColor: formik.values.useAccountInfo ? '#f0f0f0' : 'inherit' } // Gray background if readOnly
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Contact Number"
                        name="contactNumber"
                        value={formik.values.contactNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                        helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                        InputProps={{
                            readOnly: formik.values.useAccountInfo,
                            style: { backgroundColor: formik.values.useAccountInfo ? '#f0f0f0' : 'inherit' } // Gray background if readOnly
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" style={{ margin: 0 }}>
                            Supporting Documents
                        </Typography>
                        <IconButton onClick={handleAddSupportingDoc} style={{ marginLeft: '8px' }}>
                            <Add />
                        </IconButton>
                        {supportingDocs.length > 0 && (
                            <IconButton onClick={handleRemoveSupportingDoc} >
                                <Remove />
                            </IconButton>
                        )}
                    </div>
                    {supportingDocs.map((doc, index) => (
                        <Box key={index} display="flex" flexDirection="column" mb={2}>
                            <Box display="flex" alignItems="center">
                                <IconButton
                                    component="label"
                                >
                                    <Upload />
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.ppt,.pptx"
                                        onChange={(e) => handleSupportingDocChange(e, index)}
                                    />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteSupportingDoc(index)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                            {doc.filename && (
                                <>
                                    <Typography variant="body2" mt={1}>Uploaded File: {doc.actualfilename.length > 20 ? `${doc.actualfilename.substring(0, 20)}...` : doc.actualfilename}</Typography>
                                    {doc.file.type.startsWith('image/') ? (
                                        <img src={doc.preview} alt={doc.filename} style={{ maxHeight: 100, maxWidth: 100, marginTop: '8px', objectFit: 'contain' }} />
                                    ) : (
                                        <a href={doc.preview} target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px' }}>
                                            Preview File
                                        </a>
                                    )}
                                </>
                            )}
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Notes"
                                name={`supportingDocs[${index}].notes`}
                                value={doc.notes}
                                onChange={(e) => handleSupportingDocNotesChange(index, e.target.value)}
                                style={{ marginTop: '16px' }}
                            />
                        </Box>
                    ))}

                    <Typography variant="h6" style={{ marginTop: '16px' }}>Event Cover Image</Typography>
                    <Box mt={2}>
                        <Button variant="contained" component="label">
                            Upload Event Image
                            <input type="file" hidden onChange={onFileChange} />
                        </Button>
                        {imageFile && (
                            <>
                                <Typography variant="caption" display="block">Image uploaded</Typography>
                                <img src={imagePreview} alt="Event Cover" style={{ maxHeight: 100, maxWidth: 100, marginTop: '8px', objectFit: 'contain' }} />
                                <IconButton onClick={handleDeleteImage} aria-label="delete" color="error">
                                    <Delete />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Grid>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.useAccountInfo}
                                onChange={formik.handleChange}
                                name="useAccountInfo"
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
                            />
                        }
                        label="By submitting this proposal, you understand that all activities are subject to approval and will only be delivered when approved"
                    />
                    {formik.touched.consentApproved && formik.errors.consentApproved && (
                        <Typography variant="caption" color="error">
                            {formik.errors.consentApproved}
                        </Typography>
                    )}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.termsApproved}
                                onChange={formik.handleChange}
                                name="termsApproved"
                            />
                        }
                        label={
                            <>
                                I have read and agreed to the{' '}
                                <Link
                                    onClick={handleTermsClick}
                                    style={{ color: 'blue', textDecoration: 'underline' }}
                                >
                                    Terms and Conditions of Prásinos
                                </Link>
                            </>
                        }
                    />
                    {formik.touched.termsApproved && formik.errors.termsApproved && (
                        <Typography variant="caption" color="error">
                            {formik.errors.termsApproved}
                        </Typography>
                    )}
                </FormGroup>
            </Grid>
            <Box mt={2} display="flex" justifyContent="flex-end" width="100%" pr={2}>
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
                <Button variant="outlined" color="primary" type="button" onClick={saveAsDraft}>
                    Save as Draft
                </Button>
            </Box>
        </Box>
        <Box mt={2}>     </Box>
        <ToastContainer />
    </Box>
);
}

export default AddEvent;
// AIzaSyAWGu_ttZhiRdqdAQe3PgCE4VZmJivPIiE