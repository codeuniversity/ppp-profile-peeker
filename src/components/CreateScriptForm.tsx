import * as React from "react";
import ProfilerApi, { MetaElement } from "../services/ProfilerApi";
import { Typography, Grid, Theme, WithStyles, createStyles, withStyles, Divider, TextField } from "@material-ui/core";
import Code from "./Code";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
    typeSpan: {
      color: theme.palette.primary.light,
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
  onScriptChange: (newScript: string) => void;
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
        <Typography variant="body1">You have the following data types available to process:</Typography>
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
            <Typography variant="body1">
              <Code margin="0 8px">{element.name}</Code>
              <span className={classes.typeSpan}>{element.type}</span>
            </Typography>
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
}
export default withStyles(styles)(CreateScriptDialog);
