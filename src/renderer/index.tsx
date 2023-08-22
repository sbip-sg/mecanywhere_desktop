import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import GlobalStyles from '@mui/material/GlobalStyles';
import reduxStore from './redux/store';
import theme from './utils/theme';
import App from './App';

// const theme = createTheme(themeOptions);
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={reduxStore}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <GlobalStyles
          styles={{
            body: { backgroundColor: "#2F2F3B" }
          }}
        /> */}
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
