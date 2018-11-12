import * as React from "react";
import { ProfileState } from "../services/ProfilerTypes";
import { Paper, Typography, Theme, createStyles, WithStyles, withStyles, Icon, IconButton } from "@material-ui/core";

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
    actionBar: {
      textAlign: "right",
    },
  });

interface Props extends WithStyles<typeof styles> {
  profile: ProfileState;
  id: string;
  onDelete?(id: string): void;
}

class Profile extends React.Component<Props> {
  public render() {
    const { profile, classes } = this.props;
    return (
      <Paper className={classes.card}>
        {this.renderActionBar()}
        <Typography variant="h5">{profile.title}</Typography>
        <Typography variant="body2">{profile.description}</Typography>
        <Typography variant="body1" className={classes.action}>
          {profile.action}
        </Typography>
      </Paper>
    );
  }

  private renderActionBar = () => {
    const { classes, onDelete } = this.props;
    if (onDelete) {
      return (
        <div className={classes.actionBar}>
          <IconButton onClick={this.handleDeleteClick}>
            <Icon>delete</Icon>
          </IconButton>
        </div>
      );
    }
    return null;
  };

  private handleDeleteClick = () => {
    const { onDelete, id } = this.props;
    if (onDelete) {
      onDelete(id);
    }
  };
}

export default withStyles(styles)(Profile);
