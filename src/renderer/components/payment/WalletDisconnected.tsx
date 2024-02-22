import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import MetamaskAnimation from './MetamaskAnimation';

interface WalletDisconnectedProps {
  handleConnect: () => void;
  isReversed: boolean;
}

const WalletDisconnected: React.FC<WalletDisconnectedProps> = ({
  handleConnect,
  isReversed,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        padding: '1rem 0',
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          padding: '1rem 0',
        }}
      >
        <MetamaskAnimation useGrayscale isReversed={isReversed} />
        <Typography
          variant="body1"
          sx={{
            padding: '0.5rem 0',
            fontWeight: '600',
          }}
        >
          You are not connected to MetaMask.
        </Typography>
        <Button
          sx={{
            padding: '0.5rem 1rem',
            margin: '3rem 0',
          }}
          onClick={handleConnect}
        >
          Connect with Metamask Mobile
        </Button>
      </Stack>
    </Box>
  );
};

export default WalletDisconnected;
