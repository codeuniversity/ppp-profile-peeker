import React, { ComponentType } from "react";
import LibraryApiContext, { LibraryApiContextValue } from "../LibraryApiContext";

function withLibraryApi<PropsWithoutContextValue extends object, Props extends PropsWithoutContextValue & LibraryApiContextValue>(
  Component: ComponentType<Props>,
) {
  return (props: PropsWithoutContextValue) => {
    return (
      <LibraryApiContext.Consumer>
        {(value: LibraryApiContextValue) => <Component {...props} {...value} />}
      </LibraryApiContext.Consumer>
    );
  };
}

export default withLibraryApi;
