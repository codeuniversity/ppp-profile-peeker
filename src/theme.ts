import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f47b00",
      light: "#ffac42",
      dark: "#ba4c00",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4e342e",
      light: "#7b5e57",
      dark: "#260e04",
      contrastText: "#ffffff",
    },
  },
  typography: {
    useNextVariants: true,
  },
});

export default theme;
