import { Typography, TextField, Box, Button } from "@mui/material"
import { useFormik } from "formik";
import { toast } from 'react-toastify';
import * as yup from 'yup';
import http from '../http';
import { useState, useEffect } from "react";

export default function ResetEndpoint() {
    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        if (sessionStorage.getItem("accessToken")) {
            http.get('/user/auth').then((res) => {
                setUser(res.data.user);
                if (res.data.status == 301) {
                    navigate("/verify", { replace: true })
                }
            });
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            password: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
        }),
        onSubmit: async (data) => {
            data.password = data.password.trim();
            try {
                const response1 = await http.post("/user/resethandler", data); // Use await
                console.log('Response from /user/resethandler:', response1.data);

                // Handle response from first POST request (optional)

                // Assuming successful response, trigger email sending
                if (response1.data == "User was verified successfully.") {
                    await http.post("/user/sendResetEmail"); // Use await with sendResetEmail function
                    toast.success('Password reset email sent successfully!'); // Or similar success message
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

    });

    return (
        <>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Typography variant='h6' sx={{ mt: 1 }}>Enter your current Password</Typography>
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

                <Button variant="contained" type="submit">
                    Submit
                </Button>
            </Box>
        </>
    )
}