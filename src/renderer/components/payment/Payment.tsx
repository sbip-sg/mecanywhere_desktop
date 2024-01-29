import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MetaMaskSDK, SDKProvider } from '../../../node_modules/@metamask/sdk';
import Web3 from '../../../node_modules/web3';
import QRCodePopover from './QRCodePopover';
import WalletDisconnected from './WalletDisconnected';
import WalletConnected from './WalletConnected';
import PaymentPopover from './PaymentPopover';
import WithdrawalPopover from './WithdrawalPopover';
import ErrorDialog from '../common/ErrorDialogue';

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

  useEffect(()=>{
    console.log("sdk", sdk)
  }, [sdk])

  useEffect(()=>{
    console.log("provider", provider)
  }, [provider])

  useEffect(() => {
    const getClientBalance = async () => {
      if (provider && account.length === 42) {
        const clientBalanceHex = await provider.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        const clientBalanceDecimal = parseInt(clientBalanceHex, 16);
        setClientBalance(clientBalanceDecimal / 1e18);
      }
    };
    getClientBalance();
  }, [provider, account]);

  const handleConnect = async () => {
    console.log('Web3', Web3)
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
        console.log(`chainChanged ${chain}`);
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
      console.log(`accountsChanged ${accounts}`);
      setAccount(accounts[0]);
    });

    clientProvider.on('connect', () => {
      console.log('connected');
      setOpenQR(false);
      setConnected(true);
      setIsReversed(true);
      setQrCodeUrl('');
    });

    clientProvider.on('disconnect', () => {
      handleDisconnect();
    });

    console.log('connecting');
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
          console.log('Chain ID is null');
        }
        console.log('accounts', accounts);
        console.log('chain', chain);
        return null;
        // return clientProvider.request({
        //   method: 'eth_getBalance',
        //   params: [acc, 'latest'],
        // });
      })
      // .then((clientBalanceHex) => {
      //   const clientBalanceDecimal = parseInt(clientBalanceHex, 16); // Convert hex to decimal
      //   const clientBalance = clientBalanceDecimal / 1e18;
      //   console.log(`Balance: ${clientBalance} ETH`);
      //   return null;
      // })
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
    console.log('disconnected');
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

// if (chain) {
// const chainToSwitchTo = currentChainId === '0x1' ? '0x5' : '0x1'; // 0xaa36a7 aka 11155111 is sepolia
// await ethereum.request({
//   method: 'wallet_switchEthereumChain',
//   params: [{ chainId: chainToSwitchTo }],

// }

//   const hasSessionStored = () => {
//     return existsSync('.sdk-comm');
//   };
// otp: () => {
//   return {
//     updateOTPValue: (otpValue) => {
//       if (otpValue !== '') {
//         setOtp(otpValue);
//         console.log('otp', otpValue);
//       }
//     },
//   };
// },

// const handleWithdraw = async () => {
//   const did = window.electron.store.get('did');
//   const address = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
//   const amount = 0.03;
//   const { accessToken } = reduxStore.getState().userReducer;
//   const withdrawRequest = {
//     did: did,
//     address: address,
//     amount: amount,
//   };
//   const withdrawResponse = await withdrawFromContract(
//     accessToken,
//     withdrawRequest
//   );
//   console.log('handleWithdraw', withdrawResponse);
// };
// useEffect(() => {
//   const getBalanceAsync = async () => {
//     const balanceAsync = await getBalance(
//       'token_placeholder',
//       'did_placeholder'
//     );
//     setBalance(balanceAsync);
//   };
//   getBalanceAsync();
// }, [balance]);
