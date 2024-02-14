import { combineReducers } from 'redux';
import { Job, JobResult } from 'renderer/utils/jobs';
import { SDKProvider } from '../../node_modules/@metamask/sdk';

interface UserState {
  authenticated: boolean;
  accessToken: string;
  refreshToken: string;
}

const initialUserState: UserState = {
  authenticated: false,
  accessToken: '',
  refreshToken: '',
};

interface ThemeState {
  color: string;
}

const initialThemeState: ThemeState = {
  color: 'light',
};

interface ImportingAccountState {
  importingAccount: boolean;
}

const initialImportingAccountState: ImportingAccountState = {
  importingAccount: false,
};

interface JobsState {
  jobs: Job[];
  jobResults: JobResult[];
}

const initialJobsState: JobsState = {
  jobs: [],
  jobResults: [],
};

interface DeviceStats {
  totalCpuCores: number;
  totalMem: number;
  totalGpus: number;
  gpuModel: string;
}

const initialDeviceStats: DeviceStats = {
  totalCpuCores: 4,
  totalMem: 8192,
  totalGpus: 0,
  gpuModel: '',
};

interface SDKProviderState {
  sdkProvider: SDKProvider | null;
  connected: boolean;
}

const initialSDKProviderState: SDKProviderState = {
  sdkProvider: null,
  connected: false,
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
    case 'setRefreshToken':
      return {
        ...state,
        refreshToken: action.payload,
      };
    default:
      return state;
  }
};

export const themeReducer = (
  state: ThemeState = initialThemeState,
  action: any
): ThemeState => {
  switch (action.type) {
    case 'setColor':
      return {
        ...state,
        color: action.payload,
      };
    default:
      return state;
  }
};

export const importingAccountReducer = (
  state: ImportingAccountState = initialImportingAccountState,
  action: any
): ImportingAccountState => {
  switch (action.type) {
    case 'setImportingAccount':
      return {
        ...state,
        importingAccount: action.payload,
      };
    default:
      return state;
  }
};

export const deviceStatsReducer = (
  state: DeviceStats = initialDeviceStats,
  action: any
): DeviceStats => {
  switch (action.type) {
    case 'setDeviceStats':
      return action.payload;
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

const SDKProviderReducer = (
  state: SDKProviderState = initialSDKProviderState,
  action: any
): SDKProviderState => {
  switch (action.type) {
    case 'setSDKProvider':
      return {
        ...state,
        sdkProvider: action.payload,
      };
    case 'setConnected':
      return {
        ...state,
        connected: action.payload,
      };
    default:
      return state;
  }
};

const reducers = combineReducers({
  jobs: jobsReducer,
  transactionDetailsReducer: transactionDetailsReducer,
  userReducer: userReducer,
  themeReducer: themeReducer,
  importingAccountReducer: importingAccountReducer,
  deviceStatsReducer: deviceStatsReducer,
  SDKProviderReducer: SDKProviderReducer,
});

export default reducers;
