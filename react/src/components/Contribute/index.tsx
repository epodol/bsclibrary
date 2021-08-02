import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  makeStyles,
  Box,
  Paper,
  Container,
} from '@material-ui/core';
import Donate from 'src/components/Contribute/Donate';
import Volunteer from 'src/components/Contribute/Volunteer';
import Code from 'src/components/Contribute/Code';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    style={{ overflowWrap: 'break-word' }}
    {...other}
  >
    {value === index && (
      <Box m="5%">
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {children}
        </div>
      </Box>
    )}
  </div>
);

const Contribute = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  return (
    <>
      <h1 className="text-center m-4">Contribute</h1>
      <Container>
        <Paper className={classes.root}>
          <div className={classes.tabs}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
              scrollButtons="on"
              style={{ overflowWrap: 'anywhere' }}
            >
              <Tab wrapped label="Donate" />
              <Tab wrapped label="Volunteer" />
              <Tab wrapped label="Code" />
            </Tabs>
          </div>
          <TabPanel value={value} index={0}>
            <Donate />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Volunteer />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Code />
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
};

export default Contribute;
