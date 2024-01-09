// import { Box, Button, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
import Web3 from 'web3';
// import {
//   registerMetamaskAccount,
//   withdrawFromContract,
//   depositToContract,
// } from 'renderer/services/PaymentServices';
// import { useState } from 'react';
// import reduxStore from '../../redux/store';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

import MetaMaskComponent from './MetaMaskComponent';

// import { getContract } from 'renderer/services/PaymentServices';
const Payment = () => {
  return <MetaMaskComponent />;
  // const handlePay = async () => { // Make the function async to use "await"
  //   const contractAddress = '0x59A8E8986dbbb35b63eC15893D1AFFC37dE46286';
  //   const senderAddress = '0xA32fE9BC86ADF555Db1146ef44eb7fFEB54c86CA';
  //   const abi = '../contract/build/contracts/PaymentContract.json'; // Use "require" to import the ABI
  //   const web3 = new Web3(window.ethereum); // Initialize Web3 with the injected Ethereum provider

  //   try {
  //     await window.ethereum.enable(); // Request user permission to access their Ethereum account
  //     const contract = new web3.eth.Contract(abi, contractAddress); // Initialize the contract
  //     const fromDid = window.electron.store.get('did');
  //     console.log('fromdid', fromDid);
  //     const amountToSend = web3.utils.toWei('0.06', 'ether'); // For sending 1 Ether, for example.

  //     await contract.methods.pay(fromDid).send({
  //       from: senderAddress,
  //       value: amountToSend,
  //     });
  //     console.log('Payment successful');
  //   } catch (error) {
  //     console.error('Payment error', error);
  //   }
  // };

  // return <Button onClick={handlePay}>Pay</Button>;
};

export default Payment;

//   const [metamaskAccount, setMetamaskAccount] = useState('');
//   const handleMetamaskAccountInput = (event) => {
//     setMetamaskAccount(event.target.value);
//   };
//   const handleRegisterMetamaskAccount = async () => {
//     console.log('handleRegisterMetamaskAccount');
//     const { accessToken } = reduxStore.getState().userReducer;
//     console.log('accessToken', accessToken);
//     // console.log("accessToken")
//     const did = window.electron.store.get('did');
//     console.log('account', metamaskAccount);
//     const registerMetamaskAccountRequest = {
//       did,
//       address: metamaskAccount,
//     };
//     const response = await registerMetamaskAccount(
//       accessToken,
//       registerMetamaskAccountRequest
//     );
//     const data = await response?.json();
//     console.log('register response', data);

//     // const address = accounts
//     // const address = "0x1Bd80AcA1E94c2aF75F853ab32beDcf21eb1B44f"
//     // const amount = "0.00001"
//     // const withdrawRequest =
//     // {
//     //   "did": did,
//     //   "address": address,
//     //   "amount": amount
//     // }
//     // console.log("withdraw response", data)
//   };

//   const handleOpenMetamaskWeb = async () => {
//     console.log('handleOpenMetamaskWeb');
//     const response = await window.electron.openLinkPlease();
//     console.log('response', response);
//   };

//   const withdraw = async () => {
//     console.log('handleOpenMetamaskWeb');
//     const response = await window.electron.openLinkPlease();
//     console.log('response', response);
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100%',
//         marginTop: '2rem',
//       }}
//     >
//       <input
//         type="text"
//         placeholder="Enter some text"
//         value={metamaskAccount}
//         onChange={handleMetamaskAccountInput}
//       />
//       {/* <Typography fontSize="24px">Please approve Metamask</Typography> */}
//       <Button onClick={handleRegisterMetamaskAccount}>
//         Register Metamask Account
//       </Button>
//       <Button onClick={handleOpenMetamaskWeb}>Make Payment</Button>
//       <Button onClick={handleOpenMetamaskWeb}>Withdraw Balance</Button>
//     </Box>
//   );
