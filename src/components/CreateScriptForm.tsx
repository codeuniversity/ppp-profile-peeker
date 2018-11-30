import * as React from "react";
import ProfilerApi, { MetaElement } from "../services/ProfilerApi";
import {
  Typography,
  Grid,
  Theme,
  WithStyles,
  createStyles,
  withStyles,
  Divider,
  TextField,
  Checkbox,
} from "@material-ui/core";
import Code from "./Code";
import { Filter } from "../services/ProfilerTypes";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
    typeSpan: {
      color: theme.palette.secondary.light,
    },
    divider: {
      margin: theme.spacing.unit * 2,
    },
    input: {
      fontFamily: "monospace",
    },
  });

interface Props extends WithStyles<typeof styles> {
  script: string;
  filter: Filter;
  onScriptChange: (newScript: string) => void;
  onFilterChange: (newFilter: Filter) => void;
}

const loadingState = { loaded: false };
type LoadingState = typeof loadingState;
type LoadedState = {
  loaded: true;
  metaElements: MetaElement[];
};
type State = LoadingState | LoadedState;

function isLoaded(state: State): state is LoadedState {
  return state.loaded;
}

class CreateScriptDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = loadingState;
  }

  componentDidMount() {
    this.loadDependencies();
  }

  public render() {
    const { classes } = this.props;
    const state = this.state;
    if (!isLoaded(state)) {
      return null;
    }
    return (
      <div className={classes.container}>
        <Typography variant="body1">Select what data you want to process with this script</Typography>
        {this.renderMetaInfo(state.metaElements)}
        <Divider className={classes.divider} />
        {this.renderForm()}
      </div>
    );
  }

  private renderMetaInfo = (metaElements: MetaElement[]) => {
    const { classes } = this.props;
    return (
      <Grid container direction="column" spacing={8}>
        {metaElements.map(element => (
          <Grid item key={element.name}>
            <Checkbox
              color="secondary"
              checked={this.isInFilter(element.name)}
              onChange={this.getFilterToggleForName(element.name)}
            />
            <Code margin="0 8px">{element.name}</Code>
            <span className={classes.typeSpan}>{element.type}</span>
          </Grid>
        ))}
      </Grid>
    );
  };

  private renderForm = () => {
    const { classes, script } = this.props;
    return (
      <TextField
        InputProps={{ className: classes.input }}
        value={script}
        onChange={this.onChange}
        multiline
        variant="outlined"
        fullWidth
        label="Script"
      />
    );
  };

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onScriptChange(e.target.value);
  };

  private loadDependencies = async () => {
    const metaElements = await ProfilerApi.fetchMeta();
    this.setState({
      metaElements,
      loaded: true,
    } as LoadedState);
  };

  private isInFilter = (name: string): boolean => {
    const { filter } = this.props;
    return filter.names.some(nameInFilter => nameInFilter === name);
  };

  private getFilterToggleForName = (name: string) => {
    return () => {
      const { filter, onFilterChange } = this.props;
      let namesCopy = filter.names.slice();
      if (this.isInFilter(name)) {
        namesCopy = namesCopy.filter(n => n !== name);
      } else {
        namesCopy.push(name);
      }
      onFilterChange({ names: namesCopy });
    };
  };
}
export default withStyles(styles)(CreateScriptDialog);
