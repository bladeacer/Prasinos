import { useContext } from "react";
import { UserContext } from "../contexts/Contexts";
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


export default function VerifyEmail() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            uuid: "",
            passphrase: ""
        },
        validationSchema: yup.object({
            uuid: yup.string().trim()
                .email('Enter a valid UUID')
                .max(36, 'Email must be at most 36 characters')
                .required('UUID is required'),
            passphrase: yup.string().trim()
                .min(8, 'Passphrase must be at least 8 characters')
                .max(50, 'Passphrase must be at most 50 characters')
                .required('Passphrase is required')
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.passphrase = data.passphrase.trim();

            http.put("/verifyhandler", data)
                .then((res) => {
                    sessionStorage.removeItem("accessToken");
                    setUser(res.data.user);
                    if (res.data.status !== 301) {
                        navigate("/logout", { replace: true });
                        window.location.reload();
                    }

                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    })

    return (
        <>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>

                <Typography sx={{ my: 2, fontSize: '1.7em' }}>
                    Welcome back!
                </Typography>
                <Typography sx={{ fontSize: '1.15em' }}>
                    Enter your credientials to verify
                </Typography>

                <Typography variant='h6' sx={{ mt: 4 }}>Email address</Typography>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="UUID"
                    name="uuid"
                    value={formik.values.uuid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.uuid && Boolean(formik.errors.uuid)}
                    helperText={formik.touched.uuid && formik.errors.uuid}
                />

                <Typography variant='h6' sx={{ mt: 2 }}>Password</Typography>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Passphrase"
                    name="passphrase" type="password"
                    value={formik.values.passphrase}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.passphrase && Boolean(formik.errors.passphrase)}
                    helperText={formik.touched.passphrase && formik.errors.passphrase}
                />

                <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#8ab78f' }}
                    type="submit">
                    Login
                </Button>
            </Box>
            <ToastContainer />
        </>
    )
}