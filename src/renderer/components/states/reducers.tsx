import { combineReducers } from 'redux';

const userReducer = (
  state = {
    publicKey: '',
    DID: '',
  },
  action
) => {
  switch (action.type) {
    case 'setUserPublicKey':
      return {
        ...state,
        publicKey: action.payload,
      };
    case 'setUserDID':
      return {
        ...state,
        DID: action.payload,
      };
    default:
      return state;
  }
};


const hostReducer = (
  state = {
    publicKey: '',
    DID: '',
  },
  action
) => {
  switch (action.type) {
    case 'setHostPublicKey':
      return {
        ...state,
        publicKey: action.payload,
      };
    case 'setHostDID':
      return {
        ...state,
        DID: action.payload,
      };
    default:
      return state;
  }
};


const reducers = combineReducers({
  user: userReducer,
  host: hostReducer,
});

export default reducers;
