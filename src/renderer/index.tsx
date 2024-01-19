import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import reduxStore from './redux/store';
import App from './App';



window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled rejection:', event.promise);
  console.error('Reason:', event.reason);
  // Additional actions like user notifications can be implemented here
});
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>
);
