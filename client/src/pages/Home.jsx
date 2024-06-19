import { Box, Typography, TextField, Button, styled } from '@mui/material';


const CustBanner = styled(Box)({
    backgroundImage: 'url("https://i.pinimg.com/736x/9b/53/dc/9b53dc5191a9859d9103c52c5405674c.jpg")',
    position: 'sticky',
    marginTop: '-15px',
    padding: 'unset',
    height: '277px',
    width: '1440px',
    marginLeft: '-80px',
    color: "#ffffff",
    imageRendering: 'optimizeQuality',
    backgroundSize: 'cover',
    // border: "1px solid black",
    overflowX: 'hidden',
})

const CustBannerText = styled(Typography)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '80px',
    width: '200vw'
})

export default function Home(){
    return (
        <>
            <CustBanner>
                <CustBannerText>Cultivating Green Futures.</CustBannerText>
            </CustBanner>
            <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />                <br />
                <br />
                <br />
                <br />                <br />
                <br />
                <br />
                <br />                <br />
                <br />
                <br />
                <br />                <br />
                <br />
                <br />
                <br />                <br />
                <br />
                <br />
                <br />                <br />
                <br />
                <br />
                <br />
                <Typography>Hi</Typography>
        </>
    )
}