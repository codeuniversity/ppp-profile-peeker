import * as React from "react";
import NotificationContext, { NotificationProps } from "./NotificationContext";
import Without from "../utility/Without";
import { Snackbar, SnackbarContent, Theme, createStyles, WithStyles, withStyles, Button } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
type NotificationRenderProps = Without<NotificationProps, "timeout"> & {
  index: number;
};
import classnames from "classnames";

interface State {
  notifications: {
    [notificationId: string]: NotificationRenderProps;
  };
  count: number;
}

const styles = (theme: Theme) =>
  createStyles({
    notification: {
      marginTop: theme.spacing.unit,
    },
    success: {
      backgroundColor: green[500],
    },
    error: {
      backgroundColor: theme.palette.grey[800],
    },
    buttonsuccess: {
      color: theme.palette.primary.contrastText,
    },
    buttonerror: {
      color: theme.palette.secondary.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {}

class NotificationProvider extends React.Component<Props, State> {
  static notificationCounter = 0;
  constructor(props: Props) {
    super(props);
    this.state = {
      notifications: {},
      count: 0,
    };
  }

  public render() {
    const { children } = this.props;
    return (
      <NotificationContext.Provider
        value={{
          addNotification: this.addNotification,
          removeNotification: this.removeNotification,
        }}
      >
        {this.renderNotifications()}
        {children}
      </NotificationContext.Provider>
    );
  }

  private addNotification = ({ timeout, ...restProps }: NotificationProps) => {
    NotificationProvider.notificationCounter += 1;
    const id = NotificationProvider.notificationCounter.toString();
    if (timeout !== undefined) {
      setTimeout(() => this.removeNotification(id), timeout);
    }
    this.setState((prevState: State) => {
      const notificationsCopy = Object.assign({}, prevState.notifications);
      const newCount = prevState.count + 1;
      notificationsCopy[id] = { ...restProps, index: newCount };
      return { notifications: notificationsCopy, count: newCount };
    });
    return id;
  };

  private removeNotification = (notificationId: string) => {
    this.setState((prevState: State) => {
      const notificationsCopy = Object.assign({}, prevState.notifications);
      delete notificationsCopy[notificationId];
      return { notifications: notificationsCopy };
    });
  };

  private renderNotifications = () => {
    const { notifications } = this.state;
    const { classes } = this.props;
    return (
      <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={Object.keys(notifications).length > 0}>
        <div>
          {this.sortedNotifications().map(([notificationId, { message, type, ationLabel, onAction }]) => {
            let action: React.ReactNode = undefined;

            if (ationLabel && onAction) {
              const onClick = () => {
                onAction();
                this.removeNotification(notificationId);
              };
              action = (
                <Button variant="outlined" onClick={onClick} className={classes[`button${type}`]}>
                  {ationLabel}
                </Button>
              );
            }

            return (
              <SnackbarContent
                className={classnames(classes.notification, classes[type])}
                key={notificationId}
                message={message}
                action={action}
              />
            );
          })}
        </div>
      </Snackbar>
    );
  };

  private sortedNotifications = () => {
    const { notifications } = this.state;
    return Object.entries(notifications).sort(([id1, props1], [id2, props2]) => props1.index - props2.index) as [
      string,
      NotificationRenderProps
    ][];
  };
}

export default withStyles(styles)(NotificationProvider);
