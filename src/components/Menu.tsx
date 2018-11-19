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
import { NavLink } from "react-router-dom";
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
      textDecoration: "none",
      borderBottom: "1px solid rgba(0,0,0,0)",
      height: "100%",
    },
    userInfo: {
      textAlign: "center",
      color: theme.palette.primary.contrastText,
    },
    activeLink: {
      borderBottom: `1px solid ${theme.palette.primary.contrastText}`,
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
          <Grid container justify="space-between" alignItems="center" alignContent="stretch">
            <Grid item>
              <NavLink to={dashboardRoute} exact className={classes.navItem} activeClassName={classes.activeLink}>
                <Typography variant="h4" color="inherit">
                  Monio
                </Typography>
              </NavLink>
              <NavLink to={configSelectRoute} exact className={classes.navItem} activeClassName={classes.activeLink}>
                <Icon>settings</Icon>
              </NavLink>
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
                <NavLink to={loginRoute} exact className={classes.navItem} activeClassName={classes.activeLink}>
                  <Typography variant="h5" color="inherit">
                    Login
                  </Typography>
                </NavLink>
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
