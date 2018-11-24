import React, { ComponentType } from "react";
import ProfilerApiContext, { ProfilerApiContextValue } from "../contexts/ProfilerApiContext";
import { ProfileState } from "../services/ProfilerTypes";

export interface ProfilerApiContextProps extends ProfilerApiContextValue {
  profileExists(profileId: string): boolean;
}

function getProfileExists(profiles: { [id: string]: ProfileState }) {
  return (profileIdToCheck: string) => {
    return Object.keys(profiles).find(profileId => profileId === profileIdToCheck) !== undefined;
  };
}

function withProfilerApi<
  PropsWithoutContextValue extends object,
  Props extends PropsWithoutContextValue & ProfilerApiContextProps
>(Component: ComponentType<Props>) {
  return (props: PropsWithoutContextValue) => {
    return (
      <ProfilerApiContext.Consumer>
        {(value: ProfilerApiContextValue) => {
          return <Component {...props} {...value} profileExists={getProfileExists(value.profiles)} />;
        }}
      </ProfilerApiContext.Consumer>
    );
  };
}

export default withProfilerApi;
