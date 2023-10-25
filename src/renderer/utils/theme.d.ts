import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    cerulean?: Palette['primary'];
    deepCerulean?: Palette['primary'];
    violet?: Palette['primary'];
    lightPurple?: Palette['primary'];
    lightBlack?: Palette['primary'];
    mediumBlack?: Palette['primary'];
    darkBlack?: Palette['primary'];
    mintGreen?: Palette['primary'];
    offWhite?: Palette['primary'];
  }
  interface PaletteOptions {
    cerulean?: PaletteOptions['primary'];
    deepCerulean?: PaletteOptions['primary'];
    violet?: PaletteOptions['primary'];
    lightPurple?: PaletteOptions['primary'];
    lightBlack?: PaletteOptions['primary'];
    mediumBlack?: PaletteOptions['primary'];
    darkBlack?: PaletteOptions['primary'];
    mintGreen?: PaletteOptions['primary'];
    offWhite?: PaletteOptions['primary'];
  }
}