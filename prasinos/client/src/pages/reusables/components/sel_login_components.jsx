import { Button, Box } from "@mui/material";
import { styled } from '@mui/material/styles';


export const UserSiteButton = styled(Button)({
    width: '50vw',
    height: '75vh',
    backgroundColor: '#8ab78f',
    color: 'white',
    position: 'fixed',
    left: '0%',
    top: '25%',
    '&:hover': {
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
        boxShadow: 'none',
    },
    borderRadius: 'unset'
});

export const StaffLoginButton = styled(Button)({
    width: '50vw',
    height: '37.5vh',
    backgroundColor: '#9D8A62',
    color: 'white',
    position: 'fixed',
    left: '50%',
    top: '25%',
    '&:hover': {
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
        boxShadow: 'none',
    },
    borderRadius: 'unset'
});

export const StaffRegisterButton = styled(Button)({
    width: '50vw',
    height: '37.5vh',
    backgroundColor: '#d9d9d9',
    color: 'white',
    left: '50%',
    top: '62.5%',
    position: 'fixed',
    '&:hover': {
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
        boxShadow: 'none',
    },
    borderRadius: 'unset'
})

export const ImageBox = styled(Box)({
    width: '30vw',
    maxWidth: '650px',
    height: '20vh',
    maxHeight: '150px',
    position: 'fixed',
    top: '2.5%',
    left: '34vw',
    borderRadius: 'unset'
})