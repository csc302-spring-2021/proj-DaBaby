import "./NavigationBar.scss";

import React from "react";
import { Navbar, Nav } from "react-bootstrap";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar bg="sdc">
        <Navbar.Brand>SDCFiller</Navbar.Brand>
        <Nav>
          <Nav.Link href="#new-form">Start New Form</Nav.Link>
          <Nav.Link href="#edit-response">Edit Previous Response</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default NavigationBar;
