import { Stack, Box, Button, Typography } from '@mui/material';

const ClientWithdrawal = () => {
  const handleOpenMetamaskWeb = async () => {
    console.log('handleOpenMetamaskWeb');
    const response = await window.electron.openLinkPlease();
    console.log('response', response);
  };
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
          Client PO Payment
        </Typography>
      </Box>
      <Button onClick={handleOpenMetamaskWeb}>Make Payment via Metamask</Button>
    </Stack>
  );
};

export default ClientWithdrawal;
