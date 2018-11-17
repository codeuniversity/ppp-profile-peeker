import * as React from "react";
import { Icon, Button, createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    button: {
      padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit}px`,
      minWidth: 0,
    },
  });

interface Props extends WithStyles<typeof styles> {
  starCount: number;
  hasStared: boolean;
  onClick?: () => void;
}
const Stars: React.SFC<Props> = props => {
  if (props.onClick !== undefined) {
    const onClick = (e: React.MouseEvent) => props.onClick!();
    return (
      <Button
        variant={props.hasStared ? "contained" : "outlined"}
        color={props.hasStared ? "primary" : "default"}
        size="small"
        className={props.classes.button}
        onClick={onClick}
      >
        <Icon fontSize="small">star</Icon>
        {props.starCount}
      </Button>
    );
  }
  return (
    <Button
      variant={props.hasStared ? "contained" : "outlined"}
      color={props.hasStared ? "primary" : "default"}
      size="small"
      className={props.classes.button}
    >
      <Icon fontSize="small">star</Icon>
      {props.starCount}
    </Button>
  );
};

export default withStyles(styles)(Stars);
