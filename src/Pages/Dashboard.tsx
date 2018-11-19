import * as React from "react";
import "./Dashboard.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, Theme, withStyles, WithStyles, Grid } from "@material-ui/core";
import Profile from "../components/Profile";
// import ProfileForm from "../components/ProfileForm";
import ProfilerApi from "../services/ProfilerApi";
import withProfilerApi, { ProfilerApiContextProps } from "../components/utility/withProfilerApi";
interface State {}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
      margin: "auto",
    },
  });

type Props = WithStyles<typeof styles> & ProfilerApiContextProps;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profiles: {},
    };
  }

  public render() {
    const { classes } = this.props;
    return (
      <CssBaseline>
        <>
          <div className={classes.container}>{this.renderProfiles()}</div>
          {/* <ProfileForm onSubmit={ProfilerApi.postProfile} /> */}
        </>
      </CssBaseline>
    );
  }

  private renderProfiles = () => {
    const { profiles } = this.props;
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
}

export default withStyles(styles)(withProfilerApi(App));
