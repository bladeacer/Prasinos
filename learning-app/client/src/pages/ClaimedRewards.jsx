// Import necessary dependencies
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import http from "../http"; // Assuming this is your HTTP utility for API calls
import UserContext from "../contexts/UserContext";

function ClaimedRewards() {
  const { userid } = useParams();
  const { user } = useContext(UserContext);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userid) {
      console.log(`Fetching claimed rewards for user ID: ${userid}`);
      http
        .get(`/user/claimed-rewards/${userid}`)
        .then((res) => {
          console.log("Received claimed rewards:", res.data);
          setClaimedRewards(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching claimed rewards:", err);
          setLoading(false);
        });
    } else {
      console.error("User ID is not available");
      setLoading(false);
    }
  }, [userid]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ my: 2 }}>
        Claimed Rewards for {user.name}
      </Typography>

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
              <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {reward.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {reward.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Date Claimed: {reward.date_claimed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Claimed: {reward.time_claimed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ClaimedRewards;
