import * as React from "react";
import { Config } from "../services/LibraryTypes";
import withLibraryApi from "../components/utility/withLibraryApi";
import { LibraryApiContextValue } from "../components/LibraryApiContext";
import ConfigList from "../components/ConfigList";

interface Props extends LibraryApiContextValue {}

const initialState = {
  loaded: false,
};

type InitialState = typeof initialState;

type LoadedState = {
  loaded: true;
  configs: Config[];
};

function isLoaded(state: State): state is LoadedState {
  return state.loaded;
}

type State = InitialState | LoadedState;

class ConfigSelect extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  public componentDidMount = () => {
    this.loadConfigs();
  };

  private loadConfigs = async () => {
    const { libraryApi } = this.props;
    const configs = await libraryApi.fetchConfigs();
    this.setState({ configs, loaded: true });
  };

  public render() {
    const state = this.state;
    if (isLoaded(state)) {
      const { configs } = state;
      return <ConfigList configs={configs} onVoteToggle={this.onVoteHandler()} />;
    }

    return null;
  }

  private onVoteHandler = () => {
    const { isLoggedIn, libraryApi } = this.props;
    if (!isLoggedIn) {
      return undefined;
    }

    return async (configId: string, shouldDelete: boolean) => {
      if (shouldDelete) {
        await libraryApi.deleteVoteForConfig(configId);
      } else {
        await libraryApi.voteForConfig(configId);
      }
      this.loadConfigs();
    };
  };
}

export default withLibraryApi(ConfigSelect);
