import React, { useEffect, useState } from "react";
import http from "../http"; // Ensure correct path to your http utility
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material"; // Import necessary MUI components

function ClaimedRewards({ match }) {
  const [claimedRewards, setClaimedRewards] = useState([]);

  useEffect(() => {
    if (match && match.params && match.params.userid) {
      fetchClaimedRewards(match.params.userid);
    } else {
      console.error("User ID not found in params");
      // Handle case where user ID is not available, perhaps redirect or show an error
    }
  }, [match]);

  const fetchClaimedRewards = (userid) => {
    http
      .get(`/claimed-rewards/${userid}`)
      .then((res) => {
        setClaimedRewards(res.data); // Assuming res.data is an array of claimed rewards
      })
      .catch((error) => {
        console.error("Error fetching claimed rewards:", error);
        // Handle error state or error notification
      });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Claimed Rewards
      </Typography>
      {claimedRewards.length > 0 ? (
        <Grid container spacing={2}>
          {claimedRewards.map((reward) => (
            <Grid item key={reward.id} xs={12}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                }}
              >
                {reward.imageFile ? (
                  <CardMedia
                    component="img"
                    height="150"
                    image={`${import.meta.env.VITE_FILE_BASE_URL}${
                      reward.imageFile
                    }`}
                    alt={reward.name}
                    sx={{
                      flex: "0 0 40%",
                      borderRadius: "10px",
                      marginLeft: "2%",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      flex: "0 0 40%",
                      border: "1px solid black",
                      borderRadius: "10px",
                      marginLeft: "2%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "150px",
                    }}
                  >
                    <Typography>No Image</Typography>
                  </Box>
                )}
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    paddingRight: "5%",
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                    {reward.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: "break-word", mb: 1 }}
                  >
                    {reward.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Tier: {reward.tier_required}
                  </Typography>
                  {/* Add any additional information here */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">No claimed rewards found.</Typography>
      )}
    </Box>
  );
}

export default ClaimedRewards;
