import { bindActionCreators, ActionCreator, AnyAction } from 'redux';
import reduxStore from './store';

const setPublicKey: ActionCreator<AnyAction> = (payload: string) => ({
  type: 'setPublicKey',
  payload,
});
const setDID: ActionCreator<AnyAction> = (payload: string) => ({
  type: 'setDID',
  payload,
});
const setCredential: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setCredential',
  payload,
});
const setAuthenticated: ActionCreator<AnyAction> = (payload: boolean) => ({
  type: 'setAuthenticated',
  payload,
});
const setUserAccessToken: ActionCreator<AnyAction> = (payload: string) => ({
  type: 'setUserAccessToken',
  payload,
});
const setHostAccessToken: ActionCreator<AnyAction> = (payload: string) => ({
  type: 'setHostAccessToken',
  payload,
});
const addJob: ActionCreator<AnyAction> = (id: string, content: string) => ({
  type: 'addJob',
  id,
  content,
});
const setJobs: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setJobs',
  payload,
});
const addJobResults: ActionCreator<AnyAction> = (
  id: string,
  content: string
) => ({ type: 'addJobResults', id, content });
const setJobResults: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setJobResults',
  payload,
});
const setIsProvider: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setIsProvider',
  payload,
});

const setTransactionDetails: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setTransactionDetails',
  payload,
});
const boundToDoActions = bindActionCreators(
  {
    setTransactionDetails,
    setPublicKey,
    setDID,
    setCredential,
    setAuthenticated,
    setUserAccessToken,
    setHostAccessToken,
    addJob,
    setJobs,
    addJobResults,
    setJobResults,
    setIsProvider,
  },
  reduxStore.dispatch
);

export default boundToDoActions;
