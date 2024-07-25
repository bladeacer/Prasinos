import { Typography, Button, Box } from "@mui/material"
import { useEffect } from "react"
import http from '../http'
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

export default function Verify() {
    // get details from accesstoken, call the method to send email and clear session storage immediately after
    const navigate = useNavigate();
    useEffect(() => {
        window.location.reload();
        http.post("/user/verify")
            .then((res) => {
                navigate("/verifyhandler", {replace: true})
            })
            .catch((err) => {
                toast.error("An unexpected error occured.")
            })
    }, []);

    return (
        <>
            <Box sx={{mt: '35vh'}}>
                <Typography>Check your email for the next verification step</Typography>
                <Typography>If you do not see the email, please contact our admin support.</Typography>
                <Button href={"/home"}>Click here to go back to homepage</Button>
            </Box >
        </>
    )
}