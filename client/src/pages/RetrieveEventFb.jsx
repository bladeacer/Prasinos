import '../App.css';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function RetrieveEventFb() {
  const [eventfblist, setEventfblist] = useState([]);
  const [search, setSearch] = useState('');

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getEventfb = () => {
    http.get('/eventfb').then((res) => {
      setEventfblist(res.data);
    });
  };

  const searchEventfb = () => {
    http.get(`/eventfb?search=${search}`).then((res) => {
      setEventfblist(res.data);
    });
  };

  useEffect(() => {
    http.get('/eventfb').then((res) => {
      console.log(res.data);
      setEventfblist(res.data);
    });
  }, [])

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchEventfb();
    }
  };

  const onClickSearch = () => {
    searchEventfb();
  }

  const onClickClear = () => {
    setSearch('');
    getEventfb();
  };

  return (
    <>
      <Box style={{ paddingTop: "100px", paddingLeft: "10%", width: "100vw"}}>
        <Typography variant="h5" sx={{ my: 2, fontWeight: "bold", textAlign: "center", fontSize: "35px" }}>
          Event Feedback
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
        </Box>
        <Grid container spacing={2}>
          {
            eventfblist.map((eventfb, i) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={eventfb.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {eventfb.user?.name}
                        </Typography>
                        <Link to={`/editeventfeedback/${eventfb.id}`}>
                          <IconButton color="primary" sx={{ padding: '4px' }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: -2 }} color="text.secondary">
                        <Typography sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                          <Rating
                            count={5}
                            size={30}
                            activeColor="#ffd700"
                            value={eventfb.rating}
                            edit={false}
                          />
                        </Typography>
                        <Typography style={{ marginRight: "20px"}}>
                          {dayjs(eventfb.createdAt).format(global.datetimeFormat)}
                        </Typography>
                      </Box>
                      <Typography sx={{ flexGrow: 1 }}>
                          Comment: {eventfb.comment}
                        </Typography>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        Improvement: {eventfb.feedback}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          }
        </Grid>
      </Box>
    </>
  )
}

export default RetrieveEventFb;