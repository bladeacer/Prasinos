import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Search, Clear, MoreVert, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import emailjs from '@emailjs/browser';

function RetrieveWebsiteFbS() {
  const [websitefblist, setWebsitefblist] = useState([]);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reply, setReply] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    setSelectedEmail(row.email);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
    setSelectedEmail('');
  };

  const handleResolvedClick = () => {
    if (selectedRow) {
      http.patch(`/websitefb/${selectedRow.id}/status`, {
        status: "Resolved"
      })
        .then(() => {
          getWebsitefb();
        })
        .catch((error) => {
          console.error('Error updating status:', error);
        });
    } else {
      console.error('No row selected');
    }
    handleMenuClose();
  };

  const handleViewClick = () => {
    navigate(`/viewwebsitefb/${selectedRow.id}`);
    handleMenuClose();
  };

  const handleReplyClick = () => {
    if (selectedRow) {
      setShowDialog(true);
    } else {
      console.error('No row selected');
    }
    handleMenuClose();
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setReply('');
  };

  const handleDialogSubmit = () => {
    const templateParams = {
      from_name: "PrásinosSG",
      message: reply,
      email: selectedEmail // Make sure to include the email in the template params
    };

    emailjs.send('service_60gzlnq', 'template_n0yggcn', templateParams, 'JhO9fMrH4RAMOtWBc')
      .then((result) => {
        console.log('Email successfully sent!', result.status, result.text);
        setShowDialog(false);
        setReply('');
      }, (error) => {
        console.error('Failed to send email:', error);
      });
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
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
        <Box sx={{ marginLeft: "15%" }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'email', headerName: <span className="boldHeader">Email</span>, flex: 1.5 },
    { field: 'reporttype', headerName: <span className="boldHeader">Report Type</span>, flex: 1 },
    { field: 'elaboration', headerName: <span className="boldHeader">Elaboration</span>, flex: 1 },
    {
      field: 'createdAt',
      headerName: <span className="boldHeader">Created Date</span>,
      flex: 1,
      valueFormatter: (params) => dayjs(params).format(global.datetimeFormat),
    },
    {
      field: 'updatedAt',
      headerName: <span className="boldHeader">Last Updated</span>,
      flex: 1,
      valueFormatter: (params) => dayjs(params).format(global.datetimeFormat),
    },
    { field: 'status', headerName: <span className="boldHeader">Status</span>, flex: 1 },
    {
      field: 'actions',
      headerName: <span className="boldHeader"></span>,
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(event) => handleMenuClick(event, params.row)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow?.id === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleViewClick}>View</MenuItem>
            <MenuItem onClick={handleReplyClick}>Reply</MenuItem>
            <MenuItem
              onClick={handleResolvedClick}
              disabled={params.row.status === 'Resolved'}
            >
              Mark as Resolved
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <Box style={{ paddingTop: "100px", width: "80vw", marginLeft: "12%", paddingBottom: "10px" }}>
      <Typography variant="h5" sx={{ my: 2, fontWeight: "bold", textAlign: "center", fontSize: "35px"}} className="title">
        Website Feedback (Staff)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
      <Box sx={{ height: 550, width: '100%', marginTop: "10px" }}>
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
      <Dialog open={showDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
        <DialogTitle>Reply</DialogTitle>
        <DialogContent style={{ height: "300px", paddingTop: "20px"}}>
          <TextField
            label="Reply......"
            variant="outlined"
            value={reply}
            onChange={handleReplyChange}
            multiline
            rows={4}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSubmit} color="success" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RetrieveWebsiteFbS;
