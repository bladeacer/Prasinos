import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import { LogBox, CustBox, LoginWrapper, CloseButton } from './reusables/components/login_components';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "Password at least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
            phone: yup.string()
                .required("Phone number is required")
                .matches(/^\+65\s?([689]\d{7}|[1][-\s]\d{7}|[3]\d{3}[-\s]\d{4})$/,
                    "Express in the form '+65 81234567'")
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            data.phone = data.phone;
            http.post("/user/register", data)
                .then((res) => {
                    navigate("/login", { replace: true });
                    window.location.reload();
                })
                .catch(function (err) {
                    if (err.response.data.message) {
                        toast.error(`${err.response.data.message}`);
                    } else {
                        toast.error(`${err}`);
                    }
                });
        }
    });

    return (
        <>
            <LoginWrapper>
                <LogBox>
                    <Box component="form" sx={{ maxWidth: '500px', scale: '90%' }}
                        onSubmit={formik.handleSubmit}>
                        <Typography sx={{ mt: -3, fontSize: '1.7em' }}>
                            Get Started
                        </Typography>
                        <Typography variant='h6' sx={{ mt: 0 }}>Name</Typography>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        <Typography variant='h6' sx={{ mt: 1 }}>Email address</Typography>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <Typography variant='h6' sx={{ mt: 1 }}>Mobile Number</Typography>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Phone number"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />

                        <Typography variant='h6' sx={{ mt: 1 }}>Password</Typography>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Password"
                            name="password" type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <Typography variant='h6' sx={{ mt: 1 }}>Confirm Password</Typography>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Confirm Password"
                            name="confirmPassword" type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        />

                        <Button fullWidth variant="contained" sx={{ mt: 1, backgroundColor: '#8ab78f' }}
                            type="submit">
                            Register
                        </Button>

                        <Typography variant='h6' sx={{ mt: 2 }}>Have an account? <a href="/login">Login here</a></Typography>
                    </Box>
                    <ToastContainer />
                    <CustBox>
                        <Box sx={{ zIndex: '4', width: '100%', height: '100%', '&:hover': { backdropFilter: 'blur(9px)' } }}>
                            <Typography sx={{ position: 'relative', opacity: 0, zIndex: '5', width: '100%', height: '100%', color: '#fff', '&:hover': { opacity: 1 }, textTransform: 'unset', fontSize: '36px', fontWeight: 'bold', textAlign: 'center', transform: 'translate(0%, 35%)' }}>Prasinos does not use cookies.</Typography>
                        </Box>
                    </CustBox>
                    <CloseButton href="/home">X</CloseButton>
                </LogBox>
            </LoginWrapper>
        </>
    );
}

export default Register;