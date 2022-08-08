import React from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Paper,
  Alert,
  AlertTitle,
  AlertColor,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useNavigate, Link } from 'react-router-dom';
import { useRemoteConfig, useUser } from 'reactfire';
import { getBoolean, getString } from 'firebase/remote-config';

const Home = () => {
  const navigate = useNavigate();
  const remoteConfig = useRemoteConfig();

  const user = useUser().data;

  const home_banner_enabled = getBoolean(remoteConfig, 'home_banner_enabled');
  const home_banner_severity = getString(remoteConfig, 'home_banner_severity');
  const home_banner_title = getString(remoteConfig, 'home_banner_title');
  const home_banner_title_enabled = getBoolean(
    remoteConfig,
    'home_banner_title_enabled'
  );
  const home_banner_message = getString(remoteConfig, 'home_banner_message');
  const home_banner_button_enabled = getBoolean(
    remoteConfig,
    'home_banner_button_enabled'
  );
  const home_banner_button_text = getString(
    remoteConfig,
    'home_banner_button_text'
  );
  const home_banner_button_href = getString(
    remoteConfig,
    'home_banner_button_href'
  );
  const home_banner_icon_enabled = getBoolean(
    remoteConfig,
    'home_banner_icon_enabled'
  );

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
  const Title = styled('h1')(({ theme }) => ({
    marginLeft: -12,
    whiteSpace: 'nowrap',
    textIndent: '.7rem',
    fontSize: 28,
    [theme.breakpoints.up('md')]: {
      fontSize: 56,
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
    margin: theme.spacing(4),
    padding: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      marginInline: '10%',
      padding: theme.spacing(8),
    },
  }));

  return (
    <div>
      {home_banner_enabled && (
        <Alert
          style={{ marginInline: '20%', marginTop: '2%' }}
          icon={home_banner_icon_enabled ? undefined : false}
          variant="filled"
          severity={home_banner_severity as AlertColor}
          action={
            home_banner_button_enabled ? (
              <Button
                color="inherit"
                size="small"
                href={home_banner_button_href}
              >
                {home_banner_button_text}
              </Button>
            ) : undefined
          }
        >
          {home_banner_title_enabled && (
            <AlertTitle>{home_banner_title}</AlertTitle>
          )}
          {home_banner_message}
        </Alert>
      )}

      <Box sx={{ pt: 0 }}>
        <Content maxWidth="md">
          <Logo
            src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo.svg`}
            alt="BASIS Scottsdale Library Logo"
          />
          <div>
            <Title>BASIS Scottsdale Library</Title>
            <Typography
              variant="h4"
              component="p"
              color="inherit"
              style={{ fontWeight: 'bold' }}
            >
              Now Open in Room 123!
            </Typography>
            {!user ? (
              <Button
                style={{ marginTop: 10 }}
                onClick={() => navigate('/createaccount')}
                variant="contained"
              >
                Create an Account
              </Button>
            ) : (
              <Button
                style={{ marginTop: 10 }}
                onClick={() => navigate('/books')}
                variant="contained"
              >
                Browse our Book Collection
              </Button>
            )}
          </div>
        </Content>
      </Box>
      <AboutShort>
        <h2>BASIS Scottsdale is getting a library?!</h2>
        <h6>
          Yes! BASIS Scottsdale is getting its own dedicated library! Our goal
          is to gather books and create an area where all BASIS Scottsdale
          students can come check out books for their enjoyment. This will also
          serve as a resource center for students. A library is a peaceful area
          where everyone can study. The library will be designed in a way where
          everyone will be able access it easily and have enough time to read
          the books they take out while making it fair to others. Everyone will
          be welcome!
        </h6>
        <br />
        <h2>Who will be able to use the library?</h2>
        <h6>
          The library will be open to all BASIS Scottsdale Students, Teachers,
          and Staff.
        </h6>
        <br />
        <h2>What can I do to help?</h2>
        <h6>
          The BASIS Scottsdale Library depends on donations from BASIS
          Scottsdale families. Please consider donating books or volunteering.
          For more information, click <Link to="/contribute">here.</Link>
        </h6>
        <br />
        <h2>When will the Library be open?</h2>
        <h6>
          The BASIS Scottsdale Library will typically be open from{' '}
          <strong>
            3:45-4:30 Monday-Friday, and 7:00-8:15 Wednesday-Friday
          </strong>
          . Check the Bulldog Blast for any updates to our hours for the week.
        </h6>
        <br />
        <h2>I have more questions!</h2>
        <h6>
          There has been a huge interest in the library and we are so excited to
          be able to make this a reality. To learn more about the library, check
          out <Link to="/about">the About page</Link>. If you still have any
          questions, feel free to email us at{' '}
          <a href="mailto:info@bsclibrary.net">info@bsclibrary.net</a>.
        </h6>
      </AboutShort>
    </div>
  );
};

export default Home;
