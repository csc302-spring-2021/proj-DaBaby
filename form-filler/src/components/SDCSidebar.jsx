import "./SDCSidebar.scss";

import React from "react";
import { Row, Col, Container, Button } from "react-bootstrap";

import SDCSectionLabel from "./SDCSectionLabel";

class SDCSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  // This button function will handle which section will be rendered
  handleSection = (index) => {
    this.props.onSelection(index);
  };

  render() {
    const { sections, curr_section, reviewIndex } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col sm={12} className="section-navigation">
            {sections.map((section, index) => (
              <Button
                className={`sdc-btn ${
                  curr_section == index ? "active" : ""
                } sdc-container`}
                variant="outline-dark"
                key={section.id}
                onClick={() => this.handleSection(index)}
              >
                {section.name}
              </Button>
            ))}
            <Button
              className={`sdc-btn ${
                curr_section == reviewIndex ? "active" : ""
              } sdc-container`}
              variant="outline-dark"
              key={10000000000000000}
              onClick={() => this.handleSection(reviewIndex)}
            >
              Review
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSidebar;
