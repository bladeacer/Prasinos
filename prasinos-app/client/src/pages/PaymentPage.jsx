import React from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom'

const validationSchema = yup.object({
    cardholderName: yup.string().required('Cardholder Name is required'),
    cardNumber: yup.string()
        .matches(/^\d{16}$/, 'Credit Card Number must be 16 digits')
        .required('Credit Card Number is required'),
    cvc: yup.string()
        .matches(/^\d{3}$/, 'CVC must be 3 digits')
        .required('CVC is required'),
    expiryDate: yup.string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry Date must be in MM/YY format')
        .required('Expiry Date is required'),
});

const PaymentPage = () => {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            cardholderName: '',
            cardNumber: '',
            cvc: '',
            expiryDate: '',
        },
        validationSchema,
        onSubmit: (values) => {
            // Handle form submission
            navigate('/booking-success');
        },
    });

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Payment Details
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    label="Cardholder Name"
                    name="cardholderName"
                    value={formik.values.cardholderName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cardholderName && Boolean(formik.errors.cardholderName)}
                    helperText={formik.touched.cardholderName && formik.errors.cardholderName}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Credit Card Number"
                    name="cardNumber"
                    value={formik.values.cardNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                    helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="CVC"
                    name="cvc"
                    type="password"
                    value={formik.values.cvc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cvc && Boolean(formik.errors.cvc)}
                    helperText={formik.touched.cvc && formik.errors.cvc}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Expiry Date (MM/YY)"
                    name="expiryDate"
                    value={formik.values.expiryDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                    helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={() => navigate('/booking-success')}>
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default PaymentPage;
