import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import http from '../http';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
    const [eventProposals, setEventProposals] = useState([]);
    const [statusCounts, setStatusCounts] = useState([]);
    
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

    const dataMax = Math.max(0, ...eventProposals.map(ep => Number(ep.count) || 0));
    const tickInterval = dataMax > 20 ? 10 : 5;
    const yAxisTicks = Array.from({ length: Math.ceil(dataMax / tickInterval) + 1 }, (_, i) => i * tickInterval);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <PieChart width={500} height={400}>
                        <Pie
                            data={statusCounts}
                            cx={200}
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
            </div>
        </div>
    );
};

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

    // Ensure all possible statuses are included, even if their count is zero
    const allStatuses = ["Pending Review", "Approved", "Rejected", "Action Needed"];
    allStatuses.forEach(status => {
        if (!statusCounts[status]) {
            statusCounts[status] = { name: status, value: 0 };
        }
    });

    return Object.values(statusCounts);
}

export default AdminDashboard;