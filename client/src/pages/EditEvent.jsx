import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Checkbox, FormControl, FormLabel, FormControlLabel, FormGroup, RadioGroup, Radio, InputLabel, Select, MenuItem, IconButton, Link } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventImage, setImageFile] = useState(null);
    const [supportingDocs, setSupportingDocs] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

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
            eventName: "",
            eventOrganizerType: "",
            eventOrganizerName: "",
            eventScope: "",
            expectedAttendance: "",
            eventStartDate: "",
            eventEndDate: "",
            eventStartTime: "",
            eventEndTime: ""
        },

        validationSchema: yup.object({
            email: yup.string().email('Invalid email format').required('Email is required'),
            contactNumber: yup.string().required('Contact number is required'),
            consentApproved: yup.boolean().oneOf([true], 'Consent is required'),
            termsApproved: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
            eventLocation: yup.string().required('Event location is required'),
            eventDescription: yup.string().required('Event description is required'),
            eventActivity: yup.string().required('Event activity is required'),
            eventName: yup.string().required('Event name is required'),
            eventOrganizerType: yup.string().required('Event organizer type is required'),
            eventOrganizerName: yup.string().required('Event organizer name is required'),
            eventScope: yup.string().required('Event scope is required'),
            expectedAttendance: yup.number().required('Expected attendance is required').min(1, 'At least one attendee is required'),
            eventStartDate: yup.date().required('Event start date is required'),
            eventEndDate: yup.date().required('Event end date is required'),
            eventStartTime: yup.string().required('Event start time is required'),
            eventEndTime: yup.string().required('Event end time is required'),
            participationFee: yup.number().min(0, 'Participation fee cannot be negative')
        }),

        onSubmit: async (data) => {
            if (eventImage) {
                data.eventImage = eventImage;
            }
            data.supportingDocs = supportingDocs;
            try {
                const response = await http.put(`/event/${id}`, data);
                console.log('Response:', response.data);
                navigate('/events'); // Use navigate from react-router-dom to redirect
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    useEffect(() => {
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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const handleEventActivityChange = (event) => {
        formik.handleChange(event);
        if (event.target.value !== 'others') {
            formik.setFieldValue('otherEventActivity', '');
        }
    };

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

    const handleDeleteSupportingDoc = (index) => {
        const updatedDocs = supportingDocs.filter((_, i) => i !== index);
        setSupportingDocs(updatedDocs);
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
                                <FormControlLabel value="treePlanting" control={<Radio />} label="Tree Planting" disabled={true} />
                                <FormControlLabel value="beachRecycling" control={<Radio />} label="Beach Recycling" disabled={true} />
                                <FormControlLabel value="pickingUpLitter" control={<Radio />} label="Picking Up Litter" disabled={true} />
                                <FormControlLabel value="others" control={<Radio />} label="Others (Please specify)" disabled={true} />
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
                                    disabled={true}
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
                            disabled
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
                                disabled={true}
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
                            disabled
                            value={formik.values.eventOrganizerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventOrganizerName && Boolean(formik.errors.eventOrganizerName)}
                            helperText={formik.touched.eventOrganizerName && formik.errors.eventOrganizerName}
                        />
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
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Location"
                            name="eventLocation"
                            value={formik.values.eventLocation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventLocation && Boolean(formik.errors.eventLocation)}
                            helperText={formik.touched.eventLocation && formik.errors.eventLocation}
                        />
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
                            disabled
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
                            disabled
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box>
                            {eventImage ? (
                                <img
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${eventImage}`}
                                    alt="Preview"
                                    style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', marginBottom: '10px' }}
                                />
                            ) : null}
                            <Button variant="contained" component="label">
                                Upload Event Image
                                <input type="file" hidden onChange={(e) => onFileChange(e, null, true)} />
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            {supportingDocs.map((doc, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Button variant="contained" component="label">
                                        Upload Document
                                        <input type="file" hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.ppt,.pptx" onChange={(e) => handleSupportingDocChange(e, index)} />
                                    </Button>
                                    {doc.filename && (
                                        <>
                                            <Typography variant="body2">Uploaded File: {doc.actualfilename}</Typography>
                                            {doc.file && typeof doc.file.type === 'string' && doc.file.type.startsWith('image/') ? (
                                                <img src={`${import.meta.env.VITE_FILE_BASE_URL}${doc.filename}`} alt={doc.filename} style={{ maxHeight: 100, maxWidth: 100, marginTop: '8px', objectFit: 'contain' }} />
                                            ) : (
                                                <a href={`${import.meta.env.VITE_FILE_BASE_URL}${doc.filename}`} target="_blank" rel="noopener noreferrer" style={{ marginTop: '8px' }}>
                                                    Preview File
                                                </a>
                                            )}
                                        </>
                                    )}
                                    <TextField
                                        fullWidth
                                        margin="dense"
                                        label="Notes"
                                        value={doc.notes}
                                        onChange={(e) => handleSupportingDocNotesChange(index, e.target.value)}
                                    />
                                    <IconButton color="error" onClick={() => handleDeleteSupportingDoc(index)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button variant="contained" onClick={handleAddSupportingDoc}>
                                <Add /> Add Supporting Document
                            </Button>
                        </Box>


                    </Grid>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.useAccountInfo}
                                    onChange={formik.handleChange}
                                    name="useAccountInfo"
                                    disabled
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
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                    Update Event
                </Button>
                <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => onDeleteEvent(id)}>
                    Delete Event
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default EditEvent;

