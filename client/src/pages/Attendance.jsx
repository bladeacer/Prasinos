import React, { useEffect, useState } from 'react';
import http from '../http';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Checkbox } from '@mui/material';

function EventBookings() {
    const { eventId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventStartDate, setStartDate] = useState(null);
    const [eventEndDate, setEndDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventName, setEventName] = useState(null);
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                const response = await http.get(`/attendance/${eventId}`);
                const data = response.data;
                setBookings(Array.isArray(data) ? data : []);
                
                // Initialize attendance state
                const initialAttendance = {};
                data.forEach(booking => {
                    if (booking.attendance) {
                        booking.attendance.forEach(record => {
                            if (!initialAttendance[record.date]) {
                                initialAttendance[record.date] = {};
                            }
                            initialAttendance[record.date][record.id] = true;
                        });
                    }
                });
                setAttendance(initialAttendance);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('No bookings yet');
                } else {
                    console.error('Error fetching bookings:', error);
                    setError('Failed to retrieve bookings');
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchEventData = async () => {
            try {
                const response = await http.get(`/event/${eventId}`);
                const eventData = response.data;
                setStartDate(eventData.eventStartDate);
                setEndDate(eventData.eventEndDate);
                setEventName(eventData.eventName);
            } catch (error) {
                console.error('Error fetching event:', error);
                setError('Failed to retrieve event data');
            }
        };

        fetchEventData();
        fetchBookingData();
    }, [eventId]);

    const getDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateArray = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleCheckboxChange = (bookingId) => {
        setAttendance((prevAttendance) => {
            const dateKey = selectedDate.toLocaleDateString();
            const newAttendance = { ...prevAttendance };
            if (!newAttendance[dateKey]) {
                newAttendance[dateKey] = {};
            }
            newAttendance[dateKey][bookingId] = !newAttendance[dateKey][bookingId];
            return newAttendance;
        });
    };

    const handleSaveAttendance = async () => {
        const attendanceData = Object.keys(attendance).flatMap(date => {
            return Object.keys(attendance[date]).map(id => ({
                date,
                id,
                present: attendance[date][id] // Include the present status
            }));
        });
        try {
            const response = await http.put(`/attendance/${eventId}`, attendanceData);
            console.log('Attendance saved:', response.data);
        } catch (error) {
            console.error('Error saving attendance:', error);
        }
    };

    const dateRange = eventStartDate && eventEndDate ? getDateRange(eventStartDate, eventEndDate) : [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Event Attendance
            </Typography>
            <Typography variant="h5" component="h1" gutterBottom>
                {eventName}
            </Typography>
            <div>
                {dateRange.map((date, index) => (
                    <Button key={index} onClick={() => handleDateSelect(date)}>
                        {date.toLocaleDateString()}
                    </Button>
                ))}
            </div>
            {selectedDate && (
                <div>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Attendance for {selectedDate.toLocaleDateString()}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Attendance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <React.Fragment key={booking.userId}>
                                        <TableRow>
                                            <TableCell>{booking.id}</TableCell>
                                            <TableCell>{booking.user.name}</TableCell>
                                            <TableCell>{booking.email}</TableCell>
                                            <TableCell>{booking.phoneNumber}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={!!attendance[selectedDate.toLocaleDateString()]?.[booking.id]}
                                                    onChange={() => handleCheckboxChange(booking.id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        {booking.additionalMembers && booking.additionalMembers.map((member, index) => (
                                            <TableRow key={`${booking.id}(${index + 2})`} style={{ paddingLeft: '20px' }}>
                                                <TableCell>{`${booking.id}(${index + 2})`}</TableCell>
                                                <TableCell>{member.firstName} {member.lastName}</TableCell>
                                                <TableCell>{member.email}</TableCell>
                                                <TableCell>{member.phoneNumber}</TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={!!attendance[selectedDate.toLocaleDateString()]?.[`${booking.id}(${index + 2})`]}
                                                        onChange={() => handleCheckboxChange(`${booking.id}(${index + 2})`)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <Button variant="contained" color="primary" onClick={handleSaveAttendance}>
                        Save Attendance
                    </Button>
                </div>
            )}
        </div>
    );
}

export default EventBookings;