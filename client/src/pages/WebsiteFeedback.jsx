import '../App.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton } from '@mui/material';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

const validationSchema = Yup.object({
    name: Yup.string().trim().min(3).max(100).required('Full Name is required'),
    email: Yup.string().email('Invalid email').trim().min(3).max(100).required('Email is required'),
    reporttype: Yup.string().oneOf(['Bug Report', 'Feature Request', 'General Feedback'], 'Invalid report type').required('Purpose of report is required'),
    elaboration: Yup.string().trim().min(3).max(500).required('Elaboration is required')
});

function WebsiteFeedback() {
  const [websitefblist, setWebsitefblist] = useState([]);
  const [search, setSearch] = useState('');

  const [show, setShow] = useState(true);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getWebsitefb = () => {
    http.get('/websitefb').then((res) => {
        setWebsitefblist(res.data);
    });
  };

  const searchWebsitefb = () => {
    http.get(`/websitefb?search=${search}`).then((res) => {
        setWebsitefblist(res.data);
    });
  };

  useEffect(() => {
    http.get('/websitefb').then((res) => {
      console.log(res.data);
      setWebsitefblist(res.data);
    });
  }, [])

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
        searchWebsitefb();
    }
  };

  const onClickSearch = () => {
    searchWebsitefb();
  }

  const onClickClear = () => {
    setSearch('');
    getWebsitefb();
  };

  const handleClose = () => setShow(false);

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
            websitefblist.map((websitefb, i) => {
              return (
                <Grid item xs={12} md={6} lg={4} key={websitefb.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {websitefb.name}
                        </Typography>
                        <Link to={`/editwebsitefeedback/${websitefb.id}`}>
                          <IconButton color="primary" sx={{ padding: '4px' }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        color="text.secondary">
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography>
                          {dayjs(websitefb.createdAt).format(global.datetimeFormat)}
                        </Typography>
                      </Box>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {websitefb.email}
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {websitefb.reporttype}
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {websitefb.elaboration}
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
        validationSchema={validationSchema}
        onSubmit={async (data, { resetForm }) => {
          await http.post("/websitefb", data);
          resetForm();
          setShow(false);
          getWebsitefb();
        }}
        initialValues={{
          name: '',
          email: '',
          reporttype: '',
          elaboration: '',
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
        }) => (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Website Feedback</Modal.Title>
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
                  Submit
                </Button>
              </FormikForm>
            </Modal.Body>
          </Modal>
        )}
      </Formik>
    </>
  );
}

export default WebsiteFeedback;
