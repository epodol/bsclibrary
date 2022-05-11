import React from 'react';
import {
  Button,
  Box,
  Container,
  Alert,
  AlertTitle,
  AlertColor,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useRemoteConfig } from 'reactfire';
import { getBoolean, getString } from 'firebase/remote-config';

const Home = () => {
  const remoteConfig = useRemoteConfig();

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
            <Title>Super Fancy Free Library Software</Title>
          </div>
        </Content>
      </Box>
    </div>
  );
};

export default Home;
