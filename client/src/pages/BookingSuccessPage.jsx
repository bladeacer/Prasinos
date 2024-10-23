import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccessPage = () => {
    const { state } = useLocation(); // Get state from navigation
    console.log("Received state:", state); // Check what's inside the state
    const navigate = useNavigate();
    
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ my: 2 }}>
                Booking Successful
            </Typography>

            <Typography variant="h6" sx={{ my: 2 }}>
                Booking Confirmed.
            </Typography>
            <Typography>
                A confirmation email will be sent to you shortly.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Return to Home Page
                </Button>
            </Box>
        </Box>
    );
};

export default BookingSuccessPage;
