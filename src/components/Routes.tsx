import * as React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Login from "../Pages/Login";
import LoginRedirect from "../Pages/LoginRedirect";
import LoginError from "../Pages/LoginError";

export const loginRoute = "/login";
export const loginRedirectRoute = "/login_redirect";
export const loginErrorRoute = "/login_error";

export const dashboardRoute = "/";

// tslint:disable jsx-no-lambda

export default class Routes extends React.Component {
  public render() {
    return (
      <Router>
        <Switch>
          <Route path={loginRedirectRoute} render={() => <LoginRedirect />} />
          <Route path={loginRoute} render={() => <Login />} />
          <Route path={loginErrorRoute} render={() => <LoginError />} />
          <Route path={dashboardRoute} render={() => <Dashboard />} />
        </Switch>
      </Router>
    );
  }
}
