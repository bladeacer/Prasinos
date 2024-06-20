import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
} from "@mui/material";
import {
  AccountCircle,
  AccessTime,
  Search,
  Clear,
  Edit,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import global from "../global";
import UserContext from "../contexts/UserContext";

function Reward() {
  const [rewardList, setRewardList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortedList, setSortedList] = useState([]);
  const [ascending, setAscending] = useState(true); // Track ascending or descending order
  const { user } = useContext(UserContext);

  // Fetch rewards from backend
  const getRewards = () => {
    http.get("/reward").then((res) => {
      setRewardList(res.data);
    });
  };

  // Initial fetch on component mount
  useEffect(() => {
    getRewards();
  }, []);

  // Sort rewards alphabetically based on name
  const sortRewards = () => {
    const sorted = [...rewardList].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return ascending ? -1 : 1;
      if (nameA > nameB) return ascending ? 1 : -1;
      return 0;
    });
    setSortedList(sorted);
  };

  // Handle search input change
  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Perform search on Enter key press
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchRewards();
    }
  };

  // Perform search on button click
  const onClickSearch = () => {
    searchRewards();
  };

  // Clear search and fetch all rewards
  const onClickClear = () => {
    setSearch("");
    getRewards();
  };

  // Search rewards based on input value
  const searchRewards = () => {
    http.get(`/reward?search=${search}`).then((res) => {
      setRewardList(res.data);
    });
  };

  // Toggle sorting order (ascending or descending)
  const toggleSortOrder = () => {
    setAscending(!ascending);
    sortRewards();
  };

  // Initial sort when rewardList changes
  useEffect(() => {
    sortRewards();
  }, [rewardList, ascending]);

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Rewards
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Input
          value={search}
          placeholder="Search Rewards"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Link to="/addreward" style={{ textDecoration: "none" }}>
            <Button variant="contained">Add</Button>
          </Link>
        )}
        <IconButton color="primary" onClick={toggleSortOrder}>
          {ascending ? <ArrowUpward /> : <ArrowDownward />}
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {sortedList.map((reward, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={reward.id}>
              <Card>
                {reward.imageFile && (
                  <Box className="aspect-ratio-container">
                    <img
                      alt="reward"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${reward.imageFile}`}
                    ></img>
                  </Box>
                )}
                <CardContent>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {reward.name}
                    </Typography>
                    {user && user.id === reward.userId && (
                      <Link to={`/editreward/${reward.id}`}>
                        <IconButton color="primary" sx={{ padding: "4px" }}>
                          <Edit />
                        </IconButton>
                      </Link>
                    )}
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.secondary"
                  >
                    <AccountCircle sx={{ mr: 1 }} />
                    <Typography>{reward.user?.name}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.secondary"
                  >
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>
                      {dayjs(reward.createdAt).format(global.datetimeFormat)}
                    </Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                    {reward.description}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                    Points Needed: {reward.points_needed}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    Tier Required: {reward.tier_required}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Reward;
