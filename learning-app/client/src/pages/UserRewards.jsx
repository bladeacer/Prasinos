import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, LinearProgress } from "@mui/material";
import http from "../http";
import UserContext from "../contexts/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserRewards() {
  const { userid } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (userid) {
      console.log(`Fetching user data for user ID: ${userid}`);
      http
        .get(`/user/user-rewards/${userid}`)
        .then((res) => {
          console.log("Received data:", res.data);
          setPoints(res.data.points);
          setTier(res.data.tier);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          toast.error("Failed to fetch user data.");
          setLoading(false);
        });
    } else {
      console.error("User ID is not available");
      setLoading(false);
    }
  }, [userid]);

  useEffect(() => {
    // Calculate progress to next tier
    let pointsNeeded;
    switch (tier) {
      case 1:
        pointsNeeded = 5000;
        break;
      case 2:
        pointsNeeded = 15000;
        break;
      default:
        pointsNeeded = 0; // Assuming no further tiers
    }

    const nextTierProgress = (points / pointsNeeded) * 100;
    setProgress(nextTierProgress > 100 ? 100 : nextTierProgress); // Cap progress at 100%
  }, [points, tier]);

  const handleUpdatePoints = (newPoints) => {
    http
      .put(`/user/user-rewards/${userid}`, { points: newPoints, tier: tier })
      .then((res) => {
        toast.success("Points updated successfully.");
        setPoints(newPoints);
      })
      .catch((err) => {
        console.error("Error updating points:", err);
        toast.error("Failed to update points.");
      });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        {user.name}'s Account
      </Typography>
      <Typography variant="body1">Points: {points}</Typography>
      <Typography variant="body1">Tier: {tier}</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
      <ToastContainer />
    </Box>
  );
}

export default UserRewards;
