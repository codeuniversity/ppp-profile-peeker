import * as React from "react";
import { TextField, withStyles, Theme, createStyles, WithStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing.unit,
    },
    input: {
      marginTop: 2 * theme.spacing.unit,
    },
  });

interface Props extends WithStyles<typeof styles> {
  title: string;
  onTitleChange: (newTitle: string) => void;
  description: string;
  onDescriptionChange: (newDescription: string) => void;
}

interface State {}

class UploadConfigForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public render() {
    const { title, description, classes } = this.props;
    return (
      <div className={classes.container}>
        <TextField
          className={classes.input}
          label="Title"
          value={title}
          onChange={this.onTitleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.input}
          label="Description"
          value={description}
          onChange={this.onDescriptionChange}
          variant="outlined"
          fullWidth
          multiline
        />
      </div>
    );
  }

  private onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onTitleChange } = this.props;
    onTitleChange(e.target.value);
  };

  private onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onDescriptionChange } = this.props;
    onDescriptionChange(e.target.value);
  };
}
export default withStyles(styles)(UploadConfigForm);
