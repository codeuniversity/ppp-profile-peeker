import * as React from "react";
import LibraryApiContext from "./LibraryApiContext";
import LibraryApi from "../services/LibraryApi";
interface Props {
  chidlren?: React.ReactNode;
}

export default class LibraryApiProvider extends React.Component<Props> {
  private libraryApi: LibraryApi;
  constructor(props: Props) {
    super(props);
    this.libraryApi = new LibraryApi();
  }

  public componentWillMount() {
    this.libraryApi.onCredentialsUpdated = this.handleCredentialsChanged;
  }

  private handleCredentialsChanged = () => {
    this.forceUpdate();
  };

  public render() {
    return (
      <LibraryApiContext.Provider value={{ libraryApi: this.libraryApi, isLoggedIn: this.libraryApi.isLoggedIn() }}>
        {this.props.children}
      </LibraryApiContext.Provider>
    );
  }
}
