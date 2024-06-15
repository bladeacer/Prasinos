import '../App.css'
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton } from '@mui/material';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';


const validationSchema = Yup.object({
  comment: Yup.string().trim().min(3).max(500).required('Comment is required'),
  feedback: Yup.string().trim().min(3).max(500).required('Feedback is required')
});

function EventFeedback() {

  const [eventfblist, seteventfblist] = useState([]);
  const [search, setSearch] = useState('');

  const [show, setShow] = useState(true);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getEventfb = () => {
    http.get('/eventfb').then((res) => {
      seteventfblist(res.data);
    });
  };

  const searchEventfb = () => {
    http.get(`/eventfb?search=${search}`).then((res) => {
      seteventfblist(res.data);
    });
  };

  useEffect(() => {
    getEventfb();
  }, []);

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

  useEffect(() => {
    http.get('/eventfb').then((res) => {
      console.log(res.data);
      seteventfblist(res.data);
    });
  }, []);

  const handleClose = () => setShow(false);
  const handleHome = () => navigate('/');

  return (
    <>
      <Box style={{ paddingTop: "100px", height: "1000px" }}>
        <Typography variant="h5" sx={{ my: 2 }}>
          Event Feedbacks
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
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {eventfb.comment}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        color="text.secondary">
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography>
                          {dayjs(eventfb.createdAt).format(global.datetimeFormat)}
                        </Typography>
                      </Box>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {eventfb.feedback}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          }
        </Grid>
      </Box>
      <Formik
        initialValues={{ comment: '', feedback: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          values.comment = values.comment.trim();
          values.feedback = values.feedback.trim();
          http.post("/eventfb", values)
            .then((res) => {
              console.log(res.data);
            });
          handleClose();
        }}
      >
        {({ handleSubmit }) => (
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title style={{ marginLeft: "auto" }}>Event Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormikForm>
                <Container>
                  <Form.Group controlId="formRating" className="text-center">
                    <Form.Label>Please rate your Experience Below</Form.Label>
                    <div className="d-flex justify-content-center" style={{ marginTop: "-15px" }}>
                      <Rating
                        count={5}
                        size={45}
                        activeColor="#ffd700"
                        value={rating}
                        onChange={(newRating) => {
                          setRating(newRating);
                        }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formComment">
                    <Form.Label>Comment</Form.Label>
                    <Field name="comment" as="textarea" className="form-control" />
                    <ErrorMessage name="comment" component="div" className="text-danger" />
                  </Form.Group>
                  <Form.Group controlId="formFeedback">
                    <Form.Label className="mt-3">Additional Feedback for Improvement</Form.Label>
                    <Field name="feedback" as="textarea" className="form-control" />
                    <ErrorMessage name="feedback" component="div" className="text-danger" />
                  </Form.Group>
                  <Button variant="success" type="submit" className="mt-4" style={{ width: "80%", marginLeft: "10%" }} onClick={handleSubmit}>
                    Submit
                  </Button>
                  <h6 style={{ textAlign: "center", marginTop: "5%" }}>Or</h6>
                  <Button variant="secondary" className="mt-3 mb-3" style={{ width: "80%", marginLeft: "10%" }} onClick={handleHome}>
                    Home
                  </Button>
                </Container>
              </FormikForm>
            </Modal.Body>
          </Modal>
        )}
      </Formik>
    </>

  );
}

export default EventFeedback;