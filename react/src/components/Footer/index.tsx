import React from 'react';
import { AppBar, Tooltip } from '@mui/material';
import { GitHub, Instagram, Email } from '@mui/icons-material';

const Footer = () => (
  <div className="footer">
    <AppBar className="font-small pt-3" position="absolute">
      <div className="text-center">
        <ul className="list-unstyled list-inline">
          <li className="list-inline-item">
            <Tooltip title="info@bsclibrary.net" placement="top">
              <a
                className=" btn-sm btn-dribbble mx-3"
                href="mailto:info@bsclibrary.net"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                <Email style={{ fontSize: 40 }} />
              </a>
            </Tooltip>
          </li>
          <li className="list-inline-item">
            <Tooltip title="Open souce on GitHub" placement="top">
              <a
                className=" btn-sm btn-dribbble mx-3"
                href="https://www.github.com/epodol/bsclibrary"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                <GitHub style={{ fontSize: 40 }} />
              </a>
            </Tooltip>
          </li>
          <li className="list-inline-item">
            <Tooltip title="Instagram" placement="top">
              <a
                className=" btn-sm btn-dribbble mx-3"
                href="https://www.instagram.com/basis_scottsdale_library/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                <Instagram style={{ fontSize: 40 }} />
              </a>
            </Tooltip>
          </li>
        </ul>
      </div>
      <div className="text-center py-2" style={{ color: 'hsla(0,0%,100%,.7)' }}>
        <div>
          <>
            This{' '}
            <Tooltip title="Open source on GitHub" placement="top">
              <a
                href="https://github.com/epodol/bsclibrary/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                open souce application
              </a>
            </Tooltip>{' '}
            was created from scratch using{' '}
            <Tooltip
              title="React is a JavaScript library for building user interfaces"
              placement="top"
            >
              <a
                href="https://reactjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                React,
              </a>
            </Tooltip>{' '}
            <Tooltip
              className="text-center"
              title="Firebase is a backend service from Google Cloud"
              placement="top"
            >
              <a
                href="https://firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                Firebase
              </a>
            </Tooltip>
            {', and '}
            <Tooltip
              className="text-center"
              title="Algolia is a full text search API"
              placement="top"
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              <a
                href="https://www.algolia.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Algolia.
              </a>
            </Tooltip>
          </>
          <br />
          <Tooltip title="Licensed under the MIT License" placement="top">
            <a
              href="https://github.com/epodol/bsclibrary/blob/main/LICENSE/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'none' }}
            >
              Copyright &copy; 2021 BASIS Scottsdale Library
            </a>
          </Tooltip>
        </div>
      </div>
    </AppBar>
  </div>
);

export default Footer;
