import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import './ConfirmBooking.css';

function ConfirmBooking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleConfirmBooking = () => {
        navigate(`/paymentsuccess/${id}`);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Confirm Booking
            </Typography>
            <Box className="booking-summary">
                <Typography variant="h6">Event: Environment Fundraising Run</Typography>
                <Typography>Quantity: 2</Typography>
                <Typography>Unit Price: $25.00</Typography>
                <Typography>Total: $50.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                <Button variant="contained" onClick={() => navigate(`/payment/${id}`)}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleConfirmBooking}>Confirm Booking</Button>
            </Box>
        </Box>
    );
}

export default ConfirmBooking;
