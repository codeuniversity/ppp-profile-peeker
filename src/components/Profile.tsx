import * as React from "react";
import { ProfileState } from "../types";
import { Paper, Typography, Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      margin: "10px auto",
      padding: theme.spacing.unit,
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
        <Typography variant="body1">{profile.description}</Typography>
      </Paper>
    );
  }
}

export default withStyles(styles)(Profile);
