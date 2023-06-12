import { combineReducers } from 'redux';

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

export const accountUserReducer = (state: AccountUserState = initialAccountUserState, action: any): AccountUserState => {
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

const reducers = combineReducers({
  accountUser: accountUserReducer,
});

export default reducers;