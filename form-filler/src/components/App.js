import "./App.scss";

import React from "react";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row } from "react-bootstrap";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <Col>
          <Row>
            <Col md={9}>
              <SDCSection>
                <Col></Col>
              </SDCSection>
            </Col>
            <Col md={3}>world</Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default App;
