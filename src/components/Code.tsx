import * as React from "react";
import { Theme, WithStyles, withStyles, createStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import classnames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: grey[200],
      padding: theme.spacing.unit,
      borderRadius: 3,
    },
    fullWidth: {
      width: "100%",
      display: "block",
    },
    code: {
      whiteSpace: "pre",
    },
  });

interface Props extends WithStyles<typeof styles> {
  margin?: string | number;
  fullWidth?: boolean;
  className?: string;
}

const Code: React.SFC<Props> = ({ classes, children, margin, className, fullWidth = false }) => {
  return (
    <div className={classnames(classes.container, fullWidth ? classes.fullWidth : "", className)} style={{ margin }}>
      <code className={classes.code}>{children}</code>
    </div>
  );
};

export default withStyles(styles)(Code);
