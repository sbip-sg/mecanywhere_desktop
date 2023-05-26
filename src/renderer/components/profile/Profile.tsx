import { Box, Typography } from '@mui/material';
const Profile = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: '2rem',
      }}
    >
      <Typography fontSize="24px">Profile</Typography>
    </Box>
  );
};

export default Profile;
