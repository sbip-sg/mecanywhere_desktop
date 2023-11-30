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

const setRole: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setRole',
  payload,
});

const setColor: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setColor',
  payload,
});

const setTransactionDetails: ActionCreator<AnyAction> = (payload: any) => ({
  type: 'setTransactionDetails',
  payload,
});

const boundToDoActions = bindActionCreators(
  {
    setAuthenticated,
    setAccessToken,
    addJob,
    setJobs,
    addJobResults,
    setJobResults,
    setRole,
    setColor,
    setTransactionDetails,
  },
  reduxStore.dispatch
);

export default boundToDoActions;
