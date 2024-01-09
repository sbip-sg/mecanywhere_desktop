import { useEffect, useState } from 'react';
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import QRCode from 'qrcode';
import { Buffer } from 'buffer';
import { existsSync } from 'fs';
import paymentContract from './PaymentContract.json';
import { Box, Button } from '@mui/material';
import Web3 from 'web3';

const MetaMaskComponent = () => {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [response, setResponse] = useState('');
  const [provider, setProvider] = useState<SDKProvider>();
  const [sdk, setSDK] = useState<MetaMaskSDK>();

  useEffect(() => {
    console.log('sdk', sdk);
  }, [sdk]);

  useEffect(() => {
    console.log('provider', provider);
  }, [provider]);

  useEffect(() => {
    const doAsync = async () => {
      const clientSdk = new MetaMaskSDK({
        shouldShimWeb3: false,
        storage: {
          enabled: true,
        },
        dappMetadata: {
          name: 'Electron Test Dapp',
          url: 'https://metamask.io/sdk/',
        },
        modals: {
          install: ({ link }) => {
            QRCode.toCanvas(
              document.getElementById('qrCode'),
              link,
              (error) => {
                if (error) console.error(error);
              }
            );
            return {};
          },
          otp: () => {
            return {
              updateOTPValue: (otpValue) => {
                if (otpValue !== '') {
                  document.getElementById('otp').innerText = otpValue;
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
      clientProvider.on('chainChanged', (chain) => {
        console.log(`chainChanged ${chain}`);
        setChainId(chain);
      });

      clientProvider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount('Accounts disconnected!');
          return;
        }
        console.log(`accountsChanged ${accounts}`);
        setAccount(accounts[0]);
      });
      clientProvider.on('connect', () => {
        // document.getElementById('qrCode').innerText = '';
        //   setButtonDisplay(true);
        if (account !== '') {
          //   document.getElementById('otp').innerText = '';
        }
      });
    };
    doAsync();
  }, []);

  //   // SDK Functions
  const connect = async () => {
    console.log('connect');
    await provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        console.log('accounts', accounts);
        const acc = accounts?.[0];
        setAccount(acc);
        // document.getElementById('connectButton').textContent = 'Connected';
        // document.getElementById('qrCode').style.display = 'none';
        const chain = provider.chainId;
        console.log('chain', chain);
        // if (chain) {
        // const chainToSwitchTo = currentChainId === '0x1' ? '0x5' : '0x1'; // 0xaa36a7 aka 11155111 is sepolia
        // await ethereum.request({
        //   method: 'wallet_switchEthereumChain',
        //   params: [{ chainId: chainToSwitchTo }],

        // }
        setChainId(chain);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handlePay = async () => {
    // Make the function async to use "await"
    // const contractAddress = '0x59A8E8986dbbb35b63eC15893D1AFFC37dE46286';
    const contractAddress = '0x00A2D67F79e8652ce878685Ac1B7E0b5e9A475C9';
    const senderAddress = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
    // const abi = '../contract/build/contracts/PaymentContract.json'; // Use "require" to import the ABI
    const web3 = new Web3(provider); // Initialize Web3 with the injected Ethereum provider
    console.log("paymentContract", paymentContract)
    try {
      const contract = new web3.eth.Contract(paymentContract, contractAddress); // Initialize the contract
      const fromDid = window.electron.store.get('did');
      console.log('fromdid', fromDid);
      const amountToSend = web3.utils.toWei('0.06', 'ether'); // For sending 1 Ether, for example.

      await contract.methods.pay(fromDid).send({
        from: senderAddress,
        value: amountToSend,
      });
      console.log('Payment successful');
    } catch (error) {
      console.error('Payment error', error);
    }
  };
  //   const makePayment = async () => {
  //     const from = provider.selectedAddress;
  //     const message = 'Hello World from the Electron Example dapp!';
  //     const hexMessage = '0x' + Buffer.from(message, 'utf8').toString('hex');
  //     provider
  //       .request({
  //         method: 'personal_sign',
  //         params: [hexMessage, from, 'Example password'],
  //       })
  //       .then((result) => {
  //         setResponse(result.toString());
  //         console.log('sign', result);
  //       })
  //       .catch((e) => console.log('sign ERR', e));
  //   };

  const terminate = () => {
    sdk?.terminate();
    setAccount('');
    setChainId('');
    setResponse('');
    // setButtonDisplay(false);
    // document.getElementById('qrCode').innerText = '';
    // document.getElementById('otp').innerText = '';
  };

  //   const hasSessionStored = () => {
  //     return existsSync('.sdk-comm');
  //   };

  return (
    <div>
      <canvas id="qrCode" />
      <Box id="otp">{account}</Box>
      <Button id="connectButton" onClick={() => connect()}>
        Connect
      </Button>
      <Button id="terminateButton" onClick={terminate}>
        Terminate
      </Button>
      <Button id="terminateButton" onClick={handlePay}>
        Terminate
      </Button>
      <div id="response">{response}</div>
      <div id="account">Account: {account}</div>
      <div id="chain">Chain ID: {chainId}</div>
    </div>
  );
};

export default MetaMaskComponent;

//   const personalSign = async () => {
//     const from = ethereum.selectedAddress;
//     const message = 'Hello World from the Electron Example dapp!';
//     const hexMessage = '0x' + Buffer.from(message, 'utf8').toString('hex');
//     ethereum
//       .request({
//         method: 'personal_sign',
//         params: [hexMessage, from, 'Example password'],
//       })
//       .then((result) => {
//         setResponse(result.toString());
//         console.log('sign', result);
//       })
//       .catch((e) => console.log('sign ERR', e));
//   };

//   const switchChain = async () => {
//     const currentChainId = ethereum.chainId;
//     const chainToSwitchTo = currentChainId === '0x1' ? '0x5' : '0x1';
//     await ethereum.request({
//       method: 'wallet_switchEthereumChain',
//       params: [{ chainId: chainToSwitchTo }],
//     });
//   };
{
  /* <Button
        id="personalSignButton"
        onClick={personalSign}
        style={{ display: 'none' }}
      >
        Sign
      </Button>
      <Button id="signTypedDataButton" style={{ display: 'none' }}>
        Sign Typed Data
      </Button>
      <Button
        id="switchChainButton"
        onClick={switchChain}
        style={{ display: 'none' }}
      >
        Switch Chain
      </Button> */
}
