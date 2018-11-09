import * as React from "react";
import "./App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Typography, createStyles, Theme, withStyles, WithStyles, Grid } from "@material-ui/core";
import { ProfileState, Message, isProfileUpdate } from "./types";
import Profile from "./components/Profile";
import ProfileForm from "./components/ProfileForm";

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
    header: {
      background: theme.palette.primary.main,
      padding: theme.spacing.unit * 2,
    },
    title: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profiles: {},
    };
  }

  public componentDidMount() {
    this.openSocket();
  }

  public render() {
    const { classes } = this.props;
    console.log("rendered");
    return (
      <CssBaseline>
        <>
          <header className={classes.header}>
            <Typography variant="h2" className={classes.title}>
              Monio
            </Typography>
          </header>
          <div className={classes.container}>{this.renderProfiles()}</div>
          <a
            className="GoogleLink-link"
            href={`${process.env.REACT_APP_API_URL}/auth/google_oauth2?auth_origin_url=${
              process.env.REACT_APP_ORIGIN_URL
            }`}
          >
            Sign in with Google
          </a>

          <ProfileForm onSubmit={this.handleProfilePost} />
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
              <Profile profile={profile} id={id} onDelete={this.handleProfileDelete} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  private handleMessage = (message: Message) => {
    const data = message.data;
    if (isProfileUpdate(data)) {
      this.setState(prevState => {
        const prevCopy = Object.assign({}, prevState);
        prevCopy.profiles[message.id] = data.state;
        return prevCopy;
      });
    } else {
      this.setState(prevState => {
        const prevCopy = Object.assign({}, prevState);
        delete prevCopy.profiles[message.id];
        return prevCopy;
      });
    }
  };

  private openSocket = () => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.addEventListener("open", event => {
      socket.send("Hello Server!");
    });
    socket.addEventListener("message", event => {
      const message = JSON.parse(event.data) as Message;
      console.log(message);
      this.handleMessage(message);
    });
    socket.addEventListener("close", () => {
      setTimeout(() => {
        this.openSocket();
      }, 1000);
    });
  };

  private handleProfileDelete = async (profileId: string) => {
    await fetch(`http://localhost:4000/profiles/${profileId}`, {
      method: "DELETE",
    });
  };

  private handleProfilePost = async (evalScript: string) => {
    await fetch(`http://localhost:4000/profiles`, {
      method: "POST",
      body: JSON.stringify({ eval_script: evalScript }),
    });
  };
}

export default withStyles(styles)(App);
