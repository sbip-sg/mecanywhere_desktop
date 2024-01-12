import { useEffect, useState } from 'react';
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { Box, Button } from '@mui/material';
import Web3 from 'web3';
import paymentContract from './PaymentContract.json';
import paymentContract2 from './PaymentContract2.json';
import QRCodePopover from './QRCodePopover';
import DisconnectedComponent from './DisconnectedComponent';
import ConnectedComponent from './ConnectedComponent';
import { withdrawFromContract } from 'renderer/services/PaymentServices';
import reduxStore from 'renderer/redux/store';

const MetaMaskComponent = () => {
  const [otp, setOtp] = useState('');
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [provider, setProvider] = useState<SDKProvider>();
  const [sdk, setSDK] = useState<MetaMaskSDK>();
  const [open, setOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    console.log('sdk', sdk);
  }, [sdk]);

  useEffect(() => {
    console.log('provider', provider);
  }, [provider]);

  useEffect(() => {
    console.log('qrcodeurl', qrCodeUrl);
  }, [qrCodeUrl]);

  useEffect(() => {
    console.log('otp', otp);
  }, [otp]);

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
        otp: () => {
          return {
            updateOTPValue: (otpValue) => {
              if (otpValue !== '') {
                setOtp(otpValue);
              }
            },
          };
        },
      },
    });
    setSDK(clientSdk);
    await clientSdk.init();
    const clientProvider = clientSdk.getProvider();
    setProvider(clientProvider);

    clientProvider.on('chainChanged', (chain: string) => {
      console.log(`chainChanged ${chain}`);
      setChainId(chain);
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
      setOpen(false);
      setConnected(true);
      setQrCodeUrl('');
    });

    clientProvider.on('disconnect', () => {
      console.log('disconnect');
      // setOpen(false);
      // setConnected(true);
      // setQrCodeUrl('');
    });

    console.log('connecting');
    setOpen(true);
    await clientProvider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        const acc = accounts?.[0];
        const chain = clientProvider.chainId;
        setAccount(acc);
        setChainId(chain);
        console.log('accounts', accounts);
        console.log('chain', chain);
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
    console.log('disconnected');
  };

  const handlePay = async () => {
    // const contractAddress = '0x00A2D67F79e8652ce878685Ac1B7E0b5e9A475C9';
    const contractAddress = '0xe3ed4fd891fEf89Cb5ED7f609fEDEB87ddcC864c';

    const senderAddress = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
    const web3 = new Web3(provider);
    console.log('paymentContract', paymentContract);
    try {
      const contract = new web3.eth.Contract(paymentContract, contractAddress);
      const fromDid = window.electron.store.get('did');
      console.log('fromdid', fromDid);
      const amountToSend = web3.utils.toWei('0.01', 'ether');
      await contract.methods.pay(fromDid).send({
        from: senderAddress,
        value: amountToSend,
      });
      console.log('Payment successful');
    } catch (error) {
      console.error('Payment error', error);
    }
  };

  const handleWithdraw = async () => {
    console.log('handleWithdraw1');
    const did = window.electron.store.get('did');
    const address = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
    const amount = 0.03;
    const { accessToken } = reduxStore.getState().userReducer;
    const withdrawRequest = {
      did: did,
      address: address,
      amount: amount,
    };
    // console.log(wiu)
    const withdrawResponse = await withdrawFromContract(
      accessToken,
      withdrawRequest
    );
    console.log('handleWithdraw', withdrawResponse);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <QRCodePopover
        open={open}
        setOpen={setOpen}
        qrCodeUrl={qrCodeUrl}
        setQrCodeUrl={setQrCodeUrl}
      />
      {connected ? (
        <ConnectedComponent
          handleDisconnect={handleDisconnect}
          handlePay={handlePay}
          handleWithdraw={handleWithdraw}
          account={account}
          chainId={chainId}
        />
      ) : (
        <DisconnectedComponent handleConnect={handleConnect} />
      )}
    </Box>
  );
};

export default MetaMaskComponent;

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

// useEffect(() => {
//   const doAsync = async () => {
//     const clientSdk = new MetaMaskSDK({
//       shouldShimWeb3: false,
//       storage: {
//         enabled: false,
//       },
//       dappMetadata: {
//         name: 'Electron Test Dapp',
//         url: 'https://metamask.io/sdk/',
//       },
//       modals: {
//         install: ({ link }) => {
//           setQrCodeUrl(link);
//           return {};
//         },
//         otp: () => {
//           return {
//             updateOTPValue: (otpValue) => {
//               if (otpValue !== '') {
//                 setOtp(otpValue);
//               }
//             },
//           };
//         },
//       },
//     });
//     setSDK(clientSdk);
//     await clientSdk.init();
//     const clientProvider = clientSdk.getProvider();
//     setProvider(clientProvider);

//     clientProvider.on('chainChanged', (chain: string) => {
//       console.log(`chainChanged ${chain}`);
//       setChainId(chain);
//     });

//     clientProvider.on('accountsChanged', (args) => {
//       const accounts = args as string[];
//       if (accounts.length === 0) {
//         handleDisconnect();
//         return;
//       }
//       console.log(`accountsChanged ${accounts}`);
//       setAccount(accounts[0]);
//     });

//     clientProvider.on('connect', () => {
//       console.log('connected');
//       setOpen(false);
//       setConnected(true);
//       setQrCodeUrl('');
//     });
//   };
//   doAsync();
// }, []);
