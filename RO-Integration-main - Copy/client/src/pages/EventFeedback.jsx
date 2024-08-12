import '../App.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import http from '../http';
import { Box, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const validationSchema = Yup.object({
  comment: Yup.string().trim().min(3).max(500).required('Comment is required'),
  rating: Yup.number().min(1, 'Rating is required').max(5).required('Rating is required')
});

function EventFeedback() {
  const [eventfblist, setEventfblist] = useState([]);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    http.get('/eventfb').then((res) => {
      console.log(res.data);
      setEventfblist(res.data);
    });
  }, [])

  const handleClose = () => setShow(false);
  const handleHome = () => navigate('/');

  return (
    <>
      <Formik
        initialValues={{ comment: '', rating: 0 }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          values.comment = values.comment.trim();
          http.post("/eventfb", values)
            .then((res) => {
              console.log(res.data);
              setSubmitted(true);
              setLoading(false);
              setTimeout(() => {
                navigate("/retrieveeventfb");
                handleClose();
              }, 3000);
            })
            .catch((err) => {
              setLoading(false);
              toast.error('Submission failed. Please try again.');
            });
        }}
      >
        {({ handleSubmit, setFieldValue }) => (
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title style={{ marginLeft: "32%", fontWeight: "bold" }}>Event Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress />
                </Box>
              ) : submitted ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <CheckCircleIcon color="success" style={{ fontSize: 150 }} />
                  <h4 style={{ fontWeight: "bold", marginTop: "10px" }}>Event Feedback Submitted!</h4>
                  <p style={{ marginTop: "10px" }}>Thank you for your feedback! We appreciate your <br /> input and will use it to improve future events.</p>
                </Box>
              ) : (
                <FormikForm>
                  <Container fluid>
                    <Form.Group controlId="formRating" className="text-center">
                      <Form.Label>Please rate your Experience Below</Form.Label>
                      <div className="d-flex justify-content-center" style={{ marginTop: "-15px" }}>
                        <Rating
                          count={5}
                          size={45}
                          activeColor="#ffd700"
                          value={0}
                          onChange={(newRating) => {
                            setFieldValue('rating', newRating);
                          }}
                        />
                      </div>
                      <ErrorMessage name="rating" component="div" className="text-danger" />
                    </Form.Group>
                    <Form.Group controlId="formComment">
                      <Form.Label>Comment</Form.Label>
                      <Field name="comment" as="textarea" style={{ height: "130px"}} className="form-control" />
                      <ErrorMessage name="comment" component="div" className="text-danger" />
                    </Form.Group>
                    <Button variant="success" type="submit" className="mt-5" style={{ width: "80%", marginLeft: "10%", marginBottom: "5%" }} onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Container>
                </FormikForm>
              )}
            </Modal.Body>
          </Modal>
        )}
      </Formik>
    </>
  );
}

export default EventFeedback;
