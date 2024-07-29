import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, IconButton, Menu, MenuItem, Modal, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MoreVert, Search, Clear, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function RetrieveWebsiteFbU() {
  const [websitefblist, setWebsitefblist] = useState([]);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

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
    navigate(`/editwebsitefeedback/${selectedFeedbackId}`);
  };

  const handleViewClick = () => {
    handleMenuClose();
    navigate(`/viewwebsitefb/${selectedFeedbackId}`);
  };

  const handleDeleteClick = () => {
    setDeleteId(selectedFeedbackId);
    setDeleteConfirmShow(true);
    handleMenuClose();
  };

  const deleteWebsiteFeedback = () => {
    if (deleteId) {
      http.delete(`/websitefb/${deleteId}`).then((res) => {
        console.log('Feedback deleted successfully');
        setDeleteConfirmShow(false);
        getWebsitefb();
      }).catch((error) => {
        console.error('Error deleting feedback:', error);
      });
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
        value && value.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
  
    return filteredList;
  };
  

  const columns = [
    {
      field: 'id',
      headerName: <span className="boldHeader">Report ID</span>,
      flex: 0.7,
      sx: { fontWeight: 'bold' },
      renderCell: (params) => (
        <Box sx={{ marginLeft: "20%" }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'email', headerName: <span className="boldHeader">Email</span>, flex: 1.5 },
    { field: 'reporttype', headerName: <span className="boldHeader">Report Type</span>, flex: 1 },
    {
      field: 'elaboration', headerName: <span className="boldHeader">Elaboration</span>, flex: 1, renderCell: (params) => (
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{params.value}</span>
      )
    },
    { field: 'createdAt', headerName: <span className="boldHeader">Created Date</span>, flex: 1, valueFormatter: (params) => dayjs(params).format(global.datetimeFormat) },
    {
      field: 'updatedAt', headerName: <span className="boldHeader">Last Updated</span>,
      flex: 1, valueFormatter: (params) => dayjs(params).format(global.datetimeFormat)
    },
    { field: 'status', headerName: <span className="boldHeader">Status</span>, flex: 1 },
    {
      field: 'actions',
      headerName: '',
      width: 90,
      renderCell: (params) => (
        <IconButton
          onClick={(event) => handleMenuOpen(event, params.row.id)}
        >
          <MoreVert />
        </IconButton>
      )
    }
  ];

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
      <Box sx={{ height: 500, width: '95%' }}>
        <DataGrid
          rows={getProcessedWebsiteFbList()}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25]}
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClick}>View</MenuItem>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

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
