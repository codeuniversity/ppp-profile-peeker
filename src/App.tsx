import * as React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import Routes from "./components/Routes";
import theme from "./theme";
import LibraryApiProvider from "./components/LibraryApiProvider";

interface AppProps {}

export default class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);
  }

  public render() {
    return (
      <>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <LibraryApiProvider>
            <Routes />
          </LibraryApiProvider>
        </MuiThemeProvider>
      </>
    );
  }
}
