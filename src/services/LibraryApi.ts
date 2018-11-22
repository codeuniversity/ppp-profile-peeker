import { LibraryCredentials, Config, Vote, UserInfo } from "./LibraryTypes";

const libraryUrl = "http://localhost:3000";

const authCredentialsKey = "authCredentials";
type Handler = () => void;
export default class LibraryApi {
  private credentialsUpdatedHandler: Handler | undefined;
  private unauthorizedHandler: Handler | undefined;

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

  public onCredentialsUpdated = (handler: Handler) => {
    this.credentialsUpdatedHandler = handler;
  };

  public onUnauthorized = (handler: Handler) => {
    this.unauthorizedHandler = handler;
  };

  public fetchConfigs = async () => {
    const response = await this.fetch("configs");
    if (this.checkStatus(response)) {
      return (await response.json()) as Promise<Config[]>;
    }
    return;
  };

  public voteForConfig = async (configId: string) => {
    const vote: Vote = {
      config_id: configId,
    };

    const response = await this.fetch("votes", { method: "POST" }, vote);
    if (this.checkStatus(response)) {
      return await response.json();
    }
    return;
  };

  public deleteVoteForConfig = (configId: string) => {
    return this.fetch(`configs/${configId}/vote`, { method: "DELETE" });
  };

  public fetchUserInfo = async () => {
    const response = await this.fetch(`me`);
    if (this.checkStatus(response)) {
      return (await response.json()) as Promise<UserInfo>;
    }
    return;
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

  private checkStatus = (response: Response) => {
    if (response.status === 401) {
      this.logout();
      if (this.unauthorizedHandler !== undefined) {
        this.unauthorizedHandler();
      }
      return false;
    }
    return true;
  };
}
