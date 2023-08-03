import * as React from 'react';
import Button, { ButtonPropsColorOverrides } from '@mui/material/Button';
import {
  createTheme,
  PaletteColorOptions,
  ThemeProvider,
  ThemeOptions
} from '@mui/material/styles';
import { create } from 'domain';

declare module '@mui/material/styles' {
  interface CustomPalette {
    magenta: PaletteColorOptions;
    purple: PaletteColorOptions;
    cerulean: PaletteColorOptions;
    violet: PaletteColorOptions;
    lightPurple: PaletteColorOptions;
    lightBlack: PaletteColorOptions;
    mediumBlack: PaletteColorOptions;
    darkBlack: PaletteColorOptions;
    offWhite: PaletteColorOptions;
    mintGreen: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

const createColor = (mainColor: string) => createTheme().palette.augmentColor({ color: { main: mainColor } });

const cerulean = '#' + '7f97d8'
const lightPurple = '#' + '6D697D'
const lightBlack = "#" + '292733'
const mediumBlack = "#" + '202028'
const darkBlack = "#" + '18191C'
const mintGreen = '#' + '35D4C7'
const offWhite = "#" + 'F7F7F7'
// const lightBlue = 

const themeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: darkBlack,
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: darkBlack,
          backgroundColor: cerulean,
          '&:hover': {
            color: cerulean,
            backgroundColor: darkBlack, 
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: cerulean,
          },
          '& label.Mui-focused': {
            color: cerulean,
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: cerulean,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: cerulean,
            },
            '&:hover fieldset': {
              borderColor: cerulean,
              borderWidth: '0.15rem',
            },
            '&.Mui-focused fieldset': {
              borderColor: cerulean,
            },
          },
          '& .MuiInputBase-root': {
            color: cerulean,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          textTransform: 'initial',
          fontSize: '1rem',
        },
      },
    },
  },
  palette: {
    background: {
      default: mediumBlack,
    },
    magenta: createColor('#F51474'),
    purple: createColor('#790EFC'),
    cerulean: createColor(cerulean),
    violet: createColor('#BC00A3'),
    lightPurple: createColor(lightPurple),
    lightBlack: createColor(lightBlack),
    mediumBlack: createColor(mediumBlack),
    darkBlack: createColor(darkBlack),
    mintGreen: createColor(mintGreen),
    offWhite: createColor(offWhite),
    primary: {
      light: lightBlack,
      main: mediumBlack,
      dark: darkBlack,
      contrastText: `#FFFFFF`,
    },
    secondary: {
      light: `#F51474`, //magenta
      main: `#f9f9f9`,
      dark: `#C5BDBA`,
      contrastText: `#790EFC`, //purple
    },
    text: {
      primary: offWhite,
      secondary: lightPurple,
      // disabled: styles.ttt,
      // hint: styles.tttt,
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
      fontSize: `1.1rem`,
    },
    body2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 500,
      letterSpacing: `0.1em`,
    },
    button: {
      fontWeight: 500,
      letterSpacing: `0.15em`,
    },
  },
};

export default createTheme(themeOptions);
