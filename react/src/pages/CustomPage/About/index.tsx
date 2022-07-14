import React, { useState } from 'react';
import { Tabs, Tab, Box, Container, Paper } from '@mui/material';

import Introduction from 'src/pages/CustomPage/About/Introduction';
import DueDates from 'src/pages/CustomPage/About/DueDates';
import MissingBooks from 'src/pages/CustomPage/About/MissingBooks';
import Renewing from 'src/pages/CustomPage/About/Renewing';

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

  return (
    <>
      <h1 className="text-center m-4">About</h1>
      <Container>
        <Paper sx={{ flexGrow: 1, display: 'flex' }}>
          <div>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
              scrollButtons
              style={{ overflowWrap: 'anywhere' }}
              allowScrollButtonsMobile
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
