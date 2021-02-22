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
      {
        question_id: 35960,
        question_type: "multiple-choice",
        order: 115,
        controller_id: 38610,
        controller_answer: "Present",

        question_text: "Underlying Conditions (select all that apply)",
        options: [
          { text: "Pregnancy" },
          { text: "Cardiovascular disease" },
          { text: "Liver disease" },
          { text: "Diabetes" },
          { text: "Renal disease" },
          { text: "Immunodeficiency, including HIV" },
          { text: "Chronic lung disease" },
          { text: "Others (specify): ", input_type: "string" },
        ],
      },
      {
        question_id: 35978,
        question_type: "single-choice",
        order: 72,
        controller_id: null,
        controller_answer: null,

        question_text: "Sex at Birth",
        options: [
          { text: "Male" },
          { text: "Female" },
          { text: "Other (please specify):", input_type: "string" },
        ],
      },
      {
        question_id: 45938,
        question_type: "integer",
        order: 76,
        controller_id: null,
        controller_answer: null,

        question_text: "Age",
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
                <form onSubmit={handleSubmit}>
                  {/* Where the questions will be rendered */}
                  {questions.map((question) => (
                    <Question question={question} key={question.question_id} />
                  ))}
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </form>
              )}
            ></Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSection;
