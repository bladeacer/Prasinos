import { LoginWrapper, LogBox, CloseButton, DangerHeader } from "./reusables/components/login_components"
import { Box, Typography, Button } from "@mui/material"
import { UserContext } from "../contexts/Contexts";
import { useContext, useEffect, useState } from "react";

export default function DangerZone() {
    const { user } = useContext(UserContext);
    const [uuid, setUUID] = useState(null);
    useEffect(() => {
        if (!sessionStorage.getItem("resetURL")) {
            sessionStorage.setItem("resetURL", crypto.randomUUID())
        }
        setUUID(sessionStorage.getItem("resetURL"))
    })

    return (
        <>
            <LoginWrapper sx={{ borderRadius: '30px' }}>
                <LogBox>
                    <DangerHeader>
                        <Typography sx={{ position: "relative", transform: 'translate(0%, 50%)', fontSize: '60px' }}>Danger Zone</Typography>
                    </DangerHeader>
                    <Box>
                        <Typography variant="h4" sx={{ mt: 26, width: '35vw' }}>When to Use: <b>Edit Details</b></Typography>
                        <Typography variant="h6" sx={{ mt: 4 }} >You wish to edit your user details.</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ mt: 7, width: '35vw' }}>When to Use: <b>Reset Password</b></Typography>
                        <Typography variant="h6" sx={{ mt: 4 }} >You wish to reset your password.</Typography>
                    </Box>

                    <Box sx={{ positon: 'absolute', mt: -25.75, ml: 95, mb: 19, width: '35vw' }}>
                        <Button href={`/edit/${user.id}`} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Edit Details</Button>
                    </Box>
                    <Box sx={{ positon: 'absolute', mt: -4.75, ml: 95, width: '35vw' }}>
                        <Button href={`/resethandler/${user.id}/${uuid}`} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Reset Password</Button>
                    </Box>
                </LogBox>
            </LoginWrapper>
            <CloseButton href="/settings">X</CloseButton>
        </>
    )
}