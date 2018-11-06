export interface ProfileState {
  title?: string;
  description?: string;
  action?: string;
}

interface ProfileUpdate {
  type: "update";
  state: ProfileState;
}

interface ProfileDelete {
  type: "delete";
}

export interface Message {
  id: string;
  data: ProfileUpdate | ProfileDelete;
}

export function isProfileUpdate(objectToCheck: ProfileUpdate | ProfileDelete): objectToCheck is ProfileUpdate {
  return objectToCheck.type === "update";
}
