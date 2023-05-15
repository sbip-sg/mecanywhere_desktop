import { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    background: {
      default: `#f9f9f9`,
    },
    primary: {
      //blue
      light: `#333333`,
      main: `#333333`,
      dark: `#333333`,
      // light: `#849BBB`,
      // main: `#1D2939`,
      // dark: `#121A25`,
      contrastText: `#FFFFFF`,
    },
    secondary: {
      //beige
      // light: '',
      main: `#f9f9f9`,
      dark: `#C5BDBA`,
      contrastText: `#000000`,
    },
  },
  typography: {
    fontFamily: [
      `Nunito Sans`,
      `Roboto`,
      `Helvetica`,
      `Arial`,
      `sans-serif`,
    ].join(`,`),
    fontSize: 16,
    h1: {
      letterSpacing: `0.2em`,
      fontSize: `1.6rem`,
    },
    h2: {
      letterSpacing: `1em`,
      fontSize: `1.5rem`,
    },
    body1: {
      // letterSpacing: '1em',
      fontSize: `1.1rem`,
    },
    button: {
      fontWeight: 500,
      letterSpacing: `0.15em`,
    },
  },
};

export default themeOptions;
