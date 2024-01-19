import reduxStore from 'renderer/redux/store';
import { withdrawFromContract } from 'renderer/services/PaymentServices';

const handleWithdraw = async (destinationAddress: string, amount: number) => {
  try {
    const did = window.electron.store.get('did');
    const { accessToken } = reduxStore.getState().userReducer;
    const withdrawRequest = {
      did,
      address: destinationAddress,
      amount,
    };
    const withdrawResponse = await withdrawFromContract(
      accessToken,
      withdrawRequest
    );
    console.log('handleWithdrawResponse', withdrawResponse);
  } catch (error) {
    console.error('Withdrawal error', error);
    throw error;
  }
};

export default handleWithdraw;
