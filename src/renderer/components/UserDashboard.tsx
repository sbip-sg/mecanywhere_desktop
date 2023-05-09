import { Box, Typography } from '@mui/material';

const UserDashboard = () => {
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
<Typography fontSize="24px">User Dashboard</Typography>
</Box>
    )
}

export default UserDashboard;