import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MetaMaskSDK, SDKProvider } from '../../../node_modules/@metamask/sdk';
import QRCodePopover from './QRCodePopover';
import WalletDisconnected from './WalletDisconnected';
import WalletConnected from './WalletConnected';
import PaymentPopover from './PaymentPopover';
import WithdrawalPopover from './WithdrawalPopover';
import ErrorDialog from '../componentsCommon/ErrorDialogue';

const Payment = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('placeholderplaceholder');
  const [chainId, setChainId] = useState('placeholder');
  const [balance, setBalance] = useState(0.5);
  const [clientBalance, setClientBalance] = useState(0);
  const [provider, setProvider] = useState<SDKProvider>();
  const [sdk, setSDK] = useState<MetaMaskSDK>();
  const [openQR, setOpenQR] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openWithdrawal, setOpenWithdrawal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isReversed, setIsReversed] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  useEffect(() => {
    const getClientBalance = async () => {
      if (provider && account.length === 42) {
        const clientBalanceHex = await provider.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        if (typeof clientBalanceHex === 'string') {
          const clientBalanceDecimal = parseInt(clientBalanceHex, 16);
          setClientBalance(clientBalanceDecimal / 1e18);
        } else {
          console.error('clientBalanceHex is not a string');
        }
      }
    };
    getClientBalance();
  }, [provider, account]);

  const handleConnect = async () => {
    const clientSdk = new MetaMaskSDK({
      shouldShimWeb3: false,
      storage: {
        enabled: false,
      },
      dappMetadata: {
        name: 'Electron Test Dapp',
        url: 'https://metamask.io/sdk/',
      },
      modals: {
        install: ({ link }) => {
          setQrCodeUrl(link);
          return {};
        },
      },
    });
    setSDK(clientSdk);
    await clientSdk.init();
    const clientProvider = clientSdk.getProvider();
    setProvider(clientProvider);

    clientProvider.on('chainChanged', (args) => {
      const argsArray = args as string[];
      const chain = argsArray[0];
      if (chain) {
        setChainId(chain);
      } else {
        console.error('chainChanged event did not provide a string argument');
      }
    });

    clientProvider.on('accountsChanged', (args) => {
      const accounts = args as string[];
      if (accounts.length === 0) {
        handleDisconnect();
        return;
      }
      setAccount(accounts[0]);
    });

    clientProvider.on('connect', () => {
      console.log('metamask connected');
      setOpenQR(false);
      setConnected(true);
      setIsReversed(true);
      setQrCodeUrl('');
    });

    clientProvider.on('disconnect', () => {
      handleDisconnect();
    });

    console.log('metamask connecting');
    setOpenQR(true);
    await clientProvider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        const accountsArray = accounts as string[];
        const acc = accountsArray[0];
        const chain = clientProvider.chainId;
        setAccount(acc);
        if (chain !== null) {
          setChainId(chain);
        } else {
          console.error('Chain ID is null');
        }
        return null;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDisconnect = () => {
    sdk?.terminate();
    setAccount('');
    setChainId('');
    setConnected(false);
    setIsReversed(false);
    console.log('metamask disconnected');
  };

  return (
    <Box sx={{ height: '100%', padding: '3rem' }}>
      <Typography
        variant="h3"
        sx={{
          padding: '0.5rem 0',
        }}
      >
        Payment
      </Typography>

      {connected ? (
        <WalletConnected
          handleDisconnect={handleDisconnect}
          account={account}
          chainId={chainId}
          balance={balance}
          setOpenPayment={setOpenPayment}
          setOpenWithdrawal={setOpenWithdrawal}
          isTransactionPending={isTransactionPending}
        />
      ) : (
        <WalletDisconnected
          handleConnect={handleConnect}
          isReversed={isReversed}
        />
      )}
      <QRCodePopover
        open={openQR}
        setOpen={setOpenQR}
        qrCodeUrl={qrCodeUrl}
        setQrCodeUrl={setQrCodeUrl}
      />
      <PaymentPopover
        open={openPayment}
        setOpen={setOpenPayment}
        account={account}
        balance={balance}
        setBalance={setBalance}
        clientBalance={clientBalance}
        setIsTransactionPending={setIsTransactionPending}
        provider={provider}
        setErrorMessage={setErrorMessage}
        setErrorDialogOpen={setErrorDialogOpen}
      />
      <WithdrawalPopover
        open={openWithdrawal}
        setOpen={setOpenWithdrawal}
        balance={balance}
        setBalance={setBalance}
        setIsTransactionPending={setIsTransactionPending}
        setErrorMessage={setErrorMessage}
        setErrorDialogOpen={setErrorDialogOpen}
      />
      <ErrorDialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default Payment;
