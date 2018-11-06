export interface ProfileState {
  title?: string;
  description?: string;
  action?: string;
}

export interface Message {
  id: string;
  data: ProfileState;
}
