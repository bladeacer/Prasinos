import { useFormik } from "formik";
import * as yup from 'yup';
import { Typography, Box, Button, TextField } from "@mui/material";
import { LoginWrapper, LogBox, CloseButton, CustBox } from "./reusables/components/login_components"
import { toast, ToastContainer } from 'react-toastify';
import http from '../http';

export default function ResetPassword() {
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
            http.put("/user/reset", data)
                .then((res) => {
                    localStorage.removeItem("accessToken");
                    navigate("/login", { replace: true });
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
        <>
            <LoginWrapper>
                <LogBox>
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

                    <ToastContainer />
                    <CustBox></CustBox>
                    <CloseButton href="/dangerZone">X</CloseButton>
                </LogBox>
            </LoginWrapper>
        </>
    )
}