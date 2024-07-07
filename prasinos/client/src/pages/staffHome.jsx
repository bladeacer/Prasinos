import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { Input, Typography, Box, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import http from '../http'

import { StaffContext } from "../contexts/Contexts"
import { useContext } from "react"
import { staffLogout } from "./reusables/logout";
import { CustButton, SignUpButton, CustButtonsStack } from "./reusables/components/navbar_components";
import EnhancedTable from './reusables/table';
import dayjs from "dayjs";

export default function StaffHome() {
    const { staff } = useContext(StaffContext);
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    var [userData, setUserData] = useState([]);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    function createData(id, user_id, name, join_date, points, tier) {
        return {
            id,
            user_id,
            name,
            join_date,
            points,
            tier
        }
    }

    function handleUserData(res) {
        var placeholder = [];
        for (var i = 0; i < res.data.length; i++) {
            var user = res.data[i];
            // var joe = [user.id, user.id.toString(), user.name, dayjs(user.createdAt).format("DD MMM YYYY").toString(), "", ""];
            var joe = createData(user.id, user.id, user.name, dayjs(user.createdAt).format("DD MMM YYYY").toString(), "", "")
            placeholder.push(joe);
        }
        // userData.push(pain);
        setUserData(placeholder);
    }

    const getUsers = () => {
        http.get('/user').then((res) => {
            setUserList(res.data);
            handleUserData(res);
        })
    };

    const searchUsers = () => {
        http.get(`/user?search=${search}`).then((res) => {
            setUserList(res.data);
            handleUserData(res);
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

    return (
        <>
            {/* <Typography>{staff.name} {staff.createdAt} {staff.email} {staff.phone}</Typography> */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>

                <CustButtonsStack sx={{display: 'unset', right: '20vw'}}>
                    <CustButton href="/staffSettings" sx={{mr: 2}}>{staff.name}</CustButton>
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



            </Box>

            {EnhancedTable(userData)}
        </>
    )
}