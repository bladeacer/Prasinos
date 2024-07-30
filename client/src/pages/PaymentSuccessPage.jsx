import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
    const { state } = useLocation(); // Get state from navigation
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ my: 2 }}>
                Payment Successful
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Booking Summary:</Typography>
            <Typography>Event: {state.event}</Typography>
            <Typography>Ref. Code: {state.refCode}</Typography>
            <Typography>Quantity: {state.quantity}</Typography>
            <Typography>Unit Price: ${state.unitPrice.toFixed(2)}</Typography>
            <Typography>Total: ${state.totalPrice.toFixed(2)}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ my: 2 }}>
                Booking Confirmed.
            </Typography>
            <Typography>
                A confirmation email will be sent to you shortly.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/bookings')}>
                    Return to Bookings Page
                </Button>
            </Box>
        </Box>
    );
};

export default PaymentSuccessPage;
