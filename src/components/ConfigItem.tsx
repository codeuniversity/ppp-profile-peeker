import * as React from "react";
import {
  Paper,
  Typography,
  Theme,
  createStyles,
  withStyles,
  WithStyles,
  Chip,
  Grid,
  Divider,
  Button,
  Tooltip,
  Icon,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { Config, getNamesArrayFromNamesFilterString, UserInfo } from "../services/LibraryTypes";
import Stars from "./Stars";
import DownloadConfig from "./DownloadConfig";
import DownloadedIcon from "@material-ui/icons/CloudDone";
import green from "@material-ui/core/colors/green";
import { NavLink } from "react-router-dom";
import { dashboardRoute } from "./Routes";
import { ProfileDefinition } from "../services/ProfilerTypes";
import Code from "./Code";
import classnames from "classnames";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ShortTermStoreValue } from "../contexts/ShortTermStoreContext";
import withShortTermStore from "../utility/withShortTermStore";
import { highlightedProfileKey } from "../pages/Dashboard";
import blue from "@material-ui/core/colors/blue";

export const highlightedConfigKey = "highlightedConfigId";

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: 2 * theme.spacing.unit,
      height: "100%",
      overflowX: "hidden",
    },
    highlightedPaper: {
      backgroundColor: blue[100],
    },

    container: {
      height: "100%",
      width: "100%",
    },
    scriptHeading: {
      textAlign: "right",
    },
    script: {
      overflowX: "scroll",
    },
    divider: {
      margin: `${theme.spacing.unit}px 0`,
    },
    downloadedIcon: {
      color: green[600],
      marginRight: theme.spacing.unit / 2,
    },
    createdByUserIcon: {
      color: theme.palette.secondary.light,
    },
    navLink: {
      textDecoration: "none",
    },
    expansionPanelRoot: {
      padding: 0,
      margin: 0,
      backgroundColor: "transparent",
    },
  });

type Props = WithStyles<typeof styles> &
  ShortTermStoreValue & {
    config: Config;
    currentUser?: UserInfo;
    onVoteToggle?: (configId: string, shouldDelete: boolean) => Promise<void>;
    alreadyDownloaded: boolean;
    onDownload: (profileDefinition: ProfileDefinition) => Promise<void>;
  };

interface State {}

class ConfigItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { config, classes, alreadyDownloaded, shortTermStore } = this.props;
    const isHighlighted = shortTermStore[highlightedConfigKey] === config.id;
    return (
      <Paper className={classnames(classes.paper, isHighlighted && classes.highlightedPaper)}>
        <Grid className={classes.container} container direction="column" justify="space-between">
          <Grid item style={{ width: "100%" }}>
            <Grid container justify="space-between">
              <Grid item>{this.renderConfigInfo()}</Grid>
              <Grid item>
                <Grid container>
                  {config.categories.map(category => (
                    <Grid item key={category.id}>
                      <Chip label={category.name} variant="outlined" />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Typography variant="h5">{config.title}</Typography>
            <Typography variant="body1">{config.description}</Typography>
          </Grid>

          <Grid item>
            <ExpansionPanel
              elevation={0}
              classes={{ root: classes.expansionPanelRoot, expanded: classes.expansionPanelRoot }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                classes={{
                  content: classes.expansionPanelRoot,
                  expanded: classes.expansionPanelRoot,
                  expandIcon: classes.expansionPanelRoot,
                  root: classes.expansionPanelRoot,
                }}
              >
                <Typography variant="caption" className={classes.scriptHeading}>
                  Code
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails classes={{ root: classes.expansionPanelRoot }}>
                <Grid container direction="column">
                  <Grid item>
                    <Code className={classes.script} fullWidth>
                      {config.script}
                    </Code>
                  </Grid>
                  <Grid item>{this.renderFilterInfo()}</Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <Divider className={classes.divider} />
            <div>
              <Tooltip title="star">
                <span>
                  <Stars
                    hasStared={config.has_voted}
                    starCount={config.vote_count}
                    onClick={this.starsClickHandler()}
                  />
                </span>
              </Tooltip>
              {!alreadyDownloaded && (
                <Tooltip title="download">
                  <span>
                    <DownloadConfig onClick={this.downloadConfig} />
                  </span>
                </Tooltip>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  private downloadConfig = () => {
    const { config, onDownload } = this.props;
    onDownload({
      id: config.id,
      eval_script: config.script,
      filter: { names: getNamesArrayFromNamesFilterString(config.names_filter) },
      is_local: false,
    });
  };

  private starsClickHandler = () => {
    const { onVoteToggle, config } = this.props;
    if (onVoteToggle !== undefined) {
      return () => {
        onVoteToggle(config.id, config.has_voted);
      };
    }
    return undefined;
  };

  private isByCurrentUser = () => {
    const { currentUser, config } = this.props;
    return currentUser && currentUser.id === config.user.id;
  };
  private renderConfigInfo = () => {
    const { classes, alreadyDownloaded } = this.props;

    if (this.isByCurrentUser()) {
      const classname = classnames(classes.downloadedIcon, classes.createdByUserIcon);
      if (alreadyDownloaded) {
        return (
          <NavLink to={dashboardRoute} className={classes.navLink} onClick={this.highlightProfileOnConfigClick}>
            <Button variant="text" size="small">
              <DownloadedIcon className={classname} />
              You shared this and use this
            </Button>
          </NavLink>
        );
      }
      return (
        <Button variant="text">
          <Icon className={classname}>cloud</Icon>
          You shared this
        </Button>
      );
    }
    if (alreadyDownloaded) {
      return (
        <NavLink to={dashboardRoute} className={classes.navLink} onClick={this.highlightProfileOnConfigClick}>
          <Button variant="text" size="small">
            <DownloadedIcon className={classes.downloadedIcon} />
            You use this config
          </Button>
        </NavLink>
      );
    }
    return null;
  };

  private renderFilterInfo = () => {
    const { config } = this.props;

    const filterNames = getNamesArrayFromNamesFilterString(config.names_filter);
    if (filterNames.length === 0) {
      return null;
    }

    return (
      <div>
        <Typography variant="caption" style={{ display: "inline-block" }}>
          This script processes signal
        </Typography>
        {filterNames.map(name => (
          <Code key={name} margin="8px">
            {name}
          </Code>
        ))}
      </div>
    );
  };
  private highlightProfileOnConfigClick = () => {
    const { setShortTermValue, config } = this.props;
    setShortTermValue(highlightedProfileKey, config.id, 2500, 500);
  };
}

export default withStyles(styles)(withShortTermStore(ConfigItem));
