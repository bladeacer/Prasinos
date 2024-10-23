import { Button, Box } from "@mui/material";
import { styled } from '@mui/material/styles';


export const UserSiteButton = styled(Button)({
    width: '35vw',
    height: '70vh',
    backgroundColor: '#8ab78f',
    color: 'white',
    position: 'fixed',
    right: '50vw',
    bottom: '5vh',
    '&:hover': {
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
        boxShadow: 'none',
    },
    borderRadius: 'unset'
});

export const StaffLoginButton = styled(Button)({
    width: '35vw',
    height: '35vh',
    backgroundColor: '#9D8A62',
    color: 'white',
    position: 'fixed',
    right: '15vw',
    bottom: '40vh',
    '&:hover': {
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
        boxShadow: 'none',
    },
    borderRadius: 'unset'
});

export const StaffRegisterButton = styled(Button)({
    width: '35vw',
    height: '35vh',
    backgroundColor: '#d9d9d9',
    color: 'white',
    right: '15vw',
    bottom: '5vh',
    position: 'fixed',
    '&:hover': {
        backgroundColor: '#9f8e6255',
        borderColor: '#9f8e6255',
        boxShadow: 'none',
    },
    borderRadius: 'unset'
})

export const ImageBox = styled(Box)({
    width: '20vw',
    maxWidth: '650px',
    height: '20vh',
    maxHeight: '150px',
    position: 'fixed',
    right: '40vw',
    borderRadius: 'unset'
})