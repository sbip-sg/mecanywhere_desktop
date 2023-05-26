import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { reduxStore } from './redux/store';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import themeOptions from './utils/themeOptions';
import { Helmet } from 'react-helmet';

const theme = createTheme(themeOptions);
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={reduxStore}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap"
          />
        </Helmet>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </Provider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
