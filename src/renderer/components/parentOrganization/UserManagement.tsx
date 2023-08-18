import React from 'react';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Box, Typography, Button } from '@mui/material';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  marginTop: '32px',
});

const StyledTextField = styled(TextField)({
  width: '100%',
  margin: '1rem 0rem 0.5rem 0rem',
});

const UserManagement = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginTop: '32px',
      }}
    >
      <Typography variant="h1" marginTop="1rem">
        Manage User
      </Typography>
      <Box marginTop="1rem">
        <Typography>Issue User Credential</Typography>
        <StyledTextField label="Enter user DID" variant="outlined" />
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button sx={{}}>Submit</Button>
        </Box>
        <Typography>Evoke User Credential</Typography>
        <StyledTextField label="Enter user DID" variant="outlined" />
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            sx={{
              marginBottom: '1rem',
            }}
          >
            Submit
          </Button>
        </Box>
        <Typography>Change Credential Issue Format (CPT)</Typography>
        <StyledTextField label="Enter CPT" variant="outlined" />
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            sx={{
              marginBottom: '1rem',
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagement;
