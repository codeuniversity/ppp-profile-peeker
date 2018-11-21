import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import LoginRedirect from "../pages/LoginRedirect";
import LoginError from "../pages/LoginError";
import ConfigSelect from "../pages/ConfigSelect";
import Menu from "./Menu";

export const loginRoute = "/login";
export const loginRedirectRoute = "/login_redirect";
export const loginErrorRoute = "/login_error";
export const configSelectRoute = "/config_select";
export const dashboardRoute = "/";

// tslint:disable jsx-no-lambda

export default class Routes extends React.Component {
  public render() {
    return (
      <Route path="/">
        <>
          <Menu />
          <Switch>
            <Route path={loginRedirectRoute} render={() => <LoginRedirect />} />
            <Route path={loginRoute} render={() => <Login />} />
            <Route path={loginErrorRoute} render={() => <LoginError />} />
            <Route path={configSelectRoute} render={() => <ConfigSelect />} />
            <Route path={dashboardRoute} render={() => <Dashboard />} />
          </Switch>
        </>
      </Route>
    );
  }
}
