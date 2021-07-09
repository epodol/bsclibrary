import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const Loading = () => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open aria-hidden="false">
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default Loading;
