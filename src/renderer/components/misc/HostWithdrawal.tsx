import { Stack, Box, Button, Typography } from '@mui/material';

const HostWithdrawal = () => {
  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <Typography
          variant="h1"
          style={{ fontSize: '20px', margin: '1.5rem 0 0 0' }}
        >
          Host PO Withdrawal
        </Typography>
      </Box>
      <Button>Withdraw</Button>
    </Stack>
  );
};

export default HostWithdrawal;
