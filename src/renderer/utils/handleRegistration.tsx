import actions from '../redux/actionCreators';
import {
  registerUser,
  deregisterUser,
  registerHost,
  deregisterHost,
  assignHost,
} from '../services/RegistrationServices';
import reduxStore from '../redux/store';
import {
  pauseExecutor,
  unpauseExecutor,
} from 'renderer/services/ExecutorServices';

//TODO move assignhost
export const handleRegisterClient = async (containerRef: string) => {
  console.log('handleRegisterClient');
  const credential = JSON.parse(window.electron.store.get('credential'));
  const did = window.electron.store.get('did');
  if (credential && did) {
    console.log(credential, did);
    const response = await registerUser(did, credential);
    console.log('responseclient', response);
    const { access_token } = response;
    const assignmentRes = await assignHost(access_token, did);
    if (assignmentRes) {
      const { queue } = assignmentRes;
      if (queue == '') {
        throw new Error('No host available');
      }
      window.electron.startPublisher(queue, containerRef);
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

  console.log('handleRegisterHost');
  const credential = JSON.parse(window.electron.store.get('credential'));
  const did = window.electron.store.get('did');
  if (credential && did) {
    console.log(credential, did);
    actions.setCredential(credential);
    const response = await registerHost(did, credential);
    const { access_token } = response;
    actions.setHostAccessToken(access_token);
    const unpauseResponse = await unpauseExecutor();
    console.log(unpauseResponse)
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
    window.electron.stopPublisher();
  } else {
    throw new Error('Deregistration failed');
  }
};

export const handleDeregisterHost = async () => {
  const did = window.electron.store.get('did');
  const accessToken = reduxStore.getState().accountUser.hostAccessToken;
  const pauseResponse = await pauseExecutor();
  console.log('pauseResponse from disabling sharing', pauseResponse);
  const response = await deregisterHost(accessToken, did);
  if (response && response.ok) {
    actions.setHostAccessToken('');
    console.log('deregistersuccess', response);
  } else {
    throw new Error('Deregistration failed');
  }
};
