import Web3 from 'web3';
import hostContract from '../contracts/artifacts/contracts/HostContract.sol/MecaHostContract.json';

const hostContractAddr = process.env.HOST_CONTRACT_ADDRESS;
const hostContractAbi = hostContract.abi;

export async function registerHostForTower(
  publicKey: string,
  publicKeyType: number,
  blockTimeoutLimit: number,
  stake: number,
  provider: any,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(hostContractAbi, hostContractAddr);
    const amountToSend = web3.utils.toWei(stake.toString(), 'ether');
    await contract.methods
      .registerHostForTower(publicKey, publicKeyType, blockTimeoutLimit)
      .send({ from: sender, value: amountToSend })
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

export async function deregisterHost(
  provider: any,
  host: string,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(hostContractAbi, hostContractAddr);
    await contract.methods
      .deleteHost(host)
      .send({ from: sender })
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
