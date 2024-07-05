import { Button, Box } from "@mui/material"

export default function SelectLogin() {
    return (
        <>
            <Box sx={{mt: '250px'}}>
                <Button href="/home">Click me to go to user site</Button>
                <Button href="/staffLogin">Click me to login on the staff site</Button>
                <Button href="/staffRegister">Click me to register on the staff site</Button>
            </Box>

        </>
    )
}