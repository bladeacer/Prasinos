import { useFormik } from "formik"
import * as yup from 'yup';
import { LoginWrapper, LogBox, CloseButton } from "./reusables/components/login_components"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Box, Button, TextField } from "@mui/material";
import http from '../http'
import { toast } from 'react-toastify';

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: ""
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get("/user/auth").then((res) => {
            setUser(res.data.user);
            // setImageFile(res.data.imageFile);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
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
            phone: yup.string()
                .required("Phone number is required")
                .matches(/^\+65\s?([689]\d{7}|[1][-\s]\d{7}|[3]\d{3}[-\s]\d{4})$/,
                    "Express in the form '+65 81234567'")
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = user.password;
            data.phone = data.phone;
            http.put("/user/edit", data)
                .then((res) => {
                    navigate("/settings");
                    window.location.reload();
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });
    return (
        <>
            <LoginWrapper sx={{ borderRadius: '10px' }}>
                <LogBox>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Edit User
                    </Typography>
                    {/* {user.name} {user.email} {user.password} {user.createdAt} */}
                    {!loading && (
                        <>
                            <Box component="form" onSubmit={formik.handleSubmit}>

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
                                <Button variant="contained" type="submit">
                                    Save
                                </Button>
                            </Box>
                        </>
                    )}
                </LogBox>
            </LoginWrapper>
            <CloseButton href="/settings">X</CloseButton>
        </>
    )
}