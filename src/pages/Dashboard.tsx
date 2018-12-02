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
import CreateScriptForm from "../components/CreateScriptForm";
import withNotifications from "../utility/withNotifications";
import { NotificationContextValue } from "../contexts/NotificationContext";
import { Filter } from "../services/ProfilerTypes";
import withLibraryApi from "../utility/withLibraryApi";
import { LibraryApiContextValue } from "../contexts/LibraryApiContext";
import UploadConfigForm from "../components/UploadConfigForm";
import { namesArrayToNamesFilterString } from "../services/LibraryTypes";
import { ShortTermStoreValue } from "../contexts/ShortTermStoreContext";
import withShortTermStore from "../utility/withShortTermStore";

export const highlightedProfileKey = "highlightedProfileId";

interface State {
  scriptDialogOpen: boolean;
  newScript: string;
  newFilter: Filter;
  configDialogOpenForId: undefined | string;
  newConfigTitle: string;
}

const initialFilter = Object.freeze({ names: [] });

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

type Props = WithStyles<typeof styles> &
  ProfilerApiContextProps &
  NotificationContextValue &
  LibraryApiContextValue &
  ShortTermStoreValue;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scriptDialogOpen: false,
      newScript: "",
      newFilter: initialFilter,
      newConfigTitle: "",
      configDialogOpenForId: undefined,
    };
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.renderProfiles()}
        {this.renderOptions()}
        {this.renderCreateScriptDialog()}
        {this.renderUploadScriptDialog()}
      </div>
    );
  }

  private renderProfiles = () => {
    const { profiles, classes, shortTermStore } = this.props;
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
                  isHighlighted={
                    shortTermStore[highlightedProfileKey] === id ||
                    shortTermStore[highlightedProfileKey] === profile.definition.library_id
                  }
                  profile={profile}
                  id={id}
                  onDelete={ProfilerApi.deleteProfile}
                  onCopy={this.handleProfileCopyClick}
                  onUpload={this.handleProfileUploadClick}
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
            <Button variant="contained" color="secondary" size="large">
              Browse the library for scripts
            </Button>
          </NavLink>
        </Grid>

        <Grid item>
          <Button variant="contained" color="secondary" size="large" onClick={this.openScriptDialog}>
            Create a new script yourself
          </Button>
        </Grid>
      </Grid>
    );
  };

  private renderCreateScriptDialog = () => {
    const { scriptDialogOpen, newScript, newFilter } = this.state;
    return (
      <Dialog open={scriptDialogOpen} onClose={this.closeScriptDialog}>
        <DialogTitle> Define your script</DialogTitle>
        <CreateScriptForm
          script={newScript}
          onScriptChange={this.onScriptChange}
          filter={newFilter}
          onFilterChange={this.onFilterChange}
        />
        <DialogActions>
          <Button onClick={this.closeScriptDialog}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={this.onScriptSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  private renderUploadScriptDialog = () => {
    const { configDialogOpenForId, newConfigTitle } = this.state;
    return (
      <Dialog open={configDialogOpenForId !== undefined} onClose={this.closeScriptDialog}>
        <DialogTitle> Share your script with others</DialogTitle>
        <UploadConfigForm title={newConfigTitle} onTitleChange={this.onNewConfigTitleChange} />
        <DialogActions>
          <Button onClick={this.closeConfigDialog}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={this.onScriptUpload}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  private openScriptDialog = () => {
    this.setState({ scriptDialogOpen: true });
  };

  private closeConfigDialog = () => {
    this.setState({ configDialogOpenForId: undefined, newConfigTitle: "" });
  };

  private closeScriptDialog = () => {
    this.setState({ scriptDialogOpen: false, newScript: "", newFilter: initialFilter });
  };

  private onScriptChange = (newScript: string) => {
    this.setState({ newScript });
  };

  private onFilterChange = (newFilter: Filter) => {
    this.setState({ newFilter });
  };

  private onNewConfigTitleChange = (newConfigTitle: string) => {
    this.setState({ newConfigTitle });
  };

  private handleProfileCopyClick = (id: string) => {
    const { profiles } = this.props;
    const profile = profiles[id];
    this.setState({
      newScript: profile.definition.eval_script,
      newFilter: profile.definition.filter,
      scriptDialogOpen: true,
    });
  };

  private handleProfileUploadClick = (id: string) => {
    this.setState({ configDialogOpenForId: id });
  };

  private onScriptSave = async () => {
    const { addNotification, removeNotification } = this.props;
    const { newScript, newFilter } = this.state;
    this.closeScriptDialog();
    const notificationId = addNotification({ message: "Creating Script", type: "success" });
    await ProfilerApi.postProfile({
      id: new Date().toISOString(),
      eval_script: newScript,
      is_local: true,
      filter: newFilter,
    });
    removeNotification(notificationId);
    addNotification({ type: "success", message: "Script Created!", timeout: 5000 });
  };

  private onScriptUpload = async () => {
    const { addNotification, removeNotification, libraryApi, profiles } = this.props;
    const { configDialogOpenForId, newConfigTitle } = this.state;
    this.closeConfigDialog();
    const notificationId = addNotification({ message: "Uploading Script...", type: "success" });
    const profile = profiles[configDialogOpenForId!];
    const configOrUndefined = await libraryApi.postConfig({
      title: newConfigTitle,
      script: profile.definition.eval_script,
      names_filter: namesArrayToNamesFilterString(profile.definition.filter.names),
    });
    removeNotification(notificationId);
    if (configOrUndefined !== undefined) {
      addNotification({ type: "success", message: "Script Created!", timeout: 5000 });

      ProfilerApi.updateProfile(profile.definition.id, { library_id: configOrUndefined.id });
      return;
    }
    addNotification({ type: "error", message: "Something went wrong", timeout: 5000 });
  };
}

export default withStyles(styles)(withProfilerApi(withNotifications(withLibraryApi(withShortTermStore(App)))));
