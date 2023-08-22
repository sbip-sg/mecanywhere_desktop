import { combineReducers } from 'redux';
import { Job, JobResult } from 'renderer/utils/jobs';

export interface AccountUserState {
  publicKey: string;
  did: string;
  authenticated: boolean;
  userAccessToken: string;
  hostAccessToken: string;
}

export const initialAccountUserState: AccountUserState = {
  publicKey: '',
  did: '',
  authenticated: false,
  userAccessToken: '',
  hostAccessToken: '',
};

export const initialProviderState = {
  isProvider: false,
};

interface JobsState {
  jobs: Job[];
  jobResults: JobResult[];
}

const initialJobsState: JobsState = {
  jobs: [],
  jobResults: [],
};

export const isProviderReducer = (
  state = initialProviderState,
  action: any
) => {
  switch (action.type) {
    case 'setIsProvider':
      return {
        ...state,
        isProvider: action.payload,
      };
    default:
      return state;
  }
};

export const accountUserReducer = (
  state: AccountUserState = initialAccountUserState,
  action: any
): AccountUserState => {
  switch (action.type) {
    case 'setPublicKey':
      return {
        ...state,
        publicKey: action.payload,
      };
    case 'setDID':
      return {
        ...state,
        did: action.payload,
      };
    case 'setAuthenticated':
      return {
        ...state,
        authenticated: action.payload,
      };
    case 'setUserAccessToken':
      return {
        ...state,
        userAccessToken: action.payload,
      };
    case 'setHostAccessToken':
      return {
        ...state,
        hostAccessToken: action.payload,
      };
    default:
      return state;
  }
};

const jobsReducer = (
  state: JobsState = initialJobsState,
  action: any
): JobsState => {
  switch (action.type) {
    case 'addJob':
      const newJob = {
        id: action.id,
        content: action.content,
      };
      return {
        ...state,
        jobs: [...state.jobs, newJob],
      };
    case 'setJobs':
      return {
        ...state,
        jobs: [action.payload],
      };
    case 'addJobResults':
      const newJobResult = {
        id: action.id,
        content: action.content,
      };
      return {
        ...state,
        jobResults: [...state.jobResults, newJobResult],
      };
    case 'setJobResults':
      return {
        ...state,
        jobResults: [action.payload],
      };
    default:
      return state;
  }
};

const reducers = combineReducers({
  accountUser: accountUserReducer,
  jobs: jobsReducer,
  isProvider: isProviderReducer,
});

export default reducers;
