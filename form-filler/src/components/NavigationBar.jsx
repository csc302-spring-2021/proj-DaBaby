import "./NavigationBar.scss";

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from "react-router";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { history } = this.props;
    return (
      <Navbar bg="sdc">
        <Navbar.Brand>SDCFiller</Navbar.Brand>
        <Nav>
          <Nav.Link onClick={() => history.push("/new-form")}>
            Start New Form
          </Nav.Link>

          <Nav.Link onClick={() => history.push("/edit-response")}>
            Edit Previous Response
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default withRouter(NavigationBar);
