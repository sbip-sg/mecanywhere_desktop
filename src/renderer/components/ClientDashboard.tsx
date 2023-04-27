import { Box, Typography } from '@mui/material';

const ClientDashboard = () => {
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
<Typography fontSize="24px">Client Dashboard</Typography>
</Box>
    )
}

export default ClientDashboard;