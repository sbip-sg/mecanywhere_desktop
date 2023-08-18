import actions from '../redux/actionCreators';
import {
  registerUser,
  deregisterUser,
  registerHost,
  deregisterHost,
  assignHost,
} from '../services/RegistrationServices';
import reduxStore from '../redux/store';

export const handleRegisterClient = async () => {
  const credential = JSON.parse(window.electron.store.get('credential'));
  const did = window.electron.store.get('did');
  if (credential && did) {
    const response = await registerUser(did, credential);
    const { access_token } = response;
    const assignmentRes = await assignHost(access_token, did);
    if (assignmentRes) {
      const { queue } = assignmentRes;
      if (queue == '') {
        throw new Error('No host available');
      }
      window.electron.startPublisher(queue);
      actions.setCredential(credential);
      actions.setUserAccessToken(access_token);
      console.log('host assigned');
    } else {
      throw new Error('Host assignment failed');
    }
  } else {
    throw new Error('Credential not found');
  }
};

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

export const handleDeregisterClient = async () => {
  const did = window.electron.store.get('did');
  const accessToken = reduxStore.getState().accountUser.userAccessToken;
  const response = await deregisterUser(accessToken, did);
  if (response && response.ok) {
    actions.setUserAccessToken('');
  } else {
    throw new Error('Deregistration failed');
  }
};

export const handleDeregisterHost = async () => {
  const did = window.electron.store.get('did');
  const accessToken = reduxStore.getState().accountUser.hostAccessToken;
  const response = await deregisterHost(accessToken, did);
  if (response && response.ok) {
    actions.setHostAccessToken('');
  } else {
    throw new Error('Deregistration failed');
  }
};
