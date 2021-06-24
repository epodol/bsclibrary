import React from 'react';
import { Typography, Button, Box, Container, Paper } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { useHistory, Link } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  const Content = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(16),
      paddingBottom: theme.spacing(8),
      flexDirection: 'row',
      alignItems: 'flex-start',
      textAlign: 'left',
    },
  }));
  const Title = styled(Typography)(({ theme }) => ({
    marginLeft: -12,
    whiteSpace: 'nowrap',
    textIndent: '.7rem',
    [theme.breakpoints.up('md')]: {
      fontSize: 56,
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: 28,
    },
  }));
  const Logo = styled('img')(({ theme }) => ({
    flexShrink: 0,
    width: 120,
    height: 120,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(8),
      width: 195,
      height: 175,
    },
  }));
  const AboutShort = styled(Paper)(({ theme }) => ({
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(32),
      marginRight: theme.spacing(32),
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(0),
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
  }));

  return (
    <div id="classicformpage">
      <Box sx={{ pt: 8, color: 'primary.main' }}>
        <Content maxWidth="md">
          <Logo
            src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo - v0.1.1.svg`}
            alt="BASIS Scottsdale Library Logo"
          />
          <div>
            <Title variant="h1" component="h1" color="inherit">
              BASIS Scottsdale Library
            </Title>
            <Typography variant="h5" component="p" color="inherit">
              Coming 2021
            </Typography>
            <Button
              style={{ marginTop: 4 }}
              variant="outlined"
              onClick={() =>
                history.push({
                  pathname: '/about',
                })
              }
            >
              Learn More
            </Button>
          </div>
        </Content>
      </Box>
      <AboutShort>
        <h2>BASIS Scottsdale is getting a Library!?</h2>
        <h6>
          Yes! BASIS Scottsdale is getting its own dedicated library in 2021.
          Our goal is to gather books and create an area where all BASIS
          Scottsdale students can come check out books for their enjoyment. This
          will also serve as a resource center for students. A library is a
          peaceful area where everyone can study. The library will be designed
          in a way where everyone will be able access it easily and have enough
          time to read the books they take out while making it fair to others.
          Everyone will be welcome!
        </h6>
        <h2>Who will be able to use the library?</h2>
        <h6>
          The library will be open to all BASIS Scottsdale Students, Teachers,
          and Staff.
        </h6>
        <h2>When will the library be open?</h2>
        <h6>
          The BASIS Scottsdale Library Committee is working as fast as possible
          to coordinate with the school administration and to set up or physical
          library environment. We are excited to announce our opening date in
          August of 2021. All updates will be posted in the Bulldog Blast, and
          will be available here.
        </h6>
        <h2>What can I do to help?</h2>
        <h6>
          The BASIS Scottsdale Library depends on donations from BASIS
          Scottsdale families. Please consider donating books or volunteering.
          For more information, click <Link to="/contribute">here.</Link>
        </h6>
        <h2>I have more questions!</h2>
        <h6>
          There has been a huge interest in the library and we are so excited to
          be able to make this a reality. To learn more about the library, check
          out <Link to="/about">the About page</Link>. If you still have any
          questions, feel free to email us at{' '}
          <a href="mailto:support@bsclibrary.net">support@bsclibrary.net</a>.
        </h6>
      </AboutShort>
    </div>
  );
};

export default Home;
