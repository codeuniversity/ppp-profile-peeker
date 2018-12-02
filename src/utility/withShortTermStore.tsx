import React, { ComponentType } from "react";
import ShortTermStoreContext, { ShortTermStoreValue } from "../contexts/ShortTermStoreContext";
import Without from "./Without";

function withShortTermStore<
  PropsWithoutShortTermStoreContextValue extends object,
  Props extends PropsWithoutShortTermStoreContextValue & ShortTermStoreValue
>(Component: ComponentType<Props>): ComponentType<Without<Props, keyof ShortTermStoreValue>> {
  return (props: Without<Props, keyof ShortTermStoreValue>) => {
    return (
      <ShortTermStoreContext.Consumer>
        {(value: ShortTermStoreValue) => <Component {...props} {...value} />}
      </ShortTermStoreContext.Consumer>
    );
  };
}

export default withShortTermStore;
