import { bindActionCreators, ActionCreator, AnyAction } from 'redux';
import reduxStore from './store';

const setPublicKey: ActionCreator<AnyAction> = (payload: string) => ({ type: 'setPublicKey', payload });
const setDID: ActionCreator<AnyAction> = (payload: string) => ({ type: 'setDID', payload });
const setCredential: ActionCreator<AnyAction> = (payload: any) => ({ type: 'setCredential', payload });
const setAuthenticated: ActionCreator<AnyAction> = (payload: boolean) => ({ type: 'setAuthenticated', payload });
const setUserAccessToken: ActionCreator<AnyAction> = (payload: string) => ({ type: 'setUserAccessToken', payload });
const setHostAccessToken: ActionCreator<AnyAction> = (payload: string) => ({ type: 'setHostAccessToken', payload });

const boundToDoActions = bindActionCreators(
  {
    setPublicKey,
    setDID,
    setCredential,
    setAuthenticated,
    setUserAccessToken,
    setHostAccessToken,
  },
  reduxStore.dispatch
);

export default boundToDoActions;