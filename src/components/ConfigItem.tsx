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
} from "@material-ui/core";
import { Config } from "../services/LibraryTypes";
import Stars from "./Stars";
import DownloadConfig from "./DownloadConfig";
import DownloadedIcon from "@material-ui/icons/CloudDone";
import green from "@material-ui/core/colors/green";
import { NavLink } from "react-router-dom";
import { dashboardRoute } from "./Routes";
const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing.unit,
      height: "100%",
    },
    container: {
      height: "100%",
    },
    script: {
      fontFamily: "monospace",
      whiteSpace: "pre",
      overflowX: "scroll",
    },
    divider: {
      margin: `${theme.spacing.unit}px 0`,
    },
    downloadedIcon: {
      color: green[600],
      marginRight: theme.spacing.unit / 2,
    },
    navLink: {
      textDecoration: "none",
    },
  });

interface Props extends WithStyles<typeof styles> {
  config: Config;
  onVoteToggle?: (configId: string, shouldDelete: boolean) => Promise<void>;
  alreadyDownloaded: boolean;
  onDownload: (configId: string, evalScript: string) => Promise<void>;
}

interface State {}

class ConfigItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { config, classes, alreadyDownloaded } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid className={classes.container} container direction="column" justify="space-between">
          <Grid item>
            <Grid container justify="space-between">
              <Grid item>
                {alreadyDownloaded && (
                  <NavLink to={dashboardRoute} className={classes.navLink}>
                    <Button variant="flat" size="small">
                      <DownloadedIcon className={classes.downloadedIcon} /> You use this config
                    </Button>
                  </NavLink>
                )}
              </Grid>
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
            <Typography className={classes.script} variant="body2">
              {config.script}
            </Typography>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
            <div>
              <Stars hasStared={config.has_voted} starCount={config.vote_count} onClick={this.starsClickHandler()} />
              {!alreadyDownloaded && <DownloadConfig onClick={this.downloadConfig} />}
            </div>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  private downloadConfig = () => {
    const { config, onDownload } = this.props;
    onDownload(config.id, config.script);
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
}

export default withStyles(styles)(ConfigItem);
