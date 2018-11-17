import * as React from "react";
import { Theme, withStyles, WithStyles, Typography, createStyles } from "@material-ui/core";
import withLibraryApi from "./utility/withLibraryApi";
import { LibraryApiContextValue } from "./LibraryApiContext";
import { Link } from "react-router-dom";
import { dashboardRoute, configSelectRoute, loginRoute } from "./Routes";

const styles = (theme: Theme) =>
  createStyles({
    header: {
      background: theme.palette.primary.main,
      padding: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
    navItem: {
      color: theme.palette.primary.contrastText,
      display: "inline-block",
      marginRight: theme.spacing.unit,
    },
  });

type Props = WithStyles<typeof styles> & LibraryApiContextValue & {};

class Menu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { classes, isLoggedIn } = this.props;
    return (
      <header className={classes.header}>
        <Link to={dashboardRoute}>
          <Typography variant="h2" className={classes.navItem}>
            Monio
          </Typography>
        </Link>
        <Link to={configSelectRoute}>
          <Typography variant="h5" className={classes.navItem}>
            Configs
          </Typography>
        </Link>
        {isLoggedIn ? (
          <Typography className={classes.navItem} variant="h5">
            Logout
          </Typography>
        ) : (
          <Link to={loginRoute}>
            <Typography variant="h5" className={classes.navItem}>
              Login
            </Typography>
          </Link>
        )}
      </header>
    );
  }
}

export default withLibraryApi(withStyles(styles)(Menu));
