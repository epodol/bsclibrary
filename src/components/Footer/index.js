import React from 'react';
import { MDBContainer, MDBFooter } from 'mdbreact';
import InstagramIcon from '@material-ui/icons/Instagram';
import Tooltip from '@material-ui/core/Tooltip';
import GitHubIcon from '@material-ui/icons/GitHub';

const Footer = () => (
  <MDBFooter
    color="rgba-green-strong"
    className="page-footer font-small pt-4 footer"
  >
    <div className="text-center">
      <ul className="list-unstyled list-inline">
        <li className="list-inline-item">
          <Tooltip title="Open souce on GitHub" placement="top">
            <a
              className=" btn-sm btn-dribbble mx-3"
              href="https://www.github.com/epodol/bsclibrary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon style={{ fontSize: 40 }} />
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
            >
              <InstagramIcon style={{ fontSize: 40 }} />
            </a>
          </Tooltip>
        </li>
      </ul>
    </div>
    <div className="footer-copyright text-center py-3">
      <MDBContainer fluid>
        <>
          This{' '}
          <Tooltip
            title="Open souce on GitHub, where developers and companies build, ship, and maintain their software"
            placement="top"
          >
            <a
              href="https://github.com/epodol/bsclibrary/"
              target="_blank"
              rel="noopener noreferrer"
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
            >
              React
            </a>
          </Tooltip>{' '}
          and{' '}
          <Tooltip
            className="text-center"
            title="Firebase is a backend service from Google Cloud"
            placement="top"
          >
            <a
              href="https://firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase.
            </a>
          </Tooltip>
        </>
        <br />
        <Tooltip title="Licenced under the MIT License" placement="top">
          <a
            href="https://github.com/epodol/bsclibrary/blob/main/LICENSE/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Copyright &copy; 2021 BASIS Scottsdale Library
          </a>
        </Tooltip>
      </MDBContainer>
    </div>
  </MDBFooter>
);

export default Footer;
