import React, { ComponentType } from "react";
import LibraryApiContext, { LibraryApiContextValue } from "../contexts/LibraryApiContext";
import Without from "./Without";

function withLibraryApi<
  PropsWithoutLibraryContextValue extends object,
  Props extends PropsWithoutLibraryContextValue & LibraryApiContextValue
>(Component: ComponentType<Props>): ComponentType<Without<Props, keyof LibraryApiContextValue>> {
  return (props: Without<Props, keyof LibraryApiContextValue>) => {
    return (
      <LibraryApiContext.Consumer>
        {(value: LibraryApiContextValue) => <Component {...props} {...value} />}
      </LibraryApiContext.Consumer>
    );
  };
}

export default withLibraryApi;
