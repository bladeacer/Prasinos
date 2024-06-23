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
  Pagination,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  AccountCircle,
  AccessTime,
  Search,
  Clear,
  Edit,
} from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import global from "../global";
import UserContext from "../contexts/UserContext";

function Reward() {
  const [rewardList, setRewardList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortedList, setSortedList] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const { user } = useContext(UserContext);

  const [page, setPage] = useState(1);
  const rewardsPerPage = 5;

  const [anchorEl, setAnchorEl] = useState(null);

  const getRewards = () => {
    http.get("/reward").then((res) => {
      setRewardList(res.data);
    });
  };

  useEffect(() => {
    getRewards();
  }, []);

  const sortRewards = () => {
    const sorted = [...rewardList].sort((a, b) => {
      let valueA, valueB;

      if (sortBy === "name") {
        valueA = a.name.toUpperCase();
        valueB = b.name.toUpperCase();
      } else {
        valueA = a.id;
        valueB = b.id;
      }

      if (valueA < valueB) return ascending ? -1 : 1;
      if (valueA > valueB) return ascending ? 1 : -1;
      return 0;
    });
    setSortedList(sorted);
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchRewards();
    }
  };

  const onClickSearch = () => {
    searchRewards();
  };

  const onClickClear = () => {
    setSearch("");
    getRewards();
  };

  const searchRewards = () => {
    http.get(`/reward?search=${search}`).then((res) => {
      setRewardList(res.data);
    });
  };

  const toggleSortOrder = () => {
    setAscending(!ascending);
    sortRewards();
  };

  useEffect(() => {
    sortRewards();
  }, [rewardList, ascending, sortBy]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSortMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortMethod) => {
    setSortBy(sortMethod);
    handleSortMenuClose();
  };

  const startIndex = (page - 1) * rewardsPerPage;
  const endIndex = startIndex + rewardsPerPage;
  const paginatedRewards = sortedList.slice(startIndex, endIndex);

  return (
    <Box>
      <Typography variant="h3" sx={{ my: 2 }}>
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
            <Button variant="contained">+ Add Reward</Button>
          </Link>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSortMenuClick}
          sx={{ ml: 2 }} // Add margin to the left
        >
          Sort
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSortMenuClose}
        >
          <MenuItem onClick={() => handleSortChange("name")}>
            Sort by Alphabetical Order
          </MenuItem>
          <MenuItem onClick={() => handleSortChange("id")}>
            Sort by ID
          </MenuItem>
        </Menu>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Showing {startIndex + 1} - {Math.min(endIndex, sortedList.length)} out
        of {sortedList.length}
      </Typography>

      <Grid container spacing={2}>
        {paginatedRewards.map((reward) => {
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
                  <Typography variant="body2" color="text.secondary">
                    ID: {reward.id}
                  </Typography>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.secondary"
                  >
                    <AccountCircle sx={{ mr: 1 }} />
                    <Typography>Created by: {reward.user?.name}</Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.secondary"
                  >
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>
                      Created on:{" "}
                      {dayjs(reward.createdAt).format(global.datetimeFormat)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    color="text.secondary"
                  >
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>
                      Last edited:{" "}
                      {dayjs(reward.updatedAt).format(global.datetimeFormat)}
                    </Typography>
                  </Box>

                  <Typography sx={{ wordBreak: "break-word", mb: 1 }}>
                    <strong>Description:</strong> {reward.description}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                    <strong>Points Needed:</strong> {reward.points_needed}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    <strong>Tier Required:</strong> {reward.tier_required}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {sortedList.length > rewardsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(sortedList.length / rewardsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      )}
    </Box>
  );
}

export default Reward;