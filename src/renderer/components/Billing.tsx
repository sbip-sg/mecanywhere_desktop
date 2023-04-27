import { Box, Typography } from '@mui/material';
const Billing = () => {
    return (
        <Box
            sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            marginTop: "2rem"
            }}
        >
        <Typography fontSize="24px">Billing Information</Typography>
      </Box>
    );
}

export default Billing;