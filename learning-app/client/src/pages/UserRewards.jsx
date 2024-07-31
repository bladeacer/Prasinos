import React, { useEffect, useState, useContext, RouterLink } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  CardMedia,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Search, Clear, Done } from "@mui/icons-material";
import { HelpOutline } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from "../http";
import UserContext from "../contexts/UserContext";
import InfoIcon from "@mui/icons-material/Info";
import Confetti from "react-confetti";
import Wheel from "./Wheel";
import axios from "axios";

function UserRewards() {
  const { userid } = useParams();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [pointsNeeded, setPointsNeeded] = useState(0);
  const [eligibleRewards, setEligibleRewards] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOptions, setSortOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const navigate = useNavigate();
  const [gameOpen, setGameOpen] = useState(false);
  const [canPlay, setCanPlay] = useState(true); // Manage game access
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [TierOpen, setTierOpen] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);

  const [page, setPage] = useState(1);
  const rewardsPerPage = 5;

  const { user } = useContext(UserContext); // Get the user from context
  const userId = user?.id; // Assuming user object has an id property
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [points, setPoints] = useState(user?.points || 0);
  const [tier, setTier] = useState(user?.tier || "");

  useEffect(() => {
    if (user) {
      fetchRedeemedRewards(user.id);
    }
  }, [user]);

  const fetchRedeemedRewards = async () => {
    try {
      const response = await http.get(`/redeemed-rewards/${user.id}`);
      const data = response.data;

      console.log("Fetched redeemed rewards:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setRedeemedRewards(data);
        console.log(redeemedRewards);
      } else {
        console.error("Unexpected data format:", data);
        setRedeemedRewards([]); // Reset if data is not as expected
      }
    } catch (error) {
      console.error("Error fetching redeemed rewards:", error);
      toast.error("Failed to fetch redeemed rewards.");
    }
  };

  const handleClick = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Confetti lasts for 5 seconds
  };

  const handleTierClickOpen = () => {
    setTierOpen(true);
  };

  const handleTierClose = () => {
    setTierOpen(false);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleOpenHelp = () => {
    setOpenHelp(!openHelp);
  };

  const handleHelpOpen = () => {
    setHelpOpen(true); // Open the help dialog
  };

  const handleHelpClose = () => {
    setHelpOpen(false); // Close the help dialog
  };

  useEffect(() => {
    if (tier === "Silver" || tier === "Gold") {
      setCanPlay(true);
    } else {
      setCanPlay(false);
    }
  }, [tier]);

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
    let pointsNeededToNextTier;
    switch (tier) {
      case "Bronze":
        pointsNeededToNextTier = 5000;
        break;
      case "Silver":
        pointsNeededToNextTier = 15000;
        break;
      case "Gold":
        pointsNeededToNextTier = 0; // Already at highest tier
        break;
      default:
        pointsNeededToNextTier = 0;
    }

    const nextTierProgress =
      tier === "Gold" ? 100 : (points / pointsNeededToNextTier) * 100;

    setProgress(nextTierProgress > 100 ? 100 : nextTierProgress);
    setPointsNeeded(
      tier === "Gold" ? 0 : Math.max(pointsNeededToNextTier - points, 0)
    );
  }, [points, tier]);

  const tierCheck = {
    Bronze: points >= 5000,
    Silver: points >= 15000,
    Gold: points >= 15000, // Once Gold is reached, stay in Gold
  };

  const handlePlayGame = () => {
    setGameOpen(true);
  };

  const handleSpinResult = (rewardPoints) => {
    setSpinnerLoading(true);
    http
      .put(`/user/user-rewards/${userid}`, {
        points: points + rewardPoints,
      })
      .then((res) => {
        setPoints(res.data.points);
        setSpinnerLoading(false);
        setGameOpen(false);
        toast.success(`You win ${rewardPoints} points!`);
        handlePointsUpdate(res.data.points);
        fetchUserData(); // Update user data to check for tier change
      })
      .catch((err) => {
        console.error("Error updating user points:", err);
        toast.error("Failed to update user points.");
        setSpinnerLoading(false);
      });
  };

  useEffect(() => {
    fetchEligibleRewards();
  }, [tier]);

  const fetchEligibleRewards = () => {
    http
      .get(`/reward`)
      .then((res) => {
        const eligible = res.data
          .filter((reward) => {
            if (tier === "Bronze") return reward.tier_required === "Bronze";
            if (tier === "Silver")
              return (
                reward.tier_required === "Bronze" ||
                reward.tier_required === "Silver"
              );
            if (tier === "Gold")
              return (
                reward.tier_required === "Bronze" ||
                reward.tier_required === "Silver" ||
                reward.tier_required === "Gold"
              );
            return false;
          })
          .filter((reward) => reward.points_needed <= points); // Filter rewards based on points
        setEligibleRewards(eligible);
      })
      .catch((err) => {
        console.error("Error fetching rewards:", err);
        toast.error("Failed to fetch rewards.");
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await http.get(`/user/user-rewards/${userid}`);
        const userData = response.data;
        setPoints(userData.points);
        setTier(userData.tier);
        setRedeemedRewards(userData.redeemedRewards || []); // Set redeemed rewards from server response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userid]);

  useEffect(() => {
    // Determine the tier based on points, but don't decrease if the user has moved up
    if (points > 15000) {
      setTier((prevTier) =>
        prevTier === "Bronze" || prevTier === "Silver" ? "Gold" : prevTier
      );
    } else if (points > 5000) {
      setTier((prevTier) => (prevTier === "Bronze" ? "Silver" : prevTier));
    } else {
      setTier((prevTier) => (prevTier === "Bronze" ? "Bronze" : prevTier));
    }
  }, [points]);

  useEffect(() => {
    fetchUserData();
  }, [points]);

  const handleUpdatePoints = (newPoints) => {
    http
      .put(`/user/user-rewards/${userid}`, { points: newPoints, tier: tier })
      .then(() => {
        toast.success("Points updated successfully.");
        setPoints(newPoints);
        fetchUserData(); // Refresh user data
      })
      .catch((err) => {
        console.error("Error updating points:", err);
        toast.error("Failed to update points.");
      });
  };

  const fetchUserData = async () => {
    try {
      const response = await http.get(`/user/user-rewards/${userid}`);
      const data = response.data;
      setPoints(data.points);
      return data.tier; // Return the tier value
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handlePointsUpdate = (updatedPoints) => {
    handleUpdatePoints(updatedPoints);
  };

  const handleSort = (option) => {
    if (sortOptions.includes(option)) {
      setSortOptions(sortOptions.filter((opt) => opt !== option));
    } else {
      setSortOptions([...sortOptions, option]);
    }
  };

  const handleSortMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (reward) => {
    setSelectedReward(reward);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (reward) => {
    setSelectedReward(reward);
    setOpen(true);
  };

  const handlePurchaseReward = async () => {
    if (!selectedReward || !user) {
      toast.error("Invalid reward or user data.");
      return;
    }

    if (points < selectedReward.points_needed) {
      toast.error("Insufficient points to purchase this reward.");
      return;
    }

    setRedeeming(true);

    try {
      // Prepare the redeemed reward data
      const redeemedReward = {
        userId: user.id,
        rewardId: selectedReward.id,
        name: selectedReward.name,
        description: selectedReward.description,
        pointsNeeded: selectedReward.points_needed,
        tier: tier,
        timeRedeemed: new Date().toISOString(), // Format the date as ISO string
      };

      // Update points and redeemed rewards on the server
      await http.put(`/user/user-rewards/${user.id}`, {
        points: points - selectedReward.points_needed,
        tier: tier,
      });

      // Post the redeemed reward to the server
      await http.post(`/redeemed-rewards`, redeemedReward);

      // Add the redeemed reward to the list of redeemed rewards locally
      setRedeemedRewards((prevRewards) => [...prevRewards, redeemedReward]);

      // Fetch updated user data after successful purchase
      fetchUserData();

      toast.success(`Reward "${selectedReward.name}" purchased successfully!`);
      handleClose();
    } catch (error) {
      console.error("Error processing reward purchase:", error);
      toast.error("Failed to process reward purchase.");
    } finally {
      setRedeeming(false);
    }
  };

  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const onSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      searchRewards();
    }
  };

  const onClickSearch = () => {
    searchRewards();
  };

  const onClickClear = () => {
    setSearch("");
    fetchEligibleRewards();
  };

  const searchRewards = () => {
    http.get(`/reward?search=${search}`).then((res) => {
      setEligibleRewards(
        res.data.filter((reward) => {
          if (tier === "Bronze") return reward.tier_required === "Bronze";
          if (tier === "Silver")
            return (
              reward.tier_required === "Bronze" ||
              reward.tier_required === "Silver"
            );
          if (tier === "Gold")
            return (
              reward.tier_required === "Bronze" ||
              reward.tier_required === "Silver" ||
              reward.tier_required === "Gold"
            );
          return false;
        })
      );
    });
  };

  const handleRedeemClick = () => {
    setRedeemOpen(true);
  };

  const handleRedeemClose = () => {
    setRedeemOpen(false);
  };

  if (loading) return <Typography>Loading...</Typography>;

  const sortedRewards = [...eligibleRewards].sort((a, b) => {
    const tierOrder = { Bronze: 1, Silver: 2, Gold: 3 };
    return sortOptions.reduce((acc, option) => {
      switch (option) {
        case "name":
          return acc || a.name.localeCompare(b.name);
        case "points":
          return acc || a.points_needed - b.points_needed;
        case "tierAsc":
          return acc || tierOrder[a.tier_required] - tierOrder[b.tier_required];
        case "tierDesc":
          return acc || tierOrder[b.tier_required] - tierOrder[a.tier_required];
        default:
          return acc;
      }
    }, 0);
  });

  const startIndex = (page - 1) * rewardsPerPage;
  const endIndex = startIndex + rewardsPerPage;
  const paginatedRewards = sortedRewards.slice(startIndex, endIndex);

  const tierTrophies = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
  };

  const tierBenefits = {
    Bronze: "Earn x1.25 points for every event that you participate in!",
    Silver: "Earn x1.5 points for every event that you participate in!",
    Gold: "Earn x2 points for every event that you participate in!",
  };

  const trophyIcon = tierTrophies[tier];
  const hasReachedTier = tierCheck[tier];

  return (
    <Box>
      <Box>
        <Box>
          <Box sx={{ mb: 2, mt: 4 }}>
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Hello, {user.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ mb: 2, display: "flex", alignItems: "center", mb: 1 }}
                >
                  <b>Tier:</b>
                  <span style={{ marginLeft: "0.5rem" }}>{tier}</span>
                  <IconButton onClick={handleTierClickOpen} sx={{ ml: 1 }}>
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0)",
                transition: "background-color 0.3s, box-shadow 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
                mx: "auto",
                maxWidth: "fit-content",
              }}
              onClick={handleClick}
            >
              <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                Available Points:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "4.5rem",
                  }}
                >
                  {points}
                </span>
              </Typography>
              {showConfetti && <Confetti />}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ borderRadius: 20, height: 20 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {tierTrophies[tier]}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {tier !== "Gold" && (
            <Grid item>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Points needed to next tier: <b>{pointsNeeded}</b>
              </Typography>
            </Grid>
          )}
          {tier === "Gold" && (
            <Grid item>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You are in the highest tier!
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {canPlay ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayGame}
            >
              Spin the Wheel
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayGame}
              disabled={!canPlay}
            >
              Spin the Wheel
            </Button>
          )}
        </Box>

        {gameOpen && (
          <Dialog open={gameOpen} onClose={() => setGameOpen(false)}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ padding: "4px 16px" }}
            >
              <Typography variant="h6">Spin the Wheel</Typography>
              <IconButton onClick={handleHelpOpen} color="inherit">
                <HelpOutline />
              </IconButton>
            </Box>
            {/* Help Dialog */}
            <Dialog open={helpOpen} onClose={handleHelpClose}>
              <DialogTitle>How to Play</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To play the 'Spin the Wheel' game:
                  <ol>
                    <li>Click the "Spin" button to start the game.</li>
                    <li>
                      The wheel will spin for a few seconds and then stop.
                    </li>
                    <li>
                      After the wheel stops, you will see the result of your
                      spin.
                    </li>
                    <li>
                      Your points will be updated based on the wheel's result.
                    </li>
                  </ol>
                  <Typography variant="body2" color="text.secondary">
                    Good luck and have fun!
                  </Typography>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleHelpClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="body1">Red: 50 points</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "blue",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="body1">Blue: 100 points</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "yellow",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="body1">Yellow: 200 points</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "green",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="body1">Green: 500 points</Typography>
                </Box>
              </Box>
            </DialogContent>

            <DialogContent>
              <Box sx={{ textAlign: "center", minWidth: 300 }}>
                {spinnerLoading ? (
                  <CircularProgress />
                ) : (
                  <Wheel onFinish={handleSpinResult} />
                )}
              </Box>
            </DialogContent>
          </Dialog>
        )}

        <Typography variant="h5" sx={{ my: 2 }}>
          Tier Benefits for {tier}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Card for Tier Benefits */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                border: "4px solid green",
              }}
            >
              <CardContent>
                <Typography variant="h6">🎉{tier} Tier</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tierBenefits[tier]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Tier Benefits Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                border: `4px solid ${tier === "Bronze" ? "red" : "green"}`,
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  {tier === "Bronze" ? "❌🎮 Game" : "🎮 Game"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tier === "Bronze"
                    ? "You did not unlock 'Spin the Wheel' game. Must reach Silver or Gold Tier."
                    : "You unlocked 'Spin the Wheel' game! Earn more points!"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{ display: "flex", alignItems: "center", width: "100%", mb: 2 }}
        >
          <Typography variant="h5" sx={{ my: 0, mr: 2 }}>
            Eligible Rewards
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Input
            value={search}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            placeholder="Search rewards"
            sx={{ mr: 1 }}
          />
          <IconButton color="primary" onClick={onClickSearch}>
            <Search />
          </IconButton>
          <IconButton color="primary" onClick={onClickClear} sx={{ mr: 2 }}>
            <Clear />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSortMenuClick}
          >
            Sort
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSortMenuClose}
          >
            <MenuItem
              onClick={() => handleSort("name")}
              selected={sortOptions.includes("name")}
            >
              {sortOptions.includes("name") && <Done />} Name
            </MenuItem>
            <MenuItem
              onClick={() => handleSort("points")}
              selected={sortOptions.includes("points")}
            >
              {sortOptions.includes("points") && <Done />} Points
            </MenuItem>
            <MenuItem
              onClick={() => handleSort("tierAsc")}
              selected={sortOptions.includes("tierAsc")}
            >
              {sortOptions.includes("tierAsc") && <Done />} Tier Ascending
            </MenuItem>
            <MenuItem
              onClick={() => handleSort("tierDesc")}
              selected={sortOptions.includes("tierDesc")}
            >
              {sortOptions.includes("tierDesc") && <Done />} Tier Descending
            </MenuItem>
          </Menu>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Showing {startIndex + 1} - {Math.min(endIndex, sortedRewards.length)}{" "}
          out of {sortedRewards.length}
        </Typography>

        <Box>
          {sortedRewards.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                You do not have any eligible rewards available at the moment.
                Participate in events to earn points.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/events"
              >
                Explore Events
              </Button>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={2}>
                {paginatedRewards.map((reward) => (
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
                        <Box sx={{ marginLeft: "auto", marginTop: "auto" }}>
                          <Button
                            onClick={() => handleClickOpen(reward)}
                            variant="contained"
                            color="primary"
                          >
                            {reward.points_needed} Points
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Pagination
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 4,
                }}
                count={Math.ceil(sortedRewards.length / rewardsPerPage)}
                page={page}
                onChange={handleChangePage}
              />
            </Box>
          )}
        </Box>

        <Typography variant="h5" sx={{ my: 2 }}>
          Redeemed Rewards
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Note: Redeemed Rewards are stored permanently!
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4, justifyContent: "center" }}>
          {redeemedRewards.length > 0 ? (
            redeemedRewards
              .sort(
                (a, b) => new Date(b.timeRedeemed) - new Date(a.timeRedeemed)
              ) // Sort by timeRedeemed in descending order
              .map((reward) => (
                <Grid item xs={12} sm={6} md={4} key={reward.id}>
                  {/* Ensure unique key */}
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {reward.name || "No Name"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reward.description || "No Description"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Points:</b> {reward.pointsNeeded || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Tier:</b> {reward.tier || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Time Redeemed:</b>{" "}
                        {reward.timeRedeemed
                          ? new Date(reward.timeRedeemed).toLocaleString()
                          : "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  No Redeemed Rewards.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to redeem "
              <Typography
                component="span"
                variant="body1"
                sx={{ fontWeight: "bold" }}
              >
                {selectedReward?.name}
              </Typography>
              " for{" "}
              <Typography
                component="span"
                variant="body1"
                sx={{ fontWeight: "bold" }}
              >
                {selectedReward?.points_needed} points?
              </Typography>{" "}
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              onClick={handleClose}
              sx={{
                color: "white",
                backgroundColor: "red",
                "&:hover": {
                  backgroundColor: "darkred",
                },
                flex: 1,
                marginRight: "8px", // Adjust spacing as needed
              }}
            >
              <b>Cancel</b>
            </Button>
            <Button
              onClick={handlePurchaseReward}
              variant="contained"
              color="primary"
              sx={{
                flex: 1,
                marginLeft: "8px", // Adjust spacing as needed
              }}
              disabled={redeeming}
            >
              <b>Redeem</b>
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={TierOpen} onClose={handleTierClose}>
          <DialogTitle>Tier Information</DialogTitle>
          <DialogContent>
            <DialogContentText>
              There are 3 tiers: Bronze, Silver, and Gold. <br />
              <br />
              Earn points to reach the next tier. <br />
              <br />
              Bronze: 0 to 5000 points <br />
              Silver: 5000 to 15000 points <br />
              Gold: 15000 points and above.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleTierClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Box>
    </Box>
  );
}

export default UserRewards;
