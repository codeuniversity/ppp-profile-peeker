import * as React from "react";
import ProfilerApi from "../services/ProfilerApi";
import ProfilerApiContext from "./ProfilerApiContext";
import { ProfileState } from "../services/ProfilerTypes";
interface Props {}

interface State {
  profiles: { [id: string]: ProfileState };
}

export default class ProfilerApiProvider extends React.Component<Props, State> {
  private profilerApi: ProfilerApi;
  constructor(props: Props) {
    super(props);
    this.state = {
      profiles: {},
    };
    this.profilerApi = new ProfilerApi();
  }

  public componentDidMount = () => {
    this.profilerApi.onProfileUpdate(this.handleProfileUpdate);
    this.profilerApi.onProfileDelete(this.handleProfileDelete);
    this.profilerApi.openSocket();
  };

  public componentWillUnmount() {
    this.profilerApi.onProfileUpdate(undefined);
    this.profilerApi.onProfileDelete(undefined);
  }

  public render() {
    const { children } = this.props;
    return (
      <ProfilerApiContext.Provider value={{ profilerApi: this.profilerApi, profiles: this.state.profiles }}>
        {children}
      </ProfilerApiContext.Provider>
    );
  }

  private handleProfileUpdate = (profileId: string, profileState: ProfileState) => {
    this.setState(prevState => {
      const prevCopy = Object.assign({}, prevState);
      prevCopy.profiles[profileId] = profileState;
      return prevCopy;
    });
  };

  private handleProfileDelete = (profileId: string) => {
    this.setState(prevState => {
      const prevCopy = Object.assign({}, prevState);
      delete prevCopy.profiles[profileId];
      return prevCopy;
    });
  };
}
