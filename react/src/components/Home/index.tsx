import React from 'react';
import { Typography, Button, Box, Container, Paper } from '@material-ui/core';
import { Alert, AlertTitle, Color } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';

import { useHistory, Link } from 'react-router-dom';
import { useRemoteConfig } from 'reactfire';
import { getBoolean, getString } from 'firebase/remote-config';

const Home = () => {
  const history = useHistory();
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
          severity={home_banner_severity as Color}
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

      <Box sx={{ pt: 0, color: 'primary.main' }}>
        <Content maxWidth="md">
          <Logo
            src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo.svg`}
            alt="BASIS Scottsdale Library Logo"
          />
          <div>
            <Title color="inherit">BASIS Scottsdale Library</Title>
            <Typography variant="h5" component="p" color="inherit">
              Coming Soon
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
        <h2>BASIS Scottsdale is getting a library!?</h2>
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
        <h2>Who will be able to use the library?</h2>
        <h6>
          The library will be open to all BASIS Scottsdale Students, Teachers,
          and Staff.
        </h6>
        <h2>When will the library be open?</h2>
        <h6>
          The BASIS Scottsdale Library Committee is working as fast as possible
          to coordinate with the school administration and to set up or physical
          library environment. We are excited to announce our opening date as
          soon as possible. All updates will be posted in the Bulldog Blast, and
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
      <AboutShort>
        <h1>BASIS Scottsdale Library • Update • 2021-04-23</h1>
        <h6>
          Hello BASIS Scottsdale! We have been working hard to bring the first
          library to our school over this past year. We have received many
          questions and are hoping to answer them in this post.
        </h6>
        <h2>Books</h2>
        <h6>
          We currently have around 700 books, and this number will only rise as
          we get closer to opening. We would like to offer a huge thanks to
          everyone who donated to the book drive, your generosity has helped
          significantly. We are hoping to have a wide range of books, from
          novels to textbooks, and fantasies to biographies, which will provide
          the student body with access to a wide variety with which they can
          learn, grow, or just unwind.
        </h6>
        <h2>Committee Organization</h2>
        <h6>
          In this unprecedented year, the Library Committee has been working to
          create a lasting library within BASIS Scottsdale, the benefits of
          which students will be able to reap years from now. However, just like
          a well working machine consists of multiple parts, the Library
          Committee is subdivided into multiple teams, so that more focus and
          deliberation is dedicated towards our work. The 6 teams are the Art,
          Finance, Public Relations, Book Management, and Technology Team. These
          teams have been working together with our wonderful advisor, Ms. de
          Blas, to ensure that everything runs smoothly. While our organization
          is simple, our goal is momentous. We are working as fast as we can to
          make the library a reality during these strange times, but we need
          your support.
        </h6>
        <h2>How to Contribute</h2>
        <h6>
          There are multiple ways to help, both right now and in the future. You
          can donate used books. Just contact us and we will arrange a time to
          drop them off. You can also purchase new books on our{' '}
          <a
            href="https://wishlist.bsclibrary.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon Wishlist (https://wishlist.bsclibrary.net/)
          </a>{' '}
          and have them shipped directly to the school. When the library opens,
          students will be able to volunteer and give back to the community,
          even if they are not in the Committee.
        </h6>
        <h2>How to Use the Library</h2>
        <h6>
          The library will be available to all BASIS Scottsdale students who
          register a free account with us next year. To register, all you will
          have to do is stop by the library and let us know you’re interested.
          More details about this process will be available next year.
        </h6>
        <h2>Questions?</h2>
        <h6>
          If you have any other questions, please reach out to us at{' '}
          <a href="mailto:support@bsclibrary.net">support@bsclibrary.net</a>.
          Thank you again for all your generosity and support!
        </h6>
      </AboutShort>
    </div>
  );
};

export default Home;
