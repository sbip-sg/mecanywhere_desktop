import { combineReducers } from 'redux';
import { Job, JobResult } from 'renderer/utils/jobs';

interface UserState {
  authenticated: boolean;
  accessToken: string;
}

const initialUserState: UserState = {
  authenticated: false,
  accessToken: '',
};

interface RoleState {
  role: string;
}

const initialRoleState: RoleState = {
  role: '',
};

interface JobsState {
  jobs: Job[];
  jobResults: JobResult[];
}

const initialJobsState: JobsState = {
  jobs: [],
  jobResults: [],
};

export const transactionDetailsReducer = (state = {}, action: any) => {
  switch (action.type) {
    case 'setTransactionDetails':
      return {
        ...state,
        transactionDetails: action.payload,
      };
    default:
      return state;
  }
};

export const roleReducer = (
  state: RoleState = initialRoleState,
  action: any
) => {
  switch (action.type) {
    case 'setRole':
      return {
        ...state,
        role: action.payload,
      };
    default:
      return state;
  }
};

export const userReducer = (
  state: UserState = initialUserState,
  action: any
): UserState => {
  switch (action.type) {
    case 'setAuthenticated':
      return {
        ...state,
        authenticated: action.payload,
      };
    case 'setAccessToken':
      return {
        ...state,
        accessToken: action.payload,
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
  jobs: jobsReducer,
  roleReducer: roleReducer,
  transactionDetailsReducer: transactionDetailsReducer,
  userReducer: userReducer,
});

export default reducers;
