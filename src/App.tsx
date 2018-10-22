import * as React from "react";
import "./App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Card, CardContent, Typography, createStyles, Theme, withStyles, WithStyles, Grid } from "@material-ui/core";

interface Message {
  average: number;
  current: number;
}

interface State {
  average: number;
  current: number;
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
      margin: "auto",
      maxWidth: 800,
    },
    bar: {
      backgroundColor: theme.palette.secondary.main,
      marginRight: theme.spacing.unit,
    },
    header: {
      background: theme.palette.primary.main,
      padding: theme.spacing.unit * 2,
      textAlign: "center",
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
      average: 0,
      current: 0,
    };
  }

  public componentDidMount() {
    const socket = new WebSocket("ws://localhost:4000");

    socket.addEventListener("open", event => {
      socket.send("Hello Server!");
    });
    socket.addEventListener("message", event => {
      const data = JSON.parse(event.data) as Message;
      this.setState(prevState => {
        return data;
      });
    });
  }

  public render() {
    const { classes } = this.props;
    const { average, current } = this.state;
    return (
      <CssBaseline>
        <>
          <header className={classes.header}>
            <Typography variant="h1" className={classes.title}>
              See what your car is doing
            </Typography>
          </header>
          <div className={classes.container}>
            <Card>
              <CardContent>
                <Grid container>
                  <Grid item xs={1}>
                    <div className={classes.bar} style={{ height: `${average}%`, marginTop: `${100 - average}%` }} />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography>Lifetime Average CPU Temp is {average.toFixed(2)}C</Typography>
                    <Typography>Current CPU Temp is {current.toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </>
      </CssBaseline>
    );
  }
}

export default withStyles(styles)(App);
