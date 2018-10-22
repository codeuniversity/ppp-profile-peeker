import { createMuiTheme } from "@material-ui/core/styles";

import { PaletteColor } from "@material-ui/core/styles/createPalette";

const primary: PaletteColor = {
  light: "#6d6d6d",
  main: "#424242",
  dark: "#1b1b1b",
  contrastText: "#ffffff",
};

const secondary: PaletteColor = {
  light: "#5f5fc4",
  main: "#283593",
  dark: "#001064",
  contrastText: "#eeeeee",
};

const theme = createMuiTheme({
  palette: {
    primary,
    secondary,
  },
});

export default theme;
