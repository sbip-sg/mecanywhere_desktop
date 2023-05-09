import { combineReducers } from 'redux';

const accountUserReducer = (
  state = {
    publicKey: '',
    did: '',
    authenticated: false,
    userAccessToken: '',
    hostAccessToken: '',
  },
  action
) => {
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
