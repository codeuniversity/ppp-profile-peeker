import React, { ComponentType } from "react";
import NotificationContext, { NotificationContextValue } from "../NotificationContext";

function withNotifications<
  PropsWithoutNotificationContextValue extends object,
  Props extends PropsWithoutNotificationContextValue & NotificationContextValue
>(Component: ComponentType<Props>) {
  return (props: PropsWithoutNotificationContextValue) => {
    return (
      <NotificationContext.Consumer>
        {(value: NotificationContextValue) => <Component {...props} {...value} />}
      </NotificationContext.Consumer>
    );
  };
}

export default withNotifications;
