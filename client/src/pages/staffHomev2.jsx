import { Box, Typography, Input, IconButton, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { StaffContext } from "../contexts/Contexts";
import { useContext, useState, useEffect } from "react";
import { staffLogout } from "./reusables/logout";
import http from '../http';
import dayjs from 'dayjs';

export default function StaffHome() {
    const { staff } = useContext(StaffContext);
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getUsers = () => {
        http.get('/user').then((res) => {
            setUserList(res.data);
        });
    };

    const searchUsers = () => {
        http.get(`/user?search=${search}`).then((res) => {
            setUserList(res.data);
        });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchUsers();
        }
    };

    const onClickSearch = () => {
        searchUsers();
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
        {
            field: 'createdAt', headerName: <span className="boldHeader">Created At</span>, flex: 1,
            valueFormatter: (params) => dayjs(params.value).format("DD MMM YYYY")
        },
        { field: 'points', headerName: <span className="boldHeader">Points</span>, flex: 1 },
        { field: 'tier', headerName: <span className="boldHeader">Tier</span>, flex: 1 }
    ];

    return (
        <>
            <Box style={{ paddingTop: "50px", width: "75vw", paddingBottom: "10px" }}>
                <Typography variant="h5" sx={{ my: 2, fontWeight: "bold", textAlign: "center", fontSize: "35px" }} className="title">
                    View Users
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                        value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        sx={{ ml: 2, mr: 1, width: '300px' }}
                    />
                    <IconButton color="primary" onClick={onClickSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ height: 550, width: '75vw', margin: '0 auto', marginTop: "10px" }}>
                <DataGrid
                    rows={userList}
                    columns={columns}
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20, 25, 50]}
                    disableSelectionOnClick
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                    }
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-row': {
                            '&.even-row': { backgroundColor: '#fafafa' },
                            '&.odd-row': { backgroundColor: '#ffffff' },
                        },
                    }}
                />
            </Box>
        </>
    );
}