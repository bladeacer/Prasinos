import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, FormControl, RadioGroup, FormControlLabel, Radio, Grid, Divider } from '@mui/material';
import InputMask from 'react-input-mask';
import axios from './axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const expiryDateRef = useRef(null);
    const initialFormData = {
        cardNumber: '',
        cardholderName: '',
        expiryDate: '',
        cvc: '',
        staffDiscount: '',
        voucherCode: '',
        quantity: state?.quantity || 2,
        unitPrice: state?.unitPrice || 25.00,
        totalPrice: state?.totalPrice || 50.00,
        event: state?.event || 'Environment Fundraising Run',
        refCode: state?.refCode || '155645'
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'cardNumber') {
            newValue = value.slice(0, 16).replace(/\D/g, ''); // Max 16 digits
        } else if (name === 'cvc') {
            newValue = value.slice(0, 3).replace(/\D/g, ''); // Max 3 digits
        } else if (name === 'expiryDate') {
            newValue = value; // Input mask handles formatting
        } else if (name === 'cardholderName') {
            newValue = value.replace(/[^a-zA-Z\s]/g, ''); // Only letters and spaces
        }

        setFormData({ ...formData, [name]: newValue });
    };

    const validateForm = () => {
        let validationErrors = {};
        if (!formData.cardNumber) validationErrors.cardNumber = 'Card number is required';
        if (!formData.cardholderName) validationErrors.cardholderName = 'Cardholder name is required';
        if (!formData.expiryDate) validationErrors.expiryDate = 'Expiry date is required';
        else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) validationErrors.expiryDate = 'Expiry date must be in MM/YY format';
        if (!formData.cvc) validationErrors.cvc = 'CVC is required';
        return validationErrors;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const response = await axios.post('/payment', formData);
            if (response.status === 200) {
                await accordionSummaryClasses.post('/booking',{
                    ...formData,
                    eventId: state.event.id,
                });
                navigate('/payment-success', { state: { ...formData, event: state.event } });
            }
        } catch (error) {
            if (error.response) {
                // Error response from server
                setErrors({ form: error.response.data.message });
            } else {
                console.error('Error submitting the payment', error);
                setErrors({ form: 'An unexpected error occurred' });
            }
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ my: 2 }}>
                Payment
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Booking Summary:</Typography>
            <Typography>Event: {formData.event}</Typography>
            <Typography>Ref. Code: {formData.refCode}</Typography>
            <Typography>Quantity: {formData.quantity}</Typography>
            <Typography>Unit Price: ${formData.unitPrice.toFixed(2)}</Typography>
            <Typography>Total: ${formData.totalPrice.toFixed(2)}</Typography>

            <Divider sx={{ my: 2 }} />

            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="payment-method" name="paymentMethod" defaultValue="visa">
                                <FormControlLabel value="visa" control={<Radio />} label="Visa" />
                                <FormControlLabel value="mastercard" control={<Radio />} label="MasterCard" />
                                <FormControlLabel value="amex" control={<Radio />} label="Amex" />
                                <FormControlLabel value="paynow" control={<Radio />} label="PayNow" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="cardNumber"
                            label="Card Number"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber}
                            inputProps={{ maxLength: 16 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="cvc"
                            label="CVC"
                            value={formData.cvc}
                            onChange={handleChange}
                            error={!!errors.cvc}
                            helperText={errors.cvc}
                            inputProps={{ maxLength: 3 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="cardholderName"
                            label="Cardholder Name"
                            value={formData.cardholderName}
                            onChange={handleChange}
                            error={!!errors.cardholderName}
                            helperText={errors.cardholderName}
                            inputProps={{ pattern: '[a-zA-Z\\s]*' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputMask
                            mask="12/99"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        >
                            {(inputProps) => (
                                <TextField
                                    {...inputProps}
                                    fullWidth
                                    required
                                    name="expiryDate"
                                    label="Expiry Date (MM/YY)"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    inputRef={expiryDateRef}
                                    error={!!errors.expiryDate}
                                    helperText={errors.expiryDate}
                                />
                            )}
                        </InputMask>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="staffDiscount"
                            label="Staff Discount"
                            value={formData.staffDiscount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="voucherCode"
                            label="Voucher/Gift Code"
                            value={formData.voucherCode}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                {errors.form && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {errors.form}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button variant="contained" onClick={() => window.history.back()}>
                        Back
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                        Submit Payment
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default PaymentPage;
