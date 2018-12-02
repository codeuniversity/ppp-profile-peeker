import * as React from "react";
import ShortTermStoreContext, { ShortTermStore, ShortTermValue } from "./ShortTermStoreContext";

interface Props {}

interface State {
  store: ShortTermStore;
}

export default class ShortTermStoreProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      store: {},
    };
  }

  public render() {
    const { store } = this.state;
    const { children } = this.props;
    return (
      <ShortTermStoreContext.Provider value={{ shortTermStore: store, setShortTermValue: this.setShortTermValue }}>
        {children}
      </ShortTermStoreContext.Provider>
    );
  }
  private setShortTermValue = (key: string, value: ShortTermValue, timeToLive: number, setIn?: number) => {
    setTimeout(() => {
      this.setState(prevState => {
        const stateCopy = Object.assign({}, prevState.store);
        stateCopy[key] = value;
        return { store: stateCopy };
      });

      setTimeout(() => {
        this.setState(prevState => {
          const stateCopy = Object.assign({}, prevState.store);
          delete stateCopy[key];
          return { store: stateCopy };
        });
      }, timeToLive - (setIn || 0));
    }, setIn || 0);
  };
}
