import * as React from "react";
import "./Dashboard.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, Theme, withStyles, WithStyles, Grid } from "@material-ui/core";
import { ProfileState } from "../services/ProfilerTypes";
import Profile from "../components/Profile";
import ProfileForm from "../components/ProfileForm";
import ProfilerApi from "../services/ProfilerApi";
interface State {
  profiles: {
    [key: string]: ProfileState;
  };
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
      margin: "auto",
    },
  });

interface Props extends WithStyles<typeof styles> {}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profiles: {},
    };
    this.profilerApi = new ProfilerApi();
  }
  private profilerApi: ProfilerApi;

  public componentDidMount() {
    this.profilerApi.onProfileUpdate(this.handleProfileUpdate);
    this.profilerApi.onProfileDelete(this.handleProfileDelete);
    this.profilerApi.openSocket();
  }

  public render() {
    const { classes } = this.props;
    console.log("rendered");
    return (
      <CssBaseline>
        <>
          <div className={classes.container}>{this.renderProfiles()}</div>
          <ProfileForm onSubmit={ProfilerApi.postProfile} />
        </>
      </CssBaseline>
    );
  }

  private renderProfiles = () => {
    const { profiles } = this.state;
    return (
      <Grid container spacing={16} justify={"center"} alignItems="stretch">
        {Object.entries(profiles).map(([id, profile]) => {
          return (
            <Grid item key={id} xs={12} sm={4} xl={3}>
              <Profile profile={profile} id={id} onDelete={ProfilerApi.deleteProfile} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

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

export default withStyles(styles)(App);
