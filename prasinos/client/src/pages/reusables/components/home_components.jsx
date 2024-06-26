import { Box, Typography, styled } from '@mui/material';

export const CustBanner = styled(Box)({
    position: 'relative',
    height: '277px',
    width: '100vw',
    color: "#ffffff",
    right: '50vw',
    imageRendering: 'optimizeQuality',
    backgroundSize: 'cover',
})

export const Pain = styled(Box)({
    position: 'absolute',
    background: 'transparent',
    zIndex: '-1',
    left: '0%',
    top: '15%'
})

export const CustBannerText = styled(Typography)({
    position: 'relative',
    right: '-25%',
    transform: 'translate(-50%, -210px)',
    fontSize: '80px',
    width: '200vw',
    color: "#ffffff",
})

export const TextBox1 = styled(Box)({
    postion: 'relative',
    maxWidth: '50%',
    textAlign: 'left',
    margin: '-10px 8vw 20px'
})

export const CustImg1 = styled(Box)({
    position: 'relative',
    right: "-40vw",
    width: '25%',
    margin: '-200px 0px 0px'
})

export const TextBox2 = styled(Box)({
    postion: 'relative',
    maxWidth: '50%',
    textAlign: 'left',
    margin: '120px 54vw 0px'
})

export const CustImg2 = styled(Box)({
    position: 'relative',
    right: "57vw",
    width: '25%',
    margin: '-200px 140px 0px',
})