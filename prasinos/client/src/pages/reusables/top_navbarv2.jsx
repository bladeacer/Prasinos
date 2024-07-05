import * as React from 'react';
import imgUrl from '../../assets/prasinos-logo.jpg';
import { Box, Button } from '@mui/material';
import { AccentedButton, CustomAppBar, D9Background, CustButton, CustButtonsStack, CustNavStack, ImageBox, SignInButton, SignUpButton } from './components/navbar_components';
import { useContext } from 'react';
import { UserContext } from '../../contexts/Contexts';
import url from '../../assets/dimmed-logo.png'
import { SidebarData } from './SideBarData';
import { useState } from 'react';
import './sidebar.css'
import { goof_check, is_accent } from './accent_parser';
import { logout } from './logout';

export default function TopNavbarV2() {
    const { user } = useContext(UserContext);

    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <Box sx={{ flexGrow: 1, zIndex: 1 }}>

                {((!goof_check && !is_accent[5] && !is_accent[6] && !is_accent[9] && !is_accent[10] && !is_accent[11])) && (
                    <>
                        <ImageBox
                            component="img"
                            alt="Prasinos logo"
                            sx={{ maxWidth: { xs: 0, md: 0, lg: 195, xl: 195 } }}
                            src={imgUrl}
                            onClick={showSidebar}
                        />
                        <CustomAppBar position="sticky">
                            <CustNavStack spacing={4} direction="row">
                                {is_accent[0] && (
                                    <>
                                        <AccentedButton href='/home'>Home</AccentedButton>
                                    </>
                                )}
                                {!is_accent[0] && (
                                    <>
                                        <CustButton href='/home'>Home</CustButton>
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
                                {is_accent[2] && (
                                    <>
                                        <AccentedButton href='/events'>Events</AccentedButton>
                                    </>
                                )}
                                {!is_accent[2] && (
                                    <>
                                        <CustButton href='/events'>Events</CustButton>
                                    </>
                                )}
                                {is_accent[3] && (
                                    <>
                                        <AccentedButton href='/rewards'>Rewards</AccentedButton>
                                    </>
                                )}
                                {!is_accent[3] && (
                                    <>
                                        <CustButton href='/rewards'>Rewards</CustButton>
                                    </>
                                )}
                                {is_accent[4] && (
                                    <>
                                        <AccentedButton href='/support'>Support</AccentedButton>
                                    </>
                                )}
                                {!is_accent[4] && (
                                    <>
                                        <CustButton href='/support'>Support</CustButton>
                                    </>
                                )}

                            </CustNavStack>

                            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>

                                <ul className='nav-menu-items' onClick={showSidebar}>

                                    {SidebarData.map((item, index) => {
                                        return (
                                            <li key={index} className={item.cName}>
                                                <Button href={item.path}>
                                                    <span>{item.title}</span>
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

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
                                        <CustButton href="/settings">{user.name}</CustButton>
                                        <SignUpButton onClick={logout}>Logout</SignUpButton>
                                    </CustButtonsStack>
                                </>
                            )}
                        </CustomAppBar>
                    </>
                )}
                {!goof_check && (is_accent[5] || is_accent[6] || is_accent[9] || is_accent[10] || is_accent[11]) && (
                    <>
                        <ImageBox
                            component="img"
                            sx={{
                                opacity: '0.30',
                                maxWidth: { xs: 0, md: 0, lg: 195, xl: 195 },
                                marginTop: '-2px'
                            }}
                            alt="Prasinos logo"
                            src={url}
                        />
                        <D9Background position="sticky">
                            <CustNavStack spacing={4} direction="row" sx={{ right: '450px', top: '40px' }}>
                                {is_accent[0] && (
                                    <>
                                        <AccentedButton>Home</AccentedButton>
                                    </>
                                )}
                                {!is_accent[0] && (
                                    <>
                                        <CustButton>Home</CustButton>
                                    </>
                                )}
                                {is_accent[1] && (
                                    <>
                                        <AccentedButton>Booking</AccentedButton>
                                    </>
                                )}
                                {!is_accent[1] && (
                                    <>
                                        <CustButton>Booking</CustButton>
                                    </>
                                )}
                                {is_accent[2] && (
                                    <>
                                        <AccentedButton>Events</AccentedButton>
                                    </>
                                )}
                                {!is_accent[2] && (
                                    <>
                                        <CustButton>Events</CustButton>
                                    </>
                                )}
                                {is_accent[3] && (
                                    <>
                                        <AccentedButton>Rewards</AccentedButton>
                                    </>
                                )}
                                {!is_accent[3] && (
                                    <>
                                        <CustButton>Rewards</CustButton>
                                    </>
                                )}
                                {is_accent[4] && (
                                    <>
                                        <AccentedButton>Support</AccentedButton>
                                    </>
                                )}
                                {!is_accent[4] && (
                                    <>
                                        <CustButton>Support</CustButton>
                                    </>
                                )}
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
                                        <CustButton href="/settings">{user.name}</CustButton>
                                        <SignUpButton onClick={logout}>Logout</SignUpButton>
                                    </CustButtonsStack>
                                </>
                            )}
                        </D9Background>
                    </>
                )}

            </Box>
        </>
    )
}