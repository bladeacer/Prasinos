import * as React from 'react';
import imgUrl from '../../assets/prasinos-logo.jpg';
import { Box, Button, Typography } from '@mui/material';
import { AccentedButton, CustomAppBar, D9Background, CustButton, CustButtonsStack, CustNavStack, ImageBox, SignInButton, SignUpButton } from './components/navbar_components';
import url from '../../assets/dimmed-logo.png'
import { SidebarData } from './SideBarData';
import { useState } from 'react';
import './sidebar.css'
import { is_accent } from './accent_parser';
import { logout, staffLogout } from './logout';
import { useContext } from 'react';
import { StaffContext, UserContext } from '../../contexts/Contexts';

export default function TopNavbarV2() {
    const { user, setUser } = useContext(UserContext);
    const { staff, setStaff } = useContext(StaffContext);
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(sidebar);

    const renderButton = (index, label, href) => {
        return is_accent[index] ? (
            <AccentedButton href={href}>{label}</AccentedButton>
        ) : (
            <CustButton href={href}>{label}</CustButton>
        );
    };

    console.log("Staff", staff);
    console.log("User", user);

    return (
        <>
            <Box sx={{ flexGrow: 1, zIndex: 1 }}>
                {!is_accent[5] && !is_accent[6] && !is_accent[8] && !is_accent[9] && !is_accent[10] && !is_accent[11] && !is_accent[13] && !is_accent[14] && !is_accent[15] && !is_accent[16] && (
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
                                {renderButton(0, 'Home', '/home')}
                                {renderButton(1, 'Booking', '/booking')}
                                {renderButton(2, 'Events', '/events')}
                                {renderButton(3, 'Rewards', '/rewards')}
                                {renderButton(4, 'Support', '/support')}
                            </CustNavStack>

                            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                                <ul className='nav-menu-items' onClick={showSidebar}>
                                    {SidebarData.map((item, index) => (
                                        <li key={index} className={item.cName}>
                                            <Button href={item.path}>
                                                <span>{item.title}</span>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {!user && !staff && (
                                    <CustButtonsStack spacing={3} direction="row">
                                        <SignInButton href='/login' variant="contained">Sign In</SignInButton>
                                        <SignUpButton href='/register' variant="contained"> Sign Up</SignUpButton>
                                    </CustButtonsStack>
                            )}
                            {user && (
                                <CustButtonsStack spacing={3} direction="row">
                                    <CustButton href="/settings">{user.name.slice(0, 8)}..</CustButton>
                                    <SignUpButton onClick={logout}>Logout</SignUpButton>
                                    {user.imageFile ? (
                                        <img className='smallImage' src={`${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`} />
                                    ) : (
                                        <CustButton href="/settings" sx={{ fontSize: '0.75rem', height: '50px', width: '90px', borderRadius: '50%' }}>No profile picture yet</CustButton>
                                    )}
                                </CustButtonsStack>
                            )}
                            {staff && (
                                <CustButtonsStack spacing={3} direction="row">
                                    <CustButton>{staff.name.slice(0, 8)}..</CustButton>
                                    <SignUpButton onClick={staffLogout}>Logout</SignUpButton>
                                </CustButtonsStack>
                            )}
                        </CustomAppBar>
                    </>
                )}
                {((is_accent[5] || is_accent[6]) || ((is_accent[9] || is_accent[10] || is_accent[11] || is_accent[13] || is_accent[16]) && user)) && (
                    <>
                        <ImageBox
                            component="img"
                            sx={{
                                opacity: '0.30',
                                maxWidth: { xs: 0, md: 0, lg: 195, xl: 195 },
                                marginTop: '-2px',
                                zIndex: -10
                            }}
                            alt="Prasinos logo"
                            src={url}
                        />
                        <D9Background position="sticky">
                            <CustNavStack spacing={4} direction="row" sx={{ right: '450px', top: '40px' }}>
                                {renderButton(0, 'Home')}
                                {renderButton(1, 'Booking')}
                                {renderButton(2, 'Events')}
                                {renderButton(3, 'Rewards')}
                                {renderButton(4, 'Support')}
                            </CustNavStack>
                            {!user && (
                                <CustButtonsStack spacing={3} direction="row">
                                    <SignInButton href='/login' variant="contained">Sign In</SignInButton>
                                    <SignUpButton href='/register' variant="contained"> Sign Up</SignUpButton>
                                </CustButtonsStack>
                            )}
                            {user && !staff && (
                                <CustButtonsStack spacing={3} direction="row">
                                    <CustButton href="/settings">{user.name.slice(0, 8)}..</CustButton>
                                    <SignUpButton onClick={logout}>Logout</SignUpButton>
                                    {user.imageFile ? (
                                        <img className='smallImage' src={`${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`} />
                                    ) : (
                                        <CustButton href="/settings" sx={{ fontSize: '0.75rem', height: '50px', width: '90px', borderRadius: '50%' }}>No profile picture yet</CustButton>
                                    )}
                                </CustButtonsStack>
                            )}
                            {staff && !user && (
                                <CustButtonsStack spacing={3} direction="row">
                                    <CustButton>{staff.name.slice(0, 8)}..</CustButton>
                                    <SignUpButton onClick={staffLogout}>Logout</SignUpButton>
                                </CustButtonsStack>
                            )}
                        </D9Background>
                    </>
                )}
            </Box>
        </>
    );
}