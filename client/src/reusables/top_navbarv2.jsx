import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import imgUrl from '../assets/prasinos-logo.jpg';

const SignInButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: '20px',
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: 'unset',
    backgroundColor: '#d9d9d9',
    borderColor: '#d9d9d9',
    color: '#000000',
    '&:hover': {
        backgroundColor: '#8ab78f',
        borderColor: '#8ab78f',
        boxShadow: 'none',
    },
    overflow: 'hidden'
});

const SignUpButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: '20px',
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: 'unset',
    backgroundColor: '#8ab78f',
    borderColor: '#8ab78f',
    color: '#000000',
    '&:hover': {
        backgroundColor: '#9f8e62',
        borderColor: '#9f8e62',
        boxShadow: 'none',
    },
    overflow: 'hidden'
});

const CustButton = styled(Button)({
    color: '#000000',
    paddingTop: '0.7vh',
    textTransform: 'unset',
    fontSize: '24px',
    overflow: 'hidden'
})

const CustButtonsStack = styled(Stack)({
    backgroundColor: 'transparent',
    position: 'fixed',
    right: '12vw',
    overflow: 'hidden',
    zIndex: '2'
})

const CustNavStack = styled(Stack)({
    backgroundColor: 'transparent',
    position: 'fixed',
    right: '30vw',
    marginRight: '1.5vw',
    overflow: 'hidden',
    zIndex: '1'
})


const CustomAppBar = styled(AppBar)({
    backgroundColor: 'transparent',
    boxShadow: 'unset',
})


export default function TopNavbarV2() {
    return (
        // <Stack spacing={2} direction="row">
        //     <SignInButton variant="contained">Sign In</SignInButton>
        //     <SignUpButton variant="contained" disableRipple>
        //         Bootstrap
        //     </SignUpButton>
        // </Stack>
        <Box sx={{ flexGrow: 1 }}>
            <CustomAppBar position="static">
                <CustButtonsStack spacing={3} direction="row">
                    <SignInButton variant="contained">Sign In</SignInButton>
                    <SignUpButton variant="contained"> Sign Up</SignUpButton>
                </CustButtonsStack>
                <Box
                    component="img"
                    sx={{
                        maxWidth: {xs: 0, md: 0, lg: 195},
                        right: '78vw',
                        position: 'fixed',
                        marginTop: '-2.15vh',
                        marginRight: '2vw',
                    }}
                    alt="The house from the offer."
                    src={imgUrl}
                />
                <CustNavStack spacing={4} direction="row">
                    <CustButton>Home</CustButton>
                    <CustButton>Booking</CustButton>
                    <CustButton>Events</CustButton>
                    <CustButton>Rewards</CustButton>
                    <CustButton>Support</CustButton>
                </CustNavStack>
            </CustomAppBar>

        </Box>
    )
}