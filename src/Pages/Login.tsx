import * as React from "react";

interface LoginProps {}

export default class Login extends React.Component<LoginProps> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <a
        className="GoogleLink-link"
        href={`${process.env.REACT_APP_API_URL}/auth/google_oauth2?auth_origin_url=${process.env.REACT_APP_ORIGIN_URL}`}
      >
        Sign in with Google
      </a>
    );
  }
}
