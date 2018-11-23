import * as React from "react";
import { Theme, WithStyles, withStyles, createStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: grey[300],
      padding: theme.spacing.unit,
      borderRadius: 3,
      display: "inline-block",
    },
    code: {
      whiteSpace: "pre-wrap",
    },
  });

interface Props extends WithStyles<typeof styles> {
  margin?: string | number;
}

const Code: React.SFC<Props> = ({ classes, children, margin }) => {
  return (
    <div className={classes.container} style={{ margin }}>
      <code className={classes.code}>{children}</code>
    </div>
  );
};

export default withStyles(styles)(Code);
