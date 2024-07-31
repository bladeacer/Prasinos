import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditBooking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateTimeBooked: "",
    eventId: "",
    userId: "",
    pax: "",
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await http.get(`/booking/${id}`);
        setBooking(response.data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const formik = useFormik({
    initialValues: booking,
    enableReinitialize: true,
    validationSchema: yup.object({
      firstName: yup
        .string()
        .trim()
        .min(2, "First Name must be at least 2 characters")
        .max(100, "First Name must be at most 100 characters")
        .required("First Name is required"),
      lastName: yup
        .string()
        .trim()
        .min(2, "Last Name must be at least 2 characters")
        .max(100, "Last Name must be at most 100 characters")
        .required("Last Name is required"),
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
      phoneNumber: yup
        .string()
        .trim()
        .min(10, "Phone Number must be at least 10 characters")
        .max(15, "Phone Number must be at most 15 characters")
        .required("Phone Number is required"),
      dateTimeBooked: yup.date().required("Booking Date and Time are required"),
      eventId: yup.number().required("Event ID is required"),
      userId: yup.number().required("User ID is required"),
      pax: yup
        .number()
        .positive("PAX must be a positive number")
        .required("PAX is required"),
    }),
    onSubmit: async (data) => {
      try {
        const response = await http.put(`/booking/${id}`, data);
        if (response.status === 200) {
          toast.success("Booking updated successfully!");
          navigate("/bookings");
        } else {
          toast.error("Failed to update booking.");
        }
      } catch (error) {
        toast.error("Failed to update booking.");
        console.error("Error updating booking:", error);
      }
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteBooking = async () => {
    try {
      await http.delete(`/booking/${id}`);
      navigate("/bookings");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
          Error 404: Booking not found
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          Either the Booking ID is deleted or invalid.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/bookings")}>
          Go Back to Bookings
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Booking
      </Typography>
      {!loading && (
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={8}>
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
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
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Phone Number"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Booking Date and Time"
                name="dateTimeBooked"
                type="datetime-local"
                value={formik.values.dateTimeBooked}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.dateTimeBooked &&
                  Boolean(formik.errors.dateTimeBooked)
                }
                helperText={
                  formik.touched.dateTimeBooked && formik.errors.dateTimeBooked
                }
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Event ID"
                name="eventId"
                value={formik.values.eventId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.eventId && Boolean(formik.errors.eventId)}
                helperText={formik.touched.eventId && formik.errors.eventId}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="User ID"
                name="userId"
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.userId && Boolean(formik.errors.userId)}
                helperText={formik.touched.userId && formik.errors.userId}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="PAX"
                name="pax"
                value={formik.values.pax}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pax && Boolean(formik.errors.pax)}
                helperText={formik.touched.pax && formik.errors.pax}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteBooking}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default EditBooking;
