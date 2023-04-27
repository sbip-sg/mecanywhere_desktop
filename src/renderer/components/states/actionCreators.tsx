import { bindActionCreators } from 'redux';
import { store } from './store';

const setUserPublicKey = (payload) => ({ type: 'setUserPublicKey', payload });
const setUserDID = (payload) => ({ type: 'setUserDID', payload });
const setHostPublicKey = (payload) => ({ type: 'setHostPublicKey', payload });
const setHostDID = (payload) => ({ type: 'setHostDID', payload });

const boundToDoActions = bindActionCreators(
  {
    setUserPublicKey: setUserPublicKey,
    setUserDID: setUserDID,
    setHostPublicKey: setHostPublicKey,
    setHostDID: setHostDID
  },
  store.dispatch
);

export default boundToDoActions;
