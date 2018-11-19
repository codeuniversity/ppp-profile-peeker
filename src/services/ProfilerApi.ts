import { Message, isProfileUpdate, ProfileState } from "./ProfilerTypes";
const profilerLocation = "localhost:4000";
const profilerHttpUrl = `http://${profilerLocation}`;
const profilerWsUrl = `ws://${profilerLocation}`;

type ProfileUpdateHandler = (profileId: string, profileState: ProfileState) => void;
type ProfileDeleteHandler = (profileId: string) => void;

export default class ProfilerApi {
  public constructor() {}

  private profileUpdateHandler: ProfileUpdateHandler | undefined;
  private profileDeleteHandler: ProfileDeleteHandler | undefined;

  public onProfileUpdate = (
    profileUpdateHandler: ((profileId: string, profileState: ProfileState) => void) | undefined,
  ) => {
    this.profileUpdateHandler = profileUpdateHandler;
  };

  public onProfileDelete = (profileDeleteHandler: ((profileId: string) => void) | undefined) => {
    this.profileDeleteHandler = profileDeleteHandler;
  };

  public openSocket = () => {
    const socket = new WebSocket(profilerWsUrl);

    socket.addEventListener("message", event => {
      const message = JSON.parse(event.data) as Message;
      this.handleMessage(message);
    });
    socket.addEventListener("close", () => {
      setTimeout(() => {
        this.openSocket();
      }, 1000);
    });
  };

  public static postProfile = async (evalScript: string) => {
    await fetch(`${profilerHttpUrl}/profiles`, {
      method: "POST",
      body: JSON.stringify({ eval_script: evalScript }),
    });
  };

  public static deleteProfile = async (profileId: string) => {
    await fetch(`${profilerHttpUrl}/profiles/${profileId}`, {
      method: "DELETE",
    });
  };

  private handleMessage = (message: Message) => {
    const data = message.data;
    if (isProfileUpdate(data)) {
      if (this.profileUpdateHandler) {
        this.profileUpdateHandler(message.id, data.state);
      }
    } else {
      if (this.profileDeleteHandler) {
        this.profileDeleteHandler(message.id);
      }
    }
  };
}
