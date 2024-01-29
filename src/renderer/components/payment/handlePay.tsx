// import { AbiItem } from '../../../web3-utils';
// import { AbiItem } from '../../../node_modules/web3-utils';
// import { AbiItem } from '../../../node_modules/web3-utils';
import Web3 from '../../../node_modules/web3';
import paymentContractAbi from './PaymentContract.json';

const handlePay = async (
  provider: any,
  senderAddress: string,
  contractAddress: string,
  amount: number
) => {
  try {
    const web3 = new Web3(provider);
    const paymentContract = paymentContractAbi;
    const contract = new web3.eth.Contract(paymentContract, contractAddress);
    const did = window.electron.store.get('did');
    const amountToSend = web3.utils.toWei(amount.toString(), 'ether');
    await contract.methods.pay(did).send({
      from: senderAddress,
      value: amountToSend,
    });
    console.log('Payment successful.');
  } catch (error) {
    console.error('Payment error', error);
  }
};

export default handlePay;
