import * as React from "react";
import { Theme, createStyles, withStyles, Grid, WithStyles } from "@material-ui/core";
import { Config } from "../services/LibraryTypes";
import ConfigItem from "./ConfigItem";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  configs: Config[];
  onVoteToggle?: (configId: string, shouldDelete: boolean) => Promise<void>;
}

const ConfigList: React.SFC<Props> = props => {
  const { configs, classes, onVoteToggle } = props;
  return (
    <Grid container spacing={16} justify={"center"} alignItems="stretch" className={classes.container}>
      {configs.map(config => (
        <Grid key={config.id} item xs={12} sm={4} xl={2}>
          <ConfigItem config={config} onVoteToggle={onVoteToggle} />
        </Grid>
      ))}
    </Grid>
  );
};

export default withStyles(styles)(ConfigList);
