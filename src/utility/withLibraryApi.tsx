import React, { ComponentType } from "react";
import LibraryApiContext, { LibraryApiContextValue } from "../contexts/LibraryApiContext";

function withLibraryApi<
  PropsWithoutLibraryContextValue extends object,
  Props extends PropsWithoutLibraryContextValue & LibraryApiContextValue
>(Component: ComponentType<Props>) {
  return (props: PropsWithoutLibraryContextValue) => {
    return (
      <LibraryApiContext.Consumer>
        {(value: LibraryApiContextValue) => <Component {...props} {...value} />}
      </LibraryApiContext.Consumer>
    );
  };
}

export default withLibraryApi;
