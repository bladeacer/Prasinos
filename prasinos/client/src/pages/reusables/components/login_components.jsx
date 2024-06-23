import { Box, styled } from '@mui/material';


export const CustBox = styled(Box)({
    backgroundImage: 'url("https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    imageRendering: 'optimizeQuality',
    backgroundSize: 'cover',
    position: 'relative',
    left: '153.25%',
    width: '170%',
    maxWidth: { sm: 0, md: 0, lg: 1200, xl: 1050 },
    height: '88vh',
    maxHeight: { sm: 0, md: 0, lg: 662, xl: 850 },
    overflow: 'unset',
    overflow: 'unset',
    zIndex: 2,
    bottom: '409px'
})

export const LogBox = styled(Box)({
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    maxWidth: '23vw',
    position: 'relative',
    left: '12%',
    zIndex: 2
})

export const LoginWrapper = styled(Box)({
    backgroundColor: 'white',
    height: '88%',
    width: '85%',
    position: 'fixed',
    textAlign: 'left',
    top: '40px',
    left: '6.5%'
})

