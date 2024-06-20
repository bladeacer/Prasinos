import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

export const CustomContainer = styled(Container)({
    position: 'sticky',
    marginTop: '100px',
    right: '20vh',
    padding: 'unset',
    width: '90vw',
    color: "#000000",
    // border: "1px solid black",
    overflowX: 'hidden'
})
