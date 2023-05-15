import actions from "../states/actionCreators";
import { registerUser, deregisterUser, registerHost, deregisterHost} from '../../services/RegistrationServices';
import { reduxStore } from '../states/store';

export const handleRegisterClient= async () => {
    console.log("enter register user")
    const credential = JSON.parse(window.electron.store.get('credential'));
    if (credential) {
        actions.setCredential(credential);
        const response = await registerUser({ credential });
        const { access_token } = response;
        actions.setUserAccessToken(access_token);
        console.log("responseUser", response)
        if (response.ok) {
            window.electron.startPublisher('rpc_queue');
        }
    }
};

export const handleRegisterHost = async () => {
    console.log("enter register host")
    const credential = JSON.parse(window.electron.store.get('credential'));
    if (credential) {
        actions.setCredential(credential);
        const response = await registerHost({ credential });
        const { access_token } = response;
        actions.setHostAccessToken(access_token);
        console.log("responseHost", response)
        if (response.ok) {
            window.electron.startConsumer('rpc_queue');
        }
    }
};

export const handleDeregisterClient= async () => {
    console.log("enter deregister user")
    const response = await deregisterUser(reduxStore.getState().accountUser.userAccessToken)
    console.log("response", response);
    actions.setUserAccessToken("");
};

export const handleDeregisterHost= async () => {
    console.log("enter deregister host")
    const response = await deregisterHost(reduxStore.getState().accountUser.hostAccessToken)
    console.log("response", response);
    actions.setHostAccessToken("")
};