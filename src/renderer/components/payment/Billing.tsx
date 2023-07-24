import { useEffect, useState, useRef } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { Box } from "@mui/material";
import QRCode from 'qrcode';
import { withdrawFromContract, depositToContract } from "renderer/services/PaymentServices";
import reduxStore from '../../redux/store';
import Web3 from 'web3';

const QRCodeComponent = ({ uri }: { uri: string }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, uri, (error) => {
      if (error) {
        console.error('Error generating QR code:', error);
      }
    });
  }, [uri]);

  return <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <canvas ref={canvasRef} />
  </Box>;
};

// const walletConnectModal = new WalletConnectModal({
//   projectId: process.env.WALLETCONNECT_PROJECT_ID,
//   // `standaloneChains` can also be specified when calling `walletConnectModal.openModal(...)` later on.
//   standaloneChains: ['eip155:1']
// })

function Billing() {
  const [signClient, setSignClient] = useState();
  const [sessions, setSessions] = useState([]);
  const [uri, setUri] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [txnHash, setTxnHash] = useState();

  async function createClient() {
    try {
      const client = await SignClient.init({
        projectId: process.env.WALLETCONNECT_PROJECT_ID,
      });
      setSignClient(client);
      await subscribeToEvents(client);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleConnect() {
    if (!signClient) throw Error("Cannot connect. Sign Client is not created");
    try {
      const { uri, approval } = await signClient.connect({
        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData'
            ],
            chains: ['eip155:5'],
            events: ['chainChanged', 'accountsChanged']
          }
        }
      })
      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        console.log("uri", uri)
        setUri(uri)
        console.log("approval", approval)
        // walletConnectModal.openModal({ uri })
        // Await session approval from the wallet.
        const session = await approval()
        console.log("session", session)
        // Handle the returned session (e.g. update UI to "connected" state).
        // * You will need to create this function *
        onSessionConnect(session)
        // Close the QRCode modal in case it was open.
        // walletConnectModal.closeModal()
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function onSessionConnect(session) {
    if (!session) throw Error("session doesn't exist");
    try {
      setSessions(session);
      console.log("session", session)
      setAccounts(session.namespaces.eip155.accounts[0].slice(9));
      console.log("session.namespaces.eip155.accounts[0].slice(9)", session.namespaces.eip155.accounts[0].slice(9))
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDisconnect() {
    try {
      await signClient.disconnect({
        topic: sessions.topic,
        code: 6000,
        message: "User disconnected",
      });
      reset();
    } catch (e) {
      console.log(e);
    }
  }

  async function subscribeToEvents(client) {
    if (!client)
      throw Error("No events to subscribe to b/c the client does not exist");

    try {
      client.on("session_delete", () => {
        console.log("user disconnected the session from their wallet");
        reset();
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSend() {
    try {
      const tx = {
        from: accounts,
        to: "0xE24F8f5b84F2c90BAF938130b2B21C8e9CcA82CC",
        data: "0x",
        gasPrice: "0x029104e28c",
        gasLimit: "0x5208",
        value: "0x00",
      };
      console.log("aaaaaaa")
      const result = await signClient.request({
        topic: sessions.topic,
        request: {
          method: "eth_sendTransaction",
          params: [tx]
        },
        chainId: "eip155:5"
      })
      console.log("result", result)
      setTxnHash(result)
    } catch (e) {
      console.log(e);
    }
  }
  
  async function handleWithdrawFromContract() {
    const accessToken = reduxStore.getState().accountUser.userAccessToken;
    // console.log("accessToken", accessToken)
    const did = window.electron.store.get('did');
    console.log("account", accounts)
    const address = accounts
    // const address = "0x1Bd80AcA1E94c2aF75F853ab32beDcf21eb1B44f"
    const amount = "0.00001"
    const withdrawRequest = 
    {
      "did": did,
      "address": address,
      "amount": amount
    }
    const response = await withdrawFromContract(accessToken, withdrawRequest);
    const data = await response.json();
    console.log("withdraw response", response)
    console.log("withdraw response", data)
  }

  async function handleDepositToContract() {
    const did = window.electron.store.get('did');
    const accessToken = reduxStore.getState().accountUser.userAccessToken;
    const depositRequest = {
      "did": did
    }
    const response = await depositToContract(accessToken, depositRequest);
    const {contractAddress, contractAbi} = await response.json();
    console.log("contractAddress", contractAddress)
    console.log("contractAbi", contractAbi)
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const paymentAmount = "0.00001";
    const paymentWei = web3.utils.toWei(paymentAmount, 'ether');
    try {
      await contract.methods.pay(did).send({ 
        from: accounts[0],
        value: paymentWei 
      });
      console.log('Transaction executed.');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }


  const reset = () => {
    setAccounts([]);
    setSessions([]);
  };

  useEffect(() => {
    if (!signClient) {
      createClient();
    }
  }, [signClient, createClient]);

  return (
    <div className="Billing">
      <h1>Payment</h1>
      {uri && <QRCodeComponent uri={uri}/>}
      {accounts.length ? (
        <>
          <p>{accounts}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
          <button onClick={handleSend}>Send</button>
          <button onClick={handleWithdrawFromContract}>Withdraw</button>
          { txnHash && <p>View your transaction <a href={`https://goerli.etherscan.io/tx/${txnHash}`} target="_blank" rel="noreferrer">here</a>!</p>}
        </>
      ) : (
        <button onClick={handleConnect} disabled={!signClient}>
          Connect
        </button>
      )}
    </div>
  );
}

export default Billing;
