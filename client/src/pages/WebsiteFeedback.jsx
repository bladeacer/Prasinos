import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';
import '../App.css'; // Import the CSS file here

function WebsiteFeedback() {

  return (
    <>
      <Box style={{ marginTop:"15px",height: "75vh", display: 'flex', alignItems: 'flex-start', border: "1px solid black", marginTop: "5%" }}>
        <Box style={{ flex: 1, paddingRight: '20px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3988.7099375854746!2d103.8721372!3d1.3505666!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da17a706d23a21%3A0x17d86a2a6ca98331!2s50%20Serangoon%20Ave%202%2C%20Singapore%20556129!5e0!3m2!1sen!2ssg!4v1722147315705!5m2!1sen!2ssg" 
            width="650" height="550" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </Box>
        <Box style={{ flex: 1, paddingTop: "150px", marginLeft: "20px"}}>
          <h1>WE ARE LOCATED AT</h1>
          <a href="https://www.google.com/maps/place/50+Serangoon+Ave+2,+Singapore+556129/@1.3505666,103.8721372,17z/data=!4m6!3m5!1s0x31da17a706d23a21:0x17d86a2a6ca98331!8m2!3d1.3517619!4d103.870407!16s%2Fg%2F11bw4c4kdh?entry=tts" target='_blank' className='address'><h5>50 Serangoon Ave 2, Singapore 556129</h5></a>
          <h5 style={{ marginTop: "50px"}}>WhatsApp: +65 12345678</h5>
          <h5>Email Us: <a href="mailto:prasinossg@gmail.com">PrásinosSG@gmail.com</a></h5>
          <h5>Opening Hours: Monday-Friday: 9am to 6pm</h5>
          <h5 style={{ marginLeft: "33%"}}>Weekends & PH: 9am to 4pm</h5>
        </Box>
      </Box>
    </>
  );
}

export default WebsiteFeedback;
