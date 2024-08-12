import { LoginWrapper, LogBox, CloseButton, DangerHeader } from "./reusables/components/login_components"
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import http from '../http'
import { useState } from "react";
import { logout } from "./reusables/logout";

export default function DangerZone() {
    // TODO: Refactor delete confirmation dialogue

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteUser = () => {
        http.delete('/user/delete')
            .then((res) => {
                localStorage.removeItem("accessToken");                navigate("/home", {replace: true});
                window.location.reload();
            })
            .catch((err) =>{

            })
            ;
    }

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
                    <Box>
                        <Typography variant="h4" sx={{ mt: 7, width: '35vw' }}>When to Use: <b>Delete User</b></Typography>
                        <Typography variant="h6" sx={{ mt: 4 }} >You wish to delete your account.</Typography>
                    </Box>


                    <Box sx={{ positon: 'absolute', mt: -46.75, ml: 95, mb: 19, width: '35vw' }}>
                        <Button href={"/edit"} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Edit Details</Button>
                    </Box>
                    <Box sx={{ positon: 'absolute', mt: -4.75, ml: 95, width: '35vw' }}>
                        <Button href={"/resetendpoint"} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Reset Password</Button>
                    </Box>

                    <Box sx={{ positon: 'absolute', mt: 14.75, ml: 95, width: '35vw' }}>
                        <Button onClick={handleOpen} sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Delete user</Button>
                    </Box>
                    {/* TODO: Add delete user route confirmation dialgoue */}
                </LogBox>
            </LoginWrapper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete User
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteUser}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <CloseButton href="/settings">X</CloseButton>
        </>
    )
}