import * as React from "react";
import { Paper, Typography, Theme, createStyles, withStyles, WithStyles, Chip, Grid, Divider } from "@material-ui/core";
import { Config } from "../services/LibraryTypes";
import Stars from "./Stars";

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
    },
    divider: {
      margin: `${theme.spacing.unit}px 0`,
    },
  });

interface Props extends WithStyles<typeof styles> {
  config: Config;
  onVoteToggle?: (configId: string, shouldDelete: boolean) => Promise<void>;
}

interface State {}

class ConfigItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { config, classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid className={classes.container} container direction="column" justify="space-between">
          <Grid item>
            <Grid container justify="flex-end">
              {config.categories.map(category => (
                <Grid item key={category.id}>
                  <Chip label={category.name} variant="outlined" />
                </Grid>
              ))}
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
            </div>
          </Grid>
        </Grid>
      </Paper>
    );
  }

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
