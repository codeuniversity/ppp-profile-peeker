export interface ProfileState {
  script: string;
  title?: string;
  description?: string;
  action?: string;
  error?: string;
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
