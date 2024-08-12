import { useFormik } from "formik"
import * as yup from 'yup';
import { LoginWrapper, LogBox, CloseButton, CustBox } from "./reusables/components/login_components"
import { Typography, Box, Button, TextField } from "@mui/material";
import http from '../http';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from "react";
// import { useNavigate } from 'react';

export default function ForgetPassword() {
    const [id, setID] = useState(0);
    const [dispReset, setDispReset] = useState(false);
    // const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required')
        }),
        onSubmit: (data) => {
            http.post("/user/getResetUser", data)
                .then((res) => {
                    setID(res.data.user.id);
                })
                .catch(function (err) {
                    if (err.response.data.message) {
                        toast.error(`${err.response.data.message}`);
                    }
                    else {
                        toast.error(`${err}`);
                    }
                });
        }
    });

    const formik1 = useFormik({
        initialValues: {
            otp: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            otp: yup.string().trim()
                .max(6, 'Otp must be at most 50 characters')
                .required('Otp is required')
        }),
        onSubmit: (data) => {
            data.id = id;
            http.put("/user/resethandler", data)
                .then((res) => {
                    if (res.data.message == "User was verified successfully.") {
                        setDispReset(true);
                    } else if (res.data.message == "Reload") {
                        window.location.reload();
                    }
                })
                .catch(function (err) {
                    if (err.response.data.message) {
                        toast.error(`${err.response.data.message}`);
                    } else {
                        toast.error(`${err}`);
                    }
                });

        },
    });

    const formik2 = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "Password at least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
        }),
        onSubmit: (data) => {
            data.id = id;
            http.put("/user/forgetReset", data)
                .then((res) => {
                    window.location.href = "/home";
                    window.location.reload();
                })
                .catch(function (err) {
                    if (err.response.data.message) {
                        toast.error(`${err.response.data.message}`);
                    }
                    else {
                        toast.error(`${err}`);
                    }
                });
        },
    });

    return (
        <LoginWrapper>
            <LogBox>
                {id === 0 && (
                    <>
                        <Typography sx={{ my: 2, fontSize: '1.7em' }}>
                            Enter your email to continue
                        </Typography>

                        <Box component="form" sx={{ maxWidth: '500px' }}
                            onSubmit={formik.handleSubmit}>

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

                            <Button fullWidth variant="contained" sx={{ mt: 1, backgroundColor: '#8ab78f' }}
                                type="submit">
                                Register
                            </Button>
                        </Box>

                        <Typography variant='h6' sx={{ mt: 2 }}>Have an account? <a href="/login">Login here</a></Typography>
                    </>
                )}

                {id !== 0 && !dispReset && (
                    <>
                        <Typography sx={{ my: 2, fontSize: '1.7em' }}>
                            Welcome back!
                        </Typography>
                        <Typography sx={{ fontSize: '1.15em' }}>
                            Enter your credientials to continue
                        </Typography>
                        <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik1.handleSubmit}>
                            <Typography variant='h6' sx={{ mt: 4 }}>Enter one-time password:</Typography>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="OTP"
                                name="otp"
                                value={formik1.values.otp}
                                onChange={formik1.handleChange}
                                onBlur={formik1.handleBlur}
                                error={formik1.touched.otp && Boolean(formik1.errors.otp)}
                                helperText={formik1.touched.otp && formik1.errors.otp}
                            />

                            <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#8ab78f' }}
                                type="submit">
                                Verify
                            </Button>
                        </Box>
                    </>
                )}

                {dispReset && (
                    <>
                        <Typography variant="h5" sx={{ my: 2 }}>
                            Reset Password
                        </Typography>
                        <Box component="form" onSubmit={formik2.handleSubmit}>

                            <Typography variant='h6' sx={{ mt: 1 }}>Password</Typography>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Password"
                                name="password" type="password"
                                value={formik2.values.password}
                                onChange={formik2.handleChange}
                                onBlur={formik2.handleBlur}
                                error={formik2.touched.password && Boolean(formik2.errors.password)}
                                helperText={formik2.touched.password && formik2.errors.password}
                            />

                            <Typography variant='h6' sx={{ mt: 1 }}>Confirm Password</Typography>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Confirm Password"
                                name="confirmPassword" type="password"
                                value={formik2.values.confirmPassword}
                                onChange={formik2.handleChange}
                                onBlur={formik2.handleBlur}
                                error={formik2.touched.confirmPassword && Boolean(formik2.errors.confirmPassword)}
                                helperText={formik2.touched.confirmPassword && formik2.errors.confirmPassword}
                            />

                            <Button variant="contained" type="submit">
                                Reset Password
                            </Button>

                            <Typography variant='h6' sx={{ mt: 4 }}>After you reset your password, you will have to login again.</Typography>
                        </Box>
                    </>
                )}

                <ToastContainer />
                <CustBox></CustBox>
                <CloseButton href="/home">X</CloseButton>
            </LogBox>
        </LoginWrapper>
    )
}