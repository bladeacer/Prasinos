import { Pain, CustBanner, CustBannerText, TextBox1 } from './reusables/components/home_components';
import { Typography } from '@mui/material';
import imgUrl from '../assets/home-banner.png';


export default function Home() {
    return (
        <>
            <Pain>
                <CustBanner
                    component="img"
                    alt="Prasinos home banner"
                    src={imgUrl}
                />
                <CustBannerText>Cultivating Green Futures.</CustBannerText>

                <TextBox1>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '36px' }}>Participate in Events</Typography>
                    <Typography sx={{ fontSize: '24px' }}>
                        There is a role for everyone to play.<br />
                        We must work together so that future generations <br /> 
                        can enjoy the green island we call home.
                    </Typography>
                </TextBox1>
            </Pain>
        </>
    )
}