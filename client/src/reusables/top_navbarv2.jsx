import * as React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Button, Stack } from '@mui/material';
import imgUrl from '../assets/prasinos-logo.jpg';
import GetNavbarState from './navbarstate_bootleg';

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
    overflow: 'hidden',
    zIndex: 0
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
    overflow: 'hidden',
    zIndex: 0
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
    position: 'absolute',
    right: '-37vw',
    overflow: 'hidden',
    zIndex: '0'
})

const CustNavStack = styled(Stack)({
    backgroundColor: 'transparent',
    position: 'absolute',
    right: '-20vw',
    marginRight: '1.5vw',
    overflow: 'hidden',
    zIndex: '0'
})

const CustomAppBar = styled(AppBar)({
    backgroundColor: 'transparent',
    boxShadow: 'unset',
    display: 'inline'
})

const D9Background = styled(AppBar)({
    backgroundColor: 'rgba(217, 217, 217, 0.51)',
    color: '#000000',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000,
    zIndex: -10,
    position: 'absolute',
})

var is_accent = GetNavbarState();

export default function TopNavbarV2() {
    return (
        // <Stack spacing={2} direction="row">
        //     <SignInButton variant="contained">Sign In</SignInButton>
        //     <SignUpButton variant="contained" disableRipple>
        //         Bootstrap
        //     </SignUpButton>
        // </Stack>
        <Box sx={{ flexGrow: 1, zIndex: 1 }}>

            {!is_accent[5] && (
                <>
                    <Box
                        component="img"
                        sx={{
                            maxWidth: { xs: 0, md: 0, lg: 195 },
                            right: '78vw',
                            position: 'absolute',
                            marginTop: '-12.75px',
                            marginRight: '2vw',
                            zIndex: '0',
                            top: '39px'
                        }}
                        alt="Prasinos logo"
                        src={imgUrl}
                    />
                    <CustomAppBar position="sticky">
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
                            {is_accent[1] && (
                                <>
                                    <AccentedButton href='/booking'>Booking</AccentedButton>
                                </>
                            )}
                            {!is_accent[1] && (
                                <>
                                    <CustButton href='/booking'>Booking</CustButton>
                                </>
                            )}

                            <CustButton href='/events'>Events</CustButton>
                            <CustButton href='/rewards'>Rewards</CustButton>
                            <CustButton href='/support'>Support</CustButton>
                        </CustNavStack>
                        <CustButtonsStack spacing={3} direction="row">
                            <SignInButton href='/login' variant="contained">Sign In</SignInButton>
                            <SignUpButton href='/register' variant="contained"> Sign Up</SignUpButton>
                        </CustButtonsStack>

                    </CustomAppBar>
                </>
            )}
            {is_accent[5] && (
                <>
                    <Box
                        component="img"
                        sx={{
                            maxWidth: { xs: 0, md: 0, lg: 195 },
                            right: '78vw',
                            position: 'absolute',
                            marginTop: '-12.75px',
                            marginRight: '2vw',
                            zIndex: '0',
                            top: '39px',
                            opacity: '0.25'
                        }}
                        alt="Prasinos logo"
                        src={imgUrl}
                    />
                    <D9Background position="sticky">
                        <CustNavStack spacing={4} direction="row" sx={{right: '450px', top: '40px'}}>
                            <CustButton>Home</CustButton>
                            <CustButton>Booking</CustButton>
                            <CustButton>Events</CustButton>
                            <CustButton>Rewards</CustButton>
                            <CustButton>Support</CustButton>
                        </CustNavStack>
                        <CustButtonsStack spacing={3} direction="row" sx={{right: '200px', top: '40px'}}>
                            <SignInButton variant="contained">Sign In</SignInButton>
                            <SignUpButton variant="contained" sx={{ backgroundColor: '#007c48'}}> Sign Up</SignUpButton>
                        </CustButtonsStack>

                    </D9Background>

                </>
            )}

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