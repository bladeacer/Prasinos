import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Bookings() {
    const [bookingList, setBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 10; // Number of bookings per page

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getBookings = () => {
        http.get('/booking').then((res) => {
            setBookingList(res.data);
        });
    };

    const searchBookings = () => {
        http.get(`/booking?search=${search}`).then((res) => {
            setBookingList(res.data);
        });
    };

    useEffect(() => {
        getBookings();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBookings();
        }
    };

    const onClickSearch = () => {
        searchBookings();
    }

    const onClickClear = () => {
        setSearch('');
        getBookings();
    };

    // Calculate total pages based on number of bookings
    const totalPages = Math.ceil(bookingList.length / bookingsPerPage);

    // Pagination control handlers
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Calculate which bookings to display based on current page
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookingList.slice(indexOfFirstBooking, indexOfLastBooking);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Bookings
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addbooking">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    currentBookings.map((booking, i) => (
                        <Grid item xs={12} md={6} lg={4} key={booking.id}>
                            <Card>
                                {
                                    booking.imageFile && (
                                        <Box className="aspect-ratio-container">
                                            <img alt="booking"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${booking.imageFile}`}>
                                            </img>
                                        </Box>
                                    )
                                }
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {booking.title}
                                        </Typography>
                                        {
                                            user && user.id === booking.userId && (
                                                <Link to={`/editbooking/${booking.id}`}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )
                                        }
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                        color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>
                                            {booking.user?.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                        color="text.secondary">
                                        <AccessTime sx={{ mr: 1 }} />
                                        <Typography>
                                            {dayjs(booking.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {booking.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button onClick={() => goToPage(1)} disabled={currentPage === 1}>
                        {'<<'}
                    </Button>
                    <Button onClick={prevPage} disabled={currentPage === 1}>
                        {'<'}
                    </Button>
                    {[...Array(totalPages).keys()].map(page => (
                        <Button key={page + 1} onClick={() => goToPage(page + 1)} disabled={currentPage === page + 1}>
                            {page + 1}
                        </Button>
                    ))}
                    <Button onClick={nextPage} disabled={currentPage === totalPages}>
                        {'>'}
                    </Button>
                    <Button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                        {'>>'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default Bookings;
