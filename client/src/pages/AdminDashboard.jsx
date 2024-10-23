import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import http from '../http';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const feedbackColors = ['#4caf50','#f44336'];

const AdminDashboard = () => {
    const [eventProposals, setEventProposals] = useState([]);
    const [statusCounts, setStatusCounts] = useState([]);
    const [websiteFeedback, setWebsiteFeedback] = useState([]);
    const [statusCounts2, setStatusCounts2] = useState([]);
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear()); // Default to current year
    const [years, setYears] = useState([]);

    // Fetching event data
    useEffect(() => {
        http.get('/event').then((res) => {
            let originalData = res.data;
            const filteredData = originalData.filter(event => event.eventStatus !== 'Draft');
            let transformedData = transformEventData(filteredData);
            let transformedStatusData = transformStatusData(filteredData);
            setEventProposals(transformedData);
            setStatusCounts(transformedStatusData);
        }).catch(error => console.error('Error fetching events:', error));
    }, []);

    // Fetching website feedback data
    useEffect(() => {
        http.get('/websitefb').then((res) => {
            let originalData = res.data;
            const availableYears = [...new Set(originalData.map(feedback => new Date(feedback.createdAt).getFullYear()))];
            setYears(availableYears);
            let filteredData = originalData.filter(feedback => new Date(feedback.createdAt).getFullYear() === yearFilter);
            let transformedData = transformWebsiteFeedbackData(filteredData);
            let transformedStatusData = transformWebsiteFeedbackStatusData(filteredData);
            setWebsiteFeedback(transformedData);
            setStatusCounts2(transformedStatusData);
        }).catch(error => console.error('Error fetching website feedback:', error));
    }, [yearFilter]);

    const dataMax = Math.max(0, ...eventProposals.map(ep => Number(ep.count) || 0));
    const tickInterval = dataMax > 20 ? 10 : 5;
    const yAxisTicks = Array.from({ length: Math.ceil(dataMax / tickInterval) + 1 }, (_, i) => i * tickInterval);

    const feedbackDataMax = Math.max(0, ...websiteFeedback.map(wf => Number(wf.count) || 0));
    const feedbackTickInterval = feedbackDataMax > 20 ? 10 : 5;
    const feedbackYAxisTicks = Array.from({ length: Math.ceil(feedbackDataMax / feedbackTickInterval) + 1 }, (_, i) => i * feedbackTickInterval);

    return (
        <div style={{ marginTop: "50px"}}>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                    <h2>Total Event Proposals by Date</h2>
                    <LineChart width={600} height={300} data={eventProposals}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, dataMax => isNaN(dataMax) ? 0 : Math.max(dataMax, yAxisTicks[yAxisTicks.length - 1])]} ticks={yAxisTicks} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </div>
                <div>
                    <h2>Event Proposal Status Distribution</h2>
                    <PieChart width={520} height={400} style={{ paddingLeft: "10%" }}>
                        <Pie
                            data={statusCounts}
                            cx={250}
                            cy={125}
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {statusCounts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div style={{ width: '62%', marginLeft: "-8%" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="yearFilter-label">Filter by Year</InputLabel>
                            <Select
                                labelId="yearFilter-label"
                                id="yearFilter"
                                value={yearFilter}
                                onChange={(e) => setYearFilter(Number(e.target.value))}
                                label="Filter by Year"
                            >
                                {years.map(year => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <h2 style={{ marginLeft: "16%"}}>Total Website Feedback by Month</h2>
                    <BarChart width={700} height={300} data={websiteFeedback}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, feedbackDataMax => isNaN(feedbackDataMax) ? 0 : Math.max(feedbackDataMax, feedbackYAxisTicks[feedbackYAxisTicks.length - 1])]} ticks={feedbackYAxisTicks} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>
                <div style={{ marginTop: "60px", marginRight: "-8%"}}>
                    <h2>Website Feedback Status Distribution</h2>
                    <PieChart width={500} height={400} style={{ marginLeft: "5%" }}>
                        <Pie
                            data={statusCounts2}
                            cx={230}
                            cy={125}
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {statusCounts2.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

// Function to transform event data
function transformEventData(events) {
    const dateCounts = events.reduce((acc, event) => {
        const date = new Date(event.createdAt).toLocaleDateString();
        if (acc[date]) {
            acc[date].count += 1;
        } else {
            acc[date] = { date, count: 1 };
        }
        return acc;
    }, {});

    return Object.values(dateCounts);
}

// Function to transform event status data
function transformStatusData(events) {
    const statusCounts = events.reduce((acc, event) => {
        const status = event.eventStatus;
        if (acc[status]) {
            acc[status].value += 1;
        } else {
            acc[status] = { name: status, value: 1 };
        }
        return acc;
    }, {});

    const allStatuses = ["Pending Review", "Approved", "Rejected", "Action Needed"];
    allStatuses.forEach(status => {
        if (!statusCounts[status]) {
            statusCounts[status] = { name: status, value: 0 };
        }
    });

    return Object.values(statusCounts).filter(status => status.value > 0);
}

// Function to transform and sort website feedback data by month with month names and resolution status counts
function transformWebsiteFeedbackData(feedbacks) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const monthCounts = feedbacks.reduce((acc, feedback) => {
        const date = new Date(feedback.createdAt);
        const month = monthNames[date.getMonth()]; // Format: "Month"
        if (!acc[month]) {
            acc[month] = { month, count: 0, resolved: 0, unresolved: 0 };
        }
        acc[month].count += 1;
        if (feedback.status === "Resolved") {
            acc[month].resolved += 1;
        } else if (feedback.status === "Unresolved") {
            acc[month].unresolved += 1;
        }
        return acc;
    }, {});

    // Convert the object to an array and sort it by date
    return Object.values(monthCounts).sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
}

// Function to transform website feedback status data
function transformWebsiteFeedbackStatusData(feedbacks) {
    const statusCounts = feedbacks.reduce((acc, feedback) => {
        const status = feedback.status;
        if (acc[status]) {
            acc[status].value += 1;
        } else {
            acc[status] = { name: status, value: 1, color: status === "Resolved" ? feedbackColors[0] : feedbackColors[1] };
        }
        return acc;
    }, {});

    const allStatuses = ["Resolved", "Unresolved"];
    allStatuses.forEach(status => {
        if (!statusCounts[status]) {
            statusCounts[status] = { name: status, value: 0, color: status === "Resolved" ? feedbackColors[0] : feedbackColors[1] };
        }
    });

    return Object.values(statusCounts).filter(status => status.value > 0);
}

// Custom Tooltip for the BarChart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { count, resolved, unresolved } = payload[0].payload;
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p className="label"><strong>{label}</strong></p>
                <p>Total Feedback: {count}</p>
                <p>Resolved: {resolved}</p>
                <p>Unresolved: {unresolved}</p>
            </div>
        );
    }
    return null;
};

export default AdminDashboard;
