import { useFormik } from "formik"
import * as yup from 'yup';
import { LoginWrapper, LogBox, CloseButton, CustBox } from "./reusables/components/login_components"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import http from '../http'
import { toast, ToastContainer } from 'react-toastify';
import zIndex from "@mui/material/styles/zIndex";

export default function EditUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        company: ""
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
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Name only allow letters, spaces and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters'),
            phone: yup.string()
                .matches(/^\+65\s?([689]\d{7}|[1][-\s]\d{7}|[3]\d{3}[-\s]\d{4})$/,
                    "Express in the form '+65 81234567'"),
            company: yup.string()
                .min(10, 'Company must be at least 3 characters')
                .max(150, 'Company must be at most 50 characters')
                .matches(/^[a-zA-Z '-,.]+$/,
                    "Company only allow letters, spaces and characters: ' - , ."),
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.email = data.email.trim().toLowerCase();
            data.phone = data.phone;
            data.company = data.company.trim();
            if (imageFile) {
                data.imageFile = imageFile;
            }
            console.log(data);
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

                    {!loading && (
                        <>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Edit User
                            </Typography>
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

                                <Typography variant='h6' sx={{ mt: 1 }}>Company</Typography>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Company"
                                    name="company"
                                    value={formik.values.company}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.company && Boolean(formik.errors.company)}
                                    helperText={formik.touched.company && formik.errors.company}
                                />

                                <Typography variant='h6' sx={{ mt: 1 }}>Upload profile picture</Typography>
                                {
                                    imageFile && (
                                        <Box className="smallImage" sx={{ mt: 3, width: '150px' }}>
                                            <img alt="image"
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} sx={{ zIndex: 10 }}>
                                            </img>
                                        </Box>
                                    )
                                }
                                <Button variant="contained" component="label" sx={{ my: 4, ml: 22, mt: -20 }}>
                                    Upload Image
                                    <input hidden accept="image/*" multiple type="file"
                                        onChange={onFileChange} />
                                </Button>

                                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                                    Save
                                </Button>


                            </Box>
                        </>
                    )}
                </LogBox>
            </LoginWrapper>
            <CustBox />
            <ToastContainer />
            <CloseButton href="/settings">X</CloseButton>
        </>
    )
}