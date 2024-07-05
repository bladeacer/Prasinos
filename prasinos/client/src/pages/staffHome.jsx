import { Typography, Button } from "@mui/material"
import { StaffContext } from "../contexts/Contexts"
import { useContext } from "react"
import { staffLogout } from "./reusables/logout";

export default function StaffHome() {
    const { staff } = useContext(StaffContext);
    return (
        <>
            <Typography>{staff.name} {staff.createdAt} {staff.email} {staff.phone}</Typography>
            <Button onClick={staffLogout}>Logout</Button>
        </>
    )
}