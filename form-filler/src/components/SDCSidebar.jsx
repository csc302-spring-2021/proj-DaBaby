import "./SDCSidebar.scss";

import React from "react";
import { Row, Col, Container } from "react-bootstrap";

import SDCSectionLabel from "./SDCSectionLabel";

class SDCSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm={12} className="section-navigation">
            <SDCSectionLabel
              name={"Section 1: Patient Information"}
              state="active"
            />
            <SDCSectionLabel name={"Section 2: Clinical Status"} />
            <SDCSectionLabel name={"Section 3: Exposure Risk Prior to Onset"} />
            <SDCSectionLabel name={"Review"} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSidebar;
