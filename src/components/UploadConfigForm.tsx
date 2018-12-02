import * as React from "react";
import { TextField, withStyles, Theme, createStyles, WithStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

interface State {}

class UploadConfigForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { title, classes } = this.props;
    return (
      <div className={classes.container}>
        <TextField label="Title" value={title} onChange={this.onTitleChange} variant="outlined" fullWidth />
      </div>
    );
  }

  private onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onTitleChange } = this.props;
    onTitleChange(e.target.value);
  };
}
export default withStyles(styles)(UploadConfigForm);
