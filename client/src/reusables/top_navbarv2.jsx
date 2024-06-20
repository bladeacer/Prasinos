import * as React from 'react';
import imgUrl from '../assets/prasinos-logo.jpg';
import GetNavbarState from './navbarstate_bootleg';
import { Box } from '@mui/material';
import { AccentedButton, CustomAppBar, D9Background, CustButton, CustButtonsStack, CustNavStack, ImageBox, SignInButton, SignUpButton } from './components/navbar_components';


var is_accent = GetNavbarState();
// const { setUser } = useContext(UserContext);

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
                        <CustButtonsStack spacing={3} direction="row">
                            <SignInButton href='/login' variant="contained">Sign In</SignInButton>
                            <SignUpButton href='/register' variant="contained"> Sign Up</SignUpButton>
                        </CustButtonsStack>

                    </CustomAppBar>
                </>
            )}
            {is_accent[5] && (
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
                            {true && (
                                <>
                                    <SignInButton variant="contained">Sign In</SignInButton>
                                    <SignUpButton variant="contained" sx={{ backgroundColor: '#007c48' }}> Sign Up</SignUpButton>
                                </>
                            )}

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