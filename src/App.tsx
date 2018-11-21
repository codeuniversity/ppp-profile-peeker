import * as React from "react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import Routes from "./components/Routes";
import theme from "./theme";
import LibraryApiProvider from "./components/LibraryApiProvider";
import ProfilerApiProvider from "./components/ProfilerApiProvider";
import NotificationProvider from "./components/NotificationProvider";
import { BrowserRouter as Router } from "react-router-dom";

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
          <Router>
            <NotificationProvider>
              <ProfilerApiProvider>
                <LibraryApiProvider>
                  <Routes />
                </LibraryApiProvider>
              </ProfilerApiProvider>
            </NotificationProvider>
          </Router>
        </MuiThemeProvider>
      </>
    );
  }
}
