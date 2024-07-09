import { Button } from "@mui/material"
import { useParams } from "react-router-dom"

export default function ResetEndpoint() {
    // /resethandler/1/...
    const id  = window.location.pathname[14];
    const uuid = window.location.pathname.slice(-36);
    return (
        <>
            <Button href={`/reset/${id}/${uuid}`}>Reset password here</Button>
        </>
    )
}