import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Container,
  makeStyles,
  Paper,
} from '@material-ui/core';

import Introduction from 'src/components/About/Introduction';
import DueDates from 'src/components/About/DueDates';
import MissingBooks from 'src/components/About/MissingBooks';
import Renewing from 'src/components/About/Renewing';

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

const About = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  return (
    <>
      <h1 className="text-center m-4">About</h1>
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
              <Tab wrapped label="Introduction" />
              <Tab wrapped label="Due Dates" />
              <Tab wrapped label="Missing Books" />
              <Tab wrapped label="Renewing" />
            </Tabs>
          </div>
          <TabPanel value={value} index={0}>
            <Introduction />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DueDates />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <MissingBooks />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Renewing />
          </TabPanel>
        </Paper>
      </Container>
    </>
  );
};

export default About;
