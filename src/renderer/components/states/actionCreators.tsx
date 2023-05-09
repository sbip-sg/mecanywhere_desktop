import { bindActionCreators } from 'redux';
import { reduxStore } from './store';

const setPublicKey = (payload) => ({ type: 'setPublicKey', payload });
const setDID = (payload) => ({ type: 'setDID', payload });
const setCredential = (payload) => ({ type: 'setCredential', payload });
const setAuthenticated = (payload) => ({ type: 'setAuthenticated', payload });
const setUserAccessToken = (payload) => ({ type: 'setUserAccessToken', payload });
const setHostAccessToken = (payload) => ({ type: 'setHostAccessToken', payload });

const boundToDoActions = bindActionCreators(
  {
    setPublicKey: setPublicKey,
    setDID: setDID,
    setCredential: setCredential,
    setAuthenticated: setAuthenticated,
    setUserAccessToken: setUserAccessToken,
    setHostAccessToken: setHostAccessToken,
  },
  reduxStore.dispatch
);

export default boundToDoActions;
