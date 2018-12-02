import React from "react";

export interface NotificationProps {
  message: string;
  type: "success" | "error";
  timeout?: number;
  onAction?: () => void;
  ationLabel?: string;
}

export interface NotificationContextValue {
  addNotification(notfificationProps: NotificationProps): string;
  removeNotification(notificationId: string): void;
}

const defaultValue: NotificationContextValue = {
  addNotification: notificationProps => "",
  removeNotification: notificationID => {},
};

const NotificationContext = React.createContext(defaultValue);

export default NotificationContext;
