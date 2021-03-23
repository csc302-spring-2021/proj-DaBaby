import "./NavigationBar.scss";

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, Route, Switch } from "react-router-dom";
import ResponseDashboard from "./SDCResponseDashboard";
import Form from "./Form";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar bg="sdc">
          <Navbar.Brand>SDCFiller</Navbar.Brand>
          <Nav>
            <Nav.Link href="/">Start New Form</Nav.Link>
            <Nav.Link as={Link} to={"/responses"}>
              Edit Previous Response
            </Nav.Link>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/forms/:procedureId" component={Form} />
        </Switch>
      </div>
    );
  }
}

export default NavigationBar;
