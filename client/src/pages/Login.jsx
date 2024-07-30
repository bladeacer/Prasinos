import React, { useContext } from 'react';
import { Box, Typography, TextField, Button, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            role: "user"
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
            console.log(data.role);

            // Determine the endpoint based on a condition, e.g., isAdmin flag
            const endpoint = data.role === "admin" ? "/admin/login" : "/user/login";

            http.post(endpoint, data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    if (data.role === 'admin') {
                        navigate("/dashboard");
                    } else {
                        navigate("/");
                    }
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }} style={{ marginLeft: "5%", marginRight: "-10%", marginTop: "130px"}}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Login
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
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
                <FormControl component="fieldset">
                    <FormLabel component="legend">Role</FormLabel>
                    <RadioGroup
                        row
                        aria-label="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange} // Ensure handleChange updates formik state
                    >
                        <FormControlLabel value="user" control={<Radio />} label="User" />
                        <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    </RadioGroup>
                </FormControl>
                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
                    Login
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default Login;