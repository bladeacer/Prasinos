import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css'; // Import the CSS file here

const validationSchema = Yup.object({
  name: Yup.string().trim().min(3).max(100).required('Full Name is required'),
  email: Yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
  reporttype: Yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback'], 'Invalid report type').required('Purpose of report is required'),
  elaboration: Yup.string().trim().min(3).max(500).required('Elaboration is required')
});

function WebsiteFeedback() {
  const [websitefblist, setWebsitefblist] = useState([]);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null); // Object to store file info
  const [show, setShow] = useState(false); // Change to false to not show modal on page load
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
          setImageFile({
            filename: res.data.filename,
            originalName: file.name
          });
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

  const handleShow = () => setShow(true); // Function to show the modal

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  return (
    <>
      <Box style={{ marginTop: "140px", width: "80vw", height: "75vh", marginLeft: "13%", display: 'flex', alignItems: 'flex-start', border: "1px solid black" }}>
        <Box style={{ flex: 1, paddingRight: '20px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3988.7099375854746!2d103.8721372!3d1.3505666!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da17a706d23a21%3A0x17d86a2a6ca98331!2s50%20Serangoon%20Ave%202%2C%20Singapore%20556129!5e0!3m2!1sen!2ssg!4v1722147315705!5m2!1sen!2ssg" 
            width="650" height="596" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </Box>
        <Box style={{ flex: 1, paddingTop: "150px", marginLeft: "20px"}}>
          <h1>WE ARE LOCATED AT</h1>
          <a href="https://www.google.com/maps/place/50+Serangoon+Ave+2,+Singapore+556129/@1.3505666,103.8721372,17z/data=!4m6!3m5!1s0x31da17a706d23a21:0x17d86a2a6ca98331!8m2!3d1.3517619!4d103.870407!16s%2Fg%2F11bw4c4kdh?entry=tts" target='_blank' className='address'><h5>50 Serangoon Ave 2, Singapore 556129</h5></a>
          <h5 style={{ marginTop: "50px"}}>WhatsApp: +65 12345678</h5>
          <h5>Email Us: <a href="mailto:prasinossg@gmail.com">PrásinosSG@gmail.com</a></h5>
          <h5>Opening Hours: Monday-Friday: 9am to 6pm</h5>
          <h5 style={{ marginLeft: "30%"}}>Weekends & PH: 9am to 4pm</h5>
        </Box>
      </Box>
      
      <h1 style={{ marginTop: '50px', marginLeft: "40%"}}>Frequently Asked Questions</h1>
      <Accordion defaultActiveKey="0" style={{ marginLeft: "15%", marginBottom: "50px", marginTop: '40px'}}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>1. What is the Prásinos website about?</Accordion.Header>
          <Accordion.Body>
            A platform for residents to participate in
            <ul>
              <li>Sustainability initiatives, share ideas, and collaborate on projects.</li>
              <li>Enable users and organisations to advertise events (e.g., recycling drives and tree planting activities).</li>
              <li>Encourage active involvement and foster a sense of community ownership over sustainability efforts.</li>
              <li>Provide information on sustainable practices (e.g., waste reduction, energy conservation, water management, and green living tips).</li>
              <li>Help raise awareness among residents and empower them to adopt more sustainable behaviours through our platform.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>2. What are the different tiers for the reward system?</Accordion.Header>
          <Accordion.Body>
            There are 3 tiers: bronze, silver, and gold. For each tier, users can earn more points (50% more in silver, 75% more in gold, etc.). Users participate in sustainability events to earn points, which can be spent on rewards until they run out.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>3. What is the Danger Zone?</Accordion.Header>
          <Accordion.Body>
            It is used to securely reset user accounts passwords, reset account data, and permanently delete accounts.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>4. How do I create events?</Accordion.Header>
          <Accordion.Body>
            Firstly, click on the "Create Event Proposal" button, provide the relevant details about your event, and wait for approval. Once approved, your event is created and ready to go.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>5. How long does it take to get an event approved?</Accordion.Header>
          <Accordion.Body>
            On average, it takes around 2 days to approve or reject an event proposal.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header>6. How will I get notified when my event is approved?</Accordion.Header>
          <Accordion.Body>
            Our team will send an email to notify you if your event is approved or rejected.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="6">
          <Accordion.Header>7. Can I cancel my booking for an event?</Accordion.Header>
          <Accordion.Body>
            Yes, you can cancel your booking before the event starts, but not during the event duration.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="7">
          <Accordion.Header>8. Can I cancel an event and reschedule the date?</Accordion.Header>
          <Accordion.Body>
            Yes, you can edit the event date and time on your account events page.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="8">
          <Accordion.Header>9. What do I do if I forget my password?</Accordion.Header>
          <Accordion.Body>
            Go to your account page, select the Danger Zone, and click on "Reset Password." An email will be sent for you to change your password.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="9">
          <Accordion.Header>10. Can I retrieve back my deleted account?</Accordion.Header>
          <Accordion.Body>
            Unfortunately, accounts that are permanently deleted cannot be retrieved.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="10">
          <Accordion.Header>11. How do I contact you if I have other questions?</Accordion.Header>
          <Accordion.Body>
            For further enquiries please click on this link and complete the <a href="#" onClick={handleShow}>website feedback form</a> to ask your question.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
            values.imageFile = imageFile.filename;
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
        {({ handleSubmit }) => (
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
                    <Box mb={1}>
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
                        <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" p={2} borderRadius={1}>
                          <span>{imageFile.originalName}</span>
                          <IconButton onClick={handleRemoveImage}>
                            <DeleteIcon />
                          </IconButton>
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
