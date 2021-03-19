import React from 'react';
import { MDBContainer, MDBFooter, MDBTooltip } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  // faFacebook,
  // faTwitter,
  // faDiscord,
  // faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => (
  <MDBFooter
    color="rgba-green-strong"
    className="page-footer font-small pt-4 footer"
  >
    <div className="text-center">
      <ul className="list-unstyled list-inline">
        {/* <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://twitter.com">
            <FontAwesomeIcon icon={faTwitter} size="3x" className="hoverable" />
          </a>
        </li> */}
        {/* <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://youtube.com">
            <FontAwesomeIcon icon={faYoutube} size="3x" className="hoverable" />
          </a>
        </li> */}
        <li className="list-inline-item">
          <a
            className=" btn-sm btn-dribbble mx-3"
            href="https://www.instagram.com/basis_scottsdale_library/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              size="3x"
              className="hoverable"
            />
          </a>
        </li>
        {/* <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://discord.com">
            <FontAwesomeIcon icon={faDiscord} size="3x" className="hoverable" />
          </a>
        </li> */}
        {/* <li className="list-inline-item">
          <a className=" btn-sm btn-dribbble mx-3" href="https://facebook.com">
            <FontAwesomeIcon
              icon={faFacebook}
              size="3x"
              className="hoverable"
            />
          </a>
        </li> */}
      </ul>
    </div>
    <div className="footer-copyright text-center py-3">
      <MDBContainer fluid>
        <MDBTooltip domElement placement="bottom">
          <span>
            <a
              href="https://github.com/epodol/bsclibrary/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open source on GitHub
            </a>
            <br />
            <a
              href="https://github.com/epodol/bsclibrary/blob/main/LICENSE/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Copyright &copy; 2021 BASIS Scottsdale Library
            </a>
          </span>
          <span>Licenced under the MIT License</span>
        </MDBTooltip>
      </MDBContainer>
    </div>
  </MDBFooter>
);

export default Footer;
