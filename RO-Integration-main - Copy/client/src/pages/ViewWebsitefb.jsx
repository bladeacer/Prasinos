// src/ViewWebsiteFeedback.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function ViewWebsiteFeedback() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    http.get(`/websitefb/${id}`).then((res) => {
      setReport(res.data);
    });
  }, [id]);

  if (!report) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ paddingTop: "110px", width: "69vw", margin: "0 auto", marginLeft: "2%" }}>
      <Paper elevation={3} sx={{ padding: "20px", paddingLeft: "4%", boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)' }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
          View Report
        </Typography>
        <Divider sx={{ mb: 3}} />
        <Grid container spacing={3}>
          <Grid item xs={7} sx={{ paddingLeft: "20%" }}>
            <Typography variant="h6" sx={{ mb: 1 }}><strong>Report ID:</strong> {report.id}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}><strong>Email:</strong> {report.email}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}><strong>Report Type:</strong> {report.reporttype}</Typography>
            <Typography variant="h6" sx={{ mb: 1, wordWrap: "break-word", whiteSpace: "pre-wrap", maxWidth: "100%" }}>
              <strong>Elaboration:</strong> {report.elaboration}
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}><strong>Created Date:</strong> {dayjs(report.createdAt).format(global.datetimeFormat)}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}><strong>Last Updated:</strong> {dayjs(report.updatedAt).format(global.datetimeFormat)}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}><strong>Status:</strong> {report.status}</Typography>
          </Grid>
          <Grid item xs={5}>
            {report.imageFile && (
              <Box className="aspect-ratio-container" sx={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden", ml: 1 }}>
                <img 
                  alt="uploaded file" 
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${report.imageFile}`} 
                  style={{ width: '100%', height: 'auto' }} 
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ViewWebsiteFeedback;
