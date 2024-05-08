import { useEffect } from 'react';
import { getAccount } from 'renderer/services/PymecaService';
import actions from '../redux/actionCreators';

const usePymecaAccountHook = () => {
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const account = await getAccount();
        actions.setAuthenticated(true);
        window.electron.store.set('did', account);
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    };
    fetchAccount();
  });
};

export default usePymecaAccountHook;
