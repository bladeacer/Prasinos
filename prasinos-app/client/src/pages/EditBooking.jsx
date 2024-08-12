import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, InputAdornment, IconButton, Typography, TextField } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditBooking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState({
        title: "",
        description: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/booking/${id}`).then((res) => {
            setBooking(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: booking,
        enableReinitialize: true,
        validationSchema: yup.object({
            firstName: yup
                .string()
                .matches(/^[A-Za-z]+$/, "First name cannot be numbers only")
                .min(3, "First name must be at least 3 characters")
                .required("First name is required"),
            lastName: yup
                .string()
                .matches(/^[A-Za-z]+$/, "Last name cannot be numbers only")
                .min(3, "Last name must be at least 3 characters")
                .required("Last name is required"),
            email: yup
                .string()
                .email("Invalid email address")
                .required("Email is required"),
            phoneNumber: yup
                .string()
                .matches(/^\d{8}$/, "Phone number must be 8 digits")
                .required("Phone number is required"),
            dateTimeBooked: yup
                .date()
                .required("Date and Time of Booking are required"),
            eventId: yup
                .number()
                .positive("Event ID must be a positive number")
                .required("Event ID is required"),
            pax: yup
                .number()
                .positive("PAX must be a positive number")
                .required("PAX is required"),
        }),
        onSubmit: (data) => {
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.email = data.email.trim();
            data.phoneNumber = data.phoneNumber.trim();
            data.dateTimeBooked = data.dateTimeBooked.trim();
            data.pax = parseInt(data.pax.toString().trim(), 10);
            http.put(`/booking/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/bookings");
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteBooking = () => {
        http.delete(`/booking/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/bookings/:id");
            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Booking
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="First Name"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Last Name"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Pax"
                                    name="pax"
                                    type="number"
                                    value={formik.values.pax}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.pax && Boolean(formik.errors.pax)}
                                    helperText={formik.touched.pax && formik.errors.pax}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton
                                                    aria-label="decrease pax"
                                                    onClick={() => formik.setFieldValue('pax', Math.max(1, formik.values.pax - 1))}
                                                >
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="increase pax"
                                                    onClick={() => formik.setFieldValue('pax', formik.values.pax + 1)}
                                                >
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Booking
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteBooking}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}

export default EditBooking;