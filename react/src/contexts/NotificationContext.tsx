import React, { createContext, useState, useEffect } from 'react';
import { Snackbar, SnackbarOrigin } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

const NotificationContext = createContext<NotificationHandler>(
  null as unknown as NotificationHandler
);

interface NotificationHandler {
  addNotification: (notification: notification) => void;
  removeNotification: (id: number) => void;
}

const Notification = ({
  remove,
  message,
  severity,
  timeout,
  position,
}: any) => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  }, [remove, message, severity, timeout, position]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      autoHideDuration={timeout}
      open={open}
      onClose={handleClose}
      TransitionProps={{ onExited: () => remove() }}
      anchorOrigin={position}
    >
      <Alert
        elevation={6}
        onClose={handleClose}
        variant="filled"
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

interface notification {
  message: string;
  severity: Color;
  timeout?: number;
  position?: SnackbarOrigin;
}

export const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = useState<notification[]>([]);

  const NotificationHandler = {
    addNotification(notification: notification) {
      const newNotifications = [...notifications];
      newNotifications.push(notification);
      setNotifications(newNotifications);
    },
    removeNotification(id: number) {
      const newNotifications = [...notifications];
      newNotifications.splice(id, 1);
      setNotifications(newNotifications);
    },
  };

  return (
    <NotificationContext.Provider value={NotificationHandler}>
      {notifications.length > 0 && (
        <Notification
          remove={() => {
            NotificationHandler.removeNotification(0);
          }}
          message={notifications[0].message ?? ''}
          severity={notifications[0].severity ?? 'success'}
          timeout={notifications[0].timeout ?? 5000}
          position={
            notifications[0].position ?? {
              horizontal: 'left',
              vertical: 'bottom',
            }
          }
        />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
