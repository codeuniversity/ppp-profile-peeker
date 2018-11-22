import * as React from "react";
import { Button, Theme, createStyles, withStyles, WithStyles } from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/CloudDownloadOutlined";

const styles = (theme: Theme) =>
  createStyles({
    button: {
      padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit}px`,
      minWidth: 0,
    },
  });

interface Props extends WithStyles<typeof styles> {
  onClick(): void;
}

interface State {}

class DownloadConfig extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { onClick, classes } = this.props;

    return (
      <Button className={classes.button} size="small" variant="outlined" onClick={onClick}>
        <DownloadIcon />
      </Button>
    );
  }
}

export default withStyles(styles)(DownloadConfig);
