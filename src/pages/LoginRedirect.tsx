import * as React from "react";
import queryString from "query-string";

import { LibraryApiContextValue } from "../contexts/LibraryApiContext";
import withLibraryApi from "../utility/withLibraryApi";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { dashboardRoute, loginErrorRoute } from "../components/Routes";
import { LibraryCredentials } from "../services/LibraryTypes";

interface LoginSuccessProps extends LibraryApiContextValue, RouteComponentProps {}

interface LoginRedirectQueryPrams {
  auth_token: string | undefined;
  client_id: string | undefined;
  uid: string | undefined;
}

class LoginSuccess extends React.Component<LoginSuccessProps> {
  constructor(props: LoginSuccessProps) {
    super(props);
    this.state = {};
  }

  public componentWillMount() {
    const { libraryApi, history } = this.props;
    const params = (queryString.parse(window.location.search) as object) as LoginRedirectQueryPrams;

    if (params["auth_token"] && params["uid"] && params["client_id"]) {
      const libraryCredentials: LibraryCredentials = {
        "access-token": params["auth_token"],
        client: params["client_id"],
        uid: params["uid"],
      };
      libraryApi.setCredentials(libraryCredentials);
      history.replace(dashboardRoute);
      return;
    }
    history.replace(loginErrorRoute);
  }

  public render() {
    return null;
  }
}

export default withLibraryApi(withRouter(LoginSuccess));
