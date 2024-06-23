import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Button,
  ButtonGroup,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../http";
import UserContext from "../contexts/UserContext";

function UserRewards() {
  const { userid } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState(1);
  const [progress, setProgress] = useState(0);
  const [eligibleRewards, setEligibleRewards] = useState([]);
  const [pointsNeeded, setPointsNeeded] = useState(0);
  const [sortOrder, setSortOrder] = useState("default"); // default, alphabetical, points, tierAsc, tierDesc

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
    let pointsNeededToNextTier;
    switch (tier) {
      case 1:
        pointsNeededToNextTier = 5000;
        break;
      case 2:
        pointsNeededToNextTier = 15000;
        break;
      default:
        pointsNeededToNextTier = 0; // Assuming no further tiers
    }

    const nextTierProgress = (points / pointsNeededToNextTier) * 100;
    setProgress(nextTierProgress > 100 ? 100 : nextTierProgress); // Cap progress at 100%
    setPointsNeeded(pointsNeededToNextTier - points);
  }, [points, tier]);

  useEffect(() => {
    // Fetch rewards eligible for the user's tier
    http
      .get(`/reward`)
      .then((res) => {
        const eligible = res.data.filter(
          (reward) => reward.tier_required <= tier
        );
        setEligibleRewards(eligible);
      })
      .catch((err) => {
        console.error("Error fetching rewards:", err);
        toast.error("Failed to fetch rewards.");
      });
  }, [tier]);

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

  const handleSortByName = () => {
    const sortedRewards = [...eligibleRewards].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setEligibleRewards(sortedRewards);
    setSortOrder("alphabetical");
  };

  const handleSortByPoints = () => {
    const sortedRewards = [...eligibleRewards].sort(
      (a, b) => a.points_needed - b.points_needed
    );
    setEligibleRewards(sortedRewards);
    setSortOrder("points");
  };

  const handleSortByTierAsc = () => {
    const sortedRewards = [...eligibleRewards].sort(
      (a, b) => a.tier_required - b.tier_required
    );
    setEligibleRewards(sortedRewards);
    setSortOrder("tierAsc");
  };

  const handleSortByTierDesc = () => {
    const sortedRewards = [...eligibleRewards].sort(
      (a, b) => b.tier_required - a.tier_required
    );
    setEligibleRewards(sortedRewards);
    setSortOrder("tierDesc");
  };

  const handleResetSort = () => {
    setEligibleRewards(eligibleRewards); // Reset to original order
    setSortOrder("default");
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ my: 2 }}>
        Your Rewards Information
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          You are in Tier {tier}.
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          You have {points} points available to spend.
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      </Box>

      <Grid container spacing={2}>
        {tier < 3 && (
          <Grid item>
            <Typography variant="body2">
              You need {pointsNeeded} points to reach Tier {tier + 1}.
            </Typography>
          </Grid>
        )}
        {tier === 3 && (
          <Grid item>
            <Typography variant="body2">
              You are in the highest tier!
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="sort buttons"
        >
          <Button onClick={handleSortByName}>Sort by Name</Button>
          <Button onClick={handleSortByPoints}>Sort by Points</Button>
          <Button onClick={handleSortByTierAsc}>Sort by Tier (Asc)</Button>
          <Button onClick={handleSortByTierDesc}>Sort by Tier (Desc)</Button>
          <Button onClick={handleResetSort}>Reset</Button>
        </ButtonGroup>
      </Box>

      <Typography variant="h4" sx={{ my: 2 }}>
        Eligible Rewards
      </Typography>

      <Grid container spacing={2}>
        {eligibleRewards.map((reward) => (
          <Grid item xs={12} key={reward.id}>
            <Card>
              <CardContent>
                <Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
                  Tier {reward.tier_required}
                </Typography>
                <Typography variant="h6">{reward.name}</Typography>
                <Typography
                  sx={{ wordBreak: "break-word", mb: 1 }}
                  variant="body2"
                  color="text.secondary"
                >
                  {reward.description}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <Button variant="contained" color="primary">
                  {reward.points_needed} Points
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ToastContainer />
    </Box>
  );
}

export default UserRewards;
