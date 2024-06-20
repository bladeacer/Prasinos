import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import GetNavbarState from './navbarstate_bootleg';
import Login from '../pages/Login';
import Home from '../pages/Home';
import { CustomContainer } from './components/wrapper_components';

var is_accent = GetNavbarState();

export default function CustContainer() {
    return (
        <>
            <CustomContainer>
                {is_accent[1] && (
                    <>
                        <Typography variant='h5'>Booking</Typography>
                    </>
                )}

            </CustomContainer>
            {is_accent[0] && (
                <>
                    <Home></Home>

                </>
            )}
            {is_accent[5] && (
                <>
                    <Home></Home>
                    <Login></Login>
                </>
            )}
        </>
    )
}