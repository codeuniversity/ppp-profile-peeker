import { Category } from "./LibraryTypes";

export type CommaSeperatedStrings = string;

export type NamesFilter = "" | CommaSeperatedStrings;
export interface Config {
  id: string;
  title: string;
  description?: string;
  script: string;
  vote_count: number;
  has_voted: boolean;
  categories: Category[];
  names_filter: NamesFilter;
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

export interface UserInfo {
  id: string;
  image: string;
  name: string;
  nickname: string;
}

export function getNamesArrayFromNamesFilterString(namesFilter: NamesFilter): string[] {
  if (namesFilter === "") {
    return [];
  }
  return namesFilter.split(",");
}
