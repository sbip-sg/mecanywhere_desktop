import { Box, Typography } from '@mui/material';

const HostDashboard = () => {
    return(

        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            marginTop: "2rem"
        }}
>
<Typography fontSize="24px">Host Dashboard</Typography>
</Box>
    )
}

export default HostDashboard;