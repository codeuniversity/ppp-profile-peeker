import * as React from "react";
import { Typography } from "@material-ui/core";

interface LoginErrorProps {}

export default class LoginError extends React.Component<LoginErrorProps> {
  constructor(props: LoginErrorProps) {
    super(props);
  }

  public render() {
    return <Typography variant="h2">Something went wrong with your login :(</Typography>;
  }
}
