import * as React from "react";
import "./Dashboard.css";
import { createStyles, Theme, withStyles, WithStyles, Grid, Divider, Button } from "@material-ui/core";
import Profile from "../components/Profile";
import ProfilerApi from "../services/ProfilerApi";
import withProfilerApi, { ProfilerApiContextProps } from "../utility/withProfilerApi";
import { NavLink } from "react-router-dom";
import { configSelectRoute } from "../components/Routes";
interface State {
  scriptDialogOpen: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
    divider: {
      margin: theme.spacing.unit * 2,
    },
    optionCard: {
      padding: theme.spacing.unit,
    },
  });

type Props = WithStyles<typeof styles> & ProfilerApiContextProps;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scriptDialogOpen: false,
    };
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.renderProfiles()}
        {this.renderOptions()}
        {this.renderCreateScriptDialog()}
      </div>
    );
  }

  private renderProfiles = () => {
    const { profiles, classes } = this.props;
    if (Object.keys(profiles).length === 0) {
      return null;
    }
    return (
      <>
        <Grid container spacing={16} justify={"space-around"} alignItems="stretch">
          {Object.entries(profiles).map(([id, profile]) => {
            return (
              <Grid item key={id} xs={12} sm={6} md={4} lg={4} xl={2}>
                <Profile profile={profile} id={id} onDelete={ProfilerApi.deleteProfile} />
              </Grid>
            );
          })}
        </Grid>
        <Divider className={classes.divider} />
      </>
    );
  };

  private renderOptions = () => {
    return (
      <Grid container spacing={16} justify={"space-around"} alignItems="center">
        <Grid item>
          <NavLink to={configSelectRoute}>
            <Button variant="contained" color="primary" size="large">
              Browse the library for scripts
            </Button>
          </NavLink>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" size="large">
            Create a new script yourself
          </Button>
        </Grid>
      </Grid>
    );
  };

  private renderCreateScriptDialog = () => {};
}

export default withStyles(styles)(withProfilerApi(App));
