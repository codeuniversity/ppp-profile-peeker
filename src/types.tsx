export interface ProfileState {
  title: string;
  description: string;
}

export interface Message {
  id: string;
  data: ProfileState;
}
