import * as React from "react";
import { Theme, createStyles, withStyles, Grid, WithStyles } from "@material-ui/core";
import { Config } from "../services/LibraryTypes";
import ConfigItem from "./ConfigItem";
import { ProfileDefinition } from "../services/ProfilerTypes";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  configs: Config[];
  onVoteToggle?: (configId: string, shouldDelete: boolean) => Promise<void>;
  profileExists: (profileId: string) => boolean;
  onDownload: (profileDefinition: ProfileDefinition) => Promise<void>;
}

const ConfigList: React.SFC<Props> = props => {
  const { configs, classes, onVoteToggle, profileExists, onDownload } = props;
  return (
    <Grid container spacing={16} justify={"space-around"} alignItems="stretch" className={classes.container}>
      {configs.map(config => (
        <Grid key={config.id} item xs={12} sm={6} md={4} lg={4} xl={2}>
          <ConfigItem
            onDownload={onDownload}
            config={config}
            onVoteToggle={onVoteToggle}
            alreadyDownloaded={profileExists(config.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default withStyles(styles)(ConfigList);
