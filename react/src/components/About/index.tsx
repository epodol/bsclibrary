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
    padding: `10px`,
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
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box p={4} px={0}>
        {children}
      </Box>
    )}
  </div>
);

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const About = () => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  return (
    <>
      <h1 className="text-center m-4">About</h1>
      <p className="text-center font-italic">
        This page is still a work in progress.
      </p>
      <Container>
        <Paper className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="standard"
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            aria-label="About"
            className={classes.tabs}
          >
            <Tab label="Introduction" {...a11yProps(0)} />
            <Tab label="Due Dates" {...a11yProps(1)} />
            <Tab label="Missing Books" {...a11yProps(2)} />
            <Tab label="Renewing" {...a11yProps(3)} />
          </Tabs>
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
