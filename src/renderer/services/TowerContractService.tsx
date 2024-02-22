import Web3 from 'web3';
import towerContract from '../contracts/artifacts/contracts/TowerContract.sol/MecaTowerContract.json';

const towerContractAddr = process.env.TOWER_CONTRACT_ADDRESS;
const towerContractAbi = towerContract.abi;

export async function registerMeForTower(
  towerAddress: string,
  provider: any,
  sender: string
) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(towerContractAbi, towerContractAddr);
    await contract.methods
      .registerMeForTower(towerAddress)
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
    console.log('Register successful.');
    return true;
  } catch (error) {
    console.error('Register error', error);
  }
}

export async function getTowers(provider: any) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(towerContractAbi, towerContractAddr);
    const towers = await contract.methods.getTowers().call();
    return towers;
  } catch (error) {
    console.error('Get towers error', error);
  }
}
