import * as React from "react";
import "./App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Typography, createStyles, Theme, withStyles, WithStyles, Grid } from "@material-ui/core";
import { ProfileState, Message } from "./types";
import Profile from "./components/Profile";

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
              <Profile profile={profile} />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  private openSocket = () => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.addEventListener("open", event => {
      socket.send("Hello Server!");
    });
    socket.addEventListener("message", event => {
      const message = JSON.parse(event.data) as Message;
      console.log(message);
      this.setState(prevState => {
        const prevCopy = Object.assign({}, prevState);
        prevCopy.profiles[message.id] = message.data;
        return prevCopy;
      });
    });
    socket.addEventListener("close", () => {
      setTimeout(() => {
        this.openSocket();
      }, 1000);
    });
  };
}

export default withStyles(styles)(App);
