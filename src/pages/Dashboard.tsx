import * as React from "react";
import "./Dashboard.css";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import Profile from "../components/Profile";
import ProfilerApi from "../services/ProfilerApi";
import withProfilerApi, { ProfilerApiContextProps } from "../utility/withProfilerApi";
import { NavLink } from "react-router-dom";
import { configSelectRoute } from "../components/Routes";
import CreateScriptDialog from "../components/CreateScriptForm";
import withNotifications from "../utility/withNotifications";
import { NotificationContextValue } from "../contexts/NotificationContext";
interface State {
  scriptDialogOpen: boolean;
  newScript: string;
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

type Props = WithStyles<typeof styles> & ProfilerApiContextProps & NotificationContextValue;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scriptDialogOpen: false,
      newScript: "",
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
                <Profile
                  profile={profile}
                  id={id}
                  onDelete={ProfilerApi.deleteProfile}
                  onCopy={this.handleProfileCopyClick}
                />
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
          <Button variant="contained" color="primary" size="large" onClick={this.openScriptDialog}>
            Create a new script yourself
          </Button>
        </Grid>
      </Grid>
    );
  };

  private renderCreateScriptDialog = () => {
    const { scriptDialogOpen, newScript } = this.state;
    return (
      <Dialog open={scriptDialogOpen} onClose={this.closeScriptDialog}>
        <DialogTitle> Define your script</DialogTitle>
        <CreateScriptDialog script={newScript} onScriptChange={this.onScriptChange} />
        <DialogActions>
          <Button onClick={this.closeScriptDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={this.onScriptSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  private openScriptDialog = () => {
    this.setState({ scriptDialogOpen: true });
  };
  private closeScriptDialog = () => {
    this.setState({ scriptDialogOpen: false });
  };

  private onScriptChange = (newScript: string) => {
    this.setState({ newScript });
  };

  private handleProfileCopyClick = (id: string) => {
    const { profiles } = this.props;
    const profile = profiles[id];
    this.setState({ newScript: profile.script, scriptDialogOpen: true });
  };

  private onScriptSave = async () => {
    const { addNotification, removeNotification } = this.props;
    const { newScript } = this.state;
    this.closeScriptDialog();
    const notificationId = addNotification({ message: "Creating Script", type: "success" });
    await ProfilerApi.postProfile(new Date().toISOString(), newScript);
    removeNotification(notificationId);
    addNotification({ type: "success", message: "Script Created!", timeout: 5000 });
  };
}

export default withStyles(styles)(withProfilerApi(withNotifications(App)));
