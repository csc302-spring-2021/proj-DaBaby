import "./App.scss";

import React from "react";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row, Container } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";

class App extends React.Component {
  render() {
    return (
      <Container fluid className="App">
        <NavigationBar />
        <Col>
          <Row>
            <Col md={8}>
              <SDCSection>
                <Col></Col>
              </SDCSection>
            </Col>
            <Col md={4}>
              <SDCSidebar />
            </Col>
          </Row>
        </Col>
      </Container>
    );
  }
}

export default App;
