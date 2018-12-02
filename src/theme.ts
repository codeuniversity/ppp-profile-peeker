import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#c62828",
      light: "#ff5f52",
      dark: "#8e0000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#283593",
      light: "#5f5fc4",
      dark: "#001064",
      contrastText: "#ffffff",
    },
  },
  typography: {
    useNextVariants: true,
  },
});

export default theme;
