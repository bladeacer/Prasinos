import { Box, Typography, Input, IconButton, Link } from '@mui/material';
import { AccessTime, Search, Clear, Edit, MoreVert } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import { StaffContext } from "../contexts/Contexts"
import { useContext } from "react"
import { staffLogout } from "./reusables/logout";
import { CustButton, SignUpButton, CustButtonsStack } from "./reusables/components/navbar_components";
import { useState, useEffect } from 'react';
import http from '../http'


export default function StaffHome() {
    const { staff } = useContext(StaffContext);
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getUsers = () => {
        http.get('/user').then((res) => {
            setUserList(res.data);
        })
    };

    const searchUsers = () => {
        http.get(`/user?search=${search}`).then((res) => {
            setUserList(res.data);
        })
    };

    useEffect(() => {
        getUsers();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key == "Enter") {
            searchUsers()
        }
    };

    const onClickSearch = () => {
        searchUsers()
    };

    const onClickClear = () => {
        setSearch('');
        getUsers();
    };

    const columns = [
        {
            field: 'id',
            headerName: <span className="boldHeader">User ID</span>,
            flex: 0.7,
            sx: { fontWeight: 'bold' },
            renderCell: (params) => (
                <Box sx={{ marginLeft: "15%" }}>
                    {params.value}
                </Box>
            )
        },
        { field: 'email', headerName: <span className="boldHeader">Email</span>, flex: 1.5 },
        { field: 'createdAt', headerName: <span className="boldHeader">Created At</span>, flex: 1 },
        // { field: 'points', headerName: <span className="boldHeader">Points</span>, flex: 1 },
        // { field: 'tier', headerName: <span className="boldHeader">Tier</span>, flex: 1 }
    ];

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, paddingTop: "40px", marginLeft: "12.25vw", width: "75vw" }}>

                <CustButtonsStack sx={{ display: 'unset', right: '20vw' }}>
                    <CustButton href="/staffSettings" sx={{ mr: 2 }}>{staff.name}</CustButton>
                    <SignUpButton onClick={staffLogout}>Logout</SignUpButton>
                </CustButtonsStack>

                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>

                <Typography variant="h5" sx={{ ml: 20, fontWeight: "bold", textAlign: "center", fontSize: "35px" }} className="title">
                    View users
                </Typography>
            </Box>
            <Box sx={{ height: 550, width: '100%', marginTop: "10px" }}>
                <DataGrid
                    rows={userList}
                    style={{}}
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

        </>
    )
}