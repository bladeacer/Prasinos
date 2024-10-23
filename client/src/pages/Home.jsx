import { Pain, CustBanner, CustBannerText, TextBox1, CustImg1, TextBox2, CustImg2 } from './reusables/components/home_components';
import { Typography } from '@mui/material';
import imgUrl from '../assets/home-banner.png';
import url2 from '../assets/home-img1.png'
import url1 from '../assets/home-img2.png'

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
                    <CustImg1
                        component="img"
                        alt="Prasinos home image 1"
                        src={url1}
                    />
                </TextBox1>
                <TextBox2>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '36px' }}>SG Green Plan 2030</Typography>
                    <Typography sx={{ fontSize: '24px' }}>
                        It is a whole-of-nation movement.<br />
                        to advance Singapore's nation agenda<br /> 
                        on sustainable development.
                    </Typography>
                    <CustImg2
                        component="img"
                        alt="Prasinos home image 2"
                        src={url2}
                    />
                </TextBox2>
                
                <TextBox1 sx={{marginBottom: '70px'}}></TextBox1>
            </Pain>
        </>
    )
}