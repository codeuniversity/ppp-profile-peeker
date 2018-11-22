import * as React from "react";
import { ProfileState } from "../services/ProfilerTypes";
import {
  Paper,
  Typography,
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  Icon,
  IconButton,
  Divider,
  Grid,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      height: "100%",
    },
    container: {
      height: "100%",
      padding: theme.spacing.unit,
    },
    action: {
      textAlign: "right",
    },
    actionBar: {
      textAlign: "right",
    },
    deleteIcon: {
      padding: 8,
    },
    scriptText: {
      fontFamily: "monospace",
      whiteSpace: "pre",
    },
    errorText: {
      color: red[600],
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
        <Grid className={classes.container} container direction="column" justify="space-between">
          <Grid item>
            {this.renderActionBar()}
            <Typography variant="h5">{profile.title}</Typography>
            <Typography variant="body2">{profile.description}</Typography>
            <Typography variant="body1" className={classes.action}>
              {profile.action}
            </Typography>
          </Grid>
          <Grid item>
            {profile.error ? (
              <>
                <Typography variant="body2" className={classes.scriptText}>
                  {profile.script}
                </Typography>
                <Divider />
                <Typography variant="body2" color="secondary" className={classes.errorText}>
                  {profile.error}
                </Typography>
              </>
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    );
  }

  private renderActionBar = () => {
    const { classes, onDelete } = this.props;
    if (onDelete) {
      return (
        <div className={classes.actionBar}>
          <IconButton className={classes.deleteIcon} onClick={this.handleDeleteClick}>
            <Icon fontSize="small">delete</Icon>
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
