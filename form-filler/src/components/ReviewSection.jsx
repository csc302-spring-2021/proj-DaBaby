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
import { Link } from "react-router-dom";

import { Form, Field } from "react-final-form";
import Question from "./Question";
import { Modal } from "react-bootstrap";

class ReviewSection extends React.Component {
  state = {
    showModal: false,
  };
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

  // Format the answer depending on its type
  formatAnswerToString = (answer) => {
    let answerString = "";
    // If answer is an array (multiple-choice) loop through and display their selections
    if (Array.isArray(answer)) {
      // Example: answer1, answer2, answer3, answer4 <addition>, answer 5
      for (let i = 0; i < answer.length; i++) {
        // If it is not the first item, add a comma
        if (i !== 0) {
          answerString += ", ";
        }
        answerString += answer[i]["selection"].toString();
        // If there is an addition to the answer, format it like so
        if (answer[i]["addition"]) {
          answerString += " - <";
          answerString += answer[i]["addition"].toString();
          answerString += ">";
        }
      }
    }
    // If answer is single-choice
    else if (answer["selection"]) {
      answerString += answer["selection"].toString();
      if (answer["addition"]) {
        answerString += " - <";
        answerString += answer["addition"].toString();
        answerString += ">";
      }
    }
    // Any other type just toString()
    else {
      answerString = answer.toString();
    }
    return answerString;
  };

  goBack = () => {
    console.log("Submitted");
  };

  render() {
    const { sdcResponse, sdcForm, submit } = this.props;
    const { name } = sdcForm;
    const { answers } = sdcResponse;
    console.log(sdcResponse);
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <h1 className="formTitle">{name}</h1>
            <h2 className="sectionTitle">Review Response</h2>
            <hr className="divider" />
            {answers.map((answer) => (
              <div key={answer.questionID}>
                <div className="question">
                  {this.getQuestionName(answer.questionID)}
                </div>
                {answer.answer === "" ||
                answer.answer === null ||
                (Array.isArray(answer.answer) && answer.answer.length == 0) ? (
                  <div className="unanswered">Unanswered</div>
                ) : (
                  <div className="answer">
                    {" "}
                    {this.formatAnswerToString(answer.answer)}{" "}
                  </div>
                )}{" "}
              </div>
            ))}
            {submit ? (
              <button
                className="sdcButton"
                type="submit"
                onClick={() =>
                  this.setState({
                    showModal: true,
                  })
                }
              >
                Submit
              </button>
            ) : (
              ""
            )}
            <Modal
              contentClassName="submit-modal"
              show={this.state.showModal}
              onHide={() => this.setState({ showModal: !this.state.showModal })}
            >
              <Modal.Title>
                <h5>Your changes has been saved.</h5>
              </Modal.Title>
              <Modal.Footer id="submit-modal-footer">
                <Link to="/responses" style={{ textDecoration: "none" }}>
                  <Button variant="primary">Exit to Home</Button>
                </Link>
                or{" "}
                <a
                  id="submit-back-link"
                  href="#"
                  onClick={() =>
                    this.setState({ showModal: !this.state.showModal })
                  }
                >
                  Go Back
                </a>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReviewSection;
