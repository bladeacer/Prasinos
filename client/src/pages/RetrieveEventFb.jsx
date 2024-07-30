// Branden
import '../App.css';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Search, Clear, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import http from '../http';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin
import global from '../global';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

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

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id]
    }));
  };

  return (
    <>
      <Box style={{ paddingTop: "100px", paddingLeft: "10%", width: "90vw"}}>
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
              const isExpanded = expanded[eventfb.id];
              return (
                <Grid item xs={11} md={6} lg={4} key={eventfb.id}>
                  <Card style={{}}>
                    <CardContent style={{ paddingBottom: "8px"}}>
                      <Box sx={{ display: 'flex', mb: 1}}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {eventfb.user?.name}
                        </Typography>
                        <Link to={`/editeventfeedback/${eventfb.id}`}>
                          <IconButton color="primary" sx={{ padding: '4px' }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: -2, marginLeft: "-2px"}} color="text.secondary">
                        <Typography sx={{ whiteSpace: 'pre-wrap', flexGrow: 1}}>
                          <Rating
                            count={5}
                            size={27}
                            activeColor="#ffd700"
                            value={eventfb.rating}
                            edit={false}
                          />
                        </Typography>
                        <Typography style={{ marginRight: "5px"}}>
                          {dayjs(eventfb.createdAt).fromNow()}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          flexGrow: 1,
                          marginTop: "-5px",
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: isExpanded ? 'none' : 3,
                        }}
                      >
                        {eventfb.comment}
                      </Typography>
                      {eventfb.comment.length > 150 && (
                        <Button size="small" onClick={() => toggleExpand(eventfb.id)} style={{ padding: "0"}}>
                          {isExpanded ? 'Show less' : 'Show more'}
                        </Button>
                      )}
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
