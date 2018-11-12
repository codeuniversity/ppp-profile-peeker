import React from "react";
import LibraryApi from "../services/LibraryApi";

export interface LibraryApiContextValue {
  libraryApi: LibraryApi;
  isLoggedIn: boolean;
}

const defaultValue: LibraryApiContextValue = {
  libraryApi: new LibraryApi(),
  isLoggedIn: false,
};

const LibraryApiContext = React.createContext<LibraryApiContextValue>(defaultValue);
export default LibraryApiContext;
