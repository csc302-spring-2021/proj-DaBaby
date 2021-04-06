import "./SDCSection.scss";

import React from "react";

import { Col, Container, Row } from "react-bootstrap";

import { Form } from "react-final-form";
import Question from "./Question";

class SDCSection extends React.Component {
  /**
   * Validates field client side as required
   */
  required = (value) => {
    return value ? undefined : "Required";
  };

  render() {
    const { section } = this.props;
    const { questions } = section;
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <h2 className="sectionTitle">{section.name}</h2>
            <hr className="divider" />
            <Form
              onSubmit={() => null}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  {/* Where the questions will be rendered */}
                  {questions.map((question) => (
                    <Question question={question} key={question.id} />
                  ))}
                </form>
              )}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSection;
