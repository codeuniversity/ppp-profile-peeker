import { Category } from "./LibraryTypes";
export interface Config {
  id: string;
  title: string;
  description?: string;
  script: string;
  vote_count: number;
  has_voted: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Vote {
  config_id: string;
}

export interface LibraryCredentials {
  "access-token": string;
  uid: string;
  client: string;
}
