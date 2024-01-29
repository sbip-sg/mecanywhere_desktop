import { bindActionCreators, ActionCreator, AnyAction } from 'redux';
import reduxStore from './store';

const setAuthenticated: ActionCreator<AnyAction> = (payload: boolean) => ({
  type: 'setAuthenticated',
  payload,
});

const setAccessToken: ActionCreator<AnyAction> = (payload: string) => ({
  type: 'setAccessToken',
  payload,
});

const setRefreshToken: ActionCreator<AnyAction> = (payload: string) => ({
  type: 'setRefreshToken',
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

const setColor: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setColor',
  payload,
});

const setImportingAccount: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setImportingAccount',
  payload,
});

const setTransactionDetails: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setTransactionDetails',
  payload,
});

const setDeviceStats: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setDeviceStats',
  payload,
});

const boundToDoActions = bindActionCreators(
  {
    setAuthenticated,
    setAccessToken,
    setRefreshToken,
    addJob,
    setJobs,
    addJobResults,
    setJobResults,
    setColor,
    setTransactionDetails,
    setImportingAccount,
    setDeviceStats,
  },
  reduxStore.dispatch
);

export default boundToDoActions;
