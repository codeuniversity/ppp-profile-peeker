import * as React from "react";
import {
  Theme,
  withStyles,
  WithStyles,
  Typography,
  createStyles,
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Icon,
} from "@material-ui/core";
import withLibraryApi from "./utility/withLibraryApi";
import { LibraryApiContextValue } from "./LibraryApiContext";
import { Link } from "react-router-dom";
import { dashboardRoute, configSelectRoute, loginRoute } from "./Routes";

const styles = (theme: Theme) =>
  createStyles({
    header: {
      background: theme.palette.primary.main,
      marginBottom: theme.spacing.unit * 2,
    },
    navItem: {
      color: theme.palette.primary.contrastText,
      display: "inline-block",
      marginRight: theme.spacing.unit,
    },
    userInfo: {
      textAlign: "center",
      color: theme.palette.primary.contrastText,
    },
  });

type Props = WithStyles<typeof styles> & LibraryApiContextValue & {};

class Menu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { classes, isLoggedIn, libraryApi } = this.props;
    return (
      <AppBar className={classes.header} position="static">
        <Toolbar>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Link to={dashboardRoute}>
                <Typography variant="h3" className={classes.navItem}>
                  Monio
                </Typography>
              </Link>
              <Link to={configSelectRoute}>
                <Typography variant="h5" className={classes.navItem}>
                  Configs
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              {isLoggedIn ? (
                <Typography className={classes.navItem} variant="h5">
                  <Grid container>
                    <Grid item>{this.renderUserInfo()}</Grid>
                    <Grid item>
                      <IconButton color="inherit" onClick={libraryApi.logout}>
                        <Icon fontSize="small">logout</Icon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Typography>
              ) : (
                <Link to={loginRoute}>
                  <Typography variant="h5" className={classes.navItem}>
                    Login
                  </Typography>
                </Link>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  private renderUserInfo = () => {
    const { currentUser, classes } = this.props;

    if (currentUser === undefined) {
      return null;
    }

    return (
      <div className={classes.userInfo}>
        <Typography color="inherit">Welcome</Typography>
        <Typography color="inherit">{currentUser.name}</Typography>
      </div>
    );
  };
}

export default withLibraryApi(withStyles(styles)(Menu));
