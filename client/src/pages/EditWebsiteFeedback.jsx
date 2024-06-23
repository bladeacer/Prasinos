import React, { useEffect, useState } from 'react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import http from '../http';

const validationSchema = Yup.object({
    name: Yup.string().trim().min(3).max(100).required('Full Name is required'),
    email: Yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
    reporttype: Yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback'], 'Invalid report type').required('Purpose of report is required'),
    elaboration: Yup.string().trim().min(3).max(500).required('Elaboration is required')
});

function EditWebsiteFeedback() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        http.get(`/websitefb/${id}`).then((res) => {
            setFeedback(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [id]);

    if (!feedback) {
        return <div>Loading...</div>;
    }

    return (
        <Formik
            validationSchema={validationSchema}
            onSubmit={async (data) => {
                await http.put(`/websitefb/${id}`, data);
                navigate('/websitefeedback');
            }}
            initialValues={{
                name: feedback.name,
                email: feedback.email,
                reporttype: feedback.reporttype,
                elaboration: feedback.elaboration,
            }}
        >
            {({
                handleSubmit,
                handleChange,
                values,
                errors,
            }) => (
                <Modal show={true} onHide={() => navigate('/websitefeedback')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Website Feedback</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormikForm noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Field name="name" type="text" className="form-control" isInvalid={!!errors.name} />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Field name="email" type="text" className="form-control" isInvalid={!!errors.email} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Purpose of report</Form.Label>
                                <Field as="select" name="reporttype" className="form-control" isInvalid={!!errors.reporttype}>
                                    <option value="" label="Select report type" />
                                    <option value="Bug Report" label="Bug Report" />
                                    <option value="Feature Request" label="Feature Request" />
                                    <option value="General Feedback" label="General Feedback" />
                                </Field>
                                <ErrorMessage name="reporttype" component="div" className="invalid-feedback" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Elaboration</Form.Label>
                                <Field as="textarea" name="elaboration" rows={3} className="form-control" isInvalid={!!errors.elaboration} />
                                <ErrorMessage name="elaboration" component="div" className="invalid-feedback" />
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </FormikForm>
                    </Modal.Body>
                </Modal>
            )}
        </Formik>
    );
}

export default EditWebsiteFeedback;
