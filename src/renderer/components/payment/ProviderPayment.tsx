import { Stack, Box, Button, Typography, useTheme } from '@mui/material';
import { withdrawFromContract } from 'renderer/services/PaymentServices';
import { useState } from 'react';
import reduxStore from '../../redux/store';

const ProviderPayment = () => {
  const theme = useTheme();
  const [accounts, setAccounts] = useState([]);

  const handleOpenMetamaskWeb = async () => {
    console.log('handleOpenMetamaskWeb');
    const response = await window.electron.openLinkPlease();
    console.log('response', response);
  };
  async function handleWithdrawFromContract() {
    const accessToken = reduxStore.getState().accountUser.userAccessToken;
    // console.log("accessToken", accessToken)
    const did = window.electron.store.get('did');
    console.log('account', accounts);
    const address = accounts;
    // const address = "0x1Bd80AcA1E94c2aF75F853ab32beDcf21eb1B44f"
    const amount = '0.00001';
    const withdrawRequest = {
      did,
      address,
      amount,
    };
    const response = await withdrawFromContract(accessToken, withdrawRequest);
    const data = await response.json();
    console.log('withdraw response', response);
    console.log('withdraw response', data);
  }

  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'top',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Typography
          color={theme.palette.cerulean.main}
          variant="h1"
          style={{ fontSize: '24px', margin: '0rem 0 0 0' }}
        >
          PAYMENT
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Typography
          variant="h4"
          style={{ fontSize: '16px', margin: '1.5rem 0 0 0' }}
        >
          You current have 432.17 SGD due by 31st August 2023.
        </Typography>
      </Box>
      <Button
        onClick={handleOpenMetamaskWeb}
        sx={{ width: '22rem', marginLeft: '1rem' }}
      >
        Make Payment via Metamask
      </Button>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Typography
          variant="h4"
          style={{ fontSize: '16px', margin: '1.5rem 0 0 0' }}
        >
          You are in a deficit thus not entitled for any withdrawal.
        </Typography>
      </Box>
      <Button
        onClick={handleWithdrawFromContract}
        sx={{ width: '22rem', marginLeft: '1rem' }}
      >
        Withdraw
      </Button>
    </Stack>
  );
};

export default ProviderPayment;
