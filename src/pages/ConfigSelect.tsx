import * as React from "react";
import { Config } from "../services/LibraryTypes";
import withLibraryApi from "../utility/withLibraryApi";
import { LibraryApiContextValue } from "../contexts/LibraryApiContext";
import ConfigList from "../components/ConfigList";
import withProfilerApi, { ProfilerApiContextProps } from "../utility/withProfilerApi";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import ProfilerApi from "../services/ProfilerApi";

const styles = (theme: Theme) =>
  createStyles({
    bla: {},
  });

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
type Props = WithStyles<typeof styles> & ProfilerApiContextProps & LibraryApiContextValue;

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
    if (configs) {
      this.setState({ configs, loaded: true });
    }
  };

  public render() {
    const state = this.state;
    if (isLoaded(state)) {
      const { configs } = state;
      const { profileExists } = this.props;
      return (
        <ConfigList
          configs={configs}
          onVoteToggle={this.onVoteHandler()}
          profileExists={profileExists}
          onDownload={ProfilerApi.postProfile}
        />
      );
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

const profilerApiIncluded = withProfilerApi(ConfigSelect);
export default withStyles(styles)(withLibraryApi(profilerApiIncluded));
