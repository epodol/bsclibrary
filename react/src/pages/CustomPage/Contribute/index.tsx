import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper, Container } from '@mui/material';

import Donate from 'src/pages/CustomPage/Contribute/Donate';
import Volunteer from 'src/pages/CustomPage/Contribute/Volunteer';
import Code from 'src/pages/CustomPage/Contribute/Code';

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

  return (
    <>
      <h1 className="text-center m-4">Contribute</h1>
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
