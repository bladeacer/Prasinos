import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem, Modal, Button } from '@mui/material';
import { MoreVert, Search, Clear, ArrowUpward, ArrowDownward, FilterList } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function RetrieveWebsiteFbU() {
  const [websitefblist, setWebsitefblist] = useState([]);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // For filter dropdown
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('id');
  const [filterStatus, setFilterStatus] = useState('all'); // State for filtering by status
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false); // State for showing delete confirmation modal
  const [deleteId, setDeleteId] = useState(null); // State to store ID of feedback to be deleted

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getWebsitefb = () => {
    http.get('/websitefb').then((res) => {
      setWebsitefblist(res.data);
    });
  };

  const searchWebsitefb = () => {
    http.get(`/websitefb?search=${search}`).then((res) => {
      setWebsitefblist(res.data);
    });
  };

  useEffect(() => {
    getWebsitefb();
  }, []);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeedbackId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFeedbackId(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    // Redirect to edit page
  };

  const handleViewClick = () => {
    navigate(`/viewwebsitefb/${selectedFeedbackId}`);
    handleMenuClose();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmShow(true);
  };

  const deleteWebsiteFeedback = () => {
    if (deleteId) {
      http.delete(`/websitefb/${deleteId}`).then((res) => {
        // Assuming deletion was successful
        console.log('Feedback deleted successfully');
        setDeleteConfirmShow(false);
        getWebsitefb(); // Refresh the feedback list
      }).catch((error) => {
        console.error('Error deleting feedback:', error);
        // Handle error if needed
      });
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortIcon = (columnName) => {
    if (sortColumn === columnName) {
      return sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
    }
    return null;
  };

  const sortWebsitefbList = (list) => {
    const sortedList = [...list].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    });
    return sortedList;
  };

  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      toggleSortOrder();
    } else {
      setSortColumn(columnName);
      setSortOrder('asc');
    }
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchWebsitefb();
    }
  };

  const onClickSearch = () => {
    searchWebsitefb();
  };

  const onClickClear = () => {
    setSearch('');
    getWebsitefb();
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmShow(false);
    setDeleteId(null);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };

  const getProcessedWebsiteFbList = () => {
    let filteredList = websitefblist.filter((websitefb) => {
      if (filterStatus === 'all') return true;
      return websitefb.status.toLowerCase() === filterStatus.toLowerCase();
    });

    filteredList = filteredList.filter((websitefb) => {
      if (!search) return true;
      return Object.values(websitefb).some(value => 
        value.toString().toLowerCase().includes(search.toLowerCase())
      );
    });

    return sortWebsitefbList(filteredList);
  };

  return (
    <Box style={{ paddingTop: "100px", paddingLeft: "7%", width: "100vw" }}>
      <Typography variant="h5" sx={{ my: 2, fontWeight: "bold", textAlign: "center", fontSize: "35px", ml: -3 }} className="title">
        Website Feedback (User)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
        <IconButton color="primary" onClick={handleFilterMenuOpen}>
          <FilterList />
        </IconButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={() => handleFilterStatus('resolved')}>Resolved</MenuItem>
          <MenuItem onClick={() => handleFilterStatus('unresolved')}>Unresolved</MenuItem>
          <MenuItem onClick={() => handleFilterStatus('all')}>All</MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 500, width: '95%', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}>
                Report ID
                <IconButton onClick={() => handleSort('id')}>
                  {sortIcon('id')}
                </IconButton>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}>Report Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: "16px" }}>Elaboration</TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}>Last Updated</TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, fontSize: "16px" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getProcessedWebsiteFbList().map((websitefb, index) => (
              <TableRow key={websitefb.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }}>
                <TableCell style={{ paddingLeft: "2.5%" }}>{websitefb.id}</TableCell>
                <TableCell>{websitefb.email}</TableCell>
                <TableCell>{websitefb.reporttype}</TableCell>
                <TableCell sx={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{websitefb.elaboration}</TableCell>
                <TableCell>{dayjs(websitefb.createdAt).format(global.datetimeFormat)}</TableCell>
                <TableCell>{dayjs(websitefb.updatedAt).format(global.datetimeFormat)}</TableCell>
                <TableCell>{websitefb.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, websitefb.id)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedFeedbackId === websitefb.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleViewClick}>
                      <Link to={`/viewwebsitefb/${websitefb.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        View
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleEditClick}>
                      <Link to={`/editwebsitefeedback/${websitefb.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        Edit
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(websitefb.id)}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation modal */}
      <Modal open={deleteConfirmShow} onClose={handleDeleteConfirmClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Confirm Delete
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this feedback?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleDeleteConfirmClose} color="primary" variant="contained" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button onClick={deleteWebsiteFeedback} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default RetrieveWebsiteFbU;
