import { bindActionCreators, ActionCreator, AnyAction } from 'redux';
import reduxStore from './store';

const setAuthenticated: ActionCreator<AnyAction> = (payload: boolean) => ({
  type: 'setAuthenticated',
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

const setSDKProvider: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setSDKProvider',
  payload,
});

const setSDKProviderConnected: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setSDKProviderConnected',
  payload,
});

const setPaymentAccounts: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setPaymentAccounts',
  payload,
});

const setPaymentChainId: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setPaymentChainId',
  payload,
});

const addToDownloaded: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'addToDownloaded',
  payload,
});

const removeFromDownloaded: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'removeFromDownloaded',
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

const setExecutorRunning: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setExecutorRunning',
  payload,
});

const registerForTower: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'registerForTower',
  payload,
});

const unregisterForTower: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'unregisterForTower',
  payload,
});

const addUnregisteredTower: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'addUnregisteredTower',
  payload,
});

const addRegisteredTower: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'addRegisteredTower',
  payload,
});

const setTowerList: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setTowerList',
  payload,
});

const boundToDoActions = bindActionCreators(
  {
    setAuthenticated,
    addJob,
    setJobs,
    addJobResults,
    setJobResults,
    setColor,
    setDataEntry,
    setImportingAccount,
    setDeviceStats,
    setSDKProvider,
    setSDKProviderConnected,
    setPaymentAccounts,
    setPaymentChainId,
    addToDownloaded,
    removeFromDownloaded,
    addToBuilt,
    removeFromBuilt,
    addToTested,
    removeFromTested,
    addToActivated,
    removeFromActivated,
    setExecutorRunning,
    registerForTower,
    unregisterForTower,
    addUnregisteredTower,
    addRegisteredTower,
    setTowerList,
  },
  reduxStore.dispatch
);

export default boundToDoActions;
