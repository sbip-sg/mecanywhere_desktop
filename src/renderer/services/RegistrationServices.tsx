import { handle401Error } from './TokenRefreshServices';
import Web3 from '../../node_modules/web3';
import { MetaMaskSDK, SDKProvider } from '../../node_modules/@metamask/sdk';

const url = process.env.REGISTRATION_SERVICE_API_URL;

export async function createAccount(data: any): Promise<any> {
  try {
    const response = await fetch(`${url}/create_account/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const res = await response.json();
    console.log('account res', res);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function authenticate(did: string, credential: object) {
  console.log('did', did);
  console.log('credential', credential);
  try {
    const response = await fetch(`${url}/authentication/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ did, credential }),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return { error };
  }
}

export async function registerHost(
  publicKey: string,
  publicKeyType: number,
  blockTimeoutLimit: number,
  provider: any,
  retryCount = 0
) {
  try {
    const web3 = new Web3(provider);
    const hostContract = hostContractAbi;
    const contract = new web3.eth.Contract(
      hostContract,
      '0x77FBb5565331b0d4c8E5A6F40181F95239fcaA16'
    );
    // const amountToSend = web3.utils.toWei(amount.toString(), 'ether');
    await contract.methods
      .registerHost(publicKey, publicKeyType, blockTimeoutLimit)
      .send({ from: '0x67c9badC4765ff6bF78130D559315854379f8a00' })
      .on('transactionHash', (hash: any) => {
        console.log('Transaction Hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction Receipt:', receipt);
      })
      .on('error', (error: any) => {
        console.error('Transaction Error:', error);
        throw new Error(error);
      });
    console.log('Register successful.');
    return true;
  } catch (error) {
    console.error('Register error', error);
  }
}

export async function deregisterHost(provider: any, retryCount = 0) {
  try {
    const web3 = new Web3(provider);
    const hostContract = hostContractAbi;
    const contract = new web3.eth.Contract(
      hostContract,
      '0x77FBb5565331b0d4c8E5A6F40181F95239fcaA16'
    );
    await contract.methods
      .deleteHost('0x67c9badC4765ff6bF78130D559315854379f8a00')
      .send({ from: '0x67c9badC4765ff6bF78130D559315854379f8a00' })
      .on('transactionHash', (hash: any) => {
        console.log('Transaction Hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction Receipt:', receipt);
      })
      .on('error', (error: any) => {
        console.error('Transaction Error:', error);
        throw new Error(error);
      });
    console.log('Deregister successful.');
    return true;
  } catch (error) {
    console.error('Deregister error', error);
  }
}

export async function registerClient(token: string, did: string) {
  try {
    const response = await fetch(`${url}/registration/register_client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });

    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function deregisterClient(token: string, did: string) {
  try {
    const response = await fetch(`${url}/registration/deregister_client`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ did }),
    });
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return true;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
