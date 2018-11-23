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
  Divider,
  Grid,
  Button,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Code from "./Code";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      height: "100%",
    },
    container: {
      height: "100%",
      padding: theme.spacing.unit,
    },
    actionText: {
      textAlign: "right",
    },
    errorText: {
      color: red[600],
    },
    action: {
      padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit}px`,
      minWidth: 0,
    },
    divider: {
      margin: `${theme.spacing.unit}px 0`,
    },
  });

interface Props extends WithStyles<typeof styles> {
  profile: ProfileState;
  id: string;
  onDelete?(id: string): void;
  onCopy?(id: string): void;
}

class Profile extends React.Component<Props> {
  public render() {
    const { profile, classes } = this.props;
    return (
      <Paper className={classes.card}>
        <Grid className={classes.container} container direction="column" justify="space-between">
          <Grid item>
            <Typography variant="h5">{profile.title}</Typography>
            <Typography variant="body2">{profile.description}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" className={classes.actionText}>
              {profile.action}
            </Typography>

            {profile.error ? (
              <>
                <Typography variant="body1">
                  <Code>{profile.script}</Code>
                </Typography>
                <Typography variant="body2" color="secondary" className={classes.errorText}>
                  {profile.error}
                </Typography>
              </>
            ) : null}
            <Divider className={classes.divider} />
            {this.renderActionBar()}
          </Grid>
        </Grid>
      </Paper>
    );
  }

  private renderActionBar = () => {
    const { classes, onDelete, onCopy } = this.props;
    if (onDelete || onCopy) {
      return (
        <div>
          {onCopy && (
            <Button variant="outlined" size="small" className={classes.action} onClick={this.handleCopyClick}>
              <Icon fontSize="small">content_copy</Icon>
            </Button>
          )}
          {onDelete && (
            <Button variant="outlined" size="small" className={classes.action} onClick={this.handleDeleteClick}>
              <Icon fontSize="small">delete</Icon>
            </Button>
          )}
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
  private handleCopyClick = () => {
    const { onCopy, id } = this.props;
    if (onCopy) {
      onCopy(id);
    }
  };
}

export default withStyles(styles)(Profile);
