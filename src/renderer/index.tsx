import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import reduxStore from './redux/store';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>
);
