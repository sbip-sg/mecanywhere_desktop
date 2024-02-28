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

const setDataEntry: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setDataEntry',
  payload,
});

const setDeviceStats: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setDeviceStats',
  payload,
});

const addToBuilt: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'addToBuilt',
  payload,
});

const removeFromBuilt: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'removeFromBuilt',
  payload,
});

const addToTested: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'addToTested',
  payload,
});

const removeFromTested: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'removeFromTested',
  payload,
});

const addToActivated: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'addToActivated',
  payload,
});

const removeFromActivated: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'removeFromActivated',
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
    setDataEntry,
    setImportingAccount,
    setDeviceStats,
    addToBuilt,
    removeFromBuilt,
    addToTested,
    removeFromTested,
    addToActivated,
    removeFromActivated,
  },
  reduxStore.dispatch
);

export default boundToDoActions;
