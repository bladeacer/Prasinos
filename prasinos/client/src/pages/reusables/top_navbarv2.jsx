import * as React from 'react';
import imgUrl from '../../assets/prasinos-logo.jpg';
import { Box } from '@mui/material';
import { AccentedButton, CustomAppBar, D9Background, CustButton, CustButtonsStack, CustNavStack, ImageBox, SignInButton, SignUpButton } from './components/navbar_components';
import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';

export default function TopNavbarV2() {
    const { user } = useContext(UserContext);

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    function falseAll() {
        for (var i = 0; i < is_accent.length; i++) {
            is_accent[i] = false
        };
    }

    var is_accent = [true, false, false, false, false, false, false, false];
    if (window.location.pathname.toString() == "/") {
        falseAll();
        is_accent[0] = true;
    }
    else if (window.location.pathname.toString() == "/booking") {
        falseAll();
        is_accent[1] = true;
    } else if (window.location.pathname.toString() == "/login") {
        is_accent[5] = true;
        is_accent[6] = false;
    } else if (window.location.pathname.toString() == "/register") {
        is_accent[6] = true;
        is_accent[5] = false;
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, zIndex: 1 }}>

                {!is_accent[5] && !is_accent[6] && (
                    <>
                        <ImageBox
                            component="img"
                            alt="Prasinos logo"
                            sx={{ maxWidth: { xs: 0, md: 0, lg: 195, xl: 195 } }}
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
                            {!user && (
                                <>
                                    <CustButtonsStack spacing={3} direction="row">
                                        <SignInButton href='/login' variant="contained">Sign In</SignInButton>
                                        <SignUpButton href='/register' variant="contained"> Sign Up</SignUpButton>
                                    </CustButtonsStack>
                                </>
                            )}
                            {user && (
                                <>
                                    <CustButtonsStack spacing={3} direction="row">
                                        <CustButton>{user.name}</CustButton>
                                        <SignUpButton onClick={logout}>Logout</SignUpButton>
                                    </CustButtonsStack>
                                </>
                            )}
                        </CustomAppBar>
                    </>
                )}
                {(is_accent[5] || is_accent[6]) && (
                    <>
                        <ImageBox
                            component="img"
                            sx={{
                                opacity: '0.30',
                                maxWidth: { xs: 0, md: 0, lg: 195, xl: 195 }
                            }}
                            alt="Prasinos logo"
                            src={imgUrl}
                        />
                        <D9Background position="sticky">
                            <CustNavStack spacing={4} direction="row" sx={{ right: '450px', top: '40px' }}>
                                <CustButton>Home</CustButton>
                                <CustButton>Booking</CustButton>
                                <CustButton>Events</CustButton>
                                <CustButton>Rewards</CustButton>
                                <CustButton>Support</CustButton>
                            </CustNavStack>
                            <CustButtonsStack spacing={3} direction="row" sx={{ right: '200px', top: '40px' }}>
                                {!user && (
                                    <>
                                        <CustButtonsStack spacing={3} direction="row">
                                            <SignInButton variant="contained">Sign In</SignInButton>
                                            <SignUpButton variant="contained" sx={{ backgroundColor: '#007c48' }}> Sign Up</SignUpButton>
                                        </CustButtonsStack>

                                    </>
                                )}
                                {user && (
                                    <>
                                        <CustButtonsStack spacing={3} direction="row">
                                            <CustButton>{user.name}</CustButton>
                                            <SignUpButton onClick={logout}>Logout</SignUpButton>
                                        </CustButtonsStack>
                                    </>
                                )}
                            </CustButtonsStack>
                        </D9Background>
                    </>
                )}
            </Box>
        </>
    )
}