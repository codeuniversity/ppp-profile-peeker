import * as React from "react";
import LibraryApiContext from "./LibraryApiContext";
import LibraryApi from "../services/LibraryApi";
import { UserInfo } from "../services/LibraryTypes";
interface Props {
  chidlren?: React.ReactNode;
}

interface State {
  currentUser?: UserInfo;
}

export default class LibraryApiProvider extends React.Component<Props, State> {
  private libraryApi: LibraryApi;
  constructor(props: Props) {
    super(props);
    this.libraryApi = new LibraryApi();
    this.state = {};
  }

  public componentWillMount = async () => {
    this.libraryApi.onCredentialsUpdated(this.handleCredentialsChanged);
    if (this.libraryApi.isLoggedIn()) {
      const currentUser = await this.libraryApi.fetchUserInfo();
      this.setState({ currentUser });
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
