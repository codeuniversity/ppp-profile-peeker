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
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import Code from "./Code";
import withLibraryApi from "../utility/withLibraryApi";
import { LibraryApiContextValue } from "../contexts/LibraryApiContext";
import green from "@material-ui/core/colors/green";
import classnames from "classnames";
import blue from "@material-ui/core/colors/blue";
import { NavLink } from "react-router-dom";
import { configSelectRoute } from "./Routes";
import withShortTermStore from "../utility/withShortTermStore";
import { ShortTermStoreValue } from "../contexts/ShortTermStoreContext";
import { highlightedConfigKey } from "./ConfigItem";
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
    deleteButton: {
      backgroundColor: red[700],
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: red[900],
      },
    },
  });

type Props = WithStyles<typeof styles> &
  LibraryApiContextValue &
  ShortTermStoreValue & {
    profile: ProfileState;
    id: string;
    isHighlighted?: boolean;
    onDelete?(id: string): void;
    onCopy?(id: string): void;
    onUpload?(id: string): void;
  };

interface State {
  deleteDialogOpen: boolean;
}

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      deleteDialogOpen: false,
    };
  }
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
            {this.renderDeleteDialog()}
          </Grid>
        </Grid>
      </Paper>
    );
  }

  private renderDeleteDialog = () => {
    const { deleteDialogOpen } = this.state;
    const { onDelete, classes } = this.props;

    return (
      <Dialog open={deleteDialogOpen} onClose={this.closeDeleteDialog}>
        <DialogTitle> Are you sure you want to delete this profile?</DialogTitle>
        <DialogActions>
          <Button onClick={this.closeDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            className={classes.deleteButton}
            classes={{}}
            onClick={this.handleActionClick(onDelete!)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  private closeDeleteDialog = () => {
    this.setState({ deleteDialogOpen: false });
  };

  private openDeleteDialog = () => {
    this.setState({ deleteDialogOpen: true });
  };

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
                onClick={this.openDeleteDialog}
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
          <span>
            <NavLink to={configSelectRoute} onClick={this.highlightConfigOnProfileClick}>
              <IconButton>
                <Icon className={classes.infoShared} color="secondary">
                  cloud_upload
                </Icon>
              </IconButton>
            </NavLink>
          </span>
        </Tooltip>
      );
    }
    if (profile.definition.is_local) {
      return (
        <Tooltip title="you defined this yourself">
          <Icon className={classes.infoIcon} color="secondary">
            cloud_off
          </Icon>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="you downloaded this from the library">
        <span>
          <NavLink to={configSelectRoute} onClick={this.highlightConfigOnProfileClick}>
            <IconButton>
              <Icon className={classes.infoIcon} color="secondary">
                cloud_queue
              </Icon>
            </IconButton>
          </NavLink>
        </span>
      </Tooltip>
    );
  };

  private highlightConfigOnProfileClick = () => {
    const { setShortTermValue, profile } = this.props;
    setShortTermValue(highlightedConfigKey, profile.definition.library_id || profile.definition.id, 2500, 500);
  };

  private handleActionClick = (action: (id: string) => void) => {
    return () => {
      const { id } = this.props;
      action(id);
    };
  };
}

export default withStyles(styles)(withLibraryApi(withShortTermStore(Profile)));
