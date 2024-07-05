import { styled } from '@mui/material/styles';
import { Button, Stack, AppBar, Box } from '@mui/material';

export const SignInButton = styled(Button)({
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

export const SignUpButton = styled(Button)({
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

export const CustButton = styled(Button)({
    color: '#000000',
    paddingTop: '0.7vh',
    textTransform: 'unset',
    fontSize: '24px',
    overflow: 'hidden',
})

export const AccentedButton = styled(Button)({
    color: '#8ab78f',
    textDecoration: 'underline',
    paddingTop: '0.7vh',
    textTransform: 'unset',
    fontSize: '24px',
    overflow: 'hidden'
})

export const CustButtonsStack = styled(Stack)({
    backgroundColor: 'transparent',
    position: 'absolute',
    right: '-37vw',
    overflow: 'hidden',
    zIndex: '0'
})

export const CustNavStack = styled(Stack)({
    backgroundColor: 'transparent',
    position: 'absolute',
    right: '-20vw',
    marginRight: '1.5vw',
    overflow: 'hidden',
    zIndex: '0'
})

export const CustomAppBar = styled(AppBar)({
    backgroundColor: 'transparent',
    boxShadow: 'unset',
    display: 'inline'
})

export const D9Background = styled(AppBar)({
    backgroundColor: 'rgba(217, 217, 217, 0.51)',
    color: '#000000',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000,
    zIndex: -10,
    position: 'absolute',
})

export const ImageBox = styled(Box)({
    maxWidth: { xs: 0, md: 0, lg: 195, xl: 195 },
    // right: '78vw',
    right: '80vw',
    position: 'absolute',
    marginTop: '-12.75px',
    marginRight: '2vw',
    zIndex: '0',
    top: '30px',
    // '&:hover': {
    //     opacity: '0'
    // }
})