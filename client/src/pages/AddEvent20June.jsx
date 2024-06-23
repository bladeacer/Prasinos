import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Checkbox, FormControl, FormLabel, FormControlLabel, FormGroup, RadioGroup, Radio, InputLabel, Select, MenuItem, IconButton, Link } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function AddEvent() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [supportingDocs, setSupportingDocs] = useState([]);

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

        onSubmit: (data) => {
            if (imageFile) {
                data.eventImage = imageFile;
            }
            data.supportingDocs = supportingDocs;
            http.post("/events", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/events");
                });
        }
    });

    useEffect(() => {
        if (formik.values.useAccountInfo) {
            formik.setFieldValue('email', user.email);
            formik.setFieldValue('contactNumber', user.contactNumber);
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

    const handleDeleteRequest = (index) => {
        const updatedRequests = formik.values.fundingRequests.filter((_, i) => i !== index);
        formik.setFieldValue('fundingRequests', updatedRequests);
    };

    const handleTermsClick = () => {
        window.open('/src/Prasinos_termsandconditions.pdf', '_blank');
    };

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
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
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const handleSupportingDocChange = (e, index) => {
        let file = e.target.files[0];
        if (file) {
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
                    const updatedDocs = [...supportingDocs];
                    updatedDocs[index].filename = res.data.filename;
                    setSupportingDocs(updatedDocs);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const handleAddSupportingDoc = () => {
        setSupportingDocs([...supportingDocs, { filename: '', notes: '' }]);
    };

    const handleDeleteSupportingDoc = (index) => {
        const updatedDocs = supportingDocs.filter((_, i) => i !== index);
        setSupportingDocs(updatedDocs);
    };

    const handleSupportingDocNotesChange = (index, notes) => {
        const updatedDocs = [...supportingDocs];
        updatedDocs[index].notes = notes;
        setSupportingDocs(updatedDocs);
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
                                    name="EventActivity"
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
                            <InputLabel>Event Organizer Type</InputLabel>
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
                                <Typography color="error">{formik.errors.eventOrganizerType}</Typography>
                            )}
                        </FormControl>
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
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Event Scope</InputLabel>
                            <Select
                                name="eventScope"
                                value={formik.values.eventScope}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventScope && Boolean(formik.errors.eventScope)}
                            >
                                <MenuItem value="neighborhood">Neighborhood</MenuItem>
                                <MenuItem value="district">District</MenuItem>
                                <MenuItem value="city">City</MenuItem>
                                <MenuItem value="national">National</MenuItem>
                            </Select>
                            {formik.touched.eventScope && formik.errors.eventScope && (
                                <Typography color="error">{formik.errors.eventScope}</Typography>
                            )}
                        </FormControl>
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
                            fullWidth margin="dense" autoComplete="off" multiline rows={4}
                            label="Event Description"
                            name="eventDescription"
                            value={formik.values.eventDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                            helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                        />
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
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Use my account email and contact number"
                                name="useAccountInfo"
                                checked={formik.values.useAccountInfo}
                                onChange={formik.handleChange}
                            />
                        </FormGroup>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={formik.values.useAccountInfo}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Contact Number"
                            name="contactNumber"
                            value={formik.values.contactNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                            helperText={formik.touched.contactNumber && formik.errors.contactNumber}
                            disabled={formik.values.useAccountInfo}
                        />
                        <Box my={2}>
                            <Typography variant="h6">Funding Requests</Typography>
                            {formik.values.fundingRequests.map((request, index) => (
                                <Box key={index} display="flex" alignItems="center" mb={1}>
                                    <TextField
                                        fullWidth
                                        label={`Request ${index + 1}`}
                                        name={`fundingRequests[${index}]`}
                                        value={request}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.fundingRequests && Boolean(formik.errors.fundingRequests)}
                                        helperText={formik.touched.fundingRequests && formik.errors.fundingRequests}
                                    />
                                    <IconButton onClick={() => handleDeleteRequest(index)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => formik.setFieldValue('fundingRequests', [...formik.values.fundingRequests, ''])}
                            >
                                Add Funding Request
                            </Button>
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
                            label="Event Start Date"
                            name="eventStartDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.eventStartDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventStartDate && Boolean(formik.errors.eventStartDate)}
                            helperText={formik.touched.eventStartDate && formik.errors.eventStartDate}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event End Date"
                            name="eventEndDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.eventEndDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventEndDate && Boolean(formik.errors.eventEndDate)}
                            helperText={formik.touched.eventEndDate && formik.errors.eventEndDate}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Start Time"
                            name="eventStartTime"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.eventStartTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventStartTime && Boolean(formik.errors.eventStartTime)}
                            helperText={formik.touched.eventStartTime && formik.errors.eventStartTime}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event End Time"
                            name="eventEndTime"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.eventEndTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventEndTime && Boolean(formik.errors.eventEndTime)}
                            helperText={formik.touched.eventEndTime && formik.errors.eventEndTime}
                        />
                        <Box mt={2}>
                            <Button variant="contained" component="label">
                                Upload Event Image
                                <input type="file" hidden onChange={onFileChange} />
                            </Button>
                            {eventImage && (
                                <Box mt={1}>
                                    <Typography variant="body2">Uploaded File: {imageFile}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h6">Supporting Documents</Typography>
                        {supportingDocs.map((doc, index) => (
                            <Box key={index} display="flex" flexDirection="column" mb={2}>
                                <Button variant="contained" component="label">
                                    Upload Document
                                    <input type="file" hidden onChange={(e) => handleSupportingDocChange(e, index)} />
                                </Button>
                                {doc.filename && (
                                    <Typography variant="body2" mt={1}>Uploaded File: {doc.filename}</Typography>
                                )}
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Notes"
                                    name={`supportingDocs[${index}].notes`}
                                    value={doc.notes}
                                    onChange={(e) => handleSupportingDocNotesChange(index, e.target.value)}
                                />
                                <IconButton onClick={() => handleDeleteSupportingDoc(index)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}
                        <Button variant="contained" onClick={handleAddSupportingDoc}>
                            Add Supporting Document
                        </Button>
                    </Grid>
                </Grid>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox />}
                        label={<Typography>I consent to the collection, use, and disclosure of my personal data for event registration purposes. <Link href="#" underline="always" color="primary">Learn more</Link></Typography>}
                        name="consentApproved"
                        checked={formik.values.consentApproved}
                        onChange={formik.handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox />}
                        label={<Typography>I accept the <Link href="#" underline="always" color="primary" onClick={handleTermsClick}>Terms and Conditions</Link>.</Typography>}
                        name="termsApproved"
                        checked={formik.values.termsApproved}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddEvent;
