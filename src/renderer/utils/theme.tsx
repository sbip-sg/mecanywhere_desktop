import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import '@mui/material/styles/createPalette';
import { scrollbarHeight, scrollbarWidth } from './constants';

// const lightPurple = '#6D697D';
// const deepCerulean = '#6485FF';
// const tintedNavy = '#2c3555';
// const navy = '#3f3f74';
// const darkWhite = '#F4F4F4';
// const orange = '#FF5F1F';
const cerulean = '#829CFF';
const mintGreen = '#35D4C7';
const offWhite = '#f0f1f2';
const violet = '#BC00A3';
const darkViolet = '#581845';
const lightBlack = '#292733';
const mediumBlack = '#202028';
const darkBlack = '#18191C';
const white = '#FFFFFF';
const grey = '#2e2f36';
const darkThemeSpaceBar1 = '#2b2b2b'; // light
const darkThemeSpaceBar2 = '#6b6b6b'; // medium
const darkThemeSpaceBar3 = '#959595'; // dark
const lightThemeSpaceBar1 = '#f1f1f1'; // light
const lightThemeSpaceBar2 = '#c1c1c1'; // medium
const lightThemeSpaceBar3 = '#a8a8a8'; // dark
const lightGrey = '#e6e8eb';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: cerulean,
            dark: grey,
          },
          secondary: {
            main: mintGreen,
            contrastText: violet,
          },
          text: {
            primary: darkBlack,
            secondary: white,
          },
          background: {
            default: white,
            paper: offWhite,
          },
        }
      : {
          primary: {
            main: cerulean,
            dark: mediumBlack,
          },
          secondary: {
            main: mintGreen,
            contrastText: violet,
          },
          text: {
            primary: offWhite,
            secondary: darkBlack,
          },
          background: {
            default: lightBlack,
            paper: darkBlack,
          },
        }),
    customColor: {
      lightGrey,
      darkViolet,
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? offWhite : darkBlack,
          scrollbarColor:
            mode === 'light'
              ? `${lightThemeSpaceBar2} ${darkThemeSpaceBar1}`
              : `${lightThemeSpaceBar2} ${darkThemeSpaceBar1}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor:
              mode === 'light' ? lightThemeSpaceBar1 : darkThemeSpaceBar1,
            width: `${scrollbarWidth}px`,
            height: `${scrollbarHeight}px`,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor:
              mode === 'light' ? lightThemeSpaceBar2 : darkThemeSpaceBar2,
            minHeight: 24,
            border: `3px solid ${
              mode === 'light' ? lightThemeSpaceBar1 : darkThemeSpaceBar1
            }`,
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            {
              backgroundColor:
                mode === 'light' ? lightThemeSpaceBar3 : darkThemeSpaceBar3,
            },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            {
              backgroundColor:
                mode === 'light' ? lightThemeSpaceBar3 : darkThemeSpaceBar3,
            },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor:
                mode === 'light' ? lightThemeSpaceBar3 : darkThemeSpaceBar3,
            },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor:
              mode === 'light' ? lightThemeSpaceBar1 : darkThemeSpaceBar1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          ...(mode === 'light'
            ? {
                color: offWhite,
                backgroundColor: grey,
                '&:hover': {
                  color: offWhite,
                  backgroundColor: darkViolet,
                },
              }
            : {
                color: darkBlack,
                backgroundColor: cerulean,
                '&:hover': {
                  color: cerulean,
                  backgroundColor: darkBlack,
                },
              }),
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          ...(mode === 'light'
            ? {
                '& label': {
                  color: grey,
                },
                '& label.Mui-focused': {
                  color: grey,
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: grey,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: grey,
                  },
                  '&:hover fieldset': {
                    borderColor: cerulean,
                    borderWidth: '0.15rem',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: grey,
                  },
                  borderRadius: '3px',
                },
                '& .MuiInputBase-root': {
                  color: grey,
                },
              }
            : {
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
              }),
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'unset' } },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          // color: "red"
        },
      },
    },
  },
});

export const createAppTheme = (mode: PaletteMode) =>
  createTheme(getDesignTokens(mode));
