import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import GetNavbarState from './navbarstate_bootleg';
import Login from '../pages/Login';
import Home from '../pages/Home';

const CustomContainer = styled(Container)({
    position: 'sticky',
    marginTop: '100px',
    right: '20vh',
    padding: 'unset',
    width: '90vw',
    color: "#000000",
    // border: "1px solid black",
    overflowX: 'hidden'
})

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
                    <Login></Login>
                </>
            )}
        </>
    )
}