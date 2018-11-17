import { LibraryCredentials, Config, Vote } from "./LibraryTypes";

const libraryUrl = "http://localhost:3000";

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

  public fetchConfigs = () => {
    return this.fetch("configs").then(response => response.json()) as Promise<Config[]>;
  };

  public voteForConfig = (configId: string) => {
    const vote: Vote = {
      config_id: configId,
    };

    return this.fetch("votes", { method: "POST" }, vote).then(response => response.json());
  };

  public deleteVoteForConfig = (configId: string) => {
    return this.fetch(`configs/${configId}/vote`, { method: "DELETE" });
  };

  private getCredentials = () => {
    const credentialsresult = localStorage.getItem(authCredentialsKey);
    if (credentialsresult) {
      return JSON.parse(credentialsresult) as LibraryCredentials;
    }
    return undefined;
  };

  private fetch = (path: string, options: RequestInit = {}, body?: object) => {
    const headers = Object.assign(
      {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      this.isLoggedIn() ? this.getCredentials() : {},
    );
    return fetch(
      `${libraryUrl}/${path}`,
      Object.assign({}, options, { headers }, body ? { body: JSON.stringify(body) } : {}),
    );
  };
}
