import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import {
  getTowers,
  registerMeForTower,
} from 'renderer/services/TowerContractService';
import { MetaMaskSDK } from '../../../node_modules/@metamask/sdk';
import Web3 from '../../../node_modules/web3';
import QRCodePopover from './QRCodePopover';
import WalletDisconnected from './WalletDisconnected';
import WalletConnected from './WalletConnected';
import PaymentPopover from './PaymentPopover';
import WithdrawalPopover from './WithdrawalPopover';
import ErrorDialog from '../componentsCommon/ErrorDialogue';
import actions from '../../redux/actionCreators';

const LOCAL_BLOCKCHAIN_URL = 'http://localhost:8545';

const Payment = () => {
  const provider = useSelector(
    (state: RootState) => state.paymentProviderReducer.sdkProvider
  );
  const providerConnected = useSelector(
    (state: RootState) => state.paymentProviderReducer.connected
  );
  const account = useSelector(
    (state: RootState) => state.paymentProviderReducer.accounts[0]
  );
  const chainId = useSelector(
    (state: RootState) => state.paymentProviderReducer.chainId
  );
  const [balance, setBalance] = useState(0.5);
  const [clientBalance, setClientBalance] = useState(0);
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
      if (provider && account) {
        const clientBalanceHex = await provider.request({
          method: 'eth_getBalance',
          params: [account, 'latest'],
        });
        if (typeof clientBalanceHex === 'string') {
          const clientBalanceDecimal = parseInt(clientBalanceHex, 16);
          setClientBalance(clientBalanceDecimal / 1e18);
        } else {
          console.error('clientBalanceHex is not a string', clientBalanceHex);
          setClientBalance(-1);
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
    actions.setSDKProvider(clientProvider);

    clientProvider.on('chainChanged', (args) => {
      const argsArray = args as string[];
      const chain = argsArray[0];
      if (chain) {
        actions.setPaymentChainId(chain);
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
      actions.setPaymentAccounts(accounts);
    });

    clientProvider.on('connect', () => {
      console.log('metamask connected');
      setOpenQR(false);
      actions.setSDKProviderConnected(true);
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
        // const acc = accountsArray[0];
        const chain = clientProvider.chainId;
        actions.setPaymentAccounts(accountsArray);
        if (chain !== null) {
          actions.setPaymentChainId(chain);
        } else {
          console.error('Chain ID is null');
        }
        return null;
      })
      .catch((error) => {
        console.error(error);
        handleDisconnect();
      });
  };

  const handleDisconnect = () => {
    sdk?.terminate();
    actions.setPaymentAccounts([]);
    actions.setPaymentChainId('');
    actions.setSDKProviderConnected(false);
    setIsReversed(false);
    console.log('metamask disconnected');
  };

  const handleLocalConnect = async () => {
    const localProvider = new Web3.providers.HttpProvider(LOCAL_BLOCKCHAIN_URL);
    const localWeb3 = new Web3(localProvider);
    const accounts = await localWeb3.eth.getAccounts();
    const chain = await localWeb3.eth.getChainId();
    actions.setPaymentAccounts(accounts);
    actions.setPaymentChainId(chain.toString());
    actions.setSDKProvider(localProvider);
    actions.setSDKProviderConnected(true);
  };

  const handleRegisterFirstTower = async () => {
    console.log(await getTowers(provider));
    const tower = ((await getTowers(provider)) as any[])[0];
    const towerAddress = tower.owner;
    registerMeForTower(towerAddress, provider, account);
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
      {/* <Button
        sx={{
          padding: '0.5rem 1rem',
          margin: '1rem 0',
        }}
        onClick={handleLocalConnect}
      >
        Connect locally
      </Button>
      <Button
        sx={{
          padding: '0.5rem 1rem',
        }}
        onClick={handleRegisterFirstTower}
      >
        Register to the first tower
      </Button> */}
      {providerConnected ? (
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
