export interface ProfileState {
  definition: {
    id: string;
    eval_script: string;
    is_local?: boolean;
  };
  display: {
    title?: string;
    description?: string;
    action?: string;
    error?: string;
  };
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

export interface RawMetaElement {
  name: string;
  type: number;
}

export function isProfileUpdate(objectToCheck: ProfileUpdate | ProfileDelete): objectToCheck is ProfileUpdate {
  return objectToCheck.type === "update";
}
