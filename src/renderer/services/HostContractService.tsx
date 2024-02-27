import Web3 from '../../node_modules/web3';
import hostContract from '../contracts/MecaHostContract.json';

const hostContractAddr = process.env.HOST_CONTRACT_ADDRESS;
const hostContractAbi = hostContract.abi;

export async function registerHost(
  publicKeyByteArray: string[],
  blockTimeoutLimit: number,
  stake: number,
  provider: any,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(hostContractAbi, hostContractAddr);
    const amountToSend = web3.utils.toWei(stake, 'ether');
    await contract.methods
      .registerAsHost(publicKeyByteArray, blockTimeoutLimit)
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

export async function updateBlockTimeoutLimit(
  blockTimeoutLimit: number,
  provider: any,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(hostContractAbi, hostContractAddr);
    await contract.methods
      .updateBlockTimeoutLimit(blockTimeoutLimit)
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
    console.log('Update successful.');
    return true;
  } catch (error) {
    console.error('Update error', error);
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

export async function addTask(
  ipfs_hash: string,
  block_timeout: number,
  task_fee: number,
  provider: any,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(hostContractAbi, hostContractAddr);
    await contract.methods
      .addTask(ipfs_hash, block_timeout, task_fee)
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
    console.log('Add task successful.');
    return true;
  } catch (error) {
    console.error('Add task error', error);
  }
}

export async function deleteTask(
  task_hash: string,
  provider: any,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(hostContractAbi, hostContractAddr);
    await contract.methods
      .deleteTask(task_hash)
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
    console.log('Delete task successful.');
    return true;
  } catch (error) {
    console.error('Delete task error', error);
  }
}
