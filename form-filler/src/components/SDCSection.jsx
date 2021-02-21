import "./SDCSection.scss";

import React from "react";

import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
} from "react-bootstrap";

import { Form, Field } from "react-final-form";
import Question from "./Question";

class SDCSection extends React.Component {
  // Questions will be saved into the state of the current section gathered from the backend
  state = {
    questions: [
      {
        question_id: 37326,
        question_type: "free-text",
        order: 42,
        controller_id: null,
        controller_answer: null,
        question_text: "Unique Case Identifier (used in country)",
      },
      {
        question_id: 35932,
        question_type: "free-text",
        order: 76,
        controller_id: null,
        controller_answer: null,

        question_text: "Place Where the Case Was Diagnosed (Country)",
      },
    ],
  };
  onSubmit = async (values) => {
    console.log(JSON.stringify(values));
  };

  /**
   * Validates field client side as required
   */
  required = (value) => {
    return value ? undefined : "Required";
  };

  render() {
    const { questions } = this.state;
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <Form
              onSubmit={this.onSubmit}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                values,
              }) => (
                <>
                  {/* Where the questions will be rendered */}
                  {questions.map((question) => (
                    <Question
                      question_type={question.question_type}
                      question_text={question.question_text}
                    />
                  ))}
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </>
              )}
            ></Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSection;
