import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export const reduxStore = createStore(reducers, {}, applyMiddleware(thunk));
