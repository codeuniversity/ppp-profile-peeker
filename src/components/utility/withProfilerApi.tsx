import React, { ComponentType } from "react";
import ProfilerApiContext, { ProfilerApiContextValue } from "../ProfilerApiContext";

function withProfilerApi<
  PropsWithoutContextValue extends object,
  Props extends PropsWithoutContextValue & ProfilerApiContextValue
>(Component: ComponentType<Props>) {
  return (props: PropsWithoutContextValue) => {
    return (
      <ProfilerApiContext.Consumer>
        {(value: ProfilerApiContextValue) => <Component {...props} {...value} />}
      </ProfilerApiContext.Consumer>
    );
  };
}

export default withProfilerApi;
