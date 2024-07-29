import { useFormik } from "formik"
import * as yup from 'yup';
import { LoginWrapper, LogBox, CloseButton } from "./reusables/components/login_components"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import http from '../http'
import { toast, ToastContainer } from 'react-toastify';

export default function EditUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: ""
    })
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        http.get("/user/auth").then((res) => {
            setUser(res.data.user);
            setImageFile(res.data.user.imageFile);
            if (res.data.status == 301) {
                navigate("/verify", { replace: true })
            }
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
            if (imageFile) {
                data.imageFile = imageFile;
            }

            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.password = user.password;
            data.phone = data.phone;
            http.put("/user/edit", data)
                .then((res) => {
                    navigate("/settings", { replace: true });
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
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />
                                    </Button>
                                    {
                                        imageFile && (
                                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                                <img alt="tutorial"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </Grid>
                        </>
                    )}
                </LogBox>
            </LoginWrapper>
            <ToastContainer />
            <CloseButton href="/settings">X</CloseButton>
        </>
    )
}