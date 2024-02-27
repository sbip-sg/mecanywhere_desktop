import Web3 from '../../node_modules/web3';
import taskContract from '../contracts/MecaTaskContract.json';

const taskContractAddr = process.env.TASK_CONTRACT_ADDRESS;
const taskContractAbi = taskContract.abi;

export default async function getTasks(provider: any, sender: string) {
  try {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(taskContractAbi, taskContractAddr);
    const tasks = await contract.methods.getTasks(sender).call();
    return tasks;
  } catch (error) {
    console.error('Get tasks error', error);
  }
}
