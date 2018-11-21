import * as React from "react";
import LibraryApiContext from "./LibraryApiContext";
import LibraryApi from "../services/LibraryApi";
import { UserInfo } from "../services/LibraryTypes";
import withNotifications from "./utility/withNotifications";
import { NotificationContextValue } from "./NotificationContext";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { loginRoute } from "./Routes";

type Props = NotificationContextValue &
  RouteComponentProps<{}> & {
    chidlren?: React.ReactNode;
  };

interface State {
  currentUser?: UserInfo;
  currentNotificationId?: string;
}

class LibraryApiProvider extends React.Component<Props, State> {
  private libraryApi: LibraryApi;
  constructor(props: Props) {
    super(props);
    this.libraryApi = new LibraryApi();
    this.state = {};
  }

  public componentWillMount = async () => {
    this.libraryApi.onCredentialsUpdated(this.handleCredentialsChanged);
    this.libraryApi.onUnauthorized(this.handleUnautorized);
    if (this.libraryApi.isLoggedIn()) {
      const currentUser = await this.libraryApi.fetchUserInfo();
      if (currentUser !== undefined) {
        this.setState({ currentUser });
      }
    }
  };

  private handleCredentialsChanged = () => {
    if (this.libraryApi.isLoggedIn()) {
      this.libraryApi.fetchUserInfo().then(currentUser => {
        this.setState({ currentUser });
      });
    }
    this.forceUpdate();
  };

  private handleUnautorized = () => {
    const { addNotification, removeNotification, history } = this.props;
    const { currentNotificationId } = this.state;
    if (currentNotificationId !== undefined) {
      removeNotification(currentNotificationId);
    }
    const id = addNotification({
      message: "Your session expired",
      type: "error",
      ationLabel: "relogin",
      onAction: () => {
        removeNotification(this.state.currentNotificationId || "");
        history.push(loginRoute);
      },
    });
    this.setState({ currentNotificationId: id });
  };

  public render() {
    return (
      <LibraryApiContext.Provider
        value={{
          libraryApi: this.libraryApi,
          isLoggedIn: this.libraryApi.isLoggedIn(),
          currentUser: this.state.currentUser,
        }}
      >
        {this.props.children}
      </LibraryApiContext.Provider>
    );
  }
}

export default withNotifications(withRouter(LibraryApiProvider));
