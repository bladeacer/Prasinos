import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

// Sample data
const sampleBookingsData = [
    { date: '2024-01-01', bookings: 20 },
    { date: '2024-02-01', bookings: 30 },
    { date: '2024-03-01', bookings: 25 },
    { date: '2024-04-01', bookings: 40 },
];

const sampleRevenueData = [
    { date: '2024-01-01', revenue: 2000 },
    { date: '2024-02-01', revenue: 3000 },
    { date: '2024-03-01', revenue: 2500 },
    { date: '2024-04-01', revenue: 3500 },
];

const sampleUserActivityData = [
    { date: '2024-01-01', totalBookings: 15, totalPayments: 1000 },
    { date: '2024-02-01', totalBookings: 20, totalPayments: 1500 },
    { date: '2024-03-01', totalBookings: 18, totalPayments: 1200 },
    { date: '2024-04-01', totalBookings: 25, totalPayments: 1800 },
];

const Dashboard = () => {
    const [bookingsData, setBookingsData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [userActivityData, setUserActivityData] = useState([]);

    useEffect(() => {
        // Simulate data fetching
        setBookingsData(sampleBookingsData);
        setRevenueData(sampleRevenueData);
        setUserActivityData(sampleUserActivityData);
    }, []);

    return (
        <Box sx={{ p: 3 }} style={{ marginTop: "20px"}}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Bookings Over Time</Typography>
                        <LineChart width={600} height={300} data={bookingsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                        </LineChart>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Revenue Reports</Typography>
                        <BarChart width={600} height={300} data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#82ca9d" />
                        </BarChart>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">User Activity Reports</Typography>
                        <LineChart width={1200} height={300} data={userActivityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalBookings" stroke="#8884d8" />
                            <Line type="monotone" dataKey="totalPayments" stroke="#82ca9d" />
                        </LineChart>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
