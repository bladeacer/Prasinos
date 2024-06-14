import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Button, Stack } from '@mui/material';
import imgUrl from '../assets/prasinos-logo.jpg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
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
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
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

const AccentedButton = styled(Button)({
    color: '#8ab78f',
    textDecoration: 'underline',
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

var is_accent = [false, false];
if (window.location.pathname.toString() == "/") {
    is_accent[0] = true;
} else {
    is_accent[0] = false;
}

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
                <Box
                    component="img"
                    sx={{
                        maxWidth: { xs: 0, md: 0, lg: 195 },
                        right: '78vw',
                        position: 'fixed',
                        marginTop: '-12.75px',
                        marginRight: '2vw',
                    }}
                    alt="Prasinos logo"
                    src={imgUrl}
                />
                <CustNavStack spacing={4} direction="row">
                    {is_accent[0] && (
                        <>
                            <AccentedButton href='/'>Home</AccentedButton>
                        </>
                    )}
                    {!is_accent[0] && (
                        <>
                            <CustButton href='/'>Home</CustButton>
                        </>
                    )}
                    <CustButton href='/'>Booking</CustButton>
                    <CustButton href='/'>Events</CustButton>
                    <CustButton href='/'>Rewards</CustButton>
                    <CustButton href='/'>Support</CustButton>
                </CustNavStack>
                <CustButtonsStack spacing={3} direction="row">
                    <SignInButton href='/' variant="contained">Sign In</SignInButton>
                    <SignUpButton href='/' variant="contained"> Sign Up</SignUpButton>
                </CustButtonsStack>

            </CustomAppBar>

            {/* Use our custom implementation of checking pathname instead of Route :D 
              <Route path={"/"} element={<Tutorials />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />
              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
            */}
        </Box>
    )
}