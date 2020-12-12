import React from 'react';
import { MDBContainer, MDBFooter } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreativeCommons,
  faCreativeCommonsNc,
  faCreativeCommonsBy,
  faInstagram,
  faFacebook,
  faTwitter,
  faDiscord,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => (
  <MDBFooter
    color="rgba-green-strong"
    className="page-footer font-small pt-4 footer"
  >
    <div className="text-center">
      <ul className="list-unstyled list-inline">
        <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://twitter.com">
            <FontAwesomeIcon icon={faTwitter} size="3x" className="hoverable" />
          </a>
        </li>
        <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://youtube.com">
            <FontAwesomeIcon icon={faYoutube} size="3x" className="hoverable" />
          </a>
        </li>
        <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://instagram.com">
            <FontAwesomeIcon
              icon={faInstagram}
              size="3x"
              className="hoverable"
            />
          </a>
        </li>
        <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://discord.com">
            <FontAwesomeIcon icon={faDiscord} size="3x" className="hoverable" />
          </a>
        </li>
        <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://facebook.com">
            <FontAwesomeIcon
              icon={faFacebook}
              size="3x"
              className="hoverable"
            />
          </a>
        </li>
      </ul>
    </div>
    <div className="footer-copyright text-center py-3">
      <MDBContainer fluid>
        <a
          rel="cc:attributionURL"
          property="dct:title"
          href="https://bsclibrary.com"
        >
          BASIS Scottsdale Library
        </a>{' '}
        by{' '}
        <a
          rel="cc:attributionURL dct:creator"
          property="cc:attributionName"
          href="https://github.com/epodol"
        >
          @epodol
        </a>{' '}
        is licensed under
        <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0">
          {' '}
          CC BY-NC 4.0
          <FontAwesomeIcon icon={faCreativeCommons} size="lg" />
          <FontAwesomeIcon icon={faCreativeCommonsNc} size="lg" />
          <FontAwesomeIcon icon={faCreativeCommonsBy} size="lg" />
        </a>
      </MDBContainer>
    </div>
  </MDBFooter>
);

export default Footer;
