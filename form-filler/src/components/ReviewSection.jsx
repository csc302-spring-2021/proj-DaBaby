import "./SDCSection.scss";
import "./ReviewSection.scss";
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

class ReviewSection extends React.Component {
  // Get the question name from the sdcForm
  getQuestionName = (questionID) => {
    const { sdcForm } = this.props;
    // Loop through all sections
    for (let i = 0; i < sdcForm["sections"].length; i++) {
      // Loop through each of the questions within the sections
      for (let j = 0; j < sdcForm["sections"][i]["questions"].length; j++) {
        // If we find the questionID we are looking for, return the questionText
        if (sdcForm["sections"][i]["questions"][j]["id"] === questionID)
          return sdcForm["sections"][i]["questions"][j]["questionText"];
      }
    }
  };

  render() {
    const { sdcResponse, sdcForm } = this.props;
    const { name } = sdcForm;
    const { answers } = sdcResponse;
    console.log(sdcResponse);
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <h1 className="formTitle">{name}</h1>
            <h2 className="sectionTitle">Review Response</h2>
            <hr className="divider"></hr>
            {answers.map((answer) => (
              <div key={answer.questionID}>
                <div className="question">
                  {this.getQuestionName(answer.questionID)}
                </div>
                {!answer.answer ||
                (Array.isArray(answer.answer) && answer.answer.length == 0) ? (
                  <div className="unanswered">Unanswered</div>
                ) : (
                  <div className="answer"> answer.answer </div>
                )}{" "}
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReviewSection;
