import { combineReducers } from 'redux';
import {
  DataEntry,
  UserState,
  ThemeState,
  ImportingAccountState,
  JobsState,
  DeviceStats,
  TaskList,
} from 'renderer/utils/dataTypes';

const initialUserState: UserState = {
  authenticated: false,
  accessToken: '',
  refreshToken: '',
};

const initialThemeState: ThemeState = {
  color: 'light',
};

const initialImportingAccountState: ImportingAccountState = {
  importingAccount: false,
};

const initialJobsState: JobsState = {
  jobs: [],
  jobResults: [],
};

const initialDeviceStats: DeviceStats = {
  totalCpuCores: 4,
  totalMem: 8192,
  totalGpus: 0,
  gpuModel: '',
};

const initialDataEntry: DataEntry = {
  duration: 0,
  network_reliability: 0,
  price: 0,
  resource_cpu: 0,
  resource_memory: 0,
  role: '',
  task_name: '',
  transaction_end_datetime: 0,
  transaction_start_datetime: 0,
  transaction_id: '',
};

const initialTaskList: TaskList = {
  downloaded: [],
  built: [],
  tested: [],
  activated: [],
};

export const dataEntryReducer = (
  state: DataEntry = initialDataEntry,
  action: any
) => {
  switch (action.type) {
    case 'setDataEntry':
      return action.payload;
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
    case 'addJob': {
      const newJob = {
        id: action.id,
        content: action.content,
      };
      return {
        ...state,
        jobs: [...state.jobs, newJob],
      };
    }
    case 'setJobs':
      return {
        ...state,
        jobs: [action.payload],
      };
    case 'addJobResults': {
      const newJobResult = {
        id: action.id,
        content: action.content,
      };
      return {
        ...state,
        jobResults: [...state.jobResults, newJobResult],
      };
    }
    case 'setJobResults':
      return {
        ...state,
        jobResults: [action.payload],
      };
    default:
      return state;
  }
};

export const taskListReducer = (
  state: TaskList = initialTaskList,
  action: any
): TaskList => {
  switch (action.type) {
    case 'addToDownloaded':
      if (!state.downloaded.includes(action.payload)) {
        return {
          ...state,
          downloaded: [...state.downloaded, action.payload],
        };
      }
      return state;
    case 'removeFromDownloaded':
      return {
        ...state,
        downloaded: state.downloaded.filter(
          (taskName) => taskName !== action.payload
        ),
      };
    case 'addToBuilt':
      if (!state.built.includes(action.payload)) {
        return {
          ...state,
          built: [...state.built, action.payload],
        };
      }
      return state;
    case 'removeFromBuilt':
      return {
        ...state,
        built: state.built.filter((taskName) => taskName !== action.payload),
      };
    case 'addToTested':
      if (!state.tested.includes(action.payload)) {
        return {
          ...state,
          tested: [...state.tested, action.payload],
        };
      }
      return state;

    case 'removeFromTested':
      return {
        ...state,
        tested: state.tested.filter((taskName) => taskName !== action.payload),
      };

    case 'addToActivated':
      if (!state.activated.includes(action.payload)) {
        return {
          ...state,
          activated: [...state.activated, action.payload],
        };
      }
      return state;

    case 'removeFromActivated':
      return {
        ...state,
        activated: state.activated.filter(
          (taskName) => taskName !== action.payload
        ),
      };

    default:
      return state;
  }
};

const reducers = combineReducers({
  jobs: jobsReducer,
  dataEntryReducer,
  userReducer,
  themeReducer,
  importingAccountReducer,
  deviceStatsReducer,
  taskList: taskListReducer,
});

export default reducers;
