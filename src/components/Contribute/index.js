import React, { useState } from 'react';
import { Tabs, Tab, AppBar, Box, Paper } from '@material-ui/core';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const Contribute = () => {
  const [value, setValue] = useState(1);

  return (
    <div className="text-center m-5">
      <Paper className="p-5">
        <h2>How can you contribute?</h2>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={(e, v) => setValue(v)}
            aria-label="How can you contribute?"
            centered
          >
            <Tab label="Time" {...a11yProps(0)} />
            <Tab label="Resources" {...a11yProps(1)} />
            <Tab label="Experience" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          More information about our volunteer program will be available soon!
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{ marginRight: '1', marginLeft: '1' }}>
            <h2>We are always looking for new books to have in our library!</h2>{' '}
            <br />
            <h5>
              Do you have books for 5th-12th graders that are in good condition?
              Please consider donating them to the BASIS Scottsdale Library!
            </h5>
            <br />
            <h6>
              We have a large donation box in the front office ready to accept
              donations. We ask that books be in good condition (not damaged or
              written in), and be appropriate for the students at our school
              (5th - 12th grade)
            </h6>
            <br />
            <h5>
              We are currently accepting donations on our{' '}
              <a
                href="https://wishlist.bsclibrary.net"
                target="_blank"
                rel="noopener noreferrer"
              >
                Amazon wishlist
              </a>
              .
            </h5>
            <h6>
              When purchasing items from our Amazon wishlist, you directly
              support our Library by contributing books that students or
              teachers have requested. When ordering from our wishlist, your
              contribution is directly mailed to the library.
            </h6>
            <br />
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          We are looking for developers with experience in any of the following
          to help contribute to this website!{' '}
          <a
            href="https://github.com/epodol/bsclibrary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more here: https://github.com/epodol/bsclibrary
          </a>
          <br />
          <br />
          React, JavaScript, HTML, CSS, Node.JS, Firebase
        </TabPanel>
      </Paper>
    </div>
  );
};
export default Contribute;
