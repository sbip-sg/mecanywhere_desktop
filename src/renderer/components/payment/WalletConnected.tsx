import { Button, Box, Typography, Stack, Grid } from '@mui/material';
import MetamaskAnimation from './MetamaskAnimation';
import handlePay from './handlePay';
import CircularProgress from '@mui/material/CircularProgress';

const InfoItem = ({
  label,
  value,
  hasProgressCircle = false,
  isTransactionPending = false,
}) => (
  <>
    <Grid
      container
      item
      md={3}
      sx={{
        justifyContent: {
          xs: 'center',
          md: 'end',
        },
      }}
    >
      <Typography variant="body1">{label}:</Typography>
    </Grid>
    <Grid
      container
      item
      md={9}
      sx={{
        justifyContent: {
          xs: 'center',
          md: 'start',
        },
        padding: {
          md: '0 2rem',
        },
      }}
    >
      <Typography variant="body1" fontWeight="600">
        {value}
      </Typography>
      {hasProgressCircle && isTransactionPending && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'secondary.contrastText',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: '0 0 0 1rem',
            }}
          >
            <CircularProgress size="1rem" color="inherit" />
          </Box>
          <Typography variant="subtitle1" color="inherit" padding="0 0.5rem">
            Pending Transaction
          </Typography>
        </Box>
      )}
    </Grid>
  </>
);

const CustomButton = ({ text, onClick, backgroundColor = '', color = '' }) => (
  <Button
    sx={{
      minWidth: '10rem',
      margin: '0.5rem',
      backgroundColor,
      color,
    }}
    onClick={onClick}
  >
    {text}
  </Button>
);

const WalletConnected = ({
  handleDisconnect,
  account,
  chainId,
  balance,
  setOpenPayment,
  setOpenWithdrawal,
  isTransactionPending,
}) => {
  return (
    <Stack
      sx={{
        height: '100%',
        padding: '1rem 0',
        alignItems: 'center',
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          padding: '1rem 0',
        }}
      >
        <MetamaskAnimation useGrayscale={false} isReversed={false} />
        <Typography
          variant="body1"
          sx={{
            padding: '0.5rem 0',
            fontWeight: '600',
          }}
        >
          You are connected to MetaMask.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            padding: '0.5rem 0',
            maxWidth: '70%',
            textAlign: 'center',
          }}
        >
          Please note that all transactions will be processed through the
          MECAnywhere Smart Contract, which serves as an intermediary.
        </Typography>
      </Stack>
      <Grid
        container
        sx={{
          width: '70%',
          padding: '1rem 0',
        }}
      >
        <InfoItem label="Account" value={account} />
        <InfoItem label="Chain ID" value={chainId} />
        <InfoItem
          label="Balance"
          value={balance}
          isTransactionPending={isTransactionPending}
          hasProgressCircle
        />
      </Grid>
      <Box
        sx={{
          width: '70%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          padding: '1rem 0',
        }}
      >
        <CustomButton
          text="Pay Or Stake"
          onClick={() => setOpenPayment(true)}
          backgroundColor="primary.main"
          color="text.primary"
        />
        <CustomButton text="Disconnect" onClick={handleDisconnect} />
        <CustomButton
          text="Withdraw"
          onClick={() => setOpenWithdrawal(true)}
          backgroundColor="primary.main"
          color="text.primary"
        />
      </Box>
    </Stack>
  );
};

export default WalletConnected;