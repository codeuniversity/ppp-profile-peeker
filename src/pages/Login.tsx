import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles, Button, Grid, Typography } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginTop: 2 * theme.spacing.unit,
    },
  });

interface LoginProps extends WithStyles<typeof styles> {}

class Login extends React.Component<LoginProps> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center" direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4">Login</Typography>
          <Typography variant="body1">Most of this app can be used without any authentication.</Typography>
          <Typography variant="body1">
            If you want to star configs or share you configs with others you need to be logged in.
          </Typography>
          <Grid container justify="flex-end">
            <Grid item>
              <a
                className="GoogleLink-link"
                href={`${process.env.REACT_APP_API_URL}/auth/google_oauth2?auth_origin_url=${
                  process.env.REACT_APP_ORIGIN_URL
                }`}
              >
                <Button className={classes.button} variant="outlined">
                  Login with Google
                </Button>
              </a>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
