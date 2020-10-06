import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import "./footer.css"

const Footer = () => {
    return (
        <MDBFooter color="green" className="font-small pt-4 mt-4 footer">
            <MDBContainer fluid className="text-center text-md-left">
                <MDBRow className="flex-center">

                </MDBRow>
            </MDBContainer>
            <div className="footer-copyright text-center py-3">
                <MDBContainer fluid>
                    <p
                        // xmlns:dct="http://purl.org/dc/terms/" xmlns:cc="http://creativecommons.org/ns#"
                        className="license-text">
                        <a rel="cc:attributionURL" property="dct:title" href="https://bsclibrary.com">BASIS Scottsdale
                            Library</a> by <a
                        rel="cc:attributionURL dct:creator" property="cc:attributionName"
                        href="https://github.com/epodol">@epodol</a> is licensed under
                        <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0">CC BY-NC 4.0
                            <img className="ccicon"
                                 src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                                 alt="Creative Commons"/>
                            <img className="ccicon"
                                 src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                                 alt="Attribution"/>
                            <img className="ccicon"
                                 src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
                                 alt="Non-Commercial"/>
                        </a>
                    </p>
                </MDBContainer>
            </div>
        </MDBFooter>
    );
}

export default Footer;