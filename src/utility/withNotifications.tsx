import React, { ComponentType } from "react";
import NotificationContext, { NotificationContextValue } from "../contexts/NotificationContext";
import Without from "./Without";

function withNotifications<
  PropsWithoutNotificationContextValue extends object,
  Props extends PropsWithoutNotificationContextValue & NotificationContextValue
>(Component: ComponentType<Props>): ComponentType<Without<Props, keyof NotificationContextValue>> {
  return (props: Without<Props, keyof NotificationContextValue>) => {
    return (
      <NotificationContext.Consumer>
        {(value: NotificationContextValue) => <Component {...props} {...value} />}
      </NotificationContext.Consumer>
    );
  };
}

export default withNotifications;
