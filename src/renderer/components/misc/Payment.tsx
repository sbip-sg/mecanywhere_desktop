import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { registerMetamaskAccount, withdrawFromContract, depositToContract } from "renderer/services/PaymentServices";
import reduxStore from '../../redux/store';
import {useState} from 'react'

const Payment = () => {
    const [metamaskAccount, setMetamaskAccount] = useState("");
    const handleMetamaskAccountInput = (event) => {
        setMetamaskAccount(event.target.value);
    };
    const handleRegisterMetamaskAccount = async () => {
        console.log("handleRegisterMetamaskAccount")
        const accessToken = reduxStore.getState().accountUser.userAccessToken;
        console.log("accessToken", accessToken)
        const did = window.electron.store.get('did');
        console.log("account", metamaskAccount)
        const registerMetamaskAccountRequest = {
            "did": did,
            "address": metamaskAccount
        }
        const response = await registerMetamaskAccount(accessToken, registerMetamaskAccountRequest);
        const data = await response?.json();
        console.log("register response", data)

        // const address = accounts
        // const address = "0x1Bd80AcA1E94c2aF75F853ab32beDcf21eb1B44f"
        // const amount = "0.00001"
        // const withdrawRequest = 
        // {
        //   "did": did,
        //   "address": address,
        //   "amount": amount
        // }
        // console.log("withdraw response", data)
    }

    const handleOpenMetamaskWeb = async () => {
        console.log("handleOpenMetamaskWeb")
        const response = await window.electron.openLinkPlease()
        console.log("response", response)
    }

    const withdraw = async () => {
        console.log("handleOpenMetamaskWeb")
        const response = await window.electron.openLinkPlease()
        console.log("response", response)
    }

    return (
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            marginTop: '2rem',
        }}
        >
            <input
        type="text"
        placeholder="Enter some text"
        value={metamaskAccount}
        onChange={handleMetamaskAccountInput}
      />
        {/* <Typography fontSize="24px">Please approve Metamask</Typography> */}
        <Button onClick={handleRegisterMetamaskAccount}>Register Metamask Account</Button>
        <Button onClick={handleOpenMetamaskWeb}>Make Payment</Button>
        <Button onClick={handleOpenMetamaskWeb}>Withdraw Balance</Button>
        </Box>
    );
};

export default Payment;
