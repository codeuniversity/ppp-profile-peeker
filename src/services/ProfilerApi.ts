import { ProfileDefinition } from "../services/ProfilerTypes";
import { Without } from "./../utility/Without";
import { Message, isProfileUpdate, ProfileState, RawMetaElement } from "./ProfilerTypes";
const profilerLocation = "localhost:4000";
const profilerHttpUrl = `http://${profilerLocation}`;
const profilerWsUrl = `ws://${profilerLocation}`;

type ProfileUpdateHandler = (profileId: string, profileState: ProfileState) => void;
type ProfileDeleteHandler = (profileId: string) => void;

const mhistTypeNumberToName = {
  [1]: "number",
  [2]: "string",
};

export interface MetaElement extends Without<RawMetaElement, "type"> {
  type: string;
}

function convertMhistMeta(metaInfo: RawMetaElement[]) {
  return metaInfo.map(rawMetaElement => {
    const type = mhistTypeNumberToName[rawMetaElement.type];

    return { type: type || `unknown type: ${rawMetaElement.type}`, name: rawMetaElement.name } as MetaElement;
  });
}

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

  public static postProfile = async (profileDefinition: ProfileDefinition) => {
    await fetch(`${profilerHttpUrl}/profiles`, {
      method: "POST",
      body: JSON.stringify(profileDefinition),
    });
  };

  public static deleteProfile = async (profileId: string) => {
    await fetch(`${profilerHttpUrl}/profiles/${profileId}`, {
      method: "DELETE",
    });
  };

  public static fetchMeta = async () => {
    const rawMetaElements = (await fetch(`${profilerHttpUrl}/meta`).then(resp => resp.json())) as RawMetaElement[];
    return convertMhistMeta(rawMetaElements);
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
