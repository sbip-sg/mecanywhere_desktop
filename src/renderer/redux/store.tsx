import { createStore, applyMiddleware, Store } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import reducers from './reducers';

// Define the RootState type based on the combined reducers
export type RootState = ReturnType<typeof reducers>;

const middleware = [thunk as ThunkMiddleware<RootState>];
const reduxStore: Store<RootState> = createStore(reducers, {}, applyMiddleware(...middleware));

export default reduxStore;