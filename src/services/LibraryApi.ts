export interface LibraryCredentials {
  "access-token": string;
  uid: string;
  client: string;
}

const authCredentialsKey = "authCredentials";
type CredentialsUpdatedHandler = () => void;
export default class LibraryApi {
  private credentialsUpdatedHandler: CredentialsUpdatedHandler | undefined;

  public setCredentials = (credentials: LibraryCredentials) => {
    const credentialString = JSON.stringify(credentials);
    localStorage.setItem(authCredentialsKey, credentialString);

    if (this.credentialsUpdatedHandler) {
      this.credentialsUpdatedHandler();
    }
  };

  public logout = () => {
    localStorage.setItem(authCredentialsKey, "");

    if (this.credentialsUpdatedHandler) {
      this.credentialsUpdatedHandler();
    }
  };

  public isLoggedIn = () => {
    const credentials = this.getCredentials();
    return !!credentials && !!credentials["access-token"] && !!credentials.client && !!credentials.uid;
  };

  public onCredentialsUpdated = (handler: CredentialsUpdatedHandler) => {
    this.onCredentialsUpdated = handler;
  };

  private getCredentials = () => {
    const credentialsresult = localStorage.getItem(authCredentialsKey);
    if (credentialsresult) {
      return JSON.parse(credentialsresult) as LibraryCredentials;
    }

    return undefined;
  };
}
