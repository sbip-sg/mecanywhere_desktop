import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import GlobalStyles from '@mui/material/GlobalStyles';
import reduxStore from './redux/store';
import { getDesignTokens } from './utils/theme';
import App from './App';
import { useMemo } from 'react'

// const theme = createTheme(themeOptions);

// const theme = useMemo(() 
// => createAppTheme(mode), [mode]);

// const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={reduxStore}>
    {/* <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans&display=swap"
          />
        </Helmet> */}
        <App />
      {/* </ThemeProvider>
    </StyledEngineProvider> */}
  </Provider>
);
