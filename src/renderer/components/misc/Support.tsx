import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// const { BrowserWindow } = require('electron')
// import { BrowserWindow } from 'electron'
import { MetaMaskSDK } from '@metamask/sdk';
import { useEffect, useState } from 'react';
import {
  withdrawFromContract,
  depositToContract,
  getContract,
} from 'renderer/services/PaymentServices';
import Web3 from 'web3';
import reduxStore from '../../redux/store';

const Support = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const options = {
    dappMetadata: { name: 'My Dapp', url: 'https://mydapp.com' },
    getUniversalLink: true,
    // preferDesktop: false
  };
  const MMSDK = new MetaMaskSDK(options);
  let ethereum;
  MMSDK.init()
    .then(() => {
      console.log('MetaMask SDK is ready');
      ethereum = MMSDK.getProvider();
    })
    .catch((error) => {
      console.error(error);
    });

  useEffect(() => {
    console.log('accounts', accounts);
    console.log('MMSDK.isAuthorized()', MMSDK.isAuthorized());
    console.log('MMSDK.isInitialized()', MMSDK.isInitialized());
  }, [MMSDK, accounts]);

  const handleClick = async () => {
    const account = (await ethereum.request({
      method: 'eth_requestAccounts',
      params: [],
    })) as string;
    setAccounts((accounts) => [...accounts, account]);
  };

  const handleShowQR = () => {
    const qrcode = MMSDK.getUniversalLink();
    console.log('qrcode', qrcode);
  };

  async function handleGetContract() {
    const did = window.electron.store.get('did');
    const accessToken = reduxStore.getState().accountUser.userAccessToken;
    const depositRequest = {
      did,
    };
    const response = await getContract(accessToken, depositRequest);
    const { contractAddress, contractAbi } = await response?.json();
    console.log('contractAddress', contractAddress);
    console.log('contractAbi', contractAbi);
    const web3 = new Web3(ethereum);
    console.log('web3', web3);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log('contract', contract);
    const paymentAmount = 0.0001;
    const paymentWei = web3.utils.toWei(paymentAmount, 'ether');
    try {
      await contract.methods.pay(did).send({
        from: '0xa32fe9bc86adf555db1146ef44eb7ffeb54c86ca',
        value: paymentWei,
      });
      console.log('Transaction executed.');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }

  // const handleSendTransaction = (contract) => {
  //   const accounts = await web3.eth.getAccounts();
  //   const paymentAmount = "0.00001";
  //   const paymentWei = web3.utils.toWei(paymentAmount, 'ether');
  //   try {
  //     await contract.methods.pay(did).send({
  //       from: accounts[0],
  //       value: paymentWei
  //     });
  //     console.log('Transaction executed.');
  //   } catch (error) {
  //     console.error('Transaction failed:', error);
  //   }
  // }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: '2rem',
      }}
    >
      <Button onClick={handleClick}>Open Metamask</Button>
      {/* <Button onClick={handleShowQR}>Show QR</Button> */}
      <Button onClick={handleGetContract}>Get Contract</Button>
    </Box>
  );
};

export default Support;

// localStorage.setItem('key', 'value');
// console.log("clicked")
// const currentWindow = getCurrentWindow();
// console.log("BrowserWindow", BrowserWindow)
// window.electron.openWindow()
// var myWindow = window.open("https://github.com", "_blank");
// myWindow.document.write("<script>alert('Hello, World!');</script>");
// Window.open('https://github.com', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no')
// var html = $(id).html();
// var newWindow = window.open('');
// newWindow.document.body.innerHTML =  '<html><head><title>Hi</title>  <script src="js/myScript.js"></script> </head>' + html;
// window.webContents.once('dom-ready', () => {
//   // window.webContents.executeJavaScript(`
//     console.log("This loads no problem!")
//     // `);
// })

// const handleClick = () => {
//   console.log("clicked")
//   const win = new BrowserWindow({ width: 800, height: 1500 })
//   win.loadURL('http://github.com')
//   // window.open('https://github.com', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no')
//   // window.webContents.once('dom-ready', () => {
//   //   // THIS WORKS!!!
//   //   window.webContents.executeJavaScript(`
//   // console.log("This loads no problem!");

// }
