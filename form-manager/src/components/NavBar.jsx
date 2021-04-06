import React from "react";
import "./NavBar.scss";
import Home from "./Home";
import Forms from "./Forms";
import { Nav, Navbar } from "react-bootstrap";
import { Link, Route, Switch } from "react-router-dom";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar bg="sdc">
          <Navbar.Brand>SDCManager</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/forms/:procedureId" component={Forms} />
        </Switch>
      </div>
    );
  }
}

export default NavigationBar;
