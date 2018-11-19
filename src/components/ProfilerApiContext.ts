import React from "react";
import ProfilerApi from "../services/ProfilerApi";
import { ProfileState } from "../services/ProfilerTypes";

export interface ProfilerApiContextValue {
  profilerApi: ProfilerApi;
  profiles: {
    [id: string]: ProfileState;
  };
}

const defaultValue: ProfilerApiContextValue = {
  profilerApi: new ProfilerApi(),
  profiles: {},
};

const ProfilerApiContext = React.createContext(defaultValue);

export default ProfilerApiContext;
