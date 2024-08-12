import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Input, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { Search, Clear, MoreVert, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import emailjs from '@emailjs/browser';
// import { UserContext, StaffContext } from '/src/contexts/Contexts.js';

function RetrieveWebsiteFbS() {
  const [user, setUser] = useState(null); // Access the user context
  const [websitefblist, setWebsitefblist] = useState([]);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedID, setSelectedID] = useState(null); // New state for selected ID
  const [showDialog, setShowDialog] = useState(false);
  const [reply, setReply] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyError, setReplyError] = useState(false);
  const [markAsResolved, setMarkAsResolved] = useState(false); // New state for checkbox
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
    setSelectedID(row.id); // Set selectedID to the row's ID
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await http.get('/user/auth');
          setUser(res.data.user);
          //   http.get('/staff/auth').then((res) => {
          //     setStaff(res.data.staff);
          // });
          console.log("Response data:", res.data); // Log the entire response data
          console.log("User role:", res.data.user.role); // Log the user role from response
        } catch (error) {
          console.error("Error during authentication:", error); // Log any errors
        }
      } else {
        console.error("No token found");
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    console.log('Selected Email:', selectedEmail);
    console.log("Selected Row ID:", selectedID);
    // console.log("Selected Admin ID:", adminId);
  }, [selectedEmail]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleResolvedClick = () => {
    if (selectedID) {
      const updateData = {
        status: "Resolved",
        staffId: user.id // Include the adminId in the update
      };

      http.patch(`/websitefb/${selectedID}/status`, updateData)
        .then(() => {
          getWebsitefb(); // Refresh the list after updating
        })
        .catch((error) => {
          console.error('Error updating status/adminId:', error);
        });
    } else {
      console.error('No row selected');
    }
    handleMenuClose();
  };


  const handleViewClick = () => {
    if (selectedID) {
      navigate(`/viewwebsitefb/${selectedID}`);
    } else {
      console.error('No row selected');
    }
    handleMenuClose();
  };

  const handleReplyClick = () => {
    if (selectedID) {
      setShowDialog(true);
    } else {
      console.error('No row selected');
    }
    handleMenuClose();
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
    setReplyError(false); // Reset error when the user types
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setReply('');
    setReplyError(false);
    setMarkAsResolved(false); // Reset checkbox when dialog closes
  };

  const handleDialogSubmit = () => {
    if (!user) {
      console.error('No user is logged in');
      return;
    }

    if (reply.trim() === '') {
      setReplyError(true); // Show error if the reply is empty
      return;
    }

    if (!selectedID) {
      console.error('No row selected or invalid row');
      return;
    }

    const templateParams = {
      from_name: "PrásinosSG",
      message: reply,
      email: selectedEmail,
    };

    const updateData = {
      staffId: user.id // Always include adminId in the update
    };

    // Only include status if the checkbox is checked
    if (markAsResolved) {
      updateData.status = "Resolved";
    }

    // Send email using emailjs
    emailjs.send('service_v19cj05', 'template_zbxnmeb', templateParams, '_9k74a0UPRk_HmD_F')
      .then((result) => {
        console.log('Email successfully sent!', result.status, result.text);
        console.log('Reply:', updateData);
        // Patch request to update adminId (and status if applicable)
        http.patch(`/websitefb/${selectedID}/status`, updateData)
          .then(() => {
            getWebsitefb(); // Refresh the list after updating
          })
          .catch((error) => {
            console.error('Error updating status/adminId:', error);
          });

        setShowDialog(false);
        setReply('');
        setReplyError(false);
        setMarkAsResolved(false); // Reset checkbox after submission
        setSelectedID(null);  // Clear selectedID after submission
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
      field: 'staffId', headerName: <span className="boldHeader">Replied By</span>, flex: 1,
      sx: { fontWeight: 'bold' },
      renderCell: (params) => (
        <Box sx={{}}>
          Staff ID: {params.value}
        </Box>
      ),
    },
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
            <MenuItem onClick={handleReplyClick} disabled={params.row.status === 'Resolved'}>
              Reply
            </MenuItem>
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
    <Box style={{ width: "83vw", paddingBottom: "10px", marginLeft: "-5%", marginTop: "50px" }}>
      <Typography variant="h5" sx={{ my: 2, fontWeight: "bold", textAlign: "center", fontSize: "35px" }} className="title">
        Website Feedback
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
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }], // Sort by 'id' in ascending order
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
        <DialogContent style={{ height: "280px", paddingTop: "20px" }}>
          <TextField
            label="Your Reply"
            variant="outlined"
            value={reply}
            onChange={handleReplyChange}
            multiline
            rows={5}
            fullWidth
            error={replyError}
            helperText={replyError ? "Reply cannot be empty." : ""}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={markAsResolved}
                onChange={(e) => setMarkAsResolved(e.target.checked)}
              />
            }
            label="Mark as Resolved"
            style={{ marginTop: "20px" }}
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
