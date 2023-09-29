import actions from '../redux/actionCreators';
import {
  registerHost,
  deregisterHost,
} from '../services/RegistrationServices';
import reduxStore from '../redux/store';

export const handleRegisterHost = async () => {
  const credential = JSON.parse(window.electron.store.get('credential'));
  const did = window.electron.store.get('did');
  if (credential && did) {
    actions.setCredential(credential);
    const response = await registerHost(did, credential);
    const { access_token } = response;
    actions.setHostAccessToken(access_token);
    if (response) {
      window.electron.startConsumer(did);
    } else {
      throw new Error('Host registration failed');
    }
  } else {
    throw new Error('Credential not found');
  }
};

export const handleDeregisterHost = async () => {
  const did = window.electron.store.get('did');
  const accessToken = reduxStore.getState().accountUser.hostAccessToken;
  const response = await deregisterHost(accessToken, did);
  if (response && response.ok) {
    actions.setHostAccessToken('');
    window.electron.stopConsumer(did);
  } else {
    throw new Error('Deregistration failed');
  }
};
