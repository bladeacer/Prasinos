import { Typography, Button, Box } from "@mui/material"
import { useEffect } from "react"
import http from '../http'
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from "./reusables/logout";

export default function Verify() {
    // get details from accesstoken, call the method to send email and clear session storage immediately after
    const navigate = useNavigate();
    useEffect(() => {
        http.post("/user/sendVerifyEmail")
        .then((res) => {
        })
        .catch(function (err) {
            if (err.response.data.message) {
                toast.error(`${err.response.data.message}`);
            } else {
                toast.error(`${err}`);
            }
        });
    }, []);

    return (
        <>
            <Box sx={{ mt: '35vh' }}>
                <Typography>Check your email for the next verification step</Typography>
                <Typography>If you do not see the email, please contact our admin support.</Typography>
                <Typography>If you see two emails, only take the otp from the latest one and ignore the first one.</Typography>
                <Typography>If do not see an email, reload and try again</Typography>
                <Button href={"/home"} onClick={logout}>Click here to go back to homepage</Button>
                <ToastContainer />
            </Box >
        </>
    )
}