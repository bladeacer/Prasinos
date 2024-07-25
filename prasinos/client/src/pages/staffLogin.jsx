import React, { useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StaffContext, UserContext } from '../contexts/Contexts';
import { LogBox, CustBox, LoginWrapper, CloseButton } from './reusables/components/login_components';


export default function StaffLogin() {
    const navigate = useNavigate();
    const { setStaff } = useContext(StaffContext);
    const {setUser} = useContext(UserContext)

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            if (sessionStorage.getItem("accessToken")) {
                sessionStorage.removeItem("accessToken");
            }
            http.post("/staff/login", data)
                .then((res) => {
                    sessionStorage.setItem("accessToken", res.data.accessToken);
                    setStaff(res.data.staff);
                    setUser(null);
                    navigate("/staffHome", {replace: true});
                    window.location.reload();
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

    return (
        <>
            <LoginWrapper>
                <LogBox>
                    <Typography sx={{ my: 2, fontSize: '1.7em' }}>
                        Welcome back!
                    </Typography>
                    <Typography sx={{ fontSize: '1.15em' }}>
                        Enter your credientials to login
                    </Typography>
                    <Box component="form" sx={{ maxWidth: '500px' }}
                        onSubmit={formik.handleSubmit}>

                        <Typography variant='h6' sx={{ mt: 4 }}>Email address</Typography>
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

                        <Typography variant='h6' sx={{ mt: 2 }}>Password</Typography>
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

                        <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#8ab78f' }}
                            type="submit">
                            Login
                        </Button>
                    </Box>
                    <ToastContainer />
                    <CustBox>
                        {/* <Button sx={{opacity: 0, zIndex: '5', width: '100%', height: '100%', color: '#fff', '&:hover': {opacity: 1}, textTransform: 'unset', fontSize: '36px', fontWeight: 'bold', textAlign: 'center'}} href="/home">Click on me to go back to the home page!</Button> */}
                    </CustBox>
                    <CloseButton href="/">X</CloseButton>
                </LogBox>
            </LoginWrapper>
        </>
    )
}
