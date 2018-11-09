import * as React from "react";
import { TextField, Button, Paper, Theme, createStyles, withStyles, WithStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      margin: "10px auto",
      padding: theme.spacing.unit,
      maxWidth: 600,
    },
  });

interface ProfileFormProps extends WithStyles<typeof styles> {
  onSubmit(evalScript: string): Promise<void>;
}

interface ProfileFormState {
  evalScript: string;
  submitting: boolean;
}

class ProfileForm extends React.Component<ProfileFormProps, ProfileFormState> {
  constructor(props: ProfileFormProps) {
    super(props);
    this.state = {
      evalScript: "",
      submitting: false,
    };
  }

  public render() {
    const { classes } = this.props;
    const { evalScript, submitting } = this.state;
    return (
      <Paper className={classes.card}>
        <TextField value={evalScript} onChange={this.onChange} multiline fullWidth />
        <Button disabled={submitting} onClick={this.handleSubmit}>
          Save
        </Button>
      </Paper>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ evalScript: e.target.value });
  };

  private handleSubmit = async () => {
    this.setState({ submitting: true });
    await this.props.onSubmit(this.state.evalScript);
    this.setState({ submitting: false });
  };
}

export default withStyles(styles)(ProfileForm);
