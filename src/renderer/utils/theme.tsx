import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import '@mui/material/styles/createPalette';
import { scrollbarHeight, scrollbarWidth } from './constants';

const lightPurple = '#6D697D';
const cerulean = '#829CFF';
const deepCerulean = '#6485FF';
const mintGreen = '#35D4C7';
const offWhite = '#F7F7F7';
const violet = '#BC00A3';
const tintedNavy = '#2c3555';
const navy = '#3f3f74';
const darkViolet = '#581845';
const orange = '#FF5F1F';
const lightBlack = '#292733';
const mediumBlack = '#202028';
const darkBlack = '#18191C';
const lightWhite = '#FFFFFF';
const mediumWhite = '#5B4996';
const darkWhite = '#F4F4F4';
const darkThemeSpaceBar1 = '#2b2b2b'; // light
const darkThemeSpaceBar2 = '#6b6b6b'; // medium
const darkThemeSpaceBar3 = '#959595'; // dark
const lightThemeSpaceBar1 = '#f1f1f1'; // light
const lightThemeSpaceBar2 = '#c1c1c1'; // medium
const lightThemeSpaceBar3 = '#a8a8a8'; // dark

declare module '@mui/material/styles/createPalette' {
  export interface PaletteOptions {
    customBackground: {
      light: string;
      main: string;
      dark: string;
    };
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: tintedNavy,
            dark: navy,
          },
          secondary: {
            main: mintGreen,
            contrastText: violet,
          },
          text: {
            primary: darkBlack,
            secondary: lightWhite,
          },
          customBackground: {
            light: lightWhite,
            main: lightBlack,
            dark: darkWhite,
          },
        }
      : {
          primary: {
            main: cerulean,
            dark: deepCerulean,
          },
          secondary: {
            main: mintGreen,
            contrastText: violet,
          },
          text: {
            primary: offWhite,
            secondary: darkBlack,
          },
          customBackground: {
            light: lightBlack,
            main: mediumBlack,
            dark: darkBlack,
          },
        }),
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
          backgroundColor: mode === 'light' ? darkWhite : darkBlack,
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
                backgroundColor: navy,
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
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'unset' } },
    },
  },
});

export const createAppTheme = (mode: PaletteMode) =>
  createTheme(getDesignTokens(mode));

// MuiFormHelperText: {
//   styleOverrides: {
//     root: {
//       textTransform: 'initial',
//       fontSize: '1rem',
//     },
//   },
// },

// export default createTheme(themeOptions);

// background: {
//   default: mediumBlack,
// },
// cerulean: {
//   main: cerulean,
// },
// deepCerulean: {
//   main: deepCerulean,
// },
// violet: {
//   main: violet,
// },
// lightPurple: {
//   main: lightPurple,
// },
// lightBlack: {
//   main: lightBlack,
// },
// mediumBlack: {
//   main: mediumBlack,
// },
// darkBlack: {
//   main: darkBlack,
// },
// mintGreen: {
//   main: mintGreen,
// },
// offWhite: {
//   main: offWhite,
// },
// cerulean: createColor(cerulean),
// deepCerulean: createColor(deepCerulean),
// violet: createColor('#BC00A3'),
// lightPurple: createColor(lightPurple),
// lightBlack: createColor(lightBlack),
// mediumBlack: createColor(mediumBlack),
// darkBlack: createColor(darkBlack),
// mintGreen: createColor(mintGreen),
// offWhite: createColor(offWhite),
