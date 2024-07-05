import { Typography, Box, Button } from '@mui/material';
import { CustomContainer } from './reusables/components/wrapper_components';

export default function Settings(is_overlay, user) {
    return (
        <>
            {!is_overlay && user && (
                <>
                    <CustomContainer sx={{ marginTop: '125px', textAlign: 'left' }}>
                        <Typography variant='h3' sx={{ mb: 3 }}>My Account</Typography>

                        <Box sx={{ width: '44.5%', height: '200px', border: '1px solid #d9d9d9', borderRadius: '15px' }}>
                            <Typography sx={{ marginLeft: '15px', fontSize: '35px' }}>Total Points</Typography>
                            <Typography sx={{ marginLeft: '12.5px', fontSize: '60px' }}>10000</Typography>
                        </Box>
                        <Box sx={{ position: 'relative', height: '200px', right: '-47.5%', top: {xs: '-15.8vh', sm: '-15.8vh', md: '-15.8vh', lg: '-27.45vh', xl: '-22vh'}, width: '44.5%', border: '1px solid #d9d9d9', borderRadius: '15px' }}>
                            <Typography sx={{ marginLeft: '15px', fontSize: '35px' }}>Earned Since</Typography>
                            <Typography sx={{ marginLeft: '12.5px', fontSize: '60px' }}>1 Jan 2024</Typography>
                        </Box>
                        <Box sx={{ marginLeft: '2.5px', marginTop: '-105px' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '25px' }}>Note: Points and tiers reset every year!</Typography>
                        </Box>
                        {/* Progress bar and other info smh */}
                        <Typography variant='h3' sx={{ mt: 3 }}>My Particulars</Typography>
                        <Box sx={{ width: '40%', ml: 15, mt: 4 }}>
                            <Typography sx={{ fontSize: '24px' }}><b>Name:</b> {user.name}</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>User ID:</b> {user.id}</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>Join Date:</b> {user.createdAt}</Typography>
                            {/* Have a dynamic implementation of points instead */}
                            <Typography sx={{ fontSize: '24px' }}> <b>Total Points:</b> 1000</Typography>
                        </Box>
                        <Box sx={{ marginLeft: '2.5px', position: 'relative', ml: 75, top: '-18.5%', width: '40%' }}>
                            <Typography sx={{ fontSize: '24px' }}><b>Email: </b> {user.email}</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>Telephone No:</b> {user.phone}</Typography>
                            {/* Have a dynamic implementation of this */}
                            <Typography sx={{ fontSize: '24px' }}><b>Events Joined: </b> 7</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>Company:</b> ABC Environmental</Typography>
                        </Box>
                        <Typography variant='h3' sx={{ mt: 3 }}>Your Feedback</Typography>
                        {/* Have a dynamic implementation of this, get feedback of user */}

                    </CustomContainer>
                    <Box sx={{ positon: 'absolute', mt: 17, ml: 100 }}>
                        <Button href='/dangerZone' sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Danger Zone</Button>
                    </Box>
                </>
            )}

            {is_overlay && user && (
                <>
                    <CustomContainer sx={{ marginTop: '125px', textAlign: 'left', backgroundColor: 'rgba(217, 217, 217, 0.51)', zIndex: -10}}>
                        <Typography variant='h3' sx={{ mb: 3 }}>My Account</Typography>

                        <Box sx={{ width: '44.5%', border: '1px solid #d9d9d9', borderRadius: '15px' }}>
                            <Typography sx={{ marginLeft: '15px', fontSize: '35px' }}>Total Points</Typography>
                            <Typography sx={{ marginLeft: '12.5px', fontSize: '60px' }}>10000</Typography>
                        </Box>
                        <Box sx={{ position: 'relative', right: '-47.5%', top: {xs: '-15.8vh', sm: '-15.8vh', md: '-15.8vh', lg: '-18vh', xl: '-17.8vh'}, width: '44.5%', border: '1px solid #d9d9d9', borderRadius: '15px' }}>
                            <Typography sx={{ marginLeft: '15px', fontSize: '35px' }}>Earned Since</Typography>
                            <Typography sx={{ marginLeft: '12.5px', fontSize: '60px' }}>1 Jan 2024</Typography>
                        </Box>
                        <Box sx={{ marginLeft: '2.5px', marginTop: '-105px' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '25px' }}>Note: Points and tiers reset every year!</Typography>
                        </Box>
                        {/* Progress bar and other info smh */}
                        <Typography variant='h3' sx={{ mt: 3 }}>My Particulars</Typography>
                        <Box sx={{ width: '40%', ml: 15, mt: 4 }}>
                            <Typography sx={{ fontSize: '24px' }}><b>Name:</b> {user.name}</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>User ID:</b> {user.id}</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>Join Date:</b> {user.createdAt}</Typography>
                            {/* Have a dynamic implementation of points instead */}
                            <Typography sx={{ fontSize: '24px' }}> <b>Total Points:</b> 1000</Typography>
                        </Box>
                        <Box sx={{ marginLeft: '2.5px', position: 'relative', ml: 75, top: '-18.5%', width: '40%' }}>
                            <Typography sx={{ fontSize: '24px' }}><b>Email: </b> {user.email}</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>Telephone No:</b> {user.phone}</Typography>
                            {/* Have a dynamic implementation of this */}
                            <Typography sx={{ fontSize: '24px' }}><b>Events Joined: </b> 7</Typography>
                            <Typography sx={{ fontSize: '24px' }}><b>Company:</b> ABC Environmental</Typography>
                        </Box>
                        <Typography variant='h3' sx={{ mt: 3 }}>Your Feedback</Typography>
                        {/* Have a dynamic implementation of this, get feedback of user */}

                    </CustomContainer>
                    <Box sx={{ positon: 'absolute', mt: 17, ml: 100, backgroundColor: 'rgba(217, 217, 217, 0.51)', opacity: '0.30', zIndex: -10}}>
                        <Button href='/dangerZone' sx={{ backgroundColor: 'red', color: 'white', borderRadius: '30px', fontSize: '18px' }}>Danger Zone</Button>
                    </Box>
                </>
            )}
        </>
    )
}