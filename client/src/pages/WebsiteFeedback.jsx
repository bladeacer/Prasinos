import '../App.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const validationSchema = Yup.object({
  name: Yup.string().trim().min(3).max(100).required('Full Name is required'),
  email: Yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
  reporttype: Yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback'], 'Invalid report type').required('Purpose of report is required'),
  elaboration: Yup.string().trim().min(3).max(500).required('Elaboration is required')
});

function WebsiteFeedback() {
  const [websitefblist, setWebsitefblist] = useState([]);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  useEffect(() => {
    http.get('/websitefb').then((res) => {
      console.log(res.data);
      setWebsitefblist(res.data);
    });
  }, []);

  const handleClose = () => setShow(false);

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          reporttype: '',
          elaboration: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          values.name = values.name.trim();
          values.email = values.email.trim();
          values.elaboration = values.elaboration.trim();
          if (imageFile) {
            values.imageFile = imageFile;
          }
          http.post("/websitefb", values)
            .then((res) => {
              console.log(res.data);
              setSubmitted(true);
              setLoading(false);
              setTimeout(() => {
                navigate("/retrievewebsitefbuser");
                handleClose();
              }, 3000);
            })
            .catch((err) => {
              setLoading(false);
              toast.error('Submission failed. Please try again.');
            });
        }}
      >
        {({
          handleSubmit
        }) => (
          <>
            <Modal dialogClassName="modal-width" show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: "32%", fontWeight: "bold" }}>Website Feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ paddingLeft: "5%", marginRight: "3%" }}>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                  </Box>
                ) : submitted ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CheckCircleIcon color="success" style={{ fontSize: 150 }} />
                    <h4 style={{ fontWeight: "bold", marginTop: "10px" }}>Website Feedback Submitted!</h4>
                    <p style={{ marginTop: "10px" }}>Thank you! Your feedback will be reviewed by our team and <br />you will be notified via email or check in the support chat.</p>
                  </Box>
                ) : (
                  <FormikForm noValidate >
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
                      <Field as="select" name="reporttype" className="form-control">
                        <option value="" label="Select report type" />
                        <option value="Bug Report" label="Bug Report" />
                        <option value="Feature Request" label="Feature Request" />
                        <option value="General Feedback" label="General Feedback" />
                      </Field>
                      <ErrorMessage name="reporttype" component="div" className="text-danger" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Explain what you have experienced</Form.Label>
                      <Field as="textarea" name="elaboration" rows={3} className="form-control" />
                      <ErrorMessage name="elaboration" component="div" className="text-danger" />
                    </Form.Group>
                    <Box mb={3}>
                      <Button variant="secondary" component="span" onClick={() => document.getElementById('fileInput').click()}>
                        Upload Image (Optional)
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
                    <Button variant="success" type="submit" onClick={handleSubmit} style={{ marginLeft: "35%", width: "30%", height: "40px", marginBottom: "2%" }}>
                      Submit
                    </Button>
                  </FormikForm>
                )}
              </Modal.Body>
            </Modal>
            <ToastContainer />
          </>
        )}
      </Formik>
    </>
  );
}

export default WebsiteFeedback;
