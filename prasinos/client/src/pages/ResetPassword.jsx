import { useFormik } from "formik"
import * as yup from 'yup';
import { LoginWrapper, LogBox, CloseButton } from "./reusables/components/login_components"
import { useParams } from "react-router-dom";
import { Typography, Box, Button, TextField } from "@mui/material";
import http from '../http';
import { toast } from 'react-toastify';

export default function ResetPassword() {
    const { id } = useParams();

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
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
                .oneOf([yup.ref('password')], 'Passwords must match')
        }),
        onSubmit: (data) => {
            data.password = data.password.trim();
            http.put(`/user/reset/${id}`, data)
                .then((res) => {
                    window.location = "/home";
                    localStorage.clear();
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });
    return (
        <>
            <LoginWrapper sx={{ borderRadius: '10px' }}>
                <LogBox>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Edit User
                    </Typography>
                    {/* {user.name} {user.email} {user.password} {user.createdAt} */}

                    <>
                        <Box component="form" onSubmit={formik.handleSubmit}>

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

                            <Button variant="contained" type="submit">
                                Save
                            </Button>
                            <Typography variant="h5" sx={{ my: 2 }}>
                                Note: Logout to reflect changes
                            </Typography>
                        </Box>
                    </>
                </LogBox>
            </LoginWrapper>
            <CloseButton href="/settings">X</CloseButton>
        </>
    )
}