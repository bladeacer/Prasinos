import React, { useEffect, useState } from 'react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import http from '../http';
import { Box} from '@mui/material';

const validationSchema = Yup.object({
    name: Yup.string().trim().min(3).max(100).required('Full Name is required'),
    email: Yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
    reporttype: Yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback'], 'Invalid report type').required('Purpose of report is required'),
    elaboration: Yup.string().trim().min(3).max(500).required('Elaboration is required')
});

function EditWebsiteFeedback() {
    const { id } = useParams();
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        http.get(`/websitefb/${id}`).then((res) => {
            setFeedback(res.data);
            setImageFile(res.data.imageFile);
        }).catch((err) => {
            console.error(err);
        });
    }, [id]);

    if (!feedback) {
        return <div>Loading...</div>;
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Formik
            initialValues={{
                name: feedback.name,
                email: feedback.email,
                reporttype: feedback.reporttype,
                elaboration: feedback.elaboration,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                if (imageFile) {
                    values.imageFile = imageFile;
                }
                values.name = values.name.trim();
                values.email = values.email.trim();
                values.elaboration = values.elaboration.trim();
                http.put(`/websitefb/${id}`, values)
                    .then((res) => {
                        console.log(res.data)
                        navigate("/retrievewebsitefbuser");
                    });
                handleClose();
            }}
        >
            {({
                handleSubmit,
            }) => (
                <Modal show={true} onHide={() => navigate('/retrievewebsitefbuser')} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ marginLeft: "auto" }}>Edit Website Feedback</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormikForm noValidate>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Field name="name" type="text" className="form-control" />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Field name="email" type="text" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Purpose of report</Form.Label>
                                <Field as="select" name="reporttype" className="form-control" >
                                    <option value="" label="Select report type" />
                                    <option value="Bug Report" label="Bug Report" />
                                    <option value="Feature Request" label="Feature Request" />
                                    <option value="General Feedback" label="General Feedback" />
                                </Field>
                                <ErrorMessage name="reporttype" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Explain what had happened</Form.Label>
                                <Field as="textarea" name="elaboration" rows={3} className="form-control" />
                                <ErrorMessage name="elaboration" component="div" className="text-danger" />
                            </Form.Group>
                            <Box mb={3}>
                                <Button variant="primary" component="span" onClick={() => document.getElementById('fileInput').click()}>
                                    Change Image (Optional)
                                </Button>
                                <input
                                    id="fileInput"
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={onFileChange}
                                />
                            </Box>
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="uploaded file" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} />
                                    </Box>
                                )
                            }
                            <br />
                            <Button variant="success" type="submit" onClick={handleSubmit} style={{ marginLeft: "35%" }}>
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
