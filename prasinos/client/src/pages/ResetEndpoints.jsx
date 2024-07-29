import { Typography, TextField, Box, Button } from "@mui/material"
import { useFormik } from "formik";
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup';
import http from '../http'

export default function ResetEndpoint() {
    // Refactor to send email skipping this process, e.g. http.post in use effect hook of ResetPassword directly (smth like verify.jsx but different)

    const formik = useFormik({
        initialValues: {
            password: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            otp: yup.string().trim()
                .max(6, 'Otp must be at most 50 characters')
                .required('Otp is required')
        }),
        onSubmit: async (data) => {
            data.password = data.password.trim();
            try {
                const response1 = await http.post("/user/resethandler", data);
                if (response1.data === "User was verified successfully.") {
                    await http.post("/user/sendResetEmail");
                    toast.success('Password reset email sent successfully!');
                }
            } catch (err) {
                if (err.response.data.message) {
                    toast.error(`${err.response.data.message}`);
                } else {
                    toast.error(`${err}`);
                }
            }
        }

    });

    return (
        <>
            <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
                <Typography sx={{ my: 2, fontSize: '1.7em' }}>
                    Welcome back!
                </Typography>
                <Typography sx={{ fontSize: '1.15em' }}>
                    Enter your credientials to continue
                </Typography>

                <Typography variant='h6' sx={{ mt: 4 }}>Enter one-time password:</Typography>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="OTP"
                    name="otp"
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                    helperText={formik.touched.otp && formik.errors.otp}
                />

                <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#8ab78f' }}
                    type="submit">
                    Verify
                </Button>
            </Box>
            <ToastContainer />
        </>
    )
}