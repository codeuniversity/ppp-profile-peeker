import * as React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import Routes from "./components/Routes";
import theme from "./theme";
import LibraryApiProvider from "./components/LibraryApiProvider";
import ProfilerApiProvider from "./components/ProfilerApiProvider";

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
          <ProfilerApiProvider>
            <LibraryApiProvider>
              <Routes />
            </LibraryApiProvider>
          </ProfilerApiProvider>
        </MuiThemeProvider>
      </>
    );
  }
}
