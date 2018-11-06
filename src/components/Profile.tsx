import * as React from "react";
import { ProfileState } from "../types";
import { Paper, Typography, Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      margin: "10px auto",
      padding: theme.spacing.unit,
      maxWidth: 400,
      height: "100%",
    },
    action: {
      textAlign: "right",
    },
  });

interface Props extends WithStyles<typeof styles> {
  profile: ProfileState;
}

class Profile extends React.Component<Props> {
  public render() {
    const { profile, classes } = this.props;
    return (
      <Paper className={classes.card}>
        <Typography variant="h5">{profile.title}</Typography>
        <Typography variant="body2">{profile.description}</Typography>
        <Typography variant="body1" className={classes.action}>
          {profile.action}
        </Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(Profile);
