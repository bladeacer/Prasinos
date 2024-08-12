import { Typography, Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import http from '../http';

const Settings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                setIsLoading(true);
                try {
                    console.log("Token:", token); // Log the token
                    const res = await http.get('/user/auth');
                    setUser(res.data.user);
                    // Uncomment and use if needed
                    // http.get('/staff/auth').then((res) => {
                    //   setStaff(res.data.staff);
                    // });
                    console.log("Response data:", res.data); // Log the entire response data
                    console.log("User role:", res.data.user.role); // Log the user role from response
                } catch (error) {
                    console.error("Error during authentication:", error); // Log any errors
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Box sx={{ marginTop: '65px', textAlign: 'left' }}>
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ positon: 'absolute', ml: 120, zIndex: -10 }}>
                        <Button href='/dangerZone' sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Danger Zone</Button>
                    </Box>
                    <Typography variant='h3' sx={{ marginTop: '-50px' }}>My Account</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '125px' }}>
                    <Box sx={{ width: '44.5%', border: '1px solid #d9d9d9', borderRadius: '15px' }}>
                        <Typography sx={{ marginLeft: '15px', fontSize: '35px' }}>Total Points</Typography>
                        <Typography sx={{ marginLeft: '12.5px', fontSize: '60px' }}>{user.points}</Typography>
                    </Box>
                    <Box sx={{ width: '44.5%', border: '1px solid #d9d9d9', borderRadius: '15px' }}>
                        <Typography sx={{ marginLeft: '15px', fontSize: '35px' }}>Earned Since</Typography>
                        <Typography sx={{ marginLeft: '12.5px', fontSize: '60px' }}>{user.createdAt}</Typography>
                    </Box>
                </Box>
                <Box sx={{ marginLeft: '2.5px', marginTop: '-105px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '25px' }}>Note: Points and tiers reset every year!</Typography>
                </Box>
                {/* Progress bar and other info smh */}
                <Typography variant='h3' sx={{ mt: 3 }}>My Particulars</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Box sx={{ width: '40%', ml: 15 }}>
                        <Typography sx={{ fontSize: '24px' }}><b>Name:</b> {user.name}</Typography>
                        <Typography sx={{ fontSize: '24px' }}><b>User ID:</b> {user.id}</Typography>
                        <Typography sx={{ fontSize: '24px' }}><b>Join Date:</b> {user.createdAt}</Typography>
                        {/* Have a dynamic implementation of points instead */}
                        <Typography sx={{ fontSize: '24px' }}><b>Total Points:</b> {user.points}</Typography>
                    </Box>
                    <Box sx={{ width: '50%', ml: 15 }}>
                        <Typography sx={{ fontSize: '24px' }}><b>Email:</b> {user.email}</Typography>
                        <Typography sx={{ fontSize: '24px' }}><b>Telephone No:</b> {user.phoneNumber}</Typography>
                        {/* Have a dynamic implementation of this */}
                        <Typography sx={{ fontSize: '24px' }}><b>Events Joined:</b> {user.eventsJoined}</Typography>
                        <Typography sx={{ fontSize: '24px' }}><b>Company:</b> {user.company}</Typography>
                    </Box>
                </Box>
                <Typography variant='h3' sx={{ mt: 5 }}>Your Feedback</Typography>
                <Button href='/retrievewebsitefbuser' sx={{ backgroundColor: 'green', color: 'white', borderRadius: '30px', fontSize: '18px', mt: 2 }}>View Feedback</Button>
            </Box>
        </>
    );
}

export default Settings;