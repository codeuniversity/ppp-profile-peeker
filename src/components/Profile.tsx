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
  Tooltip,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Code from "./Code";
import withLibraryApi from "../utility/withLibraryApi";
import { LibraryApiContextValue } from "../contexts/LibraryApiContext";
import green from "@material-ui/core/colors/green";
import classnames from "classnames";
import blue from "@material-ui/core/colors/blue";
const styles = (theme: Theme) =>
  createStyles({
    card: {
      height: "100%",
      transition: "background-color 500ms",
    },
    highlightedCard: {
      backgroundColor: blue[100],
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
    infoIcon: {
      cursor: "pointer",
    },
    infoShared: {
      color: green[600],
    },
  });

type Props = WithStyles<typeof styles> &
  LibraryApiContextValue & {
    profile: ProfileState;
    id: string;
    isHighlighted?: boolean;
    onDelete?(id: string): void;
    onCopy?(id: string): void;
    onUpload?(id: string): void;
  };

class Profile extends React.Component<Props> {
  public render() {
    const { profile, classes, isHighlighted } = this.props;
    return (
      <Paper className={classnames(classes.card, isHighlighted && classes.highlightedCard)}>
        <Grid className={classes.container} container direction="column" justify="space-between">
          <Grid item>{this.renderProfileInfo()}</Grid>
          <Grid item>
            <Typography variant="h5">{profile.display.title}</Typography>
            <Typography variant="body2">{profile.display.description}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" className={classes.actionText}>
              {profile.display.action}
            </Typography>

            {profile.display.error ? (
              <>
                <Code fullWidth>{profile.definition.eval_script}</Code>
                <Typography variant="body2" color="secondary" className={classes.errorText}>
                  {profile.display.error}
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
    const { classes, onDelete, onCopy, onUpload, profile, isLoggedIn } = this.props;
    if (onDelete || onCopy || onUpload) {
      return (
        <div>
          {onCopy && (
            <Tooltip title="copy">
              <Button
                variant="outlined"
                size="small"
                className={classes.action}
                onClick={this.handleActionClick(onCopy)}
                color="secondary"
              >
                <Icon fontSize="small">content_copy</Icon>
              </Button>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="delete">
              <Button
                variant="outlined"
                size="small"
                className={classes.action}
                onClick={this.handleActionClick(onDelete)}
                color="secondary"
              >
                <Icon fontSize="small">delete</Icon>
              </Button>
            </Tooltip>
          )}
          {onUpload &&
            profile.definition.is_local &&
            !profile.display.error && (
              <Tooltip title={!isLoggedIn ? "you need to be logged in" : "share with others"}>
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.action}
                    onClick={this.handleActionClick(onUpload)}
                    disabled={!isLoggedIn}
                    color="secondary"
                  >
                    <Icon fontSize="small">cloud_upload</Icon>
                  </Button>
                </span>
              </Tooltip>
            )}
        </div>
      );
    }
    return null;
  };

  private renderProfileInfo = () => {
    const { profile, classes } = this.props;
    if (profile.definition.library_id) {
      return (
        <Tooltip title="You shared this">
          <Icon className={classes.infoShared} color="secondary">
            cloud_upload
          </Icon>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        title={profile.definition.is_local ? "you defined this yourself" : "you downloaded this from the library"}
      >
        <Icon className={classes.infoIcon} color="secondary">
          {profile.definition.is_local ? "cloud_off" : "cloud_queue"}
        </Icon>
      </Tooltip>
    );
  };

  private handleActionClick = (action: (id: string) => void) => {
    return () => {
      const { id } = this.props;
      action(id);
    };
  };
}

export default withStyles(styles)(withLibraryApi(Profile));
