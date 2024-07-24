import '../App.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from 'react-rating-stars-component';
import http from '../http';

function EditEventFeedback() {
    const { id } = useParams();
    const [show, setShow] = useState(true);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);

    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
    const handleDeleteConfirmShow = () => setDeleteConfirmShow(true);
    const handleDeleteConfirmClose = () => setDeleteConfirmShow(false);

    const [eventfblist, setEventfblist] = useState({
        comment: "",
        feedback: "",
        rating: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/eventfb/${id}`).then((res) => {
            setEventfblist(res.data);
            setLoading(false);
        });
    }, [id]);

    const validationSchema = Yup.object({
        comment: Yup.string().trim().min(3).max(500).required('Comment is required'),
        feedback: Yup.string().trim().min(3).max(500).required('Feedback is required'),
        rating: Yup.number().min(1, 'Rating is required').max(5).required('Rating is required'),
    });

    const deleteEventFeedback = () => {
        http.delete(`/eventfb/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/retrieveeventfb");
            });
    }

    return (
        <>
            {!loading && (
                <Formik
                    initialValues={{ comment: eventfblist.comment, feedback: eventfblist.feedback, rating: eventfblist.rating }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        values.comment = values.comment.trim();
                        values.feedback = values.feedback.trim();
                        http.put(`/eventfb/${id}`, values)
                            .then((res) => {
                                console.log(res.data);
                                navigate("/retrieveeventfb");
                            });
                        handleClose();
                    }}
                >
                    {({ handleSubmit, setFieldValue }) => (
                        <Modal show={show} onHide={() => navigate('/retrieveeventfb')} centered>
                            <Modal.Header closeButton>
                                <Modal.Title style={{ marginLeft: "auto" }}>Event Feedback</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormikForm>
                                    <Container fluid>
                                        <Form.Group controlId="formRating" className="text-center">
                                            <Form.Label>Please rate your Experience Below</Form.Label>
                                            <div className="d-flex justify-content-center" style={{ marginTop: "-15px" }}>
                                                <Rating
                                                    count={5}
                                                    size={45}
                                                    activeColor="#ffd700"
                                                    value={eventfblist.rating}
                                                    onChange={(newRating) => {
                                                        setFieldValue('rating', newRating);
                                                    }}
                                                />
                                            </div>
                                            <ErrorMessage name="rating" component="div" className="text-danger" />
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
                                            Update
                                        </Button>
                                        <h6 style={{ textAlign: "center", marginTop: "5%" }}>Or</h6>
                                        <Button variant="danger" className="mt-3 mb-3" style={{ width: "80%", marginLeft: "10%" }} onClick={handleDeleteConfirmShow}>
                                            Delete
                                        </Button>
                                    </Container>
                                </FormikForm>
                            </Modal.Body>
                        </Modal>
                    )}
                </Formik>
            )}

            <Modal show={deleteConfirmShow} onHide={handleDeleteConfirmClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this feedback?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteConfirmClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteEventFeedback}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditEventFeedback;
