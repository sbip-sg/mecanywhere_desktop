import actions from "../states/actionCreators";
import { registerUser, deregisterUser, registerHost, deregisterHost, assignHost } from '../../services/RegistrationServices';
import { reduxStore } from '../states/store';

export const handleRegisterClient= async () => {
    console.log("enter register user")
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    console.log("did", did)
    console.log("credential", credential)
    if (credential) {
        actions.setCredential(credential);
        const response = await registerUser(did, credential);
        console.log("res", response)
        const { access_token } = response;
        actions.setUserAccessToken(access_token);
        console.log("responseUser", response)
        console.log("access", access_token)
        console.log("did", did)
        const assignmentRes = await assignHost(access_token, did);
        console.log('assignment response:', assignmentRes);
        if (assignmentRes) {
          const { queue } = assignmentRes;
          window.electron.startPublisher(queue);
        }
        // if (response.ok) {
        //     window.electron.startPublisher('rpc_queue');
        // }
    }
};

export const handleRegisterHost = async () => {
    console.log("enter register host")
    const credential = JSON.parse(window.electron.store.get('credential'));
    const did = window.electron.store.get('did');
    if (credential && did) {
        actions.setCredential(credential);
        const response = await registerHost(did, credential);
        console.log("res", response)
        const { access_token } = response;
        actions.setHostAccessToken(access_token);
        console.log("responseHost", response)
        if (response) {
            window.electron.startConsumer(did);
        }
    }
};

export const handleDeregisterClient= async () => {
    console.log("enter deregister user")
    const did = window.electron.store.get('did');
    const accessToken = reduxStore.getState().accountUser.userAccessToken;
    const response = await deregisterUser(accessToken, did)
    console.log("response", response);
    if (response && response.ok) {
        actions.setUserAccessToken("");
    }
};

export const handleDeregisterHost= async () => {
    console.log("enter deregister host")
    const did = window.electron.store.get('did');
    const accessToken = reduxStore.getState().accountUser.hostAccessToken;
    const response = await deregisterHost(accessToken, did)
    console.log("response", response);
    if (response && response.ok) {
        actions.setHostAccessToken("");
    }
};
