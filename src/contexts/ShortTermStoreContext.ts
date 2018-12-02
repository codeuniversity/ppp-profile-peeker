import React from "react";

export type ShortTermValue = number | string | object;

export interface ShortTermStore {
  [key: string]: ShortTermValue;
}

export interface ShortTermStoreValue {
  shortTermStore: ShortTermStore;
  setShortTermValue: (key: string, value: ShortTermValue, timeToLive: number, setIn?: number) => void;
}

const defaultValue: ShortTermStoreValue = {
  shortTermStore: {},
  setShortTermValue: () => {},
};

const ShortTermStoreContext = React.createContext(defaultValue);

export default ShortTermStoreContext;
